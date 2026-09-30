<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

require_login();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed', 405);

$code = $_GET['id'] ?? '';
$pid = ticket_id_from_code($code);
if (!$pid) fail('ไม่พบรายการแจ้งปัญหา', 404);

$pdo = get_db();
$stmt = $pdo->prepare(
    'SELECT p.*, b.building_name, u.name AS reporter_name, u.email AS reporter_email, u.phone AS reporter_phone
     FROM Problems p
     JOIN Buildings b ON b.building_id = p.building_id
     JOIN Users u ON u.user_id = p.user_id
     WHERE p.problem_id = ?'
);
$stmt->execute([$pid]);
$row = $stmt->fetch();
if (!$row) fail('ไม่พบรายการแจ้งปัญหา', 404);

if (current_role() !== 'admin' && (int)$row['user_id'] !== (int)current_user_id()) {
    fail('ไม่มีสิทธิ์เข้าถึงรายการนี้', 403);
}

$imgStmt = $pdo->prepare('SELECT image_path FROM Images WHERE problem_id = ? ORDER BY image_id DESC LIMIT 1');
$imgStmt->execute([$pid]);
$img = $imgStmt->fetch();

$histStmt = $pdo->prepare('SELECT status, note, action_date FROM Problem_History WHERE problem_id = ? ORDER BY history_id ASC');
$histStmt->execute([$pid]);
$timeline = array_map(function ($h) {
    return [
        'label' => STATUS_LABEL[$h['status']] ?? $h['status'],
        'date' => $h['action_date'],
        'note' => $h['note'],
    ];
}, $histStmt->fetchAll());

respond(['ticket' => [
    'id' => ticket_code($pid),
    'building' => $row['building_name'],
    'area' => $row['area'],
    'type' => $row['problem_type'],
    'description' => $row['detail'],
    'image' => $img ? '/uploads/' . $img['image_path'] : null,
    'status' => $row['status'],
    'statusLabel' => STATUS_LABEL[$row['status']] ?? $row['status'],
    'reporter' => $row['reporter_name'],
    'reporterEmail' => $row['reporter_email'],
    'reporterPhone' => $row['reporter_phone'],
    'assignee' => $row['assignee'],
    'staffNote' => count($timeline) ? end($timeline)['note'] : null,
    'createdAt' => $row['created_at'],
    'updatedAt' => $row['updated_at'],
    'timeline' => $timeline,
]]);
