-- Migration script to add real flight data to existing schema
-- Using existing airline and airport IDs from the database

-- Clear existing test flight data
DELETE FROM flights WHERE id > 0;

-- Insert real flight data using existing airline and airport IDs
INSERT INTO flights (
    airline_id, 
    flight_number, 
    origin_airport_id, 
    destination_airport_id, 
    departure_time, 
    arrival_time, 
    duration_minutes,
    aircraft_type,
    price_economy,
    seats_economy,
    available_economy,
    status,
    airline_logo,
    airline,
    origin,
    destination,
    departure_time_str,
    arrival_time_str,
    duration,
    price_myr
) VALUES
-- VietJet Air Flight (existing ID 70)
(70, 'VJ377', 19, 2, '2025-06-21 09:30:00', '2025-06-21 12:30:00', 180, 'Airbus A321', 299.00, 200, 52, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/a/ac/VietJet_Air_logo.svg', 'VietJet Air', 'KUL', 'DAD', '09:30', '12:30', '3h 0m', 1135.00),

-- Scoot Flight (existing ID 61)
(61, 'TR802', 19, 2, '2025-06-21 07:15:00', '2025-06-21 10:15:00', 180, 'Boeing 787-8', 275.00, 300, 65, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Scoot_logo.svg', 'Scoot', 'KUL', 'DAD', '07:15', '10:15', '3h 0m', 1043.00),

-- Singapore Airlines Flight (existing ID 63)
(63, 'SQ106', 19, 2, '2025-06-21 06:00:00', '2025-06-21 09:00:00', 180, 'Airbus A330', 420.00, 250, 32, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Singapore_Airlines_Logo.svg', 'Singapore Airlines', 'KUL', 'DAD', '06:00', '09:00', '3h 0m', 1593.00),

-- Thai Airways Flight (existing ID 67)
(67, 'TG424', 19, 2, '2025-06-21 11:20:00', '2025-06-21 14:20:00', 180, 'Airbus A330', 410.00, 250, 38, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/2/21/Thai_Airways_logo.svg', 'Thai Airways', 'KUL', 'DAD', '11:20', '14:20', '3h 0m', 1555.00),

-- Qatar Airways Flight (existing ID 56)
(56, 'QR840', 19, 2, '2025-06-21 13:00:00', '2025-06-21 16:00:00', 180, 'Boeing 787-9', 530.00, 280, 48, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Qatar_Airways_logo.svg', 'Qatar Airways', 'KUL', 'DAD', '13:00', '16:00', '3h 0m', 2010.00),

-- Malaysia Airlines Flight (existing ID 3)
(3, 'MH437', 19, 2, '2025-06-21 00:39:00', '2025-06-21 03:39:00', 180, 'Boeing 737-800', 389.00, 160, 28, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Malaysia-airlines-logo-alt.png', 'Malaysia Airlines', 'KUL', 'DAD', '00:39', '03:39', '3h 0m', 1475.00),

-- Additional flights using other routes
-- Lufthansa (KUL to SIN - ID 50, airport 25)
(50, 'LH789', 19, 25, '2025-06-21 08:45:00', '2025-06-21 09:50:00', 65, 'Airbus A320', 185.00, 180, 35, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lufthansa_Logo_2018.svg', 'Lufthansa', 'KUL', 'SIN', '08:45', '09:50', '1h 5m', 702.00),

-- Air France (KUL to BKK - ID 18, airport 26)
(18, 'AF567', 19, 26, '2025-06-21 14:30:00', '2025-06-21 16:00:00', 90, 'Boeing 787', 245.00, 220, 42, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/4/44/Air_France_Logo.svg', 'Air France', 'KUL', 'BKK', '14:30', '16:00', '1h 30m', 929.00),

-- Qantas (SIN to SYD - ID 55, airports 25 to 34)
(55, 'QF291', 25, 34, '2025-06-21 16:45:00', '2025-06-22 02:30:00', 465, 'Airbus A380', 780.00, 380, 85, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Qantas_Airways_logo_2016.svg', 'Qantas', 'SIN', 'SYD', '16:45', '02:30+1', '7h 45m', 2958.00),

-- Korean Air (ICN to KUL - ID 48, airport 32 to 19)
(48, 'KE687', 32, 19, '2025-06-21 22:15:00', '2025-06-22 05:45:00', 450, 'Boeing 777', 695.00, 300, 58, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/7/77/Korean_Air_logo.svg', 'Korean Air', 'ICN', 'KUL', '22:15', '05:45+1', '7h 30m', 2636.00);

-- Verify the data
SELECT COUNT(*) as total_flights FROM flights;
SELECT airline, flight_number, origin, destination, departure_time_str, price_myr FROM flights LIMIT 5; 