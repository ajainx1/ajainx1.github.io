<?php 
$lines = file("C:\\inetpub\\wwwroot\\alert\\api.php");
$start = 0;
foreach ($lines as $i => $line) {
    if (strpos($line, "function get_last_log_lines") !== false) {
        $start = $i;
        break;
    }
}
echo implode("", array_slice($lines, $start, 30));
?>
