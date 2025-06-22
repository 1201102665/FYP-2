-- ===================================================================
-- AeroTrav Database Setup - Complete Installation
-- Run this script to set up the entire database with real flight data
-- ===================================================================

-- Source the main schema
SOURCE database/schema.sql;

-- Source the flight data setup
SOURCE database/flights_setup.sql;

-- Verify the setup
SELECT 'Database setup complete!' as message;
SELECT COUNT(*) as total_flights FROM flights;
SELECT COUNT(*) as total_airlines FROM airlines;
SELECT COUNT(*) as total_airports FROM airports;

-- Display sample flight data
SELECT 
    airline,
    flight_number,
    departure_airport,
    arrival_airport,
    departure_datetime,
    price_eur,
    aircraft
FROM flights 
ORDER BY departure_datetime 
LIMIT 5; 