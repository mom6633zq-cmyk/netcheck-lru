<?php
// includes/helpers.php

function json_input() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail($message, $code = 400) {
    respond(['error' => $message], $code);
}

function current_user_id() {
    return $_SESSION['user_id'] ?? null;
}

function current_role() {
    return $_SESSION['role'] ?? null;
}

function require_login() {
    if (!current_user_id()) {
        fail('ไม่ได้เข้าสู่ระบบ', 401);
    }
}

function require_admin() {
    require_login();
    if (current_role() !== 'admin') {
        fail('ต้องเป็นผู้ดูแลระบบเท่านั้น', 403);
    }
}

const STATUS_LABEL = [
    'pending' => 'รอตรวจสอบ',
    'in_progress' => 'กำลังดำเนินการ',
    'resolved' => 'แก้ไขแล้ว',
    'closed' => 'ปิดงาน',
];

function ticket_code($problem_id) {
    return 'NET-' . str_pad($problem_id, 4, '0', STR_PAD_LEFT);
}

function ticket_id_from_code($code) {
    // "NET-0007" -> 7
    if (preg_match('/(\d+)$/', $code, $m)) {
        return (int) $m[1];
    }
    return (int) $code;
}

function find_or_create_building($pdo, $name) {
    $stmt = $pdo->prepare('SELECT building_id FROM Buildings WHERE building_name = ?');
    $stmt->execute([$name]);
    $row = $stmt->fetch();
    if ($row) return $row['building_id'];

    $ins = $pdo->prepare('INSERT INTO Buildings (building_name, status) VALUES (?, ?)');
    $ins->execute([$name, 'active']);
    return $pdo->lastInsertId();
}

function user_payload($u) {
    return [
        'id' => (int)$u['user_id'],
        'name' => $u['name'],
        'studentId' => $u['student_code'] ?? null,
        'email' => $u['email'],
        'phone' => $u['phone'],
        'faculty' => $u['faculty'] ?? null,
        'role' => $u['role'],
        'status' => $u['status'] ?? 'active',
    ];
}
