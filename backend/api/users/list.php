<?php
// รายชื่อผู้ใช้งาน + จำนวนเรื่องที่แจ้ง (ภาพประกอบ 3-17) — เฉพาะแอดมิน
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

require_admin();
$pdo = get_db();

$rows = $pdo->query(
    'SELECT u.*, (SELECT COUNT(*) FROM Problems p WHERE p.user_id = u.user_id) AS problem_count
     FROM Users u ORDER BY u.user_id ASC'
)->fetchAll();

$users = array_map(function ($r) {
    $u = user_payload($r);
    $u['problemCount'] = (int)$r['problem_count'];
    $u['createdAt'] = $r['created_at'];
    return $u;
}, $rows);

respond(['users' => $users]);
