<?php
/**
 * ===================================================================
 * AeroTrav Cart View API
 * Retrieves and displays user's shopping cart contents
 * ===================================================================
 */

// Enable error reporting and include database connection
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once 'includes/db_connection.php';

// Set JSON response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonResponse([
        'success' => false,
        'message' => 'Only GET method allowed'
    ], 405);
}

try {
    // Check if user is logged in
    if (!isLoggedIn()) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Please log in to view cart'
        ], 401);
    }
    
    $userId = getCurrentUserId();
    
    // Get database connection
    $pdo = DB::get();
    
    // Get all cart items for the user
    $sql = "SELECT 
                c.id as cart_id,
                c.service_id,
                c.service_type,
                c.quantity,
                c.details,
                c.added_at
            FROM carts c
            WHERE c.user_id = ?
            ORDER BY c.added_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $cartItems = $stmt->fetchAll();
    
    if (empty($cartItems)) {
        sendJsonResponse([
            'success' => true,
            'data' => [
                'cart_items' => [],
                'total_items' => 0,
                'total_amount' => 0.0,
                'cart_summary' => [
                    'hotels' => 0,
                    'flights' => 0,
                    'cars' => 0,
                    'packages' => 0
                ]
            ],
            'message' => 'Cart is empty'
        ]);
    }
    
    // Fetch detailed information for each cart item
    $detailedCartItems = [];
    $totalAmount = 0.0;
    $cartSummary = ['hotels' => 0, 'flights' => 0, 'cars' => 0, 'packages' => 0];
    
    foreach ($cartItems as $item) {
        $serviceDetails = getServiceDetails($pdo, $item['service_id'], $item['service_type']);
        
        if ($serviceDetails) {
            $itemTotal = $serviceDetails['price'] * $item['quantity'];
            $totalAmount += $itemTotal;
            
            $detailedCartItems[] = [
                'cart_id' => (int)$item['cart_id'],
                'service_id' => (int)$item['service_id'],
                'service_type' => $item['service_type'],
                'quantity' => (int)$item['quantity'],
                'details' => json_decode($item['details'], true) ?: [],
                'added_at' => $item['added_at'],
                'service_info' => $serviceDetails,
                'item_total' => $itemTotal
            ];
            
            // Update cart summary
            $cartSummary[$item['service_type'] . 's']++;
        }
    }
    
    // Return cart contents
    sendJsonResponse([
        'success' => true,
        'data' => [
            'cart_items' => $detailedCartItems,
            'total_items' => count($detailedCartItems),
            'total_amount' => $totalAmount,
            'cart_summary' => $cartSummary,
            'user_id' => $userId
        ]
    ]);
    
} catch (PDOException $e) {
    // Log the error
    logError("Cart view database error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Database error occurred'
    ], 500);
    
} catch (Exception $e) {
    // Log any other errors
    logError("Cart view error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Server error occurred'
    ], 500);
}

/**
 * Get detailed service information
 */
function getServiceDetails($pdo, $serviceId, $serviceType) {
    try {
        switch ($serviceType) {
            case 'hotel':
                $sql = "SELECT 
                            id, name, location, destination, 
                            price_per_night as price, rating, 
                            amenities, images 
                        FROM hotels 
                        WHERE id = ? AND status = 'active'";
                break;
                
            case 'flight':
                $sql = "SELECT 
                            id, airline, flight_number,
                            departure_city, arrival_city,
                            departure_time, arrival_time,
                            price, class, aircraft_type
                        FROM flights 
                        WHERE id = ? AND status = 'active'";
                break;
                
            case 'car':
                $sql = "SELECT 
                            id, make, model, year, type, location,
                            price_per_day as price, fuel_type, 
                            seats, transmission, features, images
                        FROM cars 
                        WHERE id = ? AND status = 'active' AND available = 1";
                break;
                
            case 'package':
                $sql = "SELECT 
                            id, name, description, destination, 
                            duration_days, price, includes, 
                            excludes, difficulty_level, images
                        FROM packages 
                        WHERE id = ? AND status = 'active'";
                break;
                
            default:
                return null;
        }
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$serviceId]);
        $service = $stmt->fetch();
        
        if (!$service) {
            return null;
        }
        
        // Format service data
        $formatted = [
            'id' => (int)$service['id'],
            'price' => (float)$service['price'],
            'service_type' => $serviceType
        ];
        
        // Add service-specific fields
        switch ($serviceType) {
            case 'hotel':
                $formatted['name'] = $service['name'];
                $formatted['location'] = $service['location'];
                $formatted['destination'] = $service['destination'];
                $formatted['rating'] = (float)$service['rating'];
                $formatted['amenities'] = json_decode($service['amenities'], true) ?: [];
                $formatted['images'] = json_decode($service['images'], true) ?: [];
                $formatted['price_type'] = 'per night';
                break;
                
            case 'flight':
                $formatted['airline'] = $service['airline'];
                $formatted['flight_number'] = $service['flight_number'];
                $formatted['departure_city'] = $service['departure_city'];
                $formatted['arrival_city'] = $service['arrival_city'];
                $formatted['departure_time'] = $service['departure_time'];
                $formatted['arrival_time'] = $service['arrival_time'];
                $formatted['class'] = $service['class'];
                $formatted['aircraft_type'] = $service['aircraft_type'];
                $formatted['price_type'] = 'per person';
                break;
                
            case 'car':
                $formatted['make'] = $service['make'];
                $formatted['model'] = $service['model'];
                $formatted['year'] = (int)$service['year'];
                $formatted['type'] = $service['type'];
                $formatted['location'] = $service['location'];
                $formatted['fuel_type'] = $service['fuel_type'];
                $formatted['seats'] = (int)$service['seats'];
                $formatted['transmission'] = $service['transmission'];
                $formatted['features'] = json_decode($service['features'], true) ?: [];
                $formatted['images'] = json_decode($service['images'], true) ?: [];
                $formatted['price_type'] = 'per day';
                break;
                
            case 'package':
                $formatted['name'] = $service['name'];
                $formatted['description'] = $service['description'];
                $formatted['destination'] = $service['destination'];
                $formatted['duration_days'] = (int)$service['duration_days'];
                $formatted['includes'] = json_decode($service['includes'], true) ?: [];
                $formatted['excludes'] = json_decode($service['excludes'], true) ?: [];
                $formatted['difficulty_level'] = $service['difficulty_level'];
                $formatted['images'] = json_decode($service['images'], true) ?: [];
                $formatted['price_type'] = 'total package';
                break;
        }
        
        return $formatted;
        
    } catch (Exception $e) {
        return null;
    }
}
?> 