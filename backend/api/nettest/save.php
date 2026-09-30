<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

require_login();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$body = json_input();
$download = $body['downloadMbps'] ?? null;
$upload = $body['uploadMbps'] ?? null;
$ping = $body['pingMs'] ?? null;

$pdo = get_db();
$ins = $pdo->prepare(
    'INSERT INTO Network_Tests (user_id, download_speed, upload_speed, ping) VALUES (?, ?, ?, ?)'
);
$ins->execute([current_user_id(), $download, $upload, $ping]);

respond(['ok' => true], 201);
