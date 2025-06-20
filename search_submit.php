<?php
/**
 * Flight Search Handler
 * Processes flight search requests
 */

// Enable error reporting in development
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'db_config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

// Validate required fields
if (!isset($_POST['search_type'])) {
    sendJsonResponse(['error' => 'search_type is required'], 400);
}

$searchType = trim($_POST['search_type']);
$validSearchTypes = ['hotels', 'flights', 'cars', 'packages'];

if (!in_array($searchType, $validSearchTypes)) {
    sendJsonResponse(['error' => 'Invalid search_type. Must be one of: ' . implode(', ', $validSearchTypes)], 400);
}

try {
    $results = [];
    $searchParameters = [];
    $query = "";
    $params = [];
    
    switch ($searchType) {
        case 'flights':
            // Build flights search query
            $query = "SELECT * FROM flights WHERE 1=1";
            
            if (!empty($_POST['origin'])) {
                $query .= " AND origin LIKE ?";
                $params[] = '%' . $_POST['origin'] . '%';
                $searchParameters['origin'] = $_POST['origin'];
            }
            
            if (!empty($_POST['destination'])) {
                $query .= " AND destination LIKE ?";
                $params[] = '%' . $_POST['destination'] . '%';
                $searchParameters['destination'] = $_POST['destination'];
            }
            
            if (!empty($_POST['departure_date'])) {
                $query .= " AND DATE(departure_time) = ?";
                $params[] = $_POST['departure_date'];
                $searchParameters['departure_date'] = $_POST['departure_date'];
            }
            
            if (!empty($_POST['passengers'])) {
                $query .= " AND available_seats >= ?";
                $params[] = (int)$_POST['passengers'];
                $searchParameters['passengers'] = $_POST['passengers'];
            }
            
            $query .= " ORDER BY departure_time ASC";
            break;
            
        case 'hotels':
            // Build hotels search query
            $query = "SELECT * FROM hotels WHERE 1=1";
            
            if (!empty($_POST['location'])) {
                $query .= " AND location LIKE ?";
                $params[] = '%' . $_POST['location'] . '%';
                $searchParameters['location'] = $_POST['location'];
            }
            
            if (!empty($_POST['check_in']) && !empty($_POST['check_out'])) {
                // For simplicity, just store the dates in search parameters
                $searchParameters['check_in'] = $_POST['check_in'];
                $searchParameters['check_out'] = $_POST['check_out'];
            }
            
            if (!empty($_POST['rooms'])) {
                $query .= " AND available_rooms >= ?";
                $params[] = (int)$_POST['rooms'];
                $searchParameters['rooms'] = $_POST['rooms'];
            }
            
            if (!empty($_POST['min_price'])) {
                $query .= " AND price_per_night >= ?";
                $params[] = (float)$_POST['min_price'];
                $searchParameters['min_price'] = $_POST['min_price'];
            }
            
            if (!empty($_POST['max_price'])) {
                $query .= " AND price_per_night <= ?";
                $params[] = (float)$_POST['max_price'];
                $searchParameters['max_price'] = $_POST['max_price'];
            }
            
            $query .= " ORDER BY rating DESC, price_per_night ASC";
            break;
            
        case 'cars':
            // Build cars search query
            $query = "SELECT * FROM cars WHERE 1=1";
            
            if (!empty($_POST['location'])) {
                $query .= " AND location LIKE ?";
                $params[] = '%' . $_POST['location'] . '%';
                $searchParameters['location'] = $_POST['location'];
            }
            
            if (!empty($_POST['car_type'])) {
                $query .= " AND type = ?";
                $params[] = $_POST['car_type'];
                $searchParameters['car_type'] = $_POST['car_type'];
            }
            
            if (!empty($_POST['pickup_date']) && !empty($_POST['return_date'])) {
                $searchParameters['pickup_date'] = $_POST['pickup_date'];
                $searchParameters['return_date'] = $_POST['return_date'];
            }
            
            if (!empty($_POST['min_price'])) {
                $query .= " AND price_per_day >= ?";
                $params[] = (float)$_POST['min_price'];
                $searchParameters['min_price'] = $_POST['min_price'];
            }
            
            if (!empty($_POST['max_price'])) {
                $query .= " AND price_per_day <= ?";
                $params[] = (float)$_POST['max_price'];
                $searchParameters['max_price'] = $_POST['max_price'];
            }
            
            $query .= " ORDER BY price_per_day ASC";
            break;
            
        case 'packages':
            // Build packages search query
            $query = "SELECT * FROM packages WHERE 1=1";
            
            if (!empty($_POST['destination'])) {
                $query .= " AND destination LIKE ?";
                $params[] = '%' . $_POST['destination'] . '%';
                $searchParameters['destination'] = $_POST['destination'];
            }
            
            if (!empty($_POST['duration'])) {
                $query .= " AND duration = ?";
                $params[] = (int)$_POST['duration'];
                $searchParameters['duration'] = $_POST['duration'];
            }
            
            if (!empty($_POST['min_price'])) {
                $query .= " AND price >= ?";
                $params[] = (float)$_POST['min_price'];
                $searchParameters['min_price'] = $_POST['min_price'];
            }
            
            if (!empty($_POST['max_price'])) {
                $query .= " AND price <= ?";
                $params[] = (float)$_POST['max_price'];
                $searchParameters['max_price'] = $_POST['max_price'];
            }
            
            if (!empty($_POST['start_date'])) {
                $query .= " AND start_date >= ?";
                $params[] = $_POST['start_date'];
                $searchParameters['start_date'] = $_POST['start_date'];
            }
            
            $query .= " ORDER BY price ASC";
            break;
    }
    
    // Execute the search query
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $results = $stmt->fetchAll();
    $resultsCount = count($results);
    
    // Log the search
    $userId = getCurrentUserId();
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    
    $logStmt = $pdo->prepare("
        INSERT INTO search_logs (user_id, search_type, search_parameters, results_count, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");
    
    $logStmt->execute([
        $userId,
        $searchType,
        json_encode($searchParameters),
        $resultsCount,
        $ipAddress,
        $userAgent
    ]);
    
    sendJsonResponse([
        'success' => true,
        'search_type' => $searchType,
        'results_count' => $resultsCount,
        'results' => $results,
        'search_parameters' => $searchParameters
    ]);
    
} catch (PDOException $e) {
    error_log("Search error: " . $e->getMessage());
    sendJsonResponse(['error' => 'Search failed. Please try again.'], 500);
}
?> 