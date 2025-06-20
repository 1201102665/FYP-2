<?php
/**
 * Car Rental Search API Endpoint
 * Handles car rental search with availability and filtering
 */

require_once '../../includes/enhanced_db_connection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

try {
    $db = getDB();
    $userId = getCurrentUserId();
    $sessionId = generateSessionId();
    
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    
    $requiredFields = ['pickup_location', 'pickup_date', 'return_date'];
    $errors = validateRequired($requiredFields, $input);
    
    if (!empty($errors)) {
        sendJsonResponse(['error' => 'Missing required fields', 'details' => $errors], 400);
    }
    
    $criteria = [
        'location_city' => sanitizeInput($input['pickup_location']),
        'pickup_date' => sanitizeInput($input['pickup_date']),
        'return_date' => sanitizeInput($input['return_date']),
        'driver_age' => isset($input['driver_age']) ? (int)$input['driver_age'] : 25,
        'category' => isset($input['category']) ? sanitizeInput($input['category']) : null
    ];
    
    // Validate dates
    $pickupDate = DateTime::createFromFormat('Y-m-d H:i', $criteria['pickup_date']);
    $returnDate = DateTime::createFromFormat('Y-m-d H:i', $criteria['return_date']);
    
    if (!$pickupDate || !$returnDate) {
        sendJsonResponse(['error' => 'Invalid date format. Use YYYY-MM-DD HH:MM'], 400);
    }
    
    if ($returnDate <= $pickupDate) {
        sendJsonResponse(['error' => 'Return date must be after pickup date'], 400);
    }
    
    if ($pickupDate < new DateTime()) {
        sendJsonResponse(['error' => 'Pickup date cannot be in the past'], 400);
    }
    
    // Calculate rental days
    $rentalDays = $pickupDate->diff($returnDate)->days + 1;
    
    // Search cars
    $cars = $db->searchCars($criteria);
    
    // Process availability and pricing
    $carResults = [];
    foreach ($cars as $car) {
        $carData = processCarAvailability($car, $criteria, $rentalDays);
        if ($carData) {
            $carResults[] = $carData;
        }
    }
    
    // Apply filters
    if (isset($input['filters'])) {
        $carResults = applyCarFilters($carResults, $input['filters']);
    }
    
    // Sort results
    $sortBy = $input['sort_by'] ?? 'price_asc';
    $carResults = sortCars($carResults, $sortBy);
    
    // Log search
    $searchData = [
        'search_type' => 'cars',
        'search_query' => $criteria,
        'filters_applied' => $input['filters'] ?? [],
        'results_count' => count($carResults)
    ];
    $db->logSearchActivity($userId, $sessionId, $searchData);
    
    sendJsonResponse([
        'success' => true,
        'search_criteria' => $criteria,
        'cars' => $carResults,
        'total_results' => count($carResults),
        'rental_days' => $rentalDays,
        'search_id' => uniqid('search_'),
        'timestamp' => date('c')
    ]);
    
} catch (Exception $e) {
    error_log("Car search error: " . $e->getMessage());
    sendJsonResponse(['error' => 'Car search failed. Please try again.'], 500);
}

function processCarAvailability($car, $criteria, $rentalDays) {
    $db = getDB();
    
    // Check availability during rental period
    $availabilitySql = "SELECT (c.available_cars - COALESCE(booked_cars.booked_count, 0)) as available_count
                        FROM cars c
                        LEFT JOIN (
                            SELECT car_id, COUNT(*) as booked_count
                            FROM car_bookings cb
                            JOIN booking_items bi ON cb.booking_item_id = bi.id
                            JOIN bookings b ON bi.booking_id = b.id
                            WHERE b.status IN ('confirmed', 'pending')
                            AND NOT (cb.return_date <= :pickup_date OR cb.pickup_date >= :return_date)
                            GROUP BY car_id
                        ) as booked_cars ON c.id = booked_cars.car_id
                        WHERE c.id = :car_id";
    
    $stmt = $db->getPDO()->prepare($availabilitySql);
    $stmt->execute([
        ':car_id' => $car['id'],
        ':pickup_date' => $criteria['pickup_date'],
        ':return_date' => $criteria['return_date']
    ]);
    
    $availability = $stmt->fetch();
    
    if (!$availability || $availability['available_count'] <= 0) {
        return null;
    }
    
    // Check age restriction
    if ($criteria['driver_age'] < $car['min_driver_age']) {
        return null;
    }
    
    $totalPrice = $car['daily_rate'] * $rentalDays;
    
    return [
        'id' => $car['id'],
        'make' => $car['make'],
        'model' => $car['model'],
        'year' => $car['year'],
        'category' => $car['category'],
        'transmission' => $car['transmission'],
        'fuel_type' => $car['fuel_type'],
        'doors' => $car['doors'],
        'seats' => $car['seats'],
        'luggage_capacity' => $car['luggage_capacity'],
        'air_conditioning' => (bool)$car['air_conditioning'],
        'features' => json_decode($car['features'], true),
        'images' => json_decode($car['images'], true),
        'daily_rate' => (float)$car['daily_rate'],
        'total_price' => $totalPrice,
        'location_city' => $car['location_city'],
        'location_country' => $car['location_country'],
        'rental_company' => $car['rental_company'],
        'available_cars' => $availability['available_count'],
        'mileage_limit' => $car['mileage_limit'],
        'min_driver_age' => $car['min_driver_age'],
        'rental_days' => $rentalDays
    ];
}

function applyCarFilters($cars, $filters) {
    $filtered = $cars;
    
    if (isset($filters['categories']) && is_array($filters['categories'])) {
        $filtered = array_filter($filtered, function($car) use ($filters) {
            return in_array($car['category'], $filters['categories']);
        });
    }
    
    if (isset($filters['transmission'])) {
        $filtered = array_filter($filtered, function($car) use ($filters) {
            return $car['transmission'] === $filters['transmission'];
        });
    }
    
    if (isset($filters['fuel_types']) && is_array($filters['fuel_types'])) {
        $filtered = array_filter($filtered, function($car) use ($filters) {
            return in_array($car['fuel_type'], $filters['fuel_types']);
        });
    }
    
    if (isset($filters['min_seats'])) {
        $filtered = array_filter($filtered, function($car) use ($filters) {
            return $car['seats'] >= (int)$filters['min_seats'];
        });
    }
    
    if (isset($filters['air_conditioning']) && $filters['air_conditioning']) {
        $filtered = array_filter($filtered, function($car) use ($filters) {
            return $car['air_conditioning'];
        });
    }
    
    if (isset($filters['min_price'])) {
        $filtered = array_filter($filtered, function($car) use ($filters) {
            return $car['total_price'] >= (float)$filters['min_price'];
        });
    }
    
    if (isset($filters['max_price'])) {
        $filtered = array_filter($filtered, function($car) use ($filters) {
            return $car['total_price'] <= (float)$filters['max_price'];
        });
    }
    
    return array_values($filtered);
}

function sortCars($cars, $sortBy) {
    switch ($sortBy) {
        case 'price_asc':
            usort($cars, function($a, $b) {
                return $a['total_price'] <=> $b['total_price'];
            });
            break;
        case 'price_desc':
            usort($cars, function($a, $b) {
                return $b['total_price'] <=> $a['total_price'];
            });
            break;
        case 'category':
            usort($cars, function($a, $b) {
                return strcmp($a['category'], $b['category']);
            });
            break;
        default:
            usort($cars, function($a, $b) {
                return $a['total_price'] <=> $b['total_price'];
            });
            break;
    }
    
    return $cars;
}
?> 