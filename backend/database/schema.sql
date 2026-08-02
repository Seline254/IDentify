CREATE DATABASE IF NOT EXISTS IDentifyDB;
USE IDentifyDB;

CREATE TABLE IF NOT EXISTS OFFICERS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    gate VARCHAR(50) NOT NULL,
    role ENUM('officer', 'superadmin') DEFAULT 'officer',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS INVENTORY_RECORDS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reg_number VARCHAR(20) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    course VARCHAR(100) NOT NULL,
    college VARCHAR(100) NOT NULL,
    gate VARCHAR(50) NOT NULL,
    status ENUM('in_custody', 'claimed') DEFAULT 'in_custody',
    date_logged TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    claimed_at TIMESTAMP NULL,
    logged_by INT NOT NULL,
    FOREIGN KEY (logged_by) REFERENCES OFFICERS(id)
);

-- Seed officer (password is 'password')
INSERT INTO OFFICERS (full_name, username, password_hash, gate, role, is_active)
VALUES ('Test Officer', 'officer1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uSi8CJjjO', 'Main Gate', 'officer', 1);