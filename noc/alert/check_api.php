<?php 
$lines = file("C:\\inetpub\\wwwroot\\alert\\api.php");
echo implode("", array_slice($lines, 0, 30));
?>
