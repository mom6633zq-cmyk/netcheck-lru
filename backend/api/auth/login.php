<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$body = json_input();
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

if (!$email || !$password) fail('กรุณากรอก Email และรหัสผ่าน');

$pdo = get_db();
$stmt = $pdo->prepare('SELECT * FROM Users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    fail('Email หรือรหัสผ่านไม่ถูกต้อง', 401);
}
if ($user['status'] !== 'active') {
    fail('บัญชีนี้ถูกระงับการใช้งาน', 403);
}

$_SESSION['user_id'] = $user['user_id'];
$_SESSION['role'] = $user['role'];

respond(['user' => user_payload($user)]);
