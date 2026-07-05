<?php 
$WshShell = new COM("WScript.Shell"); 
$oExec = $WshShell->Run("cmd /c echo Hello > C:\\inetpub\\wwwroot\\alert\\test_com.txt", 0, false); 
echo "SPAWNED"; 
?>
