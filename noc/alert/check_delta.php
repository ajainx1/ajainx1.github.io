<?php echo @file_get_contents("http://10.133.15.45/", false, stream_context_create(["http"=>["timeout"=>5]])); ?>
