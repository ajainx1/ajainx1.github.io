<?php 
$json = file_get_contents("C:\\inetpub\\wwwroot\\alert\\config.json");
$data = json_decode($json, true);
$categories = [];
foreach ($data["hosts"] as $h) {
    if (isset($h["category"])) {
        $categories[$h["category"]] = true;
    }
}
print_r(array_keys($categories));
?>
