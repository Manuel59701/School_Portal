-- =======================================================
-- ST. AUGUSTINE ACADEMY - DATABASE SCHEMA (MYSQL / MARIADB)
-- MILESTONE 1 (CORE) + MILESTONE 2 (PREPARED EXTENSIONS)
-- =======================================================

CREATE DATABASE IF NOT EXISTS school_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE school_portal;

-- 1. Users Table (Core Auth for Admin, Teachers, Students)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin', 'accounts_officer') NOT NULL DEFAULT 'student',
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Classes & Arms Table
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL, -- e.g. "SSS 2 Sapphire (Science)"
    level ENUM('nursery', 'primary', 'secondary') NOT NULL,
    section VARCHAR(80) DEFAULT NULL, -- e.g. "Senior Secondary"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    class_id INT NOT NULL,
    admission_no VARCHAR(50) NOT NULL UNIQUE,
    guardian_name VARCHAR(150),
    guardian_phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE RESTRICT
);

-- 4. Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    assigned_class_id INT DEFAULT NULL,
    specialization_subject VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_class_id) REFERENCES classes(id) ON DELETE SET NULL
);

-- 5. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    class_id INT DEFAULT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 6. Results Table
CREATE TABLE IF NOT EXISTS results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    term VARCHAR(50) NOT NULL, -- e.g. 'Second Term 2025/2026'
    ca_score DECIMAL(5,2) DEFAULT 0.00,
    exam_score DECIMAL(5,2) DEFAULT 0.00,
    total_score DECIMAL(5,2) DEFAULT 0.00,
    grade VARCHAR(5) NOT NULL,
    remarks VARCHAR(150),
    source ENUM('manual', 'upload_ocr') DEFAULT 'manual',
    status ENUM('draft', 'published', 'locked') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE RESTRICT
);

-- 7. Result Uploads & OCR Parsing Records
CREATE TABLE IF NOT EXISTS result_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    parsed_json_data LONGTEXT,
    reviewed TINYINT(1) DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

-- 8. Newsletter Subscribers Table (Milestone 1 Core)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================================================
-- INITIAL SEED DATA
-- =======================================================

-- Admin user (password: admin123)
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'System Administrator', 'admin@staugustine.edu', '$2y$10$e7K4b.dF5qN9uCeq2wMv9ea7nLqUq.5hO0Xj82Y9eQ4.P3n5MhCke', 'admin'),
(2, 'Dr. Sarah Adebayo', 'sarah.adebayo@academy.edu', '$2y$10$e7K4b.dF5qN9uCeq2wMv9ea7nLqUq.5hO0Xj82Y9eQ4.P3n5MhCke', 'teacher'),
(3, 'Tariq Emmanuel Johnson', 'tariq.johnson@student.academy.edu', '$2y$10$e7K4b.dF5qN9uCeq2wMv9ea7nLqUq.5hO0Xj82Y9eQ4.P3n5MhCke', 'student')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO classes (id, name, level, section) VALUES
(1, 'Nursery 1 Diamond', 'nursery', 'Early Years'),
(2, 'Primary 4 Emerald', 'primary', 'Primary School'),
(3, 'JSS 2 Gold', 'secondary', 'Junior Secondary'),
(4, 'SSS 2 Sapphire (Science)', 'secondary', 'Senior Secondary')
ON DUPLICATE KEY UPDATE id=id;
