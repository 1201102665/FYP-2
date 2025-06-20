<?php
/**
 * ===================================================================
 * AeroTrav Flight Search API
 * Handles flight search with filters and returns JSON results
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
    $departureCity = $params['departure_city'] ?? '';
    $arrivalCity = $params['arrival_city'] ?? '';
    $departureDate = $params['departure_date'] ?? '';
    $returnDate = $params['return_date'] ?? '';
    $passengers = (int)($params['passengers'] ?? 1);
    $class = $params['class'] ?? '';
    $minPrice = (float)($params['min_price'] ?? 0);
    $maxPrice = (float)($params['max_price'] ?? 999999);
    $airline = $params['airline'] ?? '';
    $page = (int)($params['page'] ?? 1);
    $limit = (int)($params['limit'] ?? 10);
    
    // Calculate offset for pagination
    $offset = ($page - 1) * $limit;
    
    // Get database connection
    $pdo = DB::get();
    
    // Build WHERE clause based on filters
    $where = ['status = ?'];
    $values = ['active'];
    
    if (!empty($departureCity)) {
        $where[] = 'departure_city LIKE ?';
        $values[] = '%' . $departureCity . '%';
    }
    
    if (!empty($arrivalCity)) {
        $where[] = 'arrival_city LIKE ?';
        $values[] = '%' . $arrivalCity . '%';
    }
    
    if (!empty($departureDate)) {
        $where[] = 'DATE(departure_time) = ?';
        $values[] = $departureDate;
    }
    
    if (!empty($class)) {
        $where[] = 'class = ?';
        $values[] = $class;
    }
    
    if ($minPrice > 0) {
        $where[] = 'price >= ?';
        $values[] = $minPrice;
    }
    
    if ($maxPrice < 999999) {
        $where[] = 'price <= ?';
        $values[] = $maxPrice;
    }
    
    if (!empty($airline)) {
        $where[] = 'airline LIKE ?';
        $values[] = '%' . $airline . '%';
    }
    
    if ($passengers > 0) {
        $where[] = 'available_seats >= ?';
        $values[] = $passengers;
    }
    
    // Build ORDER BY clause
    $orderBy = 'departure_time ASC, price ASC';
    $sortBy = $params['sort_by'] ?? '';
    
    switch ($sortBy) {
        case 'price_low':
            $orderBy = 'price ASC';
            break;
        case 'price_high':
            $orderBy = 'price DESC';
            break;
        case 'departure_time':
            $orderBy = 'departure_time ASC';
            break;
        case 'arrival_time':
            $orderBy = 'arrival_time ASC';
            break;
        case 'duration':
            $orderBy = 'TIMESTAMPDIFF(MINUTE, departure_time, arrival_time) ASC';
            break;
    }
    
    // Build complete query
    $whereClause = implode(' AND ', $where);
    $sql = "SELECT 
                id,
                airline,
                flight_number,
                departure_city,
                arrival_city,
                departure_time,
                arrival_time,
                price,
                available_seats,
                class,
                aircraft_type,
                TIMESTAMPDIFF(MINUTE, departure_time, arrival_time) as duration_minutes,
                created_at
            FROM flights 
            WHERE $whereClause 
            ORDER BY $orderBy 
            LIMIT ? OFFSET ?";
    
    $values[] = $limit;
    $values[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);
    $flights = $stmt->fetchAll();
    
    // Get total count for pagination
    $countSql = "SELECT COUNT(*) as total FROM flights WHERE $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute(array_slice($values, 0, -2)); // Remove limit and offset
    $totalCount = $countStmt->fetch()['total'];
    
    // Format flights data
    $formattedFlights = [];
    foreach ($flights as $flight) {
        $formattedFlights[] = [
            'id' => (int)$flight['id'],
            'airline' => $flight['airline'],
            'flight_number' => $flight['flight_number'],
            'departure_city' => $flight['departure_city'],
            'arrival_city' => $flight['arrival_city'],
            'departure_time' => $flight['departure_time'],
            'arrival_time' => $flight['arrival_time'],
            'price' => (float)$flight['price'],
            'available_seats' => (int)$flight['available_seats'],
            'class' => $flight['class'],
            'aircraft_type' => $flight['aircraft_type'],
            'duration_minutes' => (int)$flight['duration_minutes'],
            'duration_formatted' => floor($flight['duration_minutes'] / 60) . 'h ' . ($flight['duration_minutes'] % 60) . 'm',
            'created_at' => $flight['created_at']
        ];
    }
    
    // Return results
    sendJsonResponse([
        'success' => true,
        'data' => [
            'flights' => $formattedFlights,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => (int)$totalCount,
                'total_pages' => ceil($totalCount / $limit),
                'has_more' => ($offset + $limit) < $totalCount
            ],
            'filters_applied' => [
                'departure_city' => $departureCity,
                'arrival_city' => $arrivalCity,
                'departure_date' => $departureDate,
                'return_date' => $returnDate,
                'passengers' => $passengers,
                'class' => $class,
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
                'airline' => $airline,
                'sort_by' => $sortBy
            ]
        ]
    ]);
    
} catch (PDOException $e) {
    // Log the error
    logError("Flights search database error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Database error occurred'
    ], 500);
    
} catch (Exception $e) {
    // Log any other errors
    logError("Flights search error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Server error occurred'
    ], 500);
}
?> 