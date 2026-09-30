-- NetCheck LRU database schema
-- Matches the Data Dictionary in Chapter 3.2.5 of the project report
-- Import this file via phpMyAdmin, or run: mysql -u root -p < schema.sql

-- ตารางที่ 3-1 ตารางผู้ใช้งาน (Users)
CREATE TABLE IF NOT EXISTS Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  student_code VARCHAR(20),
  email VARCHAR(100) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  phone VARCHAR(20),
  faculty VARCHAR(150),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ตารางที่ 3-2 ตารางอาคาร (Buildings)
CREATE TABLE IF NOT EXISTS Buildings (
  building_id INT AUTO_INCREMENT PRIMARY KEY,
  building_name VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ตารางที่ 3-3 ตารางตรวจสอบคุณภาพเครือข่าย (Network_Tests)
CREATE TABLE IF NOT EXISTS Network_Tests (
  test_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  building_id INT NULL,
  download_speed DECIMAL(10,2),
  upload_speed DECIMAL(10,2),
  ping DECIMAL(10,2),
  test_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note TEXT,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (building_id) REFERENCES Buildings(building_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ตารางที่ 3-4 ตารางการแจ้งปัญหา (Problems)
CREATE TABLE IF NOT EXISTS Problems (
  problem_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  building_id INT NOT NULL,
  area VARCHAR(150) NOT NULL,
  problem_type VARCHAR(100) NOT NULL,
  detail TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  assignee VARCHAR(100),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (building_id) REFERENCES Buildings(building_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ตารางที่ 3-5 ตารางรูปภาพ (Images)
CREATE TABLE IF NOT EXISTS Images (
  image_id INT AUTO_INCREMENT PRIMARY KEY,
  problem_id INT NOT NULL,
  image_name VARCHAR(255) NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (problem_id) REFERENCES Problems(problem_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ตารางที่ 3-6 ตารางประวัติการดำเนินงาน (Problem_History)
CREATE TABLE IF NOT EXISTS Problem_History (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  problem_id INT NOT NULL,
  user_id INT NULL,
  status VARCHAR(30) NOT NULL,
  note TEXT,
  action_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (problem_id) REFERENCES Problems(problem_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- ส่วนขยายเพิ่มเติม (ใช้กับหน้าจัดการผู้ใช้งาน / ตั้งค่าระบบ ตามภาพประกอบ 3-17, 3-18) ----
CREATE TABLE IF NOT EXISTS Settings (
  setting_key VARCHAR(60) PRIMARY KEY,
  setting_value TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
