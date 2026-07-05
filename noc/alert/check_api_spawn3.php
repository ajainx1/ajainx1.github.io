<?php 
$lines = file("C:\\inetpub\\wwwroot\\alert\\api.php");
foreach ($lines as $i => $line) {
    if (strpos($line, "start /B") !== false) {
        echo "Line $i: $line";
    }
}
?>
