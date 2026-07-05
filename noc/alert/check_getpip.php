<?php 
pclose(popen("start /b cmd /c \"C:\\inetpub\\wwwroot\\alert\\python\\python.exe C:\\inetpub\\wwwroot\\alert\\python\\get-pip.py > C:\\inetpub\\wwwroot\\alert\\getpip_error.log 2>&1\"", "r"));
echo "SPAWNED"; 
?>
