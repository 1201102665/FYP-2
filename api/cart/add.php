<?php
/**
 * Add to Cart API Endpoint
 * Handles adding items to shopping cart
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
    
    $requiredFields = ['item_type', 'item_id', 'price'];
    $errors = validateRequired($requiredFields, $input);
    
    if (!empty($errors)) {
        sendJsonResponse(['error' => 'Missing required fields', 'details' => $errors], 400);
    }
    
    $itemData = [
        'item_type' => sanitizeInput($input['item_type']),
        'item_id' => (int)$input['item_id'],
        'quantity' => isset($input['quantity']) ? (int)$input['quantity'] : 1,
        'price' => (float)$input['price'],
        'selected_options' => isset($input['selected_options']) ? $input['selected_options'] : []
    ];
    
    // Validate item type
    $validTypes = ['flight', 'hotel', 'car', 'package'];
    if (!in_array($itemData['item_type'], $validTypes)) {
        sendJsonResponse(['error' => 'Invalid item_type. Must be: ' . implode(', ', $validTypes)], 400);
    }
    
    // Validate quantity
    if ($itemData['quantity'] < 1 || $itemData['quantity'] > 10) {
        sendJsonResponse(['error' => 'Quantity must be between 1 and 10'], 400);
    }
    
    // Validate price
    if ($itemData['price'] <= 0) {
        sendJsonResponse(['error' => 'Price must be greater than 0'], 400);
    }
    
    // Verify item exists and get details
    $itemDetails = getItemDetails($db, $itemData['item_type'], $itemData['item_id']);
    if (!$itemDetails) {
        sendJsonResponse(['error' => 'Item not found or unavailable'], 404);
    }
    
    // Validate selected options based on item type
    $validationResult = validateSelectedOptions($itemData, $itemDetails);
    if (!$validationResult['valid']) {
        sendJsonResponse(['error' => $validationResult['message']], 400);
    }
    
    // Add to cart
    $success = $db->addToCart($userId, $sessionId, $itemData);
    
    if (!$success) {
        sendJsonResponse(['error' => 'Failed to add item to cart'], 500);
    }
    
    // Get updated cart
    $cartItems = $db->getCartItems($userId, $sessionId);
    $cartSummary = calculateCartSummary($cartItems);
    
    // Log activity
    $db->logUserActivity($userId, $sessionId, 'cart_add', [
        'item_type' => $itemData['item_type'],
        'item_id' => $itemData['item_id'],
        'quantity' => $itemData['quantity'],
        'price' => $itemData['price']
    ]);
    
    sendJsonResponse([
        'success' => true,
        'message' => 'Item added to cart successfully',
        'item' => [
            'type' => $itemData['item_type'],
            'id' => $itemData['item_id'],
            'name' => $itemDetails['name'],
            'quantity' => $itemData['quantity'],
            'price' => $itemData['price'],
            'selected_options' => $itemData['selected_options']
        ],
        'cart_summary' => $cartSummary
    ], 201);
    
} catch (Exception $e) {
    error_log("Add to cart error: " . $e->getMessage());
    sendJsonResponse(['error' => 'Failed to add item to cart'], 500);
}

function getItemDetails($db, $itemType, $itemId) {
    switch ($itemType) {
        case 'flight':
            $sql = "SELECT f.*, al.name as airline_name 
                    FROM flights f 
                    JOIN airlines al ON f.airline_id = al.id 
                    WHERE f.id = :id AND f.status = 'scheduled'";
            break;
        case 'hotel':
            $sql = "SELECT * FROM hotels WHERE id = :id AND status = 'active'";
            break;
        case 'car':
            $sql = "SELECT * FROM cars WHERE id = :id AND status = 'available'";
            break;
        case 'package':
            $sql = "SELECT * FROM packages WHERE id = :id AND status = 'active'";
            break;
        default:
            return null;
    }
    
    $stmt = $db->getPDO()->prepare($sql);
    $stmt->execute([':id' => $itemId]);
    $item = $stmt->fetch();
    
    if (!$item) {
        return null;
    }
    
    // Add name field for consistent response
    switch ($itemType) {
        case 'flight':
            $item['name'] = $item['airline_name'] . ' ' . $item['flight_number'];
            break;
        case 'hotel':
            $item['name'] = $item['name'];
            break;
        case 'car':
            $item['name'] = $item['make'] . ' ' . $item['model'];
            break;
        case 'package':
            $item['name'] = $item['name'];
            break;
    }
    
    return $item;
}

function validateSelectedOptions($itemData, $itemDetails) {
    $itemType = $itemData['item_type'];
    $options = $itemData['selected_options'];
    
    switch ($itemType) {
        case 'flight':
            // Validate seat class
            if (isset($options['seat_class'])) {
                $validClasses = ['economy', 'business', 'first'];
                if (!in_array($options['seat_class'], $validClasses)) {
                    return ['valid' => false, 'message' => 'Invalid seat class'];
                }
                
                // Check availability for selected class
                $availableField = 'available_' . $options['seat_class'];
                if ($itemDetails[$availableField] < $itemData['quantity']) {
                    return ['valid' => false, 'message' => 'Not enough seats available in selected class'];
                }
            }
            break;
            
        case 'hotel':
            // Validate room type and dates
            if (!isset($options['check_in']) || !isset($options['check_out'])) {
                return ['valid' => false, 'message' => 'Check-in and check-out dates are required'];
            }
            
            $checkIn = DateTime::createFromFormat('Y-m-d', $options['check_in']);
            $checkOut = DateTime::createFromFormat('Y-m-d', $options['check_out']);
            
            if (!$checkIn || !$checkOut) {
                return ['valid' => false, 'message' => 'Invalid date format'];
            }
            
            if ($checkOut <= $checkIn) {
                return ['valid' => false, 'message' => 'Check-out must be after check-in'];
            }
            break;
            
        case 'car':
            // Validate rental dates
            if (!isset($options['pickup_date']) || !isset($options['return_date'])) {
                return ['valid' => false, 'message' => 'Pickup and return dates are required'];
            }
            
            $pickup = DateTime::createFromFormat('Y-m-d H:i', $options['pickup_date']);
            $return = DateTime::createFromFormat('Y-m-d H:i', $options['return_date']);
            
            if (!$pickup || !$return) {
                return ['valid' => false, 'message' => 'Invalid date format'];
            }
            
            if ($return <= $pickup) {
                return ['valid' => false, 'message' => 'Return date must be after pickup date'];
            }
            break;
            
        case 'package':
            // Validate travel dates and traveler count
            if (isset($options['start_date'])) {
                $startDate = DateTime::createFromFormat('Y-m-d', $options['start_date']);
                if (!$startDate) {
                    return ['valid' => false, 'message' => 'Invalid start date format'];
                }
            }
            
            if (isset($options['travelers'])) {
                $travelers = (int)$options['travelers'];
                if ($travelers < $itemDetails['min_travelers'] || $travelers > $itemDetails['max_travelers']) {
                    return ['valid' => false, 'message' => 'Invalid number of travelers'];
                }
            }
            break;
    }
    
    return ['valid' => true];
}

function calculateCartSummary($cartItems) {
    $totalItems = 0;
    $totalAmount = 0;
    $itemsByType = [];
    
    foreach ($cartItems as $item) {
        $totalItems += $item['quantity'];
        $totalAmount += $item['price'] * $item['quantity'];
        
        if (!isset($itemsByType[$item['item_type']])) {
            $itemsByType[$item['item_type']] = 0;
        }
        $itemsByType[$item['item_type']]++;
    }
    
    return [
        'total_items' => $totalItems,
        'total_amount' => $totalAmount,
        'items_by_type' => $itemsByType,
        'currency' => 'USD'
    ];
}
?> 