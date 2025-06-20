<?php
/**
 * ===================================================================
 * AeroTrav Cart Add API
 * Adds items to user's shopping cart
 * ===================================================================
 */

// Enable error reporting and include database connection
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once 'includes/db_connection.php';

// Set JSON response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse([
        'success' => false,
        'message' => 'Only POST method allowed'
    ], 405);
}

try {
    // Check if user is logged in
    if (!isLoggedIn()) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Please log in to add items to cart'
        ], 401);
    }
    
    $userId = getCurrentUserId();
    
    // Get JSON input from request body
    $input = getJsonInput();
    
    if (!$input) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid JSON input'
        ], 400);
    }
    
    // Validate required fields
    $required = ['service_id', 'service_type'];
    $missing = validateRequired($required, $input);
    
    if (!empty($missing)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Missing required fields: ' . implode(', ', $missing)
        ], 400);
    }
    
    // Extract input data
    $serviceId = (int)$input['service_id'];
    $serviceType = $input['service_type'];
    $quantity = (int)($input['quantity'] ?? 1);
    $details = $input['details'] ?? [];
    
    // Validate service type
    $validTypes = ['hotel', 'flight', 'car', 'package'];
    if (!in_array($serviceType, $validTypes)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid service type. Must be one of: ' . implode(', ', $validTypes)
        ], 400);
    }
    
    // Validate quantity
    if ($quantity < 1 || $quantity > 10) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Quantity must be between 1 and 10'
        ], 400);
    }
    
    // Get database connection
    $pdo = DB::get();
    
    // Verify that the service exists and is available
    $serviceExists = verifyServiceExists($pdo, $serviceId, $serviceType);
    if (!$serviceExists) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Service not found or unavailable'
        ], 404);
    }
    
    // Check if item already exists in cart
    $sql = "SELECT id, quantity FROM carts WHERE user_id = ? AND service_id = ? AND service_type = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId, $serviceId, $serviceType]);
    $existingItem = $stmt->fetch();
    
    if ($existingItem) {
        // Update existing cart item
        $newQuantity = $existingItem['quantity'] + $quantity;
        if ($newQuantity > 10) {
            $newQuantity = 10;
        }
        
        $updateSql = "UPDATE carts SET quantity = ?, details = ?, added_at = CURRENT_TIMESTAMP WHERE id = ?";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([$newQuantity, json_encode($details), $existingItem['id']]);
        
        $message = 'Cart item updated successfully';
    } else {
        // Insert new cart item
        $insertSql = "INSERT INTO carts (user_id, service_id, service_type, quantity, details) VALUES (?, ?, ?, ?, ?)";
        $insertStmt = $pdo->prepare($insertSql);
        $insertStmt->execute([$userId, $serviceId, $serviceType, $quantity, json_encode($details)]);
        
        $message = 'Item added to cart successfully';
    }
    
    // Get updated cart count
    $countSql = "SELECT COUNT(*) as cart_count FROM carts WHERE user_id = ?";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute([$userId]);
    $cartCount = $countStmt->fetch()['cart_count'];
    
    // Return success response
    sendJsonResponse([
        'success' => true,
        'message' => $message,
        'data' => [
            'cart_count' => (int)$cartCount,
            'service_id' => $serviceId,
            'service_type' => $serviceType,
            'quantity' => $existingItem ? $newQuantity : $quantity
        ]
    ]);
    
} catch (PDOException $e) {
    // Log the error
    logError("Cart add database error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Database error occurred'
    ], 500);
    
} catch (Exception $e) {
    // Log any other errors
    logError("Cart add error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Server error occurred'
    ], 500);
}

/**
 * Verify that a service exists and is available
 */
function verifyServiceExists($pdo, $serviceId, $serviceType) {
    try {
        switch ($serviceType) {
            case 'hotel':
                $sql = "SELECT id FROM hotels WHERE id = ? AND status = 'active'";
                break;
            case 'flight':
                $sql = "SELECT id FROM flights WHERE id = ? AND status = 'active'";
                break;
            case 'car':
                $sql = "SELECT id FROM cars WHERE id = ? AND status = 'active' AND available = 1";
                break;
            case 'package':
                $sql = "SELECT id FROM packages WHERE id = ? AND status = 'active'";
                break;
            default:
                return false;
        }
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$serviceId]);
        
        return $stmt->fetch() !== false;
    } catch (Exception $e) {
        return false;
    }
}
?> 