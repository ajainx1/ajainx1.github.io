<?php 
$lines = file("C:\\inetpub\\wwwroot\\alert\\api.php");
$start = 0;
foreach ($lines as $i => $line) {
    if (strpos($line, "\$up_count++") !== false || strpos($line, "\$down_count++") !== false) {
        $start = $i;
        break;
    }
}
$start = max(0, $start - 10);
echo implode("", array_slice($lines, $start, 35));
?>
