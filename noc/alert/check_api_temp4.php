<?php 
$lines = file("C:\\inetpub\\wwwroot\\alert\\api.php");
$start = 0;
foreach ($lines as $i => $line) {
    if (strpos($line, "function run_parallel_ping_cycle") !== false) {
        $start = $i;
        break;
    }
}
echo implode("", array_slice($lines, $start + 35, 20));
?>
