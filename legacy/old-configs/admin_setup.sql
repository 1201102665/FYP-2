-- Additional tables for Admin Dashboard
USE aerotrav;

-- Create admins table for admin authentication
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO admins (username, password_hash) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Create car_rentals table if it doesn't exist
CREATE TABLE IF NOT EXISTS car_rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    daily_rate DECIMAL(10, 2) NOT NULL,
    availability_status ENUM('available', 'unavailable') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create ratings table if it doesn't exist
CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    package_id INT NOT NULL,
    stars TINYINT NOT NULL CHECK (stars >= 1 AND stars <= 5),
    comment TEXT,
    status ENUM('pending', 'approved', 'deleted') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- Add status column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS status ENUM('pending', 'active', 'blocked') DEFAULT 'active';

-- Update bookings table to use proper status values and add missing columns
ALTER TABLE bookings 
MODIFY COLUMN status ENUM('pending', 'approved', 'cancelled', 'completed') DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS travel_date DATE,
ADD COLUMN IF NOT EXISTS num_guests INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS package_id INT,
ADD FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL;

-- Update bookings table to use proper user_id as INT
ALTER TABLE bookings MODIFY COLUMN user_id INT NOT NULL;
ALTER TABLE bookings ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Insert sample car rentals
INSERT INTO car_rentals (company_name, model, type, daily_rate, availability_status) VALUES
('Hertz', 'Toyota Camry', 'Sedan', 45.00, 'available'),
('Avis', 'Honda CR-V', 'SUV', 65.00, 'available'),
('Budget', 'Nissan Sentra', 'Compact', 35.00, 'available'),
('Enterprise', 'Ford Explorer', 'SUV', 75.00, 'available'),
('Alamo', 'Chevrolet Malibu', 'Sedan', 50.00, 'available');

-- Insert sample ratings
INSERT INTO ratings (user_id, package_id, stars, comment, status) VALUES
(1, 1, 5, 'Amazing trip to Bali! Everything was perfect from start to finish.', 'approved'),
(1, 2, 4, 'Paris was beautiful, but the hotel room was smaller than expected.', 'approved'),
(1, 3, 5, 'Tokyo adventure exceeded all expectations. Highly recommended!', 'pending'),
(1, 4, 4, 'Great New York experience, loved the Broadway show.', 'pending'),
(1, 5, 5, 'Sydney was incredible, the harbor cruise was the highlight.', 'pending'),
(1, 1, 3, 'Good overall but some activities were rushed.', 'pending');

-- Insert sample pending bookings
INSERT INTO bookings (booking_reference, user_id, user_email, user_name, package_id, travel_date, num_guests, total_amount, status, payment_method) VALUES
('TRV001', 1, 'user@example.com', 'Test User', 1, '2024-06-15', 2, 1299.99, 'pending', 'card'),
('TRV002', 1, 'user@example.com', 'Test User', 3, '2024-07-20', 1, 1899.99, 'pending', 'paypal'),
('TRV003', 1, 'user@example.com', 'Test User', 2, '2024-08-10', 2, 1499.99, 'pending', 'card'),
('TRV004', 1, 'user@example.com', 'Test User', 5, '2024-09-05', 4, 1999.99, 'pending', 'card'),
('TRV005', 1, 'user@example.com', 'Test User', 4, '2024-10-12', 2, 1699.99, 'pending', 'paypal'); 