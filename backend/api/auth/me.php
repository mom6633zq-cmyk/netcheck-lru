<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

require_login();
$pdo = get_db();

if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $b = json_input();
    $stmt = $pdo->prepare(
        'UPDATE Users SET name = COALESCE(?, name), phone = COALESCE(?, phone),
         student_code = COALESCE(?, student_code), faculty = COALESCE(?, faculty) WHERE user_id = ?'
    );
    $stmt->execute([$b['name'] ?? null, $b['phone'] ?? null, $b['studentId'] ?? null, $b['faculty'] ?? null, current_user_id()]);
} elseif ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    fail('Method not allowed', 405);
}

$stmt = $pdo->prepare('SELECT * FROM Users WHERE user_id = ?');
$stmt->execute([current_user_id()]);
$user = $stmt->fetch();
if (!$user) fail('ไม่พบผู้ใช้', 404);
respond(['user' => user_payload($user)]);
