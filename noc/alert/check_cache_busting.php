<?php 
$lines = file("C:\\inetpub\\wwwroot\\alert\\static\\script.js");
foreach ($lines as $i => $line) {
    if (strpos($line, "endpoint=status") !== false) {
        echo "Line $i: $line";
    }
}
?>
