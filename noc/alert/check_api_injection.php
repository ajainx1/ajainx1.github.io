<?php 
$lines = file("C:\\inetpub\\wwwroot\\alert\\api.php");
$found = [];
foreach ($lines as $i => $line) {
    if (strpos($line, "native_data.json") !== false || strpos($line, "native_sensor_data") !== false) {
        $found[] = "Line " . ($i+1) . ": " . trim($line);
    }
}
echo implode("\n", $found) ?: "NOT FOUND";
?>
