<?php 
exec("cmd /c \"findstr /I /C:\\\"dark-mode\\\" C:\\inetpub\\wwwroot\\alert\\static\\chatbot.css\"", $out);
echo implode("\n", $out);
?>
