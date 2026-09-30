<?php
// ตั้งค่าระบบ (ภาพประกอบ 3-18) — เก็บแบบ key/value ในตาราง Settings
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/helpers.php';

require_admin();
$pdo = get_db();

const SETTING_DEFAULTS = [
    'system_name' => 'ระบบตรวจสอบคุณภาพเครือข่าย',
    'admin_email' => 'it@lru.ac.th',
    'auto_check_minutes' => '60',
    'notify_email' => '1',
    'notify_line' => '0',
    'auto_assign' => '1',
    'sla_hours' => '24',
    'auto_close_days' => '7',
    'smtp_host' => 'smtp.lru.ac.th',
    'smtp_port' => '587',
    'smtp_security' => 'TLS',
    'mail_from' => 'noreply@lru.ac.th',
];

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $b = json_input();
    $stmt = $pdo->prepare('INSERT INTO Settings (setting_key, setting_value) VALUES (?, ?)
                           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
    foreach (SETTING_DEFAULTS as $key => $_) {
        if (array_key_exists($key, $b)) $stmt->execute([$key, (string)$b[$key]]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    fail('Method not allowed', 405);
}

$saved = $pdo->query('SELECT setting_key, setting_value FROM Settings')->fetchAll(PDO::FETCH_KEY_PAIR);
respond(['settings' => array_merge(SETTING_DEFAULTS, $saved)]);
