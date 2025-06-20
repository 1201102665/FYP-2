<?php
/**
 * ===================================================================
 * AeroTrav Hotel Search API
 * Handles hotel search with filters and returns JSON results
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
    $destination = $params['destination'] ?? '';
    $checkIn = $params['check_in'] ?? '';
    $checkOut = $params['check_out'] ?? '';
    $guests = (int)($params['guests'] ?? 1);
    $minPrice = (float)($params['min_price'] ?? 0);
    $maxPrice = (float)($params['max_price'] ?? 999999);
    $rating = (float)($params['min_rating'] ?? 0);
    $amenities = $params['amenities'] ?? [];
    $page = (int)($params['page'] ?? 1);
    $limit = (int)($params['limit'] ?? 10);
    
    // Calculate offset for pagination
    $offset = ($page - 1) * $limit;
    
    // Get database connection
    $pdo = DB::get();
    
    // Build WHERE clause based on filters
    $where = ['status = ?'];
    $values = ['active'];
    
    if (!empty($destination)) {
        $where[] = '(destination LIKE ? OR location LIKE ? OR name LIKE ?)';
        $searchTerm = '%' . $destination . '%';
        $values[] = $searchTerm;
        $values[] = $searchTerm;
        $values[] = $searchTerm;
    }
    
    if ($minPrice > 0) {
        $where[] = 'price_per_night >= ?';
        $values[] = $minPrice;
    }
    
    if ($maxPrice < 999999) {
        $where[] = 'price_per_night <= ?';
        $values[] = $maxPrice;
    }
    
    if ($rating > 0) {
        $where[] = 'rating >= ?';
        $values[] = $rating;
    }
    
    if (!empty($amenities) && is_array($amenities)) {
        foreach ($amenities as $amenity) {
            $where[] = 'JSON_CONTAINS(amenities, ?)';
            $values[] = json_encode($amenity);
        }
    }
    
    // Build ORDER BY clause
    $orderBy = 'rating DESC, price_per_night ASC';
    $sortBy = $params['sort_by'] ?? '';
    
    switch ($sortBy) {
        case 'price_low':
            $orderBy = 'price_per_night ASC';
            break;
        case 'price_high':
            $orderBy = 'price_per_night DESC';
            break;
        case 'rating':
            $orderBy = 'rating DESC';
            break;
        case 'name':
            $orderBy = 'name ASC';
            break;
    }
    
    // Build complete query
    $whereClause = implode(' AND ', $where);
    $sql = "SELECT 
                id, 
                name, 
                description, 
                location, 
                destination, 
                address,
                rating, 
                price_per_night, 
                amenities, 
                images, 
                available_rooms,
                created_at
            FROM hotels 
            WHERE $whereClause 
            ORDER BY $orderBy 
            LIMIT ? OFFSET ?";
    
    $values[] = $limit;
    $values[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);
    $hotels = $stmt->fetchAll();
    
    // Get total count for pagination
    $countSql = "SELECT COUNT(*) as total FROM hotels WHERE $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute(array_slice($values, 0, -2)); // Remove limit and offset
    $totalCount = $countStmt->fetch()['total'];
    
    // Format hotels data
    $formattedHotels = [];
    foreach ($hotels as $hotel) {
        $formattedHotels[] = [
            'id' => (int)$hotel['id'],
            'name' => $hotel['name'],
            'description' => $hotel['description'],
            'location' => $hotel['location'],
            'destination' => $hotel['destination'],
            'address' => $hotel['address'],
            'rating' => (float)$hotel['rating'],
            'price_per_night' => (float)$hotel['price_per_night'],
            'amenities' => json_decode($hotel['amenities'], true) ?: [],
            'images' => json_decode($hotel['images'], true) ?: [],
            'available_rooms' => (int)$hotel['available_rooms'],
            'created_at' => $hotel['created_at']
        ];
    }
    
    // Return results
    sendJsonResponse([
        'success' => true,
        'data' => [
            'hotels' => $formattedHotels,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => (int)$totalCount,
                'total_pages' => ceil($totalCount / $limit),
                'has_more' => ($offset + $limit) < $totalCount
            ],
            'filters_applied' => [
                'destination' => $destination,
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'guests' => $guests,
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
                'min_rating' => $rating,
                'amenities' => $amenities,
                'sort_by' => $sortBy
            ]
        ]
    ]);
    
} catch (PDOException $e) {
    // Log the error
    logError("Hotels search database error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Database error occurred'
    ], 500);
    
} catch (Exception $e) {
    // Log any other errors
    logError("Hotels search error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Server error occurred'
    ], 500);
}
?> 