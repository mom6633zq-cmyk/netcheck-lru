-- migration_v2.sql — สำหรับคนที่ import schema.sql เวอร์ชันแรกไปแล้ว
-- เปิด phpMyAdmin > เลือกฐานข้อมูล netcheck_lru > แท็บ SQL > วางทั้งไฟล์นี้ > Go
ALTER TABLE Users ADD COLUMN IF NOT EXISTS student_code VARCHAR(20) NULL AFTER name;
ALTER TABLE Users ADD COLUMN IF NOT EXISTS faculty VARCHAR(150) NULL AFTER phone;

CREATE TABLE IF NOT EXISTS Settings (
  setting_key VARCHAR(60) PRIMARY KEY,
  setting_value TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- เติมข้อมูลตัวอย่างให้บัญชีที่ seed ไว้แล้ว (ถ้าอีเมลตรงกัน)
UPDATE Users SET faculty = 'สำนักคอมพิวเตอร์' WHERE email = 'admin@lru.ac.th';
UPDATE Users SET student_code = '6501001234', faculty = 'คณะวิทยาศาสตร์และเทคโนโลยี' WHERE email = 'somchai@lru.ac.th';
UPDATE Users SET student_code = '6501005678', faculty = 'คณะครุศาสตร์' WHERE email = 'malee@lru.ac.th';
