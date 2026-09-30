<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

require_login();
$pdo = get_db();
$stmt = $pdo->prepare(
    'SELECT download_speed, upload_speed, ping, test_date FROM Network_Tests WHERE user_id = ? ORDER BY test_date DESC LIMIT 1'
);
$stmt->execute([current_user_id()]);
$row = $stmt->fetch();

respond(['result' => $row ? [
    'download_mbps' => (float) $row['download_speed'],
    'upload_mbps' => (float) $row['upload_speed'],
    'ping_ms' => (float) $row['ping'],
] : null]);
