<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

require_login();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed', 405);

$pdo = get_db();

$sql = 'SELECT p.*, b.building_name, u.name AS reporter_name, u.email AS reporter_email, u.phone AS reporter_phone
        FROM Problems p
        JOIN Buildings b ON b.building_id = p.building_id
        JOIN Users u ON u.user_id = p.user_id
        WHERE 1=1';
$params = [];

$isAdmin = current_role() === 'admin';
$mine = $_GET['mine'] ?? '';
if (!$isAdmin || $mine === '1') {
    $sql .= ' AND p.user_id = ?';
    $params[] = current_user_id();
}
if (!empty($_GET['building'])) {
    $sql .= ' AND b.building_name = ?';
    $params[] = $_GET['building'];
}
if (!empty($_GET['type'])) {
    $sql .= ' AND p.problem_type = ?';
    $params[] = $_GET['type'];
}
if (!empty($_GET['status'])) {
    $sql .= ' AND p.status = ?';
    $params[] = $_GET['status'];
}
if (!empty($_GET['search'])) {
    $s = '%' . $_GET['search'] . '%';
    $sql .= ' AND (b.building_name LIKE ? OR p.problem_type LIKE ? OR u.name LIKE ? OR p.problem_id LIKE ?)';
    array_push($params, $s, $s, $s, $s);
}
$sql .= ' ORDER BY p.created_at DESC';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$tickets = array_map('serialize_ticket_row', $rows);
respond(['tickets' => $tickets]);

function serialize_ticket_row($row) {
    global $pdo;
    $pid = $row['problem_id'];

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

    return [
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
    ];
}
