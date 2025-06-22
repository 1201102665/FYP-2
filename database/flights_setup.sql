-- Flight Data Setup Script
-- This script creates the flights table and inserts sample flight data with real airline logos

-- Drop table if it exists (for clean setup)
DROP TABLE IF EXISTS flights;

-- 1) Create the table (if not already defined)
CREATE TABLE flights (
  id INT PRIMARY KEY AUTO_INCREMENT,
  airline_logo VARCHAR(255) NOT NULL,
  airline VARCHAR(50) NOT NULL,
  flight_number VARCHAR(10) NOT NULL,
  departure_airport VARCHAR(100) NOT NULL,
  arrival_airport VARCHAR(100) NOT NULL,
  departure_datetime DATETIME NOT NULL,
  arrival_datetime DATETIME NOT NULL,
  stops INT NOT NULL,
  price_eur DECIMAL(8,2) NOT NULL,
  base_fare_eur DECIMAL(8,2) NOT NULL,
  taxes_eur DECIMAL(8,2) NOT NULL,
  aircraft VARCHAR(50) NOT NULL,
  travel_class VARCHAR(20) NOT NULL,
  cabin_baggage_kg INT NOT NULL,
  checked_baggage_kg INT NOT NULL,
  refundable BOOLEAN NOT NULL,
  on_time_performance_pct INT NOT NULL,
  carbon_footprint VARCHAR(10) NOT NULL,
  wifi_available BOOLEAN NOT NULL,
  entertainment_available BOOLEAN NOT NULL,
  meals_available BOOLEAN NOT NULL,
  cancellation_policy TEXT NOT NULL,
  change_policy TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2) Ten sample rows with logo URLs
INSERT INTO flights
  (airline_logo, airline, flight_number, departure_airport, arrival_airport,
   departure_datetime, arrival_datetime, stops, price_eur, base_fare_eur, taxes_eur,
   aircraft, travel_class, cabin_baggage_kg, checked_baggage_kg, refundable,
   on_time_performance_pct, carbon_footprint, wifi_available, entertainment_available,
   meals_available, cancellation_policy, change_policy)
VALUES
('https://upload.wikimedia.org/wikipedia/commons/6/6c/AirAsia_Logo.svg',
 'AirAsia', 'AK195',
 'Kuala Lumpur International Airport', 'Da Nang International Airport',
 '2025-06-21 08:00:00','2025-06-21 11:00:00', 1, 259.00, 209.00, 50.00,
 'Airbus A320','Economy', 7, 20, TRUE, 85, 'Low', TRUE, TRUE, TRUE,
 'Free cancellation up to 24 hours before departure.',
 'Changes allowed with fee from MYR 150; fare difference may apply.'),

('https://upload.wikimedia.org/wikipedia/commons/a/ac/VietJet_Air_logo.svg',
 'VietJet Air','VJ377',
 'Kuala Lumpur International Airport','Da Nang International Airport',
 '2025-06-21 09:30:00','2025-06-21 12:30:00', 1, 299.00, 249.00, 50.00,
 'Airbus A321','Economy', 7, 20, FALSE, 80, 'Medium', FALSE, TRUE, TRUE,
 'Free cancellation up to 24 hours before departure.',
 'Changes allowed with fee from MYR 120; fare difference may apply.'),

('https://upload.wikimedia.org/wikipedia/commons/3/3e/Malaysia-airlines-logo-alt.png',
 'Malaysia Airlines','MH437',
 'Kuala Lumpur International Airport','Da Nang International Airport',
 '2025-06-21 00:39:00','2025-06-21 03:39:00', 1, 389.00, 339.00, 50.00,
 'Boeing 737-800','Economy', 7, 30, TRUE, 90, 'Low', TRUE, TRUE, TRUE,
 'Free cancellation up to 24 hours before departure.',
 'Changes allowed with fee from MYR 200; fare difference may apply.'),

('https://upload.wikimedia.org/wikipedia/commons/2/2f/Scoot_logo.svg',
 'Scoot','TR802',
 'Kuala Lumpur International Airport','Da Nang International Airport',
 '2025-06-21 07:15:00','2025-06-21 10:15:00', 1, 275.00, 225.00, 50.00,
 'Boeing 787-8','Economy', 7, 25, FALSE, 88, 'Low', TRUE, FALSE, TRUE,
 'No free cancellation; fees from MYR 180 apply.',
 'Changes allowed with fee from MYR 180; fare difference may apply.'),

('https://upload.wikimedia.org/wikipedia/commons/f/fd/Singapore_Airlines_Logo.svg',
 'Singapore Airlines','SQ106',
 'Kuala Lumpur International Airport','Da Nang International Airport',
 '2025-06-21 06:00:00','2025-06-21 09:00:00', 1, 420.00, 370.00, 50.00,
 'Airbus A330','Economy', 7, 30, TRUE, 92, 'Low', TRUE, TRUE, TRUE,
 'Free cancellation up to 24 hours before departure.',
 'Changes allowed with fee from MYR 250; fare difference may apply.'),

('https://upload.wikimedia.org/wikipedia/commons/2/21/Thai_Airways_logo.svg',
 'Thai Airways','TG424',
 'Kuala Lumpur International Airport','Da Nang International Airport',
 '2025-06-21 11:20:00','2025-06-21 14:20:00', 1, 410.00, 360.00, 50.00,
 'Airbus A330','Economy', 7, 30, TRUE, 87, 'Medium', TRUE, TRUE, TRUE,
 'Free cancellation up to 24 hours before departure.',
 'Changes allowed with fee from MYR 200; fare difference may apply.'),

('https://upload.wikimedia.org/wikipedia/commons/c/c1/Emirates_logo.svg',
 'Emirates','EK354',
 'Kuala Lumpur International Airport','Da Nang International Airport',
 '2025-06-21 10:45:00','2025-06-21 13:45:00', 1, 550.00, 500.00, 50.00,
 'Boeing 777-300ER','Economy', 7, 30, TRUE, 89, 'Low', TRUE, TRUE, TRUE,
 'Free cancellation up to 24 hours before departure.',
 'Changes allowed with fee from MYR 300; fare difference may apply.'),

('https://upload.wikimedia.org/wikipedia/commons/7/7a/Qatar_Airways_logo.svg',
 'Qatar Airways','QR840',
 'Kuala Lumpur International Airport','Da Nang International Airport',
 '2025-06-21 13:00:00','2025-06-21 16:00:00', 1, 530.00, 480.00, 50.00,
 'Boeing 787-9','Economy', 7, 30, TRUE, 93, 'Low', TRUE, TRUE, TRUE,
 'Free cancellation up to 24 hours before departure.',
 'Changes allowed with fee from MYR 300; fare difference may apply.'),

('https://upload.wikimedia.org/wikipedia/commons/5/5c/All_Nippon_Airways_Logo.svg',
 'All Nippon Airways','NH828',
 'Kuala Lumpur International Airport','Da Nang International Airport',
 '2025-06-21 14:30:00','2025-06-21 17:30:00', 1, 480.00, 430.00, 50.00,
 'Boeing 787-8','Economy', 7, 25, TRUE, 94, 'Low', TRUE, TRUE, TRUE,
 'Free cancellation up to 24 hours before departure.',
 'Changes allowed with fee from MYR 220; fare difference may apply.'),

('https://upload.wikimedia.org/wikipedia/commons/6/66/Cathay_Pacific_Ltd._logo.svg',
 'Cathay Pacific','CX729',
 'Kuala Lumpur International Airport','Da Nang International Airport',
 '2025-06-21 15:50:00','2025-06-21 18:50:00', 1, 500.00, 450.00, 50.00,
 'Airbus A321neo','Economy', 7, 25, TRUE, 91, 'Low', TRUE, TRUE, TRUE,
 'Free cancellation up to 24 hours before departure.',
 'Changes allowed with fee from MYR 240; fare difference may apply.');

-- Create index for better query performance
CREATE INDEX idx_flights_departure_datetime ON flights(departure_datetime);
CREATE INDEX idx_flights_arrival_datetime ON flights(arrival_datetime);
CREATE INDEX idx_flights_departure_airport ON flights(departure_airport);
CREATE INDEX idx_flights_arrival_airport ON flights(arrival_airport);
CREATE INDEX idx_flights_airline ON flights(airline);
CREATE INDEX idx_flights_price ON flights(price_eur);

-- Show the inserted data
SELECT COUNT(*) as total_flights FROM flights;
SELECT * FROM flights ORDER BY departure_datetime LIMIT 5; 