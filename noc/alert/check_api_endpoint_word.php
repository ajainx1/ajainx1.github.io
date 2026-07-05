<?php 
$content = file_get_contents("C:\\inetpub\\wwwroot\\alert\\api.php");
if (strpos($content, "endpoint") !== false) {
    echo "Found endpoint";
} else {
    echo "NO ENDPOINT";
}
if (strpos($content, "action") !== false) {
    echo "\nFound action";
}
?>
