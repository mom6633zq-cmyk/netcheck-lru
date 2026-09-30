<?php
// ประวัติการดำเนินงานของเจ้าหน้าที่ทั้งหมด (ภาพประกอบ 3-16) — เฉพาะแอดมิน
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/helpers.php';

require_admin();
$pdo = get_db();

$rows = $pdo->query(
    'SELECT h.history_id, h.problem_id, h.status, h.note, h.action_date, u.name AS staff_name, u.role AS staff_role
     FROM Problem_History h
     JOIN Users u ON u.user_id = h.user_id AND u.role = \'admin\'
     ORDER BY h.action_date DESC, h.history_id DESC'
)->fetchAll();

$counts = ['total' => count($rows), 'pending' => 0, 'in_progress' => 0, 'resolved' => 0, 'closed' => 0];
$items = [];
foreach ($rows as $r) {
    if (isset($counts[$r['status']])) $counts[$r['status']]++;
    $items[] = [
        'id' => (int)$r['history_id'],
        'time' => $r['action_date'],
        'ticket' => ticket_code($r['problem_id']),
        'status' => $r['status'],
        'statusLabel' => STATUS_LABEL[$r['status']] ?? $r['status'],
        'by' => $r['staff_name'],
        'note' => $r['note'],
    ];
}
respond(['summary' => $counts, 'items' => $items]);
