<?php
require_once __DIR__ . '/../../config.php';

$size = isset($_GET['bytes']) ? (int) $_GET['bytes'] : 3000000;
$size = max(1, min($size, 15000000));

header('Content-Type: application/octet-stream');
header('Content-Length: ' . $size);
header('Cache-Control: no-store');

$chunk = 65536;
$sent = 0;
while ($sent < $size) {
    $n = min($chunk, $size - $sent);
    echo random_bytes($n);
    $sent += $n;
    flush();
}
exit;
