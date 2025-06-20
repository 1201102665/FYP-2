-- ===================================================================
-- AeroTrav Complete Database Schema
-- Comprehensive travel booking platform with all features
-- ===================================================================

-- Create database with UTF8MB4 support
DROP DATABASE IF EXISTS aerotrav;
CREATE DATABASE aerotrav 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

USE aerotrav;

-- ===================================================================
-- CORE USER TABLES
-- ===================================================================

-- Users table (enhanced from existing)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('active', 'inactive', 'pending', 'suspended') DEFAULT 'pending',
    profile_image VARCHAR(500),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    nationality VARCHAR(100),
    passport_number VARCHAR(50),
    preferred_language VARCHAR(10) DEFAULT 'en',
    preferred_currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- User preferences table
CREATE TABLE user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_preference (user_id, preference_key),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- ===================================================================
-- TRAVEL INVENTORY TABLES
-- ===================================================================

-- Airlines table
CREATE TABLE airlines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    country VARCHAR(100),
    website VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Airports table
CREATE TABLE airports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    iata_code VARCHAR(3) NOT NULL UNIQUE,
    icao_code VARCHAR(4),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone VARCHAR(50),
    status ENUM('active', 'inactive') DEFAULT 'active',
    
    INDEX idx_iata_code (iata_code),
    INDEX idx_city (city),
    INDEX idx_country (country)
) ENGINE=InnoDB;

-- Flights table (enhanced)
CREATE TABLE flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    airline_id INT NOT NULL,
    flight_number VARCHAR(20) NOT NULL,
    origin_airport_id INT NOT NULL,
    destination_airport_id INT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    aircraft_type VARCHAR(100),
    price_economy DECIMAL(10, 2),
    price_business DECIMAL(10, 2),
    price_first DECIMAL(10, 2),
    seats_economy INT DEFAULT 0,
    seats_business INT DEFAULT 0,
    seats_first INT DEFAULT 0,
    available_economy INT DEFAULT 0,
    available_business INT DEFAULT 0,
    available_first INT DEFAULT 0,
    status ENUM('scheduled', 'delayed', 'cancelled', 'completed') DEFAULT 'scheduled',
    baggage_allowance JSON,
    amenities JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (airline_id) REFERENCES airlines(id),
    FOREIGN KEY (origin_airport_id) REFERENCES airports(id),
    FOREIGN KEY (destination_airport_id) REFERENCES airports(id),
    INDEX idx_route (origin_airport_id, destination_airport_id),
    INDEX idx_departure (departure_time),
    INDEX idx_flight_number (flight_number),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Hotels table (enhanced)
CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    chain VARCHAR(100),
    category ENUM('budget', 'mid-range', 'luxury', 'resort', 'boutique') DEFAULT 'mid-range',
    star_rating DECIMAL(2, 1),
    user_rating DECIMAL(3, 2),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    amenities JSON,
    images JSON,
    check_in_time TIME DEFAULT '15:00',
    check_out_time TIME DEFAULT '11:00',
    cancellation_policy TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website VARCHAR(255),
    status ENUM('active', 'inactive', 'temporarily_closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_city (city),
    INDEX idx_country (country),
    INDEX idx_category (category),
    INDEX idx_star_rating (star_rating),
    INDEX idx_user_rating (user_rating),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Hotel rooms table
CREATE TABLE hotel_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    description TEXT,
    max_occupancy INT NOT NULL DEFAULT 2,
    size_sqm INT,
    bed_type VARCHAR(100),
    amenities JSON,
    images JSON,
    base_price DECIMAL(10, 2) NOT NULL,
    total_rooms INT NOT NULL DEFAULT 1,
    available_rooms INT NOT NULL DEFAULT 1,
    
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_room_type (room_type),
    INDEX idx_price (base_price)
) ENGINE=InnoDB;

-- Cars table (enhanced)
CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year YEAR,
    category ENUM('economy', 'compact', 'intermediate', 'standard', 'full-size', 'premium', 'luxury', 'suv', 'minivan') NOT NULL,
    transmission ENUM('manual', 'automatic') DEFAULT 'automatic',
    fuel_type ENUM('petrol', 'diesel', 'hybrid', 'electric') DEFAULT 'petrol',
    doors TINYINT DEFAULT 4,
    seats TINYINT DEFAULT 5,
    luggage_capacity TINYINT DEFAULT 2,
    air_conditioning BOOLEAN DEFAULT TRUE,
    features JSON,
    images JSON,
    daily_rate DECIMAL(10, 2) NOT NULL,
    location_city VARCHAR(100) NOT NULL,
    location_country VARCHAR(100) NOT NULL,
    rental_company VARCHAR(100),
    available_cars INT DEFAULT 1,
    mileage_limit INT COMMENT 'Daily mileage limit, 0 for unlimited',
    min_driver_age TINYINT DEFAULT 21,
    status ENUM('available', 'rented', 'maintenance', 'inactive') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_location (location_city, location_country),
    INDEX idx_category (category),
    INDEX idx_daily_rate (daily_rate),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ===================================================================
-- PACKAGE AND TRIP TABLES
-- ===================================================================

-- Travel packages table (enhanced)
CREATE TABLE packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    destination_city VARCHAR(100) NOT NULL,
    destination_country VARCHAR(100) NOT NULL,
    category ENUM('adventure', 'cultural', 'relaxation', 'business', 'family', 'luxury', 'budget') DEFAULT 'cultural',
    duration_days INT NOT NULL,
    duration_nights INT NOT NULL,
    min_travelers INT DEFAULT 1,
    max_travelers INT DEFAULT 10,
    description TEXT,
    highlights JSON,
    itinerary JSON,
    included_items JSON,
    excluded_items JSON,
    images JSON,
    base_price DECIMAL(10, 2) NOT NULL,
    child_price DECIMAL(10, 2),
    single_supplement DECIMAL(10, 2),
    available_dates JSON,
    booking_deadline_days INT DEFAULT 7,
    cancellation_policy TEXT,
    difficulty_level ENUM('easy', 'moderate', 'challenging', 'expert') DEFAULT 'easy',
    physical_requirements TEXT,
    recommended_age_min INT,
    recommended_age_max INT,
    group_size_min INT DEFAULT 1,
    group_size_max INT DEFAULT 20,
    guide_included BOOLEAN DEFAULT TRUE,
    meals_included ENUM('none', 'breakfast', 'half-board', 'full-board', 'all-inclusive') DEFAULT 'breakfast',
    accommodation_level ENUM('budget', 'standard', 'superior', 'deluxe', 'luxury') DEFAULT 'standard',
    status ENUM('active', 'inactive', 'draft', 'sold_out') DEFAULT 'active',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_destination (destination_city, destination_country),
    INDEX idx_category (category),
    INDEX idx_duration (duration_days),
    INDEX idx_price (base_price),
    INDEX idx_status (status),
    INDEX idx_featured (featured)
) ENGINE=InnoDB;

-- Trip creator/planner table
CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    destination_city VARCHAR(100),
    destination_country VARCHAR(100),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    travelers_count INT DEFAULT 1,
    trip_type ENUM('business', 'leisure', 'family', 'solo', 'group') DEFAULT 'leisure',
    preferences JSON,
    itinerary JSON,
    status ENUM('planning', 'booked', 'completed', 'cancelled') DEFAULT 'planning',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_destination (destination_city, destination_country),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ===================================================================
-- BOOKING AND CART TABLES
-- ===================================================================

-- Shopping cart table
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id VARCHAR(128),
    item_type ENUM('flight', 'hotel', 'car', 'package') NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    selected_options JSON,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_item (item_type, item_id)
) ENGINE=InnoDB;

-- Enhanced bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(20) NOT NULL UNIQUE,
    user_id INT,
    guest_email VARCHAR(255) NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(50),
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded', 'partial') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    travel_start_date DATE,
    travel_end_date DATE,
    travelers_count INT DEFAULT 1,
    special_requests TEXT,
    cancellation_reason TEXT,
    cancellation_date DATETIME,
    refund_amount DECIMAL(10, 2),
    commission_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_reference (booking_reference),
    INDEX idx_user_id (user_id),
    INDEX idx_guest_email (guest_email),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_booking_date (booking_date),
    INDEX idx_travel_dates (travel_start_date, travel_end_date)
) ENGINE=InnoDB;

-- Booking items table (enhanced)
CREATE TABLE booking_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    item_type ENUM('flight', 'hotel', 'car', 'package') NOT NULL,
    item_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    selected_options JSON,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id),
    INDEX idx_item (item_type, item_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ===================================================================
-- SPECIFIC BOOKING TABLES
-- ===================================================================

-- Flight bookings (detailed)
CREATE TABLE flight_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_item_id INT NOT NULL,
    flight_id INT NOT NULL,
    passenger_name VARCHAR(255) NOT NULL,
    passenger_email VARCHAR(255),
    passenger_phone VARCHAR(50),
    seat_class ENUM('economy', 'business', 'first') DEFAULT 'economy',
    seat_number VARCHAR(10),
    meal_preference VARCHAR(100),
    special_assistance TEXT,
    passport_number VARCHAR(50),
    passport_expiry DATE,
    check_in_status ENUM('not_checked_in', 'checked_in', 'boarding', 'no_show') DEFAULT 'not_checked_in',
    baggage_info JSON,
    status ENUM('booked', 'cancelled', 'completed', 'no_show') DEFAULT 'booked',
    
    FOREIGN KEY (booking_item_id) REFERENCES booking_items(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(id),
    INDEX idx_booking_item_id (booking_item_id),
    INDEX idx_flight_id (flight_id),
    INDEX idx_passenger_email (passenger_email)
) ENGINE=InnoDB;

-- Hotel bookings (detailed)
CREATE TABLE hotel_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_item_id INT NOT NULL,
    hotel_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights INT NOT NULL,
    rooms_count INT DEFAULT 1,
    adults_count INT DEFAULT 2,
    children_count INT DEFAULT 0,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255),
    guest_phone VARCHAR(50),
    special_requests TEXT,
    early_checkin BOOLEAN DEFAULT FALSE,
    late_checkout BOOLEAN DEFAULT FALSE,
    room_preferences JSON,
    status ENUM('booked', 'checked_in', 'checked_out', 'cancelled', 'no_show') DEFAULT 'booked',
    
    FOREIGN KEY (booking_item_id) REFERENCES booking_items(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (room_id) REFERENCES hotel_rooms(id),
    INDEX idx_booking_item_id (booking_item_id),
    INDEX idx_hotel_id (hotel_id),
    INDEX idx_dates (check_in_date, check_out_date),
    INDEX idx_guest_email (guest_email)
) ENGINE=InnoDB;

-- Car bookings (detailed)
CREATE TABLE car_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_item_id INT NOT NULL,
    car_id INT NOT NULL,
    pickup_date DATETIME NOT NULL,
    return_date DATETIME NOT NULL,
    rental_days INT NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    return_location VARCHAR(255) NOT NULL,
    driver_name VARCHAR(255) NOT NULL,
    driver_email VARCHAR(255),
    driver_phone VARCHAR(50),
    driver_license_number VARCHAR(100) NOT NULL,
    driver_age INT NOT NULL,
    additional_drivers JSON,
    insurance_options JSON,
    extras JSON,
    mileage_at_pickup INT,
    mileage_at_return INT,
    fuel_level_pickup ENUM('empty', 'quarter', 'half', 'three_quarter', 'full'),
    fuel_level_return ENUM('empty', 'quarter', 'half', 'three_quarter', 'full'),
    damage_notes_pickup TEXT,
    damage_notes_return TEXT,
    status ENUM('booked', 'picked_up', 'returned', 'cancelled') DEFAULT 'booked',
    
    FOREIGN KEY (booking_item_id) REFERENCES booking_items(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    INDEX idx_booking_item_id (booking_item_id),
    INDEX idx_car_id (car_id),
    INDEX idx_dates (pickup_date, return_date),
    INDEX idx_driver_email (driver_email)
) ENGINE=InnoDB;

-- Package bookings (detailed)
CREATE TABLE package_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_item_id INT NOT NULL,
    package_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travelers_count INT NOT NULL,
    lead_traveler_name VARCHAR(255) NOT NULL,
    lead_traveler_email VARCHAR(255),
    lead_traveler_phone VARCHAR(50),
    travelers_details JSON,
    accommodation_preferences JSON,
    dietary_requirements JSON,
    special_requests TEXT,
    travel_insurance BOOLEAN DEFAULT FALSE,
    guide_language VARCHAR(50) DEFAULT 'English',
    status ENUM('booked', 'in_progress', 'completed', 'cancelled') DEFAULT 'booked',
    
    FOREIGN KEY (booking_item_id) REFERENCES booking_items(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id),
    INDEX idx_booking_item_id (booking_item_id),
    INDEX idx_package_id (package_id),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_lead_email (lead_traveler_email)
) ENGINE=InnoDB;

-- ===================================================================
-- REVIEW AND RATING SYSTEM
-- ===================================================================

-- Reviews table (enhanced)
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_type ENUM('flight', 'hotel', 'car', 'package') NOT NULL,
    item_id INT NOT NULL,
    booking_id INT,
    overall_rating DECIMAL(2, 1) NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    cleanliness_rating DECIMAL(2, 1),
    service_rating DECIMAL(2, 1),
    location_rating DECIMAL(2, 1),
    value_rating DECIMAL(2, 1),
    title VARCHAR(255),
    comment TEXT,
    pros TEXT,
    cons TEXT,
    images JSON,
    helpful_votes INT DEFAULT 0,
    verified_stay BOOLEAN DEFAULT FALSE,
    response_from_business TEXT,
    response_date DATETIME,
    status ENUM('pending', 'approved', 'rejected', 'hidden') DEFAULT 'pending',
    moderation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_item (item_type, item_id),
    INDEX idx_booking_id (booking_id),
    INDEX idx_rating (overall_rating),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Review helpfulness votes
CREATE TABLE review_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    user_id INT NOT NULL,
    vote_type ENUM('helpful', 'not_helpful') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_review_vote (review_id, user_id)
) ENGINE=InnoDB;

-- ===================================================================
-- SEARCH AND ACTIVITY LOGGING
-- ===================================================================

-- Search logs (enhanced)
CREATE TABLE search_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id VARCHAR(128),
    search_type ENUM('flights', 'hotels', 'cars', 'packages') NOT NULL,
    search_query JSON NOT NULL,
    filters_applied JSON,
    results_count INT DEFAULT 0,
    sort_order VARCHAR(50),
    page_number INT DEFAULT 1,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer_url VARCHAR(500),
    search_duration_ms INT,
    clicked_results JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_search_type (search_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- User activity logs
CREATE TABLE user_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id VARCHAR(128),
    activity_type VARCHAR(100) NOT NULL,
    activity_data JSON,
    page_url VARCHAR(500),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ===================================================================
-- ADMIN AND MANAGEMENT TABLES
-- ===================================================================

-- Admin users table
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('super_admin', 'admin', 'moderator', 'support') DEFAULT 'admin',
    permissions JSON,
    last_login_at DATETIME,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- System settings table
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_setting_key (setting_key),
    INDEX idx_is_public (is_public)
) ENGINE=InnoDB;

-- ===================================================================
-- SAMPLE DATA INSERTION
-- ===================================================================

-- Insert sample airlines
INSERT INTO airlines (code, name, country) VALUES 
('AA', 'American Airlines', 'United States'),
('BA', 'British Airways', 'United Kingdom'),
('LH', 'Lufthansa', 'Germany'),
('AF', 'Air France', 'France'),
('EK', 'Emirates', 'United Arab Emirates');

-- Insert sample airports
INSERT INTO airports (iata_code, name, city, country) VALUES 
('JFK', 'John F. Kennedy International Airport', 'New York', 'United States'),
('LHR', 'London Heathrow Airport', 'London', 'United Kingdom'),
('CDG', 'Charles de Gaulle Airport', 'Paris', 'France'),
('DXB', 'Dubai International Airport', 'Dubai', 'United Arab Emirates'),
('FRA', 'Frankfurt Airport', 'Frankfurt', 'Germany'),
('LAX', 'Los Angeles International Airport', 'Los Angeles', 'United States'),
('NRT', 'Narita International Airport', 'Tokyo', 'Japan'),
('SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore');

-- Insert default admin user
INSERT INTO admin_users (username, email, password_hash, full_name, role) VALUES 
('admin', 'admin@aerotrav.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'super_admin');

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES 
('site_name', 'AeroTrav', 'string', 'Website name', TRUE),
('default_currency', 'USD', 'string', 'Default currency', TRUE),
('booking_hold_time', '15', 'number', 'Booking hold time in minutes', FALSE),
('enable_reviews', 'true', 'boolean', 'Enable review system', TRUE),
('max_travelers_per_booking', '10', 'number', 'Maximum travelers per booking', TRUE);

-- ===================================================================
-- PERFORMANCE OPTIMIZATIONS
-- ===================================================================

-- Additional indexes for better performance
CREATE INDEX idx_flights_departure_route ON flights(departure_time, origin_airport_id, destination_airport_id);
CREATE INDEX idx_hotels_location_rating ON hotels(city, country, user_rating);
CREATE INDEX idx_cars_location_category ON cars(location_city, location_country, category);
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX idx_reviews_item_status ON reviews(item_type, item_id, status);
CREATE INDEX idx_cart_user_session ON cart_items(user_id, session_id);

-- ===================================================================
-- TRIGGERS FOR DATA INTEGRITY
-- ===================================================================

-- Update hotel average rating when review is added/updated
DELIMITER //
CREATE TRIGGER update_hotel_rating 
AFTER INSERT ON reviews 
FOR EACH ROW 
BEGIN
    IF NEW.item_type = 'hotel' AND NEW.status = 'approved' THEN
        UPDATE hotels 
        SET user_rating = (
            SELECT AVG(overall_rating) 
            FROM reviews 
            WHERE item_type = 'hotel' 
            AND item_id = NEW.item_id 
            AND status = 'approved'
        )
        WHERE id = NEW.item_id;
    END IF;
END//
DELIMITER ;

-- Generate booking reference before insert
DELIMITER //
CREATE TRIGGER generate_booking_reference 
BEFORE INSERT ON bookings 
FOR EACH ROW 
BEGIN
    IF NEW.booking_reference IS NULL OR NEW.booking_reference = '' THEN
        SET NEW.booking_reference = CONCAT('TRV', LPAD(LAST_INSERT_ID() + 1, 8, '0'));
    END IF;
END//
DELIMITER ; 