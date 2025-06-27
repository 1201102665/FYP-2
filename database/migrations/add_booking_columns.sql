-- Migration to add missing columns to bookings table
-- These columns are needed for the booking creation API to work properly

ALTER TABLE `bookings` 
ADD COLUMN `service_type` varchar(50) DEFAULT NULL AFTER `commission_amount`,
ADD COLUMN `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)) AFTER `service_type`,
ADD COLUMN `booking_status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending' AFTER `details`,
ADD COLUMN `return_date` date DEFAULT NULL AFTER `booking_status`;

-- Update existing records to have default values
UPDATE `bookings` SET `service_type` = 'mixed' WHERE `service_type` IS NULL;
UPDATE `bookings` SET `booking_status` = 'pending' WHERE `booking_status` IS NULL; 