<?php
/**
 * Flight Search API Endpoint
 * Handles flight search requests with comprehensive filtering
 */

require_once '../../includes/enhanced_db_connection.php';

// Enable CORS for frontend requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Allow both GET and POST requests
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST'])) {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    $db = getDB();
    $userId = getCurrentUserId();
    $sessionId = generateSessionId();
    
    // Get input data
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    } else {
        $input = $_GET;
    }
    
    // Build search criteria with defaults
    $criteria = [
        'origin' => isset($input['origin']) ? sanitizeInput($input['origin']) : null,
        'destination' => isset($input['destination']) ? sanitizeInput($input['destination']) : null,
        'departure_date' => isset($input['departure_date']) ? sanitizeInput($input['departure_date']) : null,
        'return_date' => isset($input['return_date']) ? sanitizeInput($input['return_date']) : null,
        'passengers' => isset($input['passengers']) ? (int)$input['passengers'] : 1,
        'class' => isset($input['class']) ? sanitizeInput($input['class']) : 'economy'
    ];
    
    // Validate dates if provided
    if ($criteria['departure_date']) {
        $departureDate = DateTime::createFromFormat('Y-m-d', $criteria['departure_date']);
        if (!$departureDate || $departureDate < new DateTime('today')) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid or past departure date']);
            exit();
        }
    }
    
    if ($criteria['return_date']) {
        $returnDate = DateTime::createFromFormat('Y-m-d', $criteria['return_date']);
        if (!$returnDate || ($criteria['departure_date'] && $returnDate <= $departureDate)) {
            http_response_code(400);
            echo json_encode(['error' => 'Return date must be after departure date']);
            exit();
        }
    }
    
    // Search for flights
    $flights = searchFlights($db, $criteria);
    
    // Apply additional filters if provided
    if (isset($input['filters'])) {
        $flights = applyFlightFilters($flights, $input['filters']);
    }
    
    // Sort results
    $sortBy = $input['sort_by'] ?? 'price_asc';
    $flights = sortFlights($flights, $sortBy);
    
    // Apply pagination
    $page = isset($input['page']) ? (int)$input['page'] : 1;
    $perPage = isset($input['per_page']) ? (int)$input['per_page'] : 20;
    $perPage = min($perPage, 50); // Max 50 results per page
    
    $totalResults = count($flights);
    $totalPages = ceil($totalResults / $perPage);
    $offset = ($page - 1) * $perPage;
    $paginatedResults = array_slice($flights, $offset, $perPage);
    
    // Log search activity
    if ($userId) {
        $searchData = [
            'search_type' => 'flights',
            'search_query' => $criteria,
            'filters_applied' => $input['filters'] ?? [],
            'results_count' => $totalResults
        ];
        $db->logSearchActivity($userId, $sessionId, $searchData);
    }
    
    // Prepare response
    $response = [
        'success' => true,
        'data' => $paginatedResults,
        'search_criteria' => $criteria,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $perPage,
            'total_results' => $totalResults,
            'total_pages' => $totalPages,
            'has_next_page' => $page < $totalPages,
            'has_prev_page' => $page > 1
        ],
        'search_id' => uniqid('flight_search_'),
        'timestamp' => date('c')
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("Flight search error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Flight search failed. Please try again.']);
}

/**
 * Search for flights based on criteria
 */
function searchFlights($db, $criteria) {
    $sql = "SELECT f.*, 
                   a.name as airline_name,
                   a.logo_url as airline_logo,
                   origin_airport.name as origin_airport_name,
                   origin_airport.city as origin_city,
                   origin_airport.country as origin_country,
                   dest_airport.name as destination_airport_name,
                   dest_airport.city as destination_city,
                   dest_airport.country as destination_country
            FROM flights f
            JOIN airlines a ON f.airline_id = a.id
            LEFT JOIN airports origin_airport ON f.origin_airport_id = origin_airport.id
            LEFT JOIN airports dest_airport ON f.destination_airport_id = dest_airport.id
            WHERE f.status = 'active'
            AND f.available_seats >= :passengers";
    
    $params = [':passengers' => $criteria['passengers']];
    
    // Add search filters
    if ($criteria['origin']) {
        $sql .= " AND (origin_airport.city LIKE :origin OR origin_airport.code LIKE :origin_code)";
        $params[':origin'] = '%' . $criteria['origin'] . '%';
        $params[':origin_code'] = '%' . $criteria['origin'] . '%';
    }
    
    if ($criteria['destination']) {
        $sql .= " AND (dest_airport.city LIKE :destination OR dest_airport.code LIKE :destination_code)";
        $params[':destination'] = '%' . $criteria['destination'] . '%';
        $params[':destination_code'] = '%' . $criteria['destination'] . '%';
    }
    
    if ($criteria['departure_date']) {
        $sql .= " AND DATE(f.departure_time) = :departure_date";
        $params[':departure_date'] = $criteria['departure_date'];
    }
    
    $sql .= " ORDER BY f.departure_time ASC";
    
    try {
        $stmt = $db->getPDO()->prepare($sql);
        $stmt->execute($params);
        $flights = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Process flight data
        return array_map(function($flight) {
            return [
                'id' => (int)$flight['id'],
                'airline' => $flight['airline_name'],
                'airline_logo' => $flight['airline_logo'],
                'flight_number' => $flight['flight_number'],
                'origin' => $flight['origin_city'] ?: $flight['origin'],
                'destination' => $flight['destination_city'] ?: $flight['destination'],
                'origin_airport' => $flight['origin_airport_name'],
                'destination_airport' => $flight['destination_airport_name'],
                'departure_time' => $flight['departure_time'],
                'arrival_time' => $flight['arrival_time'],
                'price' => (float)$flight['price'],
                'available_seats' => (int)$flight['available_seats'],
                'duration' => calculateFlightDuration($flight['departure_time'], $flight['arrival_time']),
                'class' => $flight['class'] ?? 'economy'
            ];
        }, $flights);
        
    } catch (Exception $e) {
        error_log("Database error in searchFlights: " . $e->getMessage());
        return [];
    }
}

/**
 * Apply additional filters to flight results
 */
function applyFlightFilters($flights, $filters) {
    if (isset($filters['max_price'])) {
        $flights = array_filter($flights, function($flight) use ($filters) {
            return $flight['price'] <= $filters['max_price'];
        });
    }
    
    if (isset($filters['airlines']) && is_array($filters['airlines'])) {
        $flights = array_filter($flights, function($flight) use ($filters) {
            return in_array($flight['airline'], $filters['airlines']);
        });
    }
    
    if (isset($filters['departure_time_range'])) {
        $flights = array_filter($flights, function($flight) use ($filters) {
            $hour = (int)date('H', strtotime($flight['departure_time']));
            return $hour >= $filters['departure_time_range']['start'] && 
                   $hour <= $filters['departure_time_range']['end'];
        });
    }
    
    return array_values($flights);
}

/**
 * Sort flights by specified criteria
 */
function sortFlights($flights, $sortBy) {
    switch ($sortBy) {
        case 'price_asc':
            usort($flights, function($a, $b) { return $a['price'] <=> $b['price']; });
            break;
        case 'price_desc':
            usort($flights, function($a, $b) { return $b['price'] <=> $a['price']; });
            break;
        case 'departure_asc':
            usort($flights, function($a, $b) { return strtotime($a['departure_time']) <=> strtotime($b['departure_time']); });
            break;
        case 'departure_desc':
            usort($flights, function($a, $b) { return strtotime($b['departure_time']) <=> strtotime($a['departure_time']); });
            break;
        case 'duration_asc':
            usort($flights, function($a, $b) { return $a['duration'] <=> $b['duration']; });
            break;
        case 'duration_desc':
            usort($flights, function($a, $b) { return $b['duration'] <=> $a['duration']; });
            break;
    }
    
    return $flights;
}

/**
 * Calculate flight duration in minutes
 */
function calculateFlightDuration($departureTime, $arrivalTime) {
    $departure = new DateTime($departureTime);
    $arrival = new DateTime($arrivalTime);
    return $departure->diff($arrival)->h * 60 + $departure->diff($arrival)->i;
}
?> 