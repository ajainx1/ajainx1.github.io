<?php 
$lines = file("C:\\inetpub\\wwwroot\\alert\\api.php");
echo implode("", array_slice($lines, 1355, 20));
?>
