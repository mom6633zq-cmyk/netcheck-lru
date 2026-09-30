<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

require_admin();
if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') fail('Method not allowed', 405);

$code = $_GET['id'] ?? '';
$pid = ticket_id_from_code($code);
if (!$pid) fail('ไม่พบรายการแจ้งปัญหา', 404);

$pdo = get_db();
$stmt = $pdo->prepare('SELECT * FROM Problems WHERE problem_id = ?');
$stmt->execute([$pid]);
$row = $stmt->fetch();
if (!$row) fail('ไม่พบรายการแจ้งปัญหา', 404);

$body = json_input();
$status = $body['status'] ?? null;
$assignee = $body['assignee'] ?? null;
$staffNote = $body['staffNote'] ?? null;

$upd = $pdo->prepare(
    'UPDATE Problems SET status = COALESCE(?, status), assignee = COALESCE(?, assignee), updated_at = NOW() WHERE problem_id = ?'
);
$upd->execute([$status, $assignee, $pid]);

if ($status || $staffNote) {
    $newStatus = $status ?: $row['status'];
    $hist = $pdo->prepare('INSERT INTO Problem_History (problem_id, user_id, status, note) VALUES (?, ?, ?, ?)');
    $hist->execute([$pid, current_user_id(), $newStatus, $staffNote]);
}

respond(['ok' => true, 'id' => ticket_code($pid)]);
