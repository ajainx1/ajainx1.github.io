<?php 
exec("dir C:\\inetpub\\wwwroot\\alert", $out);
echo implode("\n", $out);
?>
