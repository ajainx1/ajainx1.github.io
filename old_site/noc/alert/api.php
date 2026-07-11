<?php
header('Content-Type: application/json');

$endpoint = isset($_GET['endpoint']) ? trim($_GET['endpoint']) : '';

if ($endpoint !== 'status') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid endpoint.'
    ]);
    exit;
}

// Simulated list of network hosts
$hosts = [
    ['description' => 'Patna HQ Core Switch', 'ip' => '192.168.1.10', 'status' => 'UP'],
    ['description' => 'Gaya DHQ Edge Router', 'ip' => '192.168.12.1', 'status' => 'UP'],
    ['description' => 'Nawada Gateway Switch', 'ip' => '192.168.25.4', 'status' => 'UP'],
    ['description' => 'Nalanda Link Switch', 'ip' => '192.168.15.2', 'status' => 'UP'],
    ['description' => 'Muzaffarpur Node Router', 'ip' => '192.168.30.1', 'status' => 'UP'],
    ['description' => 'Saran District Gateway', 'ip' => '192.168.22.1', 'status' => 'UP'],
    ['description' => 'Begusarai Local Router', 'ip' => '192.168.19.12', 'status' => 'UP']
];

// To make the portfolio look alive and showcase both the "All UP" state 
// and the "Active Link Outages" UI state, we will simulate a mock outage 
// if the current time's seconds are between 30 and 45.
$seconds = (int)date('s');
if ($seconds >= 30 && $seconds <= 45) {
    $hosts[] = [
        'description' => 'Bhojpur DHQ Backup Router',
        'ip' => '192.168.8.5',
        'status' => 'DOWN'
    ];
}

echo json_encode([
    'status' => 'success',
    'hosts' => $hosts
]);
