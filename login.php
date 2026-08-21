<?php
// Set secure session cookie parameters
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => false, // Set to true when HTTPS TLS binding is active
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
    session_start();
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');

// ══ SECURITY: Load credentials from external config (outside webroot) ══
$config_path = 'C:\noc_config\auth.php';
if (file_exists($config_path)) {
    require_once $config_path;
    $valid_username      = isset($NOC_USERNAME) ? $NOC_USERNAME : 'admin';
    $valid_password_hash = isset($NOC_PASSWORD_HASH) ? $NOC_PASSWORD_HASH : '';
} else {
    // Fallback: use IIS Application Pool Environment Variables
    $valid_username      = getenv('NOC_USERNAME') ?: 'admin';
    $valid_password_hash = getenv('NOC_PASSWORD_HASH') ?: '';
}

// Safety guard: deny all logins if no password hash is configured
if (empty($valid_password_hash)) {
    http_response_code(503);
    echo json_encode(['success' => false, 'message' => 'Authentication service not configured. Contact NOC Administrator.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = isset($_GET['action']) ? $_GET['action'] : 'login';

if ($action === 'check') {
    if (isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true) {
        echo json_encode(['authenticated' => true, 'username' => $_SESSION['username']]);
    } else {
        echo json_encode(['authenticated' => false]);
    }
    exit;
}

if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    exit;
}

if ($action === 'login') {
    $client_ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $rate_dir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'noc_auth_limits';
    if (!is_dir($rate_dir)) {
        @mkdir($rate_dir, 0755, true);
    }
    $ip_file = $rate_dir . DIRECTORY_SEPARATOR . md5($client_ip) . '.json';
    $now = time();
    $window = 300; // 5 minutes
    $max_failed = 5;

    $ip_data = ['failed_attempts' => [], 'lockout_until' => 0];
    if (file_exists($ip_file)) {
        $loaded = json_decode(@file_get_contents($ip_file), true);
        if (is_array($loaded)) {
            $ip_data = $loaded;
        }
    }

    // Check active lockout
    if (intval($ip_data['lockout_until'] ?? 0) > $now) {
        $remain = intval($ip_data['lockout_until']) - $now;
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => "🛑 Too many failed attempts. Workstation locked for {$remain}s."
        ]);
        exit;
    }

    $username = isset($input['username']) ? trim($input['username']) : '';
    $password = isset($input['password']) ? trim($input['password']) : '';

    if ($username === $valid_username && password_verify($password, $valid_password_hash)) {
        // Defense Against Session Fixation: Regenerate session ID on authentication
        session_regenerate_id(true);

        $_SESSION['authenticated']  = true;
        $_SESSION['username']       = $username;
        $_SESSION['login_time']     = time();
        $_SESSION['login_ip']       = $client_ip;

        // Clear IP failed attempts on successful login
        if (file_exists($ip_file)) {
            @unlink($ip_file);
        }

        echo json_encode(['success' => true, 'message' => 'Authentication successful']);
    } else {
        // Filter attempts older than window
        $attempts = array_filter($ip_data['failed_attempts'] ?? [], function($ts) use ($now, $window) {
            return ($now - $ts) < $window;
        });
        $attempts[] = $now;
        $ip_data['failed_attempts'] = array_values($attempts);

        if (count($ip_data['failed_attempts']) >= $max_failed) {
            $ip_data['lockout_until'] = $now + 300; // 5-minute lockout
            $ip_data['failed_attempts'] = [];
        }

        @file_put_contents($ip_file, json_encode($ip_data), LOCK_EX);

        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }
    exit;
}
?>
