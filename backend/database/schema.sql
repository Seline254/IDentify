-- Purpose: Database schema and table creation script.
CREATE DATABASE IF NOT_EXISTS IDentifyDB;
USE IDentifyDB;

CREATE TABLE IF NOT EXISTS STUDENTS (
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    Reg_No VARCHAR(20) NOT NULL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
);

CREATE TABLE IF NOT EXISTS OFFICERS(
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    work_id VARCHAR(20) NOT NULL PRIMARY KEY,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
);

CREATE TABLE IF NOT EXISTS Lost_Students_ID (
    Reg_No VARCHAR(20) NOT NULL,
    Found_at VARCHAR(100) NOT NULL,
    status ENUM('Found', 'Not Found') NOT NULL,
    pickup_point VARCHAR(100) NOT NULL,
    FOREIGN KEY (Reg_No) REFERENCES STUDENTS(Reg_No)
);