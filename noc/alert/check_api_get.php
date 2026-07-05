<?php 
exec("cmd /c \"findstr /I /C:\\\"\$_GET\\\" C:\\inetpub\\wwwroot\\alert\\api.php\"", $out);
echo implode("\n", $out);
?>
