<?php
$counterFile = __DIR__ . '/counter.txt';

$count = 1230; // default starting number for showcase

if (file_exists($counterFile)) {
    $count = (int)file_get_contents($counterFile);
}

$count++;
file_put_contents($counterFile, $count);

echo $count;
