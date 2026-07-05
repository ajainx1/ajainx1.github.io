<?php 
exec("cmd /c \"findstr /I /C:\\\"endpoint\\\" C:\\inetpub\\wwwroot\\alert\\api.php\"", $out);
echo implode("\n", $out);
?>
