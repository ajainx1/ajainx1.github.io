<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-cache, must-revalidate');

// Scan exclusively the uploads/ directory for user/district submitted documents
$base_dir = 'uploads';

$excluded_filenames = [
    'upload_log.txt', 'Thumbs.db', '.htaccess', 'web.config',
    'index.php', 'track.php', 'clicks.json', 'api.php', 'login.php',
    'auth.php', '.env', 'config.json', 'last_state.json'
];

$excluded_extensions = ['php', 'config', 'env', 'json', 'bak', 'tmp', 'log', 'map'];

$files = [];

if (is_dir($base_dir)) {
    try {
        $dir_iterator = new RecursiveDirectoryIterator($base_dir, RecursiveDirectoryIterator::SKIP_DOTS);
        $iterator = new RecursiveIteratorIterator($dir_iterator, RecursiveIteratorIterator::SELF_FIRST);

        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $filename = $file->getFilename();
                $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
                
                // Skip excluded files and logs
                if (in_array($filename, $excluded_filenames) || substr($filename, 0, 1) === '.' || in_array($ext, $excluded_extensions)) {
                    continue;
                }

                $rawPath = $file->getPathname();
                $path = str_replace('\\', '/', $rawPath);
                
                // Determine District / Submission Purpose from folder name
                $parts = explode('/', $path);
                $district_tag = 'General Submission';
                
                if (count($parts) >= 3) {
                    $district_tag = $parts[1]; // uploads/<folder_name>/<file>
                }

                // Clean & format display category/district name
                $district_tag = str_replace(['-', '_'], ' ', $district_tag);
                $district_tag = ucwords(trim($district_tag));

                $files[] = [
                    'name' => $filename,
                    'path' => $path,
                    'size' => $file->getSize(),
                    'date' => date('Y-m-d H:i:s', $file->getMTime()),
                    'district' => $district_tag,
                    'extension' => $ext
                ];
            }
        }
    } catch (Exception $e) {
        // Silently handle read exceptions
    }
}

// Sort newest uploaded first
usort($files, function($a, $b) {
    return strcmp($b['date'], $a['date']);
});

echo json_encode($files, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
?>
