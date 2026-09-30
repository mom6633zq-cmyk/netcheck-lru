<?php
// POST = เพิ่มผู้ใช้ใหม่, PATCH ?id=N = แก้ไข / รีเซ็ตรหัสผ่าน / ระงับบัญชี
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

require_admin();
$pdo = get_db();
$b = json_input();
$method = $_SERVER['REQUEST_METHOD'];

$role = in_array($b['role'] ?? 'user', ['user', 'admin'], true) ? ($b['role'] ?? 'user') : 'user';
$status = in_array($b['status'] ?? 'active', ['active', 'suspended'], true) ? ($b['status'] ?? 'active') : 'active';

if ($method === 'POST') {
    $name = trim($b['name'] ?? '');
    $email = trim($b['email'] ?? '');
    $password = $b['password'] ?? '';
    if (!$name || !$email || strlen($password) < 4) fail('กรุณากรอกชื่อ อีเมล และรหัสผ่าน (อย่างน้อย 4 ตัวอักษร)');

    $chk = $pdo->prepare('SELECT user_id FROM Users WHERE email = ?');
    $chk->execute([$email]);
    if ($chk->fetch()) fail('อีเมลนี้ถูกใช้งานแล้ว', 409);

    $ins = $pdo->prepare(
        'INSERT INTO Users (username, password, name, student_code, email, phone, faculty, role, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $ins->execute([$email, password_hash($password, PASSWORD_BCRYPT), $name, $b['studentId'] ?? null,
                   $email, $b['phone'] ?? null, $b['faculty'] ?? null, $role, $status]);
    respond(['ok' => true, 'id' => (int)$pdo->lastInsertId()], 201);
}

if ($method === 'PATCH') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) fail('ไม่พบผู้ใช้', 404);
    // กันแอดมินระงับ/ลดสิทธิ์บัญชีตัวเองจนเข้าระบบไม่ได้
    if ($id === (int)current_user_id() && (($b['status'] ?? 'active') !== 'active' || ($b['role'] ?? 'admin') !== 'admin')) {
        fail('ไม่สามารถระงับหรือลดสิทธิ์บัญชีของตัวเองได้');
    }

    $upd = $pdo->prepare(
        'UPDATE Users SET name = COALESCE(?, name), student_code = COALESCE(?, student_code),
         phone = COALESCE(?, phone), faculty = COALESCE(?, faculty), role = COALESCE(?, role), status = COALESCE(?, status)
         WHERE user_id = ?'
    );
    $upd->execute([$b['name'] ?? null, $b['studentId'] ?? null, $b['phone'] ?? null, $b['faculty'] ?? null,
                   isset($b['role']) ? $role : null, isset($b['status']) ? $status : null, $id]);

    if (!empty($b['newPassword'])) {
        if (strlen($b['newPassword']) < 4) fail('รหัสผ่านใหม่ต้องมีอย่างน้อย 4 ตัวอักษร');
        $pw = $pdo->prepare('UPDATE Users SET password = ? WHERE user_id = ?');
        $pw->execute([password_hash($b['newPassword'], PASSWORD_BCRYPT), $id]);
    }
    respond(['ok' => true]);
}
fail('Method not allowed', 405);
