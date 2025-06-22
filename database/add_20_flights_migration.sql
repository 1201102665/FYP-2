-- Migration script to add 20 additional flights to the existing database
-- This script properly handles the foreign key relationships with airlines and airports tables

-- First, insert new airlines that don't exist yet
INSERT IGNORE INTO airlines (code, name, logo_url, country, status) VALUES
('LH', 'Lufthansa', 'https://upload.wikimedia.org/wikipedia/commons/4/49/Lufthansa_Logo_2018.svg', 'Germany', 'active'),
('BA', 'British Airways', 'https://upload.wikimedia.org/wikipedia/commons/5/56/British_Airways_Logo_2019.png', 'United Kingdom', 'active'),
('AF', 'Air France', 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Air_France_Logo.svg', 'France', 'active'),
('KL', 'KLM', 'https://upload.wikimedia.org/wikipedia/commons/3/3b/KLM_logo.svg', 'Netherlands', 'active'),
('TK', 'Turkish Airlines', 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Turkish_Airlines_Logo.svg', 'Turkey', 'active'),
('AA', 'American Airlines', 'https://upload.wikimedia.org/wikipedia/commons/1/1d/American_Airlines_logo_2013.svg', 'United States', 'active'),
('DL', 'Delta Air Lines', 'https://upload.wikimedia.org/wikipedia/commons/7/72/Delta_Air_Lines_Logo.svg', 'United States', 'active'),
('UA', 'United Airlines', 'https://upload.wikimedia.org/wikipedia/commons/5/50/United_Airlines_Logo.svg', 'United States', 'active'),
('SU', 'Aeroflot', 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Aeroflot_Logo_2018.svg', 'Russia', 'active'),
('QF', 'Qantas', 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Qantas_Airways_Logo.svg', 'Australia', 'active'),
('AC', 'Air Canada', 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Air_Canada_logo.svg', 'Canada', 'active'),
('BR', 'EVA Air', 'https://upload.wikimedia.org/wikipedia/commons/e/e1/EVA_Air_logo.svg', 'Taiwan', 'active'),
('ET', 'Ethiopian Airlines', 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Ethiopian_Airlines_Logo.svg', 'Ethiopia', 'active'),
('SA', 'South African Airways', 'https://upload.wikimedia.org/wikipedia/commons/3/37/South_African_Airways_logo.svg', 'South Africa', 'active'),
('PR', 'Philippine Airlines', 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Philippine_Airlines_logo.svg', 'Philippines', 'active'),
('AY', 'Finnair', 'https://upload.wikimedia.org/wikipedia/commons/1/19/Finnair_logo.svg', 'Finland', 'active'),
('SK', 'Scandinavian Airlines', 'https://upload.wikimedia.org/wikipedia/commons/1/16/SAS_Logo.svg', 'Sweden', 'active'),
('LA', 'LATAM Airlines', 'https://upload.wikimedia.org/wikipedia/commons/5/55/LATAM_Airlines_Group.svg', 'Chile', 'active'),
('GA', 'Garuda Indonesia', 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Garuda_Indonesia_Logo.svg', 'Indonesia', 'active'),
('CZ', 'China Southern Airlines', 'https://upload.wikimedia.org/wikipedia/commons/1/1f/China_Southern_Airlines_logo.svg', 'China', 'active'),
('JL', 'Japan Airlines', 'https://upload.wikimedia.org/wikipedia/commons/2/29/Japan_Airlines_Logo.svg', 'Japan', 'active');

-- Now insert the flights using the proper foreign key references
-- Get the airport IDs first
SET @kul_airport_id = (SELECT id FROM airports WHERE iata_code = 'KUL' LIMIT 1);
SET @dad_airport_id = (SELECT id FROM airports WHERE iata_code = 'DAD' LIMIT 1);

-- Insert the 20 additional flights
INSERT INTO flights 
(airline_id, flight_number, origin_airport_id, destination_airport_id, departure_time, arrival_time, 
 duration_minutes, aircraft_type, price_economy, available_economy, status, airline_logo, airline, 
 origin, destination, departure_time_str, arrival_time_str, duration, price_myr)
VALUES
-- Lufthansa LH789
((SELECT id FROM airlines WHERE code = 'LH'), 'LH789', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 05:00:00', '2025-06-21 08:00:00', 180, 'Airbus A350', 360.00, 150, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/4/49/Lufthansa_Logo_2018.svg', 'Lufthansa', 'KUL', 'DAD', '05:00', '08:00', '3h 0m', 1296.00),

-- British Airways BA312
((SELECT id FROM airlines WHERE code = 'BA'), 'BA312', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 06:30:00', '2025-06-21 09:30:00', 180, 'Boeing 747-400', 400.00, 180, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/5/56/British_Airways_Logo_2019.png', 'British Airways', 'KUL', 'DAD', '06:30', '09:30', '3h 0m', 1440.00),

-- Air France AF456
((SELECT id FROM airlines WHERE code = 'AF'), 'AF456', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 07:45:00', '2025-06-21 10:45:00', 180, 'Airbus A380', 380.00, 200, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Air_France_Logo.svg', 'Air France', 'KUL', 'DAD', '07:45', '10:45', '3h 0m', 1368.00),

-- KLM KL678
((SELECT id FROM airlines WHERE code = 'KL'), 'KL678', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 08:15:00', '2025-06-21 11:15:00', 180, 'Boeing 777-300ER', 350.00, 160, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/3/3b/KLM_logo.svg', 'KLM', 'KUL', 'DAD', '08:15', '11:15', '3h 0m', 1260.00),

-- Turkish Airlines TK221
((SELECT id FROM airlines WHERE code = 'TK'), 'TK221', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 09:00:00', '2025-06-21 12:00:00', 180, 'Airbus A330', 370.00, 170, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Turkish_Airlines_Logo.svg', 'Turkish Airlines', 'KUL', 'DAD', '09:00', '12:00', '3h 0m', 1332.00),

-- American Airlines AA990
((SELECT id FROM airlines WHERE code = 'AA'), 'AA990', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 10:20:00', '2025-06-21 13:20:00', 180, 'Boeing 777-200ER', 420.00, 140, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/1/1d/American_Airlines_logo_2013.svg', 'American Airlines', 'KUL', 'DAD', '10:20', '13:20', '3h 0m', 1512.00),

-- Delta Air Lines DL823
((SELECT id FROM airlines WHERE code = 'DL'), 'DL823', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 11:10:00', '2025-06-21 14:10:00', 180, 'Airbus A350', 430.00, 155, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/7/72/Delta_Air_Lines_Logo.svg', 'Delta Air Lines', 'KUL', 'DAD', '11:10', '14:10', '3h 0m', 1548.00),

-- United Airlines UA645
((SELECT id FROM airlines WHERE code = 'UA'), 'UA645', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 12:30:00', '2025-06-21 15:30:00', 180, 'Boeing 787-9', 440.00, 165, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/5/50/United_Airlines_Logo.svg', 'United Airlines', 'KUL', 'DAD', '12:30', '15:30', '3h 0m', 1584.00),

-- Aeroflot SU712
((SELECT id FROM airlines WHERE code = 'SU'), 'SU712', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 13:45:00', '2025-06-21 16:45:00', 180, 'Sukhoi Superjet 100', 340.00, 120, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Aeroflot_Logo_2018.svg', 'Aeroflot', 'KUL', 'DAD', '13:45', '16:45', '3h 0m', 1224.00),

-- Qantas QF101
((SELECT id FROM airlines WHERE code = 'QF'), 'QF101', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 05:50:00', '2025-06-21 08:50:00', 180, 'Boeing 747-400', 460.00, 190, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Qantas_Airways_Logo.svg', 'Qantas', 'KUL', 'DAD', '05:50', '08:50', '3h 0m', 1656.00),

-- Air Canada AC889
((SELECT id FROM airlines WHERE code = 'AC'), 'AC889', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 07:00:00', '2025-06-21 10:00:00', 180, 'Boeing 787-8', 390.00, 145, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Air_Canada_logo.svg', 'Air Canada', 'KUL', 'DAD', '07:00', '10:00', '3h 0m', 1404.00),

-- EVA Air BR201
((SELECT id FROM airlines WHERE code = 'BR'), 'BR201', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 08:30:00', '2025-06-21 11:30:00', 180, 'Airbus A330', 405.00, 175, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/e/e1/EVA_Air_logo.svg', 'EVA Air', 'KUL', 'DAD', '08:30', '11:30', '3h 0m', 1458.00),

-- Ethiopian Airlines ET364
((SELECT id FROM airlines WHERE code = 'ET'), 'ET364', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 09:15:00', '2025-06-21 12:15:00', 180, 'Boeing 787-8', 320.00, 130, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Ethiopian_Airlines_Logo.svg', 'Ethiopian Airlines', 'KUL', 'DAD', '09:15', '12:15', '3h 0m', 1152.00),

-- South African Airways SA222
((SELECT id FROM airlines WHERE code = 'SA'), 'SA222', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 10:55:00', '2025-06-21 13:55:00', 180, 'Airbus A340', 330.00, 125, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/3/37/South_African_Airways_logo.svg', 'South African Airways', 'KUL', 'DAD', '10:55', '13:55', '3h 0m', 1188.00),

-- Philippine Airlines PR806
((SELECT id FROM airlines WHERE code = 'PR'), 'PR806', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 11:40:00', '2025-06-21 14:40:00', 180, 'Airbus A321neo', 315.00, 135, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Philippine_Airlines_logo.svg', 'Philippine Airlines', 'KUL', 'DAD', '11:40', '14:40', '3h 0m', 1134.00),

-- Finnair AY156
((SELECT id FROM airlines WHERE code = 'AY'), 'AY156', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 12:10:00', '2025-06-21 15:10:00', 180, 'Airbus A350', 345.00, 155, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/1/19/Finnair_logo.svg', 'Finnair', 'KUL', 'DAD', '12:10', '15:10', '3h 0m', 1242.00),

-- Scandinavian Airlines SK461
((SELECT id FROM airlines WHERE code = 'SK'), 'SK461', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 13:25:00', '2025-06-21 16:25:00', 180, 'Airbus A330', 355.00, 140, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/1/16/SAS_Logo.svg', 'Scandinavian Airlines', 'KUL', 'DAD', '13:25', '16:25', '3h 0m', 1278.00),

-- Aeroméxico AM660 (Note: reusing AM code that should already exist)
((SELECT id FROM airlines WHERE code = 'AM'), 'AM660', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 14:05:00', '2025-06-21 17:05:00', 180, 'Boeing 737 MAX', 365.00, 148, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/0/04/Aerom%C3%A9xico_logo.svg', 'Aeroméxico', 'KUL', 'DAD', '14:05', '17:05', '3h 0m', 1314.00),

-- LATAM Airlines LA743
((SELECT id FROM airlines WHERE code = 'LA'), 'LA743', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 15:35:00', '2025-06-21 18:35:00', 180, 'Airbus A321neo', 370.00, 152, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/5/55/LATAM_Airlines_Group.svg', 'LATAM Airlines', 'KUL', 'DAD', '15:35', '18:35', '3h 0m', 1332.00),

-- Garuda Indonesia GA712
((SELECT id FROM airlines WHERE code = 'GA'), 'GA712', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 16:20:00', '2025-06-21 19:20:00', 180, 'Boeing 777-300ER', 335.00, 165, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Garuda_Indonesia_Logo.svg', 'Garuda Indonesia', 'KUL', 'DAD', '16:20', '19:20', '3h 0m', 1206.00),

-- China Southern Airlines CZ323
((SELECT id FROM airlines WHERE code = 'CZ'), 'CZ323', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 17:00:00', '2025-06-21 20:00:00', 180, 'Boeing 787-9', 345.00, 170, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/1/1f/China_Southern_Airlines_logo.svg', 'China Southern Airlines', 'KUL', 'DAD', '17:00', '20:00', '3h 0m', 1242.00),

-- Japan Airlines JL610
((SELECT id FROM airlines WHERE code = 'JL'), 'JL610', @kul_airport_id, @dad_airport_id, 
 '2025-06-21 18:15:00', '2025-06-21 21:15:00', 180, 'Boeing 787-8', 380.00, 160, 'scheduled',
 'https://upload.wikimedia.org/wikipedia/commons/2/29/Japan_Airlines_Logo.svg', 'Japan Airlines', 'KUL', 'DAD', '18:15', '21:15', '3h 0m', 1368.00);

-- Show results
SELECT COUNT(*) as total_flights_after_addition FROM flights;
SELECT airline, flight_number, departure_time FROM flights ORDER BY departure_time LIMIT 10; 