<?php 
$lines = file("C:\\inetpub\\wwwroot\\alert\\api.php");
$start = 0;
foreach ($lines as $i => $line) {
    if (strpos($line, "mkdir(") !== false) {
        $start = $i;
        break;
    }
}
echo implode("", array_slice($lines, max(0, $start - 10), 25));
?>
