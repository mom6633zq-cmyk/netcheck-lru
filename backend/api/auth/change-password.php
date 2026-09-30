<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

require_login();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$body = json_input();
$current = $body['currentPassword'] ?? '';
$next = $body['newPassword'] ?? '';

$pdo = get_db();
$stmt = $pdo->prepare('SELECT * FROM Users WHERE user_id = ?');
$stmt->execute([current_user_id()]);
$user = $stmt->fetch();

if (!password_verify($current, $user['password'])) {
    fail('รหัสผ่านปัจจุบันไม่ถูกต้อง');
}
if (strlen($next) < 4) {
    fail('รหัสผ่านใหม่ต้องมีอย่างน้อย 4 ตัวอักษร');
}

$hash = password_hash($next, PASSWORD_BCRYPT);
$upd = $pdo->prepare('UPDATE Users SET password = ? WHERE user_id = ?');
$upd->execute([$hash, current_user_id()]);

respond(['ok' => true]);
