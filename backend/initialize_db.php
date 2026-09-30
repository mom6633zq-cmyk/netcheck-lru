<?php
// Run this once from the backend container shell after setting DB_* variables.
// This file intentionally cannot be used as a web endpoint.
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once __DIR__ . '/config.php';
$pdo = get_db();
$schema = file_get_contents(__DIR__ . '/schema.sql');
$schema = preg_replace('/^\s*--.*$/m', '', $schema);
$statements = array_filter(array_map('trim', explode(';', $schema)));

foreach ($statements as $statement) {
    $pdo->exec($statement);
}

echo 'Database schema initialized.' . PHP_EOL;
