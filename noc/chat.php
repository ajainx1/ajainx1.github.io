<?php
// chat.php - High-performance PHP Proxy for Ollama streaming
// Disable ALL output buffering for zero-latency streaming
while (ob_get_level()) ob_end_clean();
ini_set('output_buffering', 'Off');
ini_set('zlib.output_compression', 0);
if (function_exists('apache_setenv')) {
    apache_setenv('no-gzip', '1');
}

header('Content-Type: application/x-ndjson');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('X-Accel-Buffering: no');
header('Connection: keep-alive');

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Increase execution time for LLM responses
set_time_limit(300);

// Get raw POST data
$inputJSON = file_get_contents('php://input');

if (empty($inputJSON)) {
    http_response_code(400);
    echo json_encode(array("error" => "Empty request body"));
    exit();
}

// Rate Limiting Security (Max 20 requests per minute per IP)
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitDir = sys_get_temp_dir() . '/ollama_rate_limits/';
if (!is_dir($rateLimitDir)) {
    @mkdir($rateLimitDir, 0755, true);
}
$ipFile = $rateLimitDir . md5($ip) . '.json';
$now = time();
$limitWindow = 60; 
$maxRequests = 20; 

if (file_exists($ipFile)) {
    $data = json_decode(@file_get_contents($ipFile), true);
    if (is_array($data)) {
        $data = array_filter($data, function($timestamp) use ($now, $limitWindow) {
            return ($now - $timestamp) < $limitWindow;
        });
        
        if (count($data) >= $maxRequests) {
            http_response_code(429);
            header('Content-Type: application/json');
            echo json_encode(array("error" => "Too many requests. Please wait a moment before sending another message."));
            exit();
        }
    } else {
        $data = array();
    }
} else {
    $data = array();
}
$data[] = $now;
@file_put_contents($ipFile, json_encode($data));

// Server-side audit logging of conversation queries for administrators
$requestData = json_decode($inputJSON, true);
if (is_array($requestData) && isset($requestData['messages'])) {
    $logDir = __DIR__ . '/logs/';
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0755, true);
    }
    $logFile = $logDir . 'chat_history.log';
    $messages = $requestData['messages'];
    $lastMsg = end($messages);
    if ($lastMsg && $lastMsg['role'] === 'user') {
        $logEntry = array(
            "timestamp" => date('Y-m-d H:i:s'),
            "ip" => $ip,
            "query" => $lastMsg['content']
        );
        @file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND);
    }
}

$ollamaUrl = 'http://10.133.0.51:11434/api/chat';

// Try cURL first (faster if available)
if (function_exists('curl_init')) {
    $ch = curl_init($ollamaUrl);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $inputJSON);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
    curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $data) {
        echo $data;
        flush();
        return strlen($data);
    });
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_TIMEOUT, 300);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen($inputJSON)
    ));

    curl_exec($ch);

    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        http_response_code(500);
        echo json_encode(array("error" => "Proxy cURL Error: " . $error_msg));
    }
    curl_close($ch);
} else {
    // Fallback to fopen streaming
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'POST',
            'content' => $inputJSON,
            'timeout' => 300,
            'ignore_errors' => true
        )
    );
    $context = stream_context_create($options);
    $fp = @fopen($ollamaUrl, 'r', false, $context);

    if ($fp === FALSE) {
        $error = error_get_last();
        http_response_code(500);
        echo json_encode(array("error" => "Proxy Stream Error: " . $error['message']));
    } else {
        // Extract HTTP code from response headers
        $meta = stream_get_meta_data($fp);
        if (isset($meta['wrapper_data']) && is_array($meta['wrapper_data'])) {
            foreach ($meta['wrapper_data'] as $headerLine) {
                if (preg_match('{HTTP\/\S*\s(\d+)}', $headerLine, $matches)) {
                    http_response_code(intval($matches[1]));
                    break;
                }
            }
        }

        // Stream response chunk by chunk with zero buffering
        while (!feof($fp)) {
            $chunk = fread($fp, 4096);
            if ($chunk !== false && strlen($chunk) > 0) {
                echo $chunk;
                flush();
            }
        }
        fclose($fp);
    }
}
?>
