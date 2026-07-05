<?php
// ping.php - Secure NOC Network Status verification tool
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Pre-approved list of safe server endpoints to prevent arbitrary host scanning
$safe_hosts = array(
    'patna_noc' => array('host' => '10.133.22.8', 'port' => 80, 'name' => 'Patna NOC Web Server'),
    'attendance' => array('host' => '10.133.0.51', 'port' => 8080, 'name' => 'FMS Attendance Server'),
    'dpr' => array('host' => '10.133.0.51', 'port' => 80, 'name' => 'Daily Progress Report Portal'),
    'taspass' => array('host' => 'taspass.nic.in', 'port' => 8443, 'name' => 'TACS Password Server')
);

$target = $_GET['target'] ?? '';

if (empty($target) || !array_key_exists($target, $safe_hosts)) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Invalid or missing target host parameter."));
    exit();
}

$hostData = $safe_hosts[$target];
$ip = $hostData['host'];
$port = $hostData['port'];
$name = $hostData['name'];

// Perform a TCP socket connection test (more reliable and permission-safe than command line ping)
$startTime = microtime(true);
$connection = @fsockopen($ip, $port, $errno, $errstr, 2.0); // 2 second timeout
$endTime = microtime(true);

if (is_resource($connection)) {
    $rtt = round(($endTime - $startTime) * 1000, 1);
    fclose($connection);
    echo json_encode(array(
        "status" => "online",
        "name" => $name,
        "host" => $ip,
        "port" => $port,
        "rtt_ms" => $rtt,
        "message" => "Server $name ($ip:$port) is ONLINE. Response time: {$rtt}ms."
    ));
} else {
    echo json_encode(array(
        "status" => "offline",
        "name" => $name,
        "host" => $ip,
        "port" => $port,
        "message" => "Server $name ($ip:$port) is OFFLINE. Error: $errstr ($errno)."
    ));
}
?>
