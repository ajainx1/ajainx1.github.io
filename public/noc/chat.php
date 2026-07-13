<?php
header('Content-Type: application/x-ndjson');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('X-Accel-Buffering: no'); // Disable buffering on Nginx/IIS if possible

// Read raw POST data
$inputData = file_get_contents('php://input');

if (empty($inputData)) {
    echo json_encode(['error' => 'Empty request body']);
    exit;
}

$ollamaUrl = 'http://127.0.0.1:11434/api/chat';

// Setup cURL request to Ollama
$ch = curl_init($ollamaUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, false); // we write directly to output
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $inputData);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2); // fail fast if Ollama is offline

// Callback to stream Ollama output directly to client
curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $data) {
    echo $data;
    if (ob_get_level() > 0) {
        ob_flush();
    }
    flush();
    return strlen($data);
});

// Run curl
$success = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// If Ollama is offline or returns error, stream a helpful fallback message
if (!$success || $httpCode !== 200) {
    $fallbackMessage = "🤖 **State NOC Chatbot Helper**\n\n" .
        "Hello! I am the State NOC AI assistant. I noticed that the local LLM backend (**Ollama**) is currently offline or unreachable.\n\n" .
        "To enable full AI chat functionality:\n" .
        "1. **Install Ollama**: Download it from [ollama.com](https://ollama.com).\n" .
        "2. **Download Model**: Run `ollama run qwen2.5:1.5b` in your terminal.\n" .
        "3. **Start Ollama**: Make sure it is running on `http://localhost:11434`.\n\n" .
        "Meanwhile, feel free to use the interactive district map, search the sanitized contacts directory, test live server status commands (e.g. type 'ping attendance' or 'status of taspass'), or explore the outages panel!";

    // Split the message into small chunks to simulate real-time typing/streaming
    $words = explode(" ", $fallbackMessage);
    foreach ($words as $word) {
        $chunk = json_encode([
            'message' => [
                'role' => 'assistant',
                'content' => $word . ' '
            ]
        ]);
        echo $chunk . "\n";
        if (ob_get_level() > 0) {
            ob_flush();
        }
        flush();
        usleep(30000); // 30ms delay to simulate typing
    }
}