<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$body = json_input();
$name = trim($body['name'] ?? '');
$studentId = trim($body['studentId'] ?? '');
$email = trim($body['email'] ?? '');
$phone = trim($body['phone'] ?? '');
$password = $body['password'] ?? '';

if (!$name || !$email || !$password) {
    fail('กรุณากรอกชื่อ อีเมล และรหัสผ่าน');
}

$pdo = get_db();

$stmt = $pdo->prepare('SELECT user_id FROM Users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    fail('อีเมลนี้ถูกใช้งานแล้ว', 409);
}

// username: ใช้ email เป็น username เพื่อความง่าย (ไม่ซ้ำ)
$hash = password_hash($password, PASSWORD_BCRYPT);
$ins = $pdo->prepare(
    'INSERT INTO Users (username, password, name, student_code, email, phone, role, status)
     VALUES (?, ?, ?, ?, ?, ?, \'user\', \'active\')'
);
$ins->execute([$email, $hash, $name, $studentId ?: null, $email, $phone]);
$userId = $pdo->lastInsertId();

$_SESSION['user_id'] = $userId;
$_SESSION['role'] = 'user';

$stmt = $pdo->prepare('SELECT * FROM Users WHERE user_id = ?');
$stmt->execute([$userId]);
respond(['user' => user_payload($stmt->fetch())], 201);
