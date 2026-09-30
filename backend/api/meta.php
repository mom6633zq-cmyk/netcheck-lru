<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/helpers.php';

require_login();
$pdo = get_db();

$buildings = $pdo->query('SELECT building_name FROM Buildings WHERE status = "active" ORDER BY building_name')
    ->fetchAll(PDO::FETCH_COLUMN);

// ถ้ายังไม่มีอาคารในฐานข้อมูลเลย ให้แสดงชุดตั้งต้นตามที่ระบุในเอกสาร
if (count($buildings) === 0) {
    $buildings = ['อาคารเรียน 1', 'อาคารเรียน 2', 'อาคารสำนักงาน', 'ห้องสมุด', 'หอพักนักศึกษา', 'โรงอาหาร', 'อาคารกีฬา', 'อื่น ๆ'];
}

$issueTypes = ['อินเทอร์เน็ตช้า', 'เชื่อมต่ออินเทอร์เน็ตไม่ได้', 'Wi-Fi ไม่เสถียร', 'สัญญาณอ่อน', 'อื่น ๆ'];

$staff = $pdo->query("SELECT name FROM Users WHERE role = 'admin' ORDER BY name")->fetchAll(PDO::FETCH_COLUMN);

respond([
    'buildings' => $buildings,
    'issueTypes' => $issueTypes,
    'statusLabels' => STATUS_LABEL,
    'staff' => $staff,
]);
