<?php 
$lines = file("C:\\inetpub\\wwwroot\\alert\\api.php");
$switchFound = false;
foreach ($lines as $i => $line) {
    if (strpos($line, "switch (") !== false) $switchFound = true;
    if ($switchFound && $i < 150) {
        echo "Line " . ($i+1) . ": " . trim($line) . "\n";
    }
}
?>
