<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

require_login();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$body = json_input();
$building = trim($body['building'] ?? '');
$area = trim($body['area'] ?? '');
$type = trim($body['type'] ?? '');
$description = trim($body['description'] ?? '');
$image = $body['image'] ?? null; // data URL base64, optional

if (!$building || !$area || !$type || !$description) {
    fail('กรุณากรอกข้อมูลให้ครบถ้วน');
}

$pdo = get_db();
$pdo->beginTransaction();
try {
    $buildingId = find_or_create_building($pdo, $building);

    $ins = $pdo->prepare(
        'INSERT INTO Problems (user_id, building_id, area, problem_type, detail, status)
         VALUES (?, ?, ?, ?, ?, \'pending\')'
    );
    $ins->execute([current_user_id(), $buildingId, $area, $type, $description]);
    $problemId = $pdo->lastInsertId();

    $histIns = $pdo->prepare(
        "INSERT INTO Problem_History (problem_id, user_id, status, note) VALUES (?, ?, 'pending', 'แจ้งผ่านระบบออนไลน์')"
    );
    $histIns->execute([$problemId, current_user_id()]);

    if ($image && preg_match('/^data:image\/(\w+);base64,(.+)$/', $image, $m)) {
        $ext = $m[1] === 'jpeg' ? 'jpg' : $m[1];
        $binary = base64_decode($m[2]);
        $filename = 'problem_' . $problemId . '_' . time() . '.' . $ext;
        $uploadDir = __DIR__ . '/../../uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0775, true);
        file_put_contents($uploadDir . $filename, $binary);

        $imgIns = $pdo->prepare(
            'INSERT INTO Images (problem_id, image_name, image_path) VALUES (?, ?, ?)'
        );
        $imgIns->execute([$problemId, $filename, $filename]);
    }

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    fail('บันทึกข้อมูลไม่สำเร็จ: ' . $e->getMessage(), 500);
}

respond(['ticket' => ['id' => ticket_code($problemId)]], 201);
