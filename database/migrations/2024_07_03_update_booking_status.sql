-- Migration to update booking status enum to have only three statuses
ALTER TABLE `bookings` 
MODIFY COLUMN `booking_status` enum('pending','confirmed','rejected') DEFAULT 'pending';

-- Update any existing completed bookings to confirmed
UPDATE `bookings` SET `booking_status` = 'confirmed' WHERE `booking_status` = 'completed';

-- Update any existing cancelled bookings to rejected
UPDATE `bookings` SET `booking_status` = 'rejected' WHERE `booking_status` = 'cancelled'; 