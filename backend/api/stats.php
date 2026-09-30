<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/helpers.php';

require_admin();
$pdo = get_db();

$total = (int) $pdo->query('SELECT COUNT(*) c FROM Problems')->fetch()['c'];

$byStatus = $pdo->query('SELECT status, COUNT(*) c FROM Problems GROUP BY status')->fetchAll();
$statusMap = [];
foreach ($byStatus as $r) $statusMap[$r['status']] = (int)$r['c'];

$byType = $pdo->query('SELECT problem_type AS type, COUNT(*) c FROM Problems GROUP BY problem_type ORDER BY c DESC')->fetchAll();
$byBuilding = $pdo->query(
    'SELECT b.building_name AS building, COUNT(*) c
     FROM Problems p JOIN Buildings b ON b.building_id = p.building_id
     GROUP BY b.building_name ORDER BY c DESC'
)->fetchAll();
$byMonth = $pdo->query(
    "SELECT DATE_FORMAT(created_at, '%Y-%m') month, COUNT(*) total,
     SUM(CASE WHEN status IN ('resolved','closed') THEN 1 ELSE 0 END) resolved
     FROM Problems GROUP BY month ORDER BY month ASC"
)->fetchAll();
$avgRes = $pdo->query(
    "SELECT b.building_name AS building, AVG(TIMESTAMPDIFF(SECOND, p.created_at, p.updated_at))/3600 hours
     FROM Problems p JOIN Buildings b ON b.building_id = p.building_id
     WHERE p.status IN ('resolved','closed') GROUP BY b.building_name"
)->fetchAll();

respond([
    'total' => $total,
    'pending' => $statusMap['pending'] ?? 0,
    'inProgress' => $statusMap['in_progress'] ?? 0,
    'resolved' => $statusMap['resolved'] ?? 0,
    'closed' => $statusMap['closed'] ?? 0,
    'byType' => array_map(fn($r) => ['type' => $r['type'], 'c' => (int)$r['c']], $byType),
    'byBuilding' => array_map(fn($r) => ['building' => $r['building'], 'c' => (int)$r['c']], $byBuilding),
    'byMonth' => array_map(fn($r) => ['month' => $r['month'], 'total' => (int)$r['total'], 'resolved' => (int)$r['resolved']], $byMonth),
    'avgResolutionByBuilding' => array_map(fn($r) => ['building' => $r['building'], 'hours' => round((float)$r['hours'], 1)], $avgRes),
]);
