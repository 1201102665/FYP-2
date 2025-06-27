INSERT INTO cars (
  make,
  model,
  year,
  category,
  transmission,
  fuel_type,
  doors,
  seats,
  luggage_capacity,
  air_conditioning,
  features,
  images,
  daily_rate,
  location_city,
  location_country,
  rental_company,
  available_cars,
  mileage_limit,
  min_driver_age,
  status
) VALUES
-- Luxury Cars
('Mercedes-Benz', 'S-Class', 2023, 'luxury', 'automatic', 'petrol', 4, 5, 3, 1,
  JSON_ARRAY('GPS Navigation', 'Bluetooth', 'Air Conditioning', 'Leather Seats', 'Parking Sensors', 'Cruise Control', 'Sunroof'),
  JSON_ARRAY('s-class-front.jpg', 's-class-interior.jpg'),
  800.00, 'Kuala Lumpur', 'Malaysia', 'Premium Car Rentals', 2, 200, 25, 'available'),

('BMW', '7 Series', 2023, 'luxury', 'automatic', 'petrol', 4, 5, 3, 1,
  JSON_ARRAY('GPS Navigation', 'Bluetooth', 'Air Conditioning', 'Leather Seats', 'Parking Sensors', 'Cruise Control', 'Sunroof'),
  JSON_ARRAY('7-series-front.jpg', '7-series-interior.jpg'),
  750.00, 'Kuala Lumpur', 'Malaysia', 'Premium Car Rentals', 3, 200, 25, 'available'),

-- SUVs
('Honda', 'CR-V', 2023, 'suv', 'automatic', 'petrol', 5, 5, 4, 1,
  JSON_ARRAY('GPS Navigation', 'Bluetooth', 'Air Conditioning', 'Backup Camera', 'Parking Sensors'),
  JSON_ARRAY('cr-v-front.jpg', 'cr-v-interior.jpg'),
  300.00, 'Kuala Lumpur', 'Malaysia', 'Family Car Rentals', 5, 0, 21, 'available'),

('Toyota', 'RAV4', 2023, 'suv', 'automatic', 'hybrid', 5, 5, 4, 1,
  JSON_ARRAY('GPS Navigation', 'Bluetooth', 'Air Conditioning', 'Backup Camera', 'Parking Sensors'),
  JSON_ARRAY('rav4-front.jpg', 'rav4-interior.jpg'),
  280.00, 'Kuala Lumpur', 'Malaysia', 'EcoRent Cars', 4, 0, 21, 'available'),

-- Economy Cars
('Honda', 'City', 2023, 'economy', 'automatic', 'petrol', 4, 5, 2, 1,
  JSON_ARRAY('Bluetooth', 'Air Conditioning', 'Backup Camera'),
  JSON_ARRAY('city-front.jpg', 'city-interior.jpg'),
  150.00, 'Kuala Lumpur', 'Malaysia', 'Budget Car Rentals', 8, 0, 21, 'available'),

('Toyota', 'Vios', 2023, 'economy', 'automatic', 'petrol', 4, 5, 2, 1,
  JSON_ARRAY('Bluetooth', 'Air Conditioning', 'Backup Camera'),
  JSON_ARRAY('vios-front.jpg', 'vios-interior.jpg'),
  140.00, 'Kuala Lumpur', 'Malaysia', 'Budget Car Rentals', 10, 0, 21, 'available'),

-- Compact Cars
('Honda', 'Jazz', 2023, 'compact', 'automatic', 'petrol', 4, 5, 2, 1,
  JSON_ARRAY('Bluetooth', 'Air Conditioning', 'Backup Camera'),
  JSON_ARRAY('jazz-front.jpg', 'jazz-interior.jpg'),
  120.00, 'Kuala Lumpur', 'Malaysia', 'City Car Rentals', 6, 0, 21, 'available'),

('Toyota', 'Yaris', 2023, 'compact', 'automatic', 'petrol', 4, 5, 2, 1,
  JSON_ARRAY('Bluetooth', 'Air Conditioning', 'Backup Camera'),
  JSON_ARRAY('yaris-front.jpg', 'yaris-interior.jpg'),
  115.00, 'Kuala Lumpur', 'Malaysia', 'City Car Rentals', 7, 0, 21, 'available'),

-- Premium SUVs
('Mercedes-Benz', 'GLC', 2023, 'suv', 'automatic', 'petrol', 5, 5, 4, 1,
  JSON_ARRAY('GPS Navigation', 'Bluetooth', 'Air Conditioning', 'Leather Seats', 'Parking Sensors', 'Cruise Control', 'Sunroof'),
  JSON_ARRAY('glc-front.jpg', 'glc-interior.jpg'),
  500.00, 'Kuala Lumpur', 'Malaysia', 'Premium Car Rentals', 3, 200, 23, 'available'),

('BMW', 'X5', 2023, 'suv', 'automatic', 'petrol', 5, 5, 4, 1,
  JSON_ARRAY('GPS Navigation', 'Bluetooth', 'Air Conditioning', 'Leather Seats', 'Parking Sensors', 'Cruise Control', 'Sunroof'),
  JSON_ARRAY('x5-front.jpg', 'x5-interior.jpg'),
  550.00, 'Kuala Lumpur', 'Malaysia', 'Premium Car Rentals', 2, 200, 23, 'available'); 