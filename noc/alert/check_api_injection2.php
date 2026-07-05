<?php 
$lines = file("C:\\inetpub\\wwwroot\\alert\\api.php");
echo implode("\n", array_slice($lines, 1285, 20));
?>
