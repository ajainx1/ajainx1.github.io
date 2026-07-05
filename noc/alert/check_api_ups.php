<?php 
$json = file_get_contents("http://127.0.0.1/alert/api.php");
$data = json_decode($json, true);
foreach ($data["hosts"] as $h) {
    if ($h["ip"] === "10.133.15.42" || $h["ip"] === "10.133.15.45") {
        echo json_encode($h) . "\n";
    }
}
?>
