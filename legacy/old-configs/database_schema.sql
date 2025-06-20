-- ===================================================================
-- AeroTrav Complete Database Schema
-- MySQL Database Schema for AeroTrav Travel Booking System
-- ===================================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS aerotrav;
USE aerotrav;

-- ===================================================================
-- USERS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('customer', 'admin') DEFAULT 'customer',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- ===================================================================
-- HOTELS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    address TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    price_per_night DECIMAL(10,2) NOT NULL,
    amenities JSON,
    images JSON,
    available_rooms INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_destination (destination),
    INDEX idx_status (status),
    INDEX idx_price (price_per_night)
);

-- ===================================================================
-- FLIGHTS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    airline VARCHAR(100) NOT NULL,
    flight_number VARCHAR(20) NOT NULL,
    departure_city VARCHAR(100) NOT NULL,
    arrival_city VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    available_seats INT NOT NULL,
    class ENUM('economy', 'business', 'first') DEFAULT 'economy',
    aircraft_type VARCHAR(50),
    status ENUM('active', 'cancelled', 'delayed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_departure_city (departure_city),
    INDEX idx_arrival_city (arrival_city),
    INDEX idx_departure_time (departure_time),
    INDEX idx_status (status),
    INDEX idx_price (price)
);

-- ===================================================================
-- CARS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    type ENUM('sedan', 'suv', 'hatchback', 'luxury', 'van') NOT NULL,
    location VARCHAR(100) NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL,
    fuel_type ENUM('petrol', 'diesel', 'electric', 'hybrid') DEFAULT 'petrol',
    seats INT NOT NULL,
    transmission ENUM('manual', 'automatic') DEFAULT 'manual',
    features JSON,
    images JSON,
    available BOOLEAN DEFAULT TRUE,
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (location),
    INDEX idx_type (type),
    INDEX idx_price (price_per_day),
    INDEX idx_status (status)
);

-- ===================================================================
-- PACKAGES TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    destination VARCHAR(100) NOT NULL,
    duration_days INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    includes JSON,
    excludes JSON,
    itinerary JSON,
    images JSON,
    max_people INT DEFAULT 10,
    difficulty_level ENUM('easy', 'moderate', 'difficult') DEFAULT 'easy',
    season ENUM('all', 'summer', 'winter', 'monsoon') DEFAULT 'all',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_destination (destination),
    INDEX idx_duration (duration_days),
    INDEX idx_price (price),
    INDEX idx_status (status)
);

-- ===================================================================
-- CARTS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    service_type ENUM('hotel', 'flight', 'car', 'package') NOT NULL,
    quantity INT DEFAULT 1,
    details JSON,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_service_type (service_type),
    UNIQUE KEY unique_user_service (user_id, service_id, service_type)
);

-- ===================================================================
-- BOOKINGS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    service_type ENUM('hotel', 'flight', 'car', 'package', 'mixed') NOT NULL,
    details JSON NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    booking_status ENUM('confirmed', 'cancelled', 'completed', 'pending') DEFAULT 'pending',
    booking_date DATE NOT NULL,
    return_date DATE,
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_booking_reference (booking_reference),
    INDEX idx_booking_status (booking_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_booking_date (booking_date)
);

-- ===================================================================
-- RATINGS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    service_type ENUM('hotel', 'flight', 'car', 'package') NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_service_id (service_id),
    INDEX idx_service_type (service_type),
    INDEX idx_rating (rating),
    INDEX idx_status (status),
    UNIQUE KEY unique_user_service_rating (user_id, service_id, service_type)
);

-- ===================================================================
-- SESSIONS TABLE (Optional - for session management)
-- ===================================================================
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT,
    data TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- ===================================================================
-- ADMIN LOGS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_action (action),
    INDEX idx_table_name (table_name),
    INDEX idx_created_at (created_at)
);

-- ===================================================================
-- SAMPLE DATA INSERTS
-- ===================================================================

-- Insert default admin user
INSERT IGNORE INTO users (name, email, password, role, status) VALUES
('Admin User', 'admin@aerotrav.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active');

-- Insert sample hotels
INSERT IGNORE INTO hotels (name, description, location, destination, price_per_night, amenities, images, available_rooms) VALUES
('Grand Palace Hotel', 'Luxury hotel in the heart of the city', 'Downtown', 'New York', 299.99, '["WiFi", "Pool", "Gym", "Spa", "Restaurant"]', '["hotel1.jpg", "hotel2.jpg"]', 50),
('Beach Resort Paradise', 'Beautiful beachfront resort', 'Beachfront', 'Miami', 199.99, '["WiFi", "Pool", "Beach Access", "Restaurant", "Bar"]', '["resort1.jpg", "resort2.jpg"]', 30),
('Mountain View Lodge', 'Cozy lodge with mountain views', 'Mountains', 'Denver', 149.99, '["WiFi", "Fireplace", "Hiking Trails", "Restaurant"]', '["lodge1.jpg", "lodge2.jpg"]', 25);

-- Insert sample flights
INSERT IGNORE INTO flights (airline, flight_number, departure_city, arrival_city, departure_time, arrival_time, price, available_seats, class) VALUES
('AirTrav', 'AT101', 'New York', 'Los Angeles', '2024-01-15 08:00:00', '2024-01-15 11:30:00', 299.99, 150, 'economy'),
('AirTrav', 'AT102', 'Los Angeles', 'New York', '2024-01-15 14:00:00', '2024-01-15 22:30:00', 299.99, 150, 'economy'),
('SkyLine', 'SL201', 'Chicago', 'Miami', '2024-01-16 09:00:00', '2024-01-16 13:00:00', 249.99, 120, 'economy');

-- Insert sample cars
INSERT IGNORE INTO cars (make, model, year, type, location, price_per_day, seats, transmission, features, images) VALUES
('Toyota', 'Camry', 2023, 'sedan', 'New York', 49.99, 5, 'automatic', '["GPS", "Bluetooth", "AC", "Backup Camera"]', '["car1.jpg", "car2.jpg"]'),
('Honda', 'CR-V', 2023, 'suv', 'Los Angeles', 69.99, 7, 'automatic', '["GPS", "Bluetooth", "AC", "All-Wheel Drive"]', '["suv1.jpg", "suv2.jpg"]'),
('Ford', 'Mustang', 2023, 'luxury', 'Miami', 89.99, 4, 'automatic', '["GPS", "Bluetooth", "AC", "Premium Sound"]', '["luxury1.jpg", "luxury2.jpg"]');

-- Insert sample packages
INSERT IGNORE INTO packages (name, description, destination, duration_days, price, includes, excludes, itinerary, images, max_people) VALUES
('NYC Weekend Getaway', 'Explore the Big Apple', 'New York', 3, 799.99, '["Hotel", "Breakfast", "City Tour", "Airport Transfer"]', '["Flights", "Dinner", "Personal Expenses"]', '["Day 1: Arrival and Check-in", "Day 2: City Tour", "Day 3: Departure"]', '["nyc1.jpg", "nyc2.jpg"]', 4),
('Miami Beach Vacation', 'Sun, sand, and relaxation', 'Miami', 5, 1299.99, '["Hotel", "Breakfast", "Beach Access", "Airport Transfer"]', '["Flights", "Dinner", "Water Sports"]', '["Day 1: Arrival", "Day 2-4: Beach Time", "Day 5: Departure"]', '["miami1.jpg", "miami2.jpg"]', 6);

-- ===================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ===================================================================

-- Update hotel ratings when new rating is added
DELIMITER //
CREATE TRIGGER update_hotel_rating 
AFTER INSERT ON ratings 
FOR EACH ROW
BEGIN
    IF NEW.service_type = 'hotel' AND NEW.status = 'approved' THEN
        UPDATE hotels 
        SET rating = (
            SELECT AVG(rating) 
            FROM ratings 
            WHERE service_id = NEW.service_id 
            AND service_type = 'hotel' 
            AND status = 'approved'
        )
        WHERE id = NEW.service_id;
    END IF;
END//
DELIMITER ;

-- Create indexes for better performance
CREATE INDEX idx_bookings_user_date ON bookings(user_id, booking_date);
CREATE INDEX idx_ratings_service_approved ON ratings(service_id, service_type, status);
CREATE INDEX idx_carts_user_added ON carts(user_id, added_at);

-- ===================================================================
-- VIEWS FOR COMMON QUERIES
-- ===================================================================

-- View for active services summary
CREATE VIEW active_services_summary AS
SELECT 
    'hotels' as service_type, 
    COUNT(*) as total_count,
    AVG(price_per_night) as avg_price
FROM hotels WHERE status = 'active'
UNION ALL
SELECT 
    'flights' as service_type,
    COUNT(*) as total_count,
    AVG(price) as avg_price
FROM flights WHERE status = 'active'
UNION ALL
SELECT 
    'cars' as service_type,
    COUNT(*) as total_count,
    AVG(price_per_day) as avg_price
FROM cars WHERE status = 'active'
UNION ALL
SELECT 
    'packages' as service_type,
    COUNT(*) as total_count,
    AVG(price) as avg_price
FROM packages WHERE status = 'active';

-- ===================================================================
-- STORED PROCEDURES
-- ===================================================================

-- Procedure to clean up old sessions
DELIMITER //
CREATE PROCEDURE CleanupOldSessions()
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
END//
DELIMITER ;

-- Procedure to get user booking history
DELIMITER //
CREATE PROCEDURE GetUserBookingHistory(IN user_id_param INT)
BEGIN
    SELECT 
        b.*,
        u.name as user_name,
        u.email as user_email
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    WHERE b.user_id = user_id_param
    ORDER BY b.created_at DESC;
END//
DELIMITER ;

-- Set up event scheduler to clean old sessions (run daily)
SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS cleanup_sessions
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
    CALL CleanupOldSessions();

-- ===================================================================
-- FINAL SETUP VERIFICATION
-- ===================================================================
SELECT 'AeroTrav Database Schema Created Successfully!' as message; 