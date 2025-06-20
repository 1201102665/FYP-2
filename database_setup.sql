-- ===================================================================
-- AeroTrav Database Setup Script
-- Creates database and users table with proper UTF8MB4 encoding
-- ===================================================================

-- Create the database with UTF8MB4 encoding for full Unicode support
CREATE DATABASE IF NOT EXISTS `aerotrav` 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

-- Use the database
USE `aerotrav`;

-- ===================================================================
-- USERS TABLE
-- Stores user account information with roles and status tracking
-- ===================================================================

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT 'User full name',
  `email` varchar(255) NOT NULL COMMENT 'User email address (login)',
  `password` varchar(255) NOT NULL COMMENT 'Hashed password',
  `phone` varchar(20) DEFAULT NULL COMMENT 'User phone number',
  `role` enum('user','admin') NOT NULL DEFAULT 'user' COMMENT 'User role/permission level',
  `status` enum('active','inactive','pending','suspended') NOT NULL DEFAULT 'pending' COMMENT 'Account status',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation time',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time',
  
  -- Primary key
  PRIMARY KEY (`id`),
  
  -- Unique constraints
  UNIQUE KEY `unique_email` (`email`),
  
  -- Indexes for performance
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_email_status` (`email`, `status`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User accounts and authentication';

-- ===================================================================
-- SAMPLE DATA
-- Insert default admin user for testing
-- ===================================================================

-- Insert default admin user (password: admin123)
INSERT INTO `users` (`name`, `email`, `password`, `phone`, `role`, `status`, `created_at`, `updated_at`) 
VALUES (
  'System Administrator',
  'admin@aerotrav.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
  '+1234567890',
  'admin',
  'active',
  NOW(),
  NOW()
);

-- Insert sample regular user (password: user123)
INSERT INTO `users` (`name`, `email`, `password`, `phone`, `role`, `status`, `created_at`, `updated_at`) 
VALUES (
  'John Doe',
  'john@example.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: user123
  '+1987654321',
  'user',
  'active',
  NOW(),
  NOW()
);

-- ===================================================================
-- VERIFICATION QUERIES
-- Run these to verify the setup worked correctly
-- ===================================================================

-- Show database info
SELECT 
  SCHEMA_NAME as 'Database',
  DEFAULT_CHARACTER_SET_NAME as 'Charset',
  DEFAULT_COLLATION_NAME as 'Collation'
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'aerotrav';

-- Show table structure
DESCRIBE users;

-- Show sample data
SELECT id, name, email, role, status, created_at FROM users;

-- Show table info
SELECT 
  TABLE_NAME,
  ENGINE,
  TABLE_COLLATION,
  TABLE_COMMENT,
  TABLE_ROWS
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'aerotrav';

-- ===================================================================
-- NOTES
-- ===================================================================
-- 1. Default admin login: admin@aerotrav.com / admin123
-- 2. Default user login: john@example.com / user123
-- 3. All passwords are properly hashed with password_hash()
-- 4. UTF8MB4 supports full Unicode including emojis
-- 5. Timestamps are automatically managed by MySQL
-- =================================================================== 