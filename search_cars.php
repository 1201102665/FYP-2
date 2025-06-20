<?php
/**
 * ===================================================================
 * AeroTrav Car Search API
 * Handles car search with filters and returns JSON results
 * ===================================================================
 */

// Enable error reporting and include database connection
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once 'includes/db_connection.php';

// Set JSON response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Get search parameters from GET or POST
    $params = $_SERVER['REQUEST_METHOD'] === 'POST' ? getJsonInput() : $_GET;
    
    if (!$params) {
        $params = [];
    }
    
    // Extract search filters
    $location = $params['location'] ?? '';
    $pickupDate = $params['pickup_date'] ?? '';
    $returnDate = $params['return_date'] ?? '';
    $vehicleType = $params['vehicle_type'] ?? '';
    $transmission = $params['transmission'] ?? '';
    $fuelType = $params['fuel_type'] ?? '';
    $minPrice = (float)($params['min_price'] ?? 0);
    $maxPrice = (float)($params['max_price'] ?? 999999);
    $seats = (int)($params['min_seats'] ?? 0);
    $page = (int)($params['page'] ?? 1);
    $limit = (int)($params['limit'] ?? 10);
    
    // Calculate offset for pagination
    $offset = ($page - 1) * $limit;
    
    // Get database connection
    $pdo = DB::get();
    
    // Build WHERE clause based on filters
    $where = ['status = ?', 'available = ?'];
    $values = ['active', true];
    
    if (!empty($location)) {
        $where[] = 'location LIKE ?';
        $values[] = '%' . $location . '%';
    }
    
    if (!empty($vehicleType)) {
        $where[] = 'type = ?';
        $values[] = $vehicleType;
    }
    
    if (!empty($transmission)) {
        $where[] = 'transmission = ?';
        $values[] = $transmission;
    }
    
    if (!empty($fuelType)) {
        $where[] = 'fuel_type = ?';
        $values[] = $fuelType;
    }
    
    if ($minPrice > 0) {
        $where[] = 'price_per_day >= ?';
        $values[] = $minPrice;
    }
    
    if ($maxPrice < 999999) {
        $where[] = 'price_per_day <= ?';
        $values[] = $maxPrice;
    }
    
    if ($seats > 0) {
        $where[] = 'seats >= ?';
        $values[] = $seats;
    }
    
    // Build ORDER BY clause
    $orderBy = 'price_per_day ASC, make ASC';
    $sortBy = $params['sort_by'] ?? '';
    
    switch ($sortBy) {
        case 'price_low':
            $orderBy = 'price_per_day ASC';
            break;
        case 'price_high':
            $orderBy = 'price_per_day DESC';
            break;
        case 'make':
            $orderBy = 'make ASC, model ASC';
            break;
        case 'year':
            $orderBy = 'year DESC';
            break;
        case 'seats':
            $orderBy = 'seats DESC';
            break;
    }
    
    // Build complete query
    $whereClause = implode(' AND ', $where);
    $sql = "SELECT 
                id,
                make,
                model,
                year,
                type,
                location,
                price_per_day,
                fuel_type,
                seats,
                transmission,
                features,
                images,
                created_at
            FROM cars 
            WHERE $whereClause 
            ORDER BY $orderBy 
            LIMIT ? OFFSET ?";
    
    $values[] = $limit;
    $values[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);
    $cars = $stmt->fetchAll();
    
    // Get total count for pagination
    $countSql = "SELECT COUNT(*) as total FROM cars WHERE $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute(array_slice($values, 0, -2)); // Remove limit and offset
    $totalCount = $countStmt->fetch()['total'];
    
    // Format cars data
    $formattedCars = [];
    foreach ($cars as $car) {
        $formattedCars[] = [
            'id' => (int)$car['id'],
            'make' => $car['make'],
            'model' => $car['model'],
            'year' => (int)$car['year'],
            'type' => $car['type'],
            'location' => $car['location'],
            'price_per_day' => (float)$car['price_per_day'],
            'fuel_type' => $car['fuel_type'],
            'seats' => (int)$car['seats'],
            'transmission' => $car['transmission'],
            'features' => json_decode($car['features'], true) ?: [],
            'images' => json_decode($car['images'], true) ?: [],
            'created_at' => $car['created_at']
        ];
    }
    
    // Return results
    sendJsonResponse([
        'success' => true,
        'data' => [
            'cars' => $formattedCars,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => (int)$totalCount,
                'total_pages' => ceil($totalCount / $limit),
                'has_more' => ($offset + $limit) < $totalCount
            ],
            'filters_applied' => [
                'location' => $location,
                'pickup_date' => $pickupDate,
                'return_date' => $returnDate,
                'vehicle_type' => $vehicleType,
                'transmission' => $transmission,
                'fuel_type' => $fuelType,
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
                'min_seats' => $seats,
                'sort_by' => $sortBy
            ]
        ]
    ]);
    
} catch (PDOException $e) {
    // Log the error
    logError("Cars search database error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Database error occurred'
    ], 500);
    
} catch (Exception $e) {
    // Log any other errors
    logError("Cars search error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Server error occurred'
    ], 500);
}
?> 