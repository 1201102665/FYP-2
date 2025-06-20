<?php
/**
 * ===================================================================
 * AeroTrav Package Search API
 * Handles package search with filters and returns JSON results
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
    $minDuration = (int)($params['min_duration'] ?? 0);
    $maxDuration = (int)($params['max_duration'] ?? 365);
    $minPrice = (float)($params['min_price'] ?? 0);
    $maxPrice = (float)($params['max_price'] ?? 999999);
    $maxPeople = (int)($params['max_people'] ?? 1);
    $difficulty = $params['difficulty_level'] ?? '';
    $season = $params['season'] ?? '';
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
        $where[] = 'destination LIKE ?';
        $values[] = '%' . $destination . '%';
    }
    
    if ($minDuration > 0) {
        $where[] = 'duration_days >= ?';
        $values[] = $minDuration;
    }
    
    if ($maxDuration < 365) {
        $where[] = 'duration_days <= ?';
        $values[] = $maxDuration;
    }
    
    if ($minPrice > 0) {
        $where[] = 'price >= ?';
        $values[] = $minPrice;
    }
    
    if ($maxPrice < 999999) {
        $where[] = 'price <= ?';
        $values[] = $maxPrice;
    }
    
    if ($maxPeople > 0) {
        $where[] = 'max_people >= ?';
        $values[] = $maxPeople;
    }
    
    if (!empty($difficulty)) {
        $where[] = 'difficulty_level = ?';
        $values[] = $difficulty;
    }
    
    if (!empty($season) && $season !== 'all') {
        $where[] = '(season = ? OR season = "all")';
        $values[] = $season;
    }
    
    // Build ORDER BY clause
    $orderBy = 'price ASC, duration_days ASC';
    $sortBy = $params['sort_by'] ?? '';
    
    switch ($sortBy) {
        case 'price_low':
            $orderBy = 'price ASC';
            break;
        case 'price_high':
            $orderBy = 'price DESC';
            break;
        case 'duration_short':
            $orderBy = 'duration_days ASC';
            break;
        case 'duration_long':
            $orderBy = 'duration_days DESC';
            break;
        case 'name':
            $orderBy = 'name ASC';
            break;
        case 'destination':
            $orderBy = 'destination ASC';
            break;
    }
    
    // Build complete query
    $whereClause = implode(' AND ', $where);
    $sql = "SELECT 
                id,
                name,
                description,
                destination,
                duration_days,
                price,
                includes,
                excludes,
                itinerary,
                images,
                max_people,
                difficulty_level,
                season,
                created_at
            FROM packages 
            WHERE $whereClause 
            ORDER BY $orderBy 
            LIMIT ? OFFSET ?";
    
    $values[] = $limit;
    $values[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);
    $packages = $stmt->fetchAll();
    
    // Get total count for pagination
    $countSql = "SELECT COUNT(*) as total FROM packages WHERE $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute(array_slice($values, 0, -2)); // Remove limit and offset
    $totalCount = $countStmt->fetch()['total'];
    
    // Format packages data
    $formattedPackages = [];
    foreach ($packages as $package) {
        $formattedPackages[] = [
            'id' => (int)$package['id'],
            'name' => $package['name'],
            'description' => $package['description'],
            'destination' => $package['destination'],
            'duration_days' => (int)$package['duration_days'],
            'price' => (float)$package['price'],
            'includes' => json_decode($package['includes'], true) ?: [],
            'excludes' => json_decode($package['excludes'], true) ?: [],
            'itinerary' => json_decode($package['itinerary'], true) ?: [],
            'images' => json_decode($package['images'], true) ?: [],
            'max_people' => (int)$package['max_people'],
            'difficulty_level' => $package['difficulty_level'],
            'season' => $package['season'],
            'created_at' => $package['created_at']
        ];
    }
    
    // Return results
    sendJsonResponse([
        'success' => true,
        'data' => [
            'packages' => $formattedPackages,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => (int)$totalCount,
                'total_pages' => ceil($totalCount / $limit),
                'has_more' => ($offset + $limit) < $totalCount
            ],
            'filters_applied' => [
                'destination' => $destination,
                'min_duration' => $minDuration,
                'max_duration' => $maxDuration,
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
                'max_people' => $maxPeople,
                'difficulty_level' => $difficulty,
                'season' => $season,
                'sort_by' => $sortBy
            ]
        ]
    ]);
    
} catch (PDOException $e) {
    // Log the error
    logError("Packages search database error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Database error occurred'
    ], 500);
    
} catch (Exception $e) {
    // Log any other errors
    logError("Packages search error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Server error occurred'
    ], 500);
}
?> 