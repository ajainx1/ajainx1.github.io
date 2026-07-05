<?php 
exec("C:\\inetpub\\wwwroot\\alert\\python\\python.exe -c \"import pysnmp.hlapi; print(dir(pysnmp.hlapi))\" 2>&1", $out); 
echo implode("\n", $out); 
?>
