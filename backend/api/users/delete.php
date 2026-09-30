<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/helpers.php';

require_admin();
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') fail('Method not allowed', 405);
$id = (int)($_GET['id'] ?? 0);
if (!$id) fail('ไม่พบผู้ใช้', 404);
if ($id === (int)current_user_id()) fail('ไม่สามารถลบบัญชีของตัวเองได้');

$pdo = get_db();
$pdo->prepare('DELETE FROM Users WHERE user_id = ?')->execute([$id]); // Problems ของผู้ใช้จะถูกลบตาม (ON DELETE CASCADE)
respond(['ok' => true]);
