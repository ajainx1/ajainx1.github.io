<?php 
exec("cmd /c \"findstr /I /C:\\\"--text-color\\\" C:\\inetpub\\wwwroot\\alert\\static\\style.css\"", $out);
echo implode("\n", $out);
?>
