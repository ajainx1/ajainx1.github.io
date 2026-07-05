<?php 
$json = file_get_contents("http://10.133.22.8/alert/api.php?action=status");
$data = json_decode($json, true);
$found = false;
foreach ($data["hosts"] as $h) {
    if ($h["ip"] === "10.133.15.42" || $h["ip"] === "10.133.15.45") {
        echo json_encode($h) . "\n";
        $found = true;
    }
}
if (!$found) echo "NO UPS HOSTS FOUND IN API OUTPUT";
?>
