<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-cache, must-revalidate');

$scan_directories = ['uploads', 'nic'];

$excluded_filenames = [
    'upload_log.txt', 'Thumbs.db', '.htaccess', 'web.config',
    'index.php', 'track.php', 'clicks.json', 'api.php', 'login.php',
    'auth.php', '.env', 'config.json', 'last_state.json'
];

$excluded_extensions = ['php', 'config', 'env', 'json', 'bak', 'tmp', 'log', 'map', 'js', 'css'];
$excluded_dir_names = ['assets', 'cache', 'node_modules', '.git', 'archive_maintenance'];

$files = [];

foreach ($scan_directories as $base_dir) {
    if (!is_dir($base_dir)) continue;

    try {
        $dir_iterator = new RecursiveDirectoryIterator($base_dir, RecursiveDirectoryIterator::SKIP_DOTS);
        $iterator = new RecursiveIteratorIterator($dir_iterator, RecursiveIteratorIterator::SELF_FIRST);

        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $filename = $file->getFilename();
                $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
                $rawPath = $file->getPathname();
                $path = str_replace('\\', '/', $rawPath);
                
                // Skip excluded directories
                $skipDir = false;
                foreach ($excluded_dir_names as $exDir) {
                    if (strpos($path, '/' . $exDir . '/') !== false || strpos($path, $base_dir . '/' . $exDir) === 0) {
                        $skipDir = true;
                        break;
                    }
                }
                if ($skipDir) continue;

                // Skip excluded files and extensions
                if (in_array($filename, $excluded_filenames) || substr($filename, 0, 1) === '.' || in_array($ext, $excluded_extensions)) {
                    continue;
                }

                // Determine Category / District / Purpose
                $parts = explode('/', $path);
                $category = 'General';
                
                if (count($parts) >= 3) {
                    $category = $parts[1];
                } elseif (count($parts) == 2 && $base_dir === 'nic') {
                    $category = 'State HQ / NIC';
                }

                $category = str_replace(['-', '_'], ' ', $category);
                $category = ucwords(trim($category));

                $files[] = [
                    'name' => $filename,
                    'path' => $path,
                    'size' => $file->getSize(),
                    'date' => date('Y-m-d H:i:s', $file->getMTime()),
                    'district' => $category,
                    'extension' => $ext
                ];
            }
        }
    } catch (Exception $e) {
        // Silently skip unreadable dirs
    }
}

// Sort newest first
usort($files, function($a, $b) {
    return strcmp($b['date'], $a['date']);
});

echo json_encode($files, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
?>
