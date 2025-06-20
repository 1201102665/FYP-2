<?php
/**
 * ===================================================================
 * AeroTrav Cart Remove API
 * Removes items from user's shopping cart
 * ===================================================================
 */

// Enable error reporting and include database connection
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once 'includes/db_connection.php';

// Set JSON response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Accept POST and DELETE requests
if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'DELETE'])) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Only POST and DELETE methods allowed'
    ], 405);
}

try {
    // Check if user is logged in
    if (!isLoggedIn()) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Please log in to modify cart'
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
    $removeAll = $input['remove_all'] ?? false; // If true, remove entire item, if false, decrease quantity by 1
    
    // Validate service type
    $validTypes = ['hotel', 'flight', 'car', 'package'];
    if (!in_array($serviceType, $validTypes)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid service type. Must be one of: ' . implode(', ', $validTypes)
        ], 400);
    }
    
    // Get database connection
    $pdo = DB::get();
    
    // Check if item exists in user's cart
    $sql = "SELECT id, quantity FROM carts WHERE user_id = ? AND service_id = ? AND service_type = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId, $serviceId, $serviceType]);
    $cartItem = $stmt->fetch();
    
    if (!$cartItem) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Item not found in cart'
        ], 404);
    }
    
    $message = '';
    
    if ($removeAll || $cartItem['quantity'] <= 1) {
        // Remove entire item from cart
        $deleteSql = "DELETE FROM carts WHERE id = ?";
        $deleteStmt = $pdo->prepare($deleteSql);
        $deleteStmt->execute([$cartItem['id']]);
        
        $message = 'Item removed from cart successfully';
        $newQuantity = 0;
    } else {
        // Decrease quantity by 1
        $newQuantity = $cartItem['quantity'] - 1;
        $updateSql = "UPDATE carts SET quantity = ? WHERE id = ?";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([$newQuantity, $cartItem['id']]);
        
        $message = 'Item quantity decreased successfully';
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
            'new_quantity' => $newQuantity,
            'removed_completely' => $newQuantity === 0
        ]
    ]);
    
} catch (PDOException $e) {
    // Log the error
    logError("Cart remove database error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Database error occurred'
    ], 500);
    
} catch (Exception $e) {
    // Log any other errors
    logError("Cart remove error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Server error occurred'
    ], 500);
}
?> 