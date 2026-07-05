<?php 
$lines = file("C:\\inetpub\\wwwroot\\alert\\api.php");
foreach ($lines as $i => $line) {
    if (strpos($line, "--run_ping_cycle") !== false && strpos($line, "php_sapi_name") === false && strpos($line, "\$argv") === false) {
        echo "Line $i: $line";
    }
}
?>
