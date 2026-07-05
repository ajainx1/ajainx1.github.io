<?php 
exec("C:\\inetpub\\wwwroot\\alert\\python\\python.exe -c \"from pysnmp.hlapi import getCmd; print(getCmd)\" 2>&1", $out); 
echo implode("\n", $out); 
?>
