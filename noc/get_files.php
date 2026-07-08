<?php
header('Content-Type: application/json');

$uploadsDir = __DIR__ . '/uploads';
$filesData = [];

if (file_exists($uploadsDir) && is_dir($uploadsDir)) {
    // Recursive directory iterator to scan uploads folder
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($uploadsDir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $fileInfo) {
        if ($fileInfo->isFile()) {
            $filePath = $fileInfo->getPathname();
            $fileName = $fileInfo->getFilename();
            
            // Generate clean relative path
            $relativePath = str_replace(__DIR__ . DIRECTORY_SEPARATOR, '', $filePath);
            $relativePath = str_replace('\\', '/', $relativePath); // normalize to web paths

            // Exclude hidden files or scripts for security
            $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            if (in_array($ext, ['php', 'phtml', 'asp', 'aspx', 'jsp', 'exe', 'sh', 'bat', 'htaccess'])) {
                continue;
            }

            // Extract district from parent directory name
            $parentDir = dirname($filePath);
            $district = basename($parentDir);
            if ($district === 'uploads') {
                $district = 'General';
            }

            $filesData[] = [
                'name' => $fileName,
                'path' => $relativePath,
                'size' => $fileInfo->getSize(),
                'date' => date('Y-m-d H:i:s', $fileInfo->getMTime()),
                'district' => $district,
                'extension' => $ext
            ];
        }
    }
}

echo json_encode($filesData, JSON_UNESCAPED_SLASHES);