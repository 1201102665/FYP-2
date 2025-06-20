<?php
/**
 * Get Cart API Endpoint
 * Retrieves cart items with details
 */

require_once '../../includes/enhanced_db_connection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

try {
    $db = getDB();
    $userId = getCurrentUserId();
    $sessionId = generateSessionId();
    
    // Get cart items
    $cartItems = $db->getCartItems($userId, $sessionId);
    
    // Enhance cart items with detailed information
    $enhancedItems = [];
    foreach ($cartItems as $item) {
        $enhancedItem = enhanceCartItem($db, $item);
        if ($enhancedItem) {
            $enhancedItems[] = $enhancedItem;
        }
    }
    
    // Calculate cart summary
    $cartSummary = calculateCartSummary($enhancedItems);
    
    sendJsonResponse([
        'success' => true,
        'cart_items' => $enhancedItems,
        'cart_summary' => $cartSummary,
        'timestamp' => date('c')
    ]);
    
} catch (Exception $e) {
    error_log("Get cart error: " . $e->getMessage());
    sendJsonResponse(['error' => 'Failed to retrieve cart'], 500);
}

function enhanceCartItem($db, $item) {
    $itemType = $item['item_type'];
    $itemId = $item['item_id'];
    
    // Get detailed item information
    $itemDetails = getItemDetails($db, $itemType, $itemId);
    if (!$itemDetails) {
        // Item no longer available, should be removed from cart
        return null;
    }
    
    $selectedOptions = json_decode($item['selected_options'], true) ?: [];
    
    return [
        'cart_item_id' => $item['id'],
        'item_type' => $itemType,
        'item_id' => $itemId,
        'item_name' => $item['item_name'],
        'quantity' => $item['quantity'],
        'unit_price' => (float)$item['price'],
        'total_price' => (float)$item['price'] * $item['quantity'],
        'selected_options' => $selectedOptions,
        'item_details' => $itemDetails,
        'added_at' => $item['created_at'],
        'is_available' => checkItemAvailability($db, $itemType, $itemId, $selectedOptions)
    ];
}

function getItemDetails($db, $itemType, $itemId) {
    switch ($itemType) {
        case 'flight':
            $sql = "SELECT f.*, al.name as airline_name, al.code as airline_code,
                           origin.name as origin_name, origin.city as origin_city,
                           dest.name as destination_name, dest.city as destination_city
                    FROM flights f
                    JOIN airlines al ON f.airline_id = al.id
                    JOIN airports origin ON f.origin_airport_id = origin.id
                    JOIN airports dest ON f.destination_airport_id = dest.id
                    WHERE f.id = :id";
            break;
            
        case 'hotel':
            $sql = "SELECT h.*, 
                           (SELECT JSON_ARRAYAGG(
                               JSON_OBJECT(
                                   'id', hr.id,
                                   'room_type', hr.room_type,
                                   'base_price', hr.base_price,
                                   'max_occupancy', hr.max_occupancy
                               )
                           ) FROM hotel_rooms hr WHERE hr.hotel_id = h.id) as rooms
                    FROM hotels h WHERE h.id = :id";
            break;
            
        case 'car':
            $sql = "SELECT * FROM cars WHERE id = :id";
            break;
            
        case 'package':
            $sql = "SELECT * FROM packages WHERE id = :id";
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
    
    // Process item based on type
    switch ($itemType) {
        case 'flight':
            return [
                'id' => $item['id'],
                'airline_name' => $item['airline_name'],
                'airline_code' => $item['airline_code'],
                'flight_number' => $item['flight_number'],
                'origin' => [
                    'name' => $item['origin_name'],
                    'city' => $item['origin_city']
                ],
                'destination' => [
                    'name' => $item['destination_name'],
                    'city' => $item['destination_city']
                ],
                'departure_time' => $item['departure_time'],
                'arrival_time' => $item['arrival_time'],
                'duration_minutes' => $item['duration_minutes'],
                'status' => $item['status']
            ];
            
        case 'hotel':
            return [
                'id' => $item['id'],
                'name' => $item['name'],
                'city' => $item['city'],
                'country' => $item['country'],
                'star_rating' => (float)$item['star_rating'],
                'user_rating' => $item['user_rating'] ? (float)$item['user_rating'] : null,
                'address' => $item['address'],
                'images' => json_decode($item['images'], true),
                'rooms' => json_decode($item['rooms'], true),
                'status' => $item['status']
            ];
            
        case 'car':
            return [
                'id' => $item['id'],
                'make' => $item['make'],
                'model' => $item['model'],
                'year' => $item['year'],
                'category' => $item['category'],
                'transmission' => $item['transmission'],
                'seats' => $item['seats'],
                'daily_rate' => (float)$item['daily_rate'],
                'location_city' => $item['location_city'],
                'location_country' => $item['location_country'],
                'images' => json_decode($item['images'], true),
                'status' => $item['status']
            ];
            
        case 'package':
            return [
                'id' => $item['id'],
                'name' => $item['name'],
                'destination_city' => $item['destination_city'],
                'destination_country' => $item['destination_country'],
                'duration_days' => $item['duration_days'],
                'duration_nights' => $item['duration_nights'],
                'category' => $item['category'],
                'base_price' => (float)$item['base_price'],
                'description' => $item['description'],
                'images' => json_decode($item['images'], true),
                'status' => $item['status']
            ];
    }
    
    return null;
}

function checkItemAvailability($db, $itemType, $itemId, $selectedOptions) {
    switch ($itemType) {
        case 'flight':
            $seatClass = $selectedOptions['seat_class'] ?? 'economy';
            $sql = "SELECT available_$seatClass as available FROM flights WHERE id = :id AND status = 'scheduled'";
            $stmt = $db->getPDO()->prepare($sql);
            $stmt->execute([':id' => $itemId]);
            $result = $stmt->fetch();
            return $result && $result['available'] > 0;
            
        case 'hotel':
            if (!isset($selectedOptions['check_in']) || !isset($selectedOptions['check_out'])) {
                return true; // Can't check without dates
            }
            
            $sql = "SELECT COUNT(*) as available_rooms FROM hotel_rooms hr
                    WHERE hr.hotel_id = :hotel_id
                    AND hr.total_rooms > (
                        SELECT COALESCE(SUM(hb.rooms_count), 0)
                        FROM hotel_bookings hb
                        JOIN booking_items bi ON hb.booking_item_id = bi.id
                        JOIN bookings b ON bi.booking_id = b.id
                        WHERE b.status IN ('confirmed', 'pending')
                        AND hb.hotel_id = :hotel_id
                        AND NOT (hb.check_out_date <= :check_in OR hb.check_in_date >= :check_out)
                    )";
            
            $stmt = $db->getPDO()->prepare($sql);
            $stmt->execute([
                ':hotel_id' => $itemId,
                ':check_in' => $selectedOptions['check_in'],
                ':check_out' => $selectedOptions['check_out']
            ]);
            $result = $stmt->fetch();
            return $result && $result['available_rooms'] > 0;
            
        case 'car':
            if (!isset($selectedOptions['pickup_date']) || !isset($selectedOptions['return_date'])) {
                return true; // Can't check without dates
            }
            
            $sql = "SELECT (c.available_cars - COALESCE(booked_cars.booked_count, 0)) as available_count
                    FROM cars c
                    LEFT JOIN (
                        SELECT car_id, COUNT(*) as booked_count
                        FROM car_bookings cb
                        JOIN booking_items bi ON cb.booking_item_id = bi.id
                        JOIN bookings b ON bi.booking_id = b.id
                        WHERE b.status IN ('confirmed', 'pending')
                        AND NOT (cb.return_date <= :pickup_date OR cb.pickup_date >= :return_date)
                        GROUP BY car_id
                    ) as booked_cars ON c.id = booked_cars.car_id
                    WHERE c.id = :car_id";
            
            $stmt = $db->getPDO()->prepare($sql);
            $stmt->execute([
                ':car_id' => $itemId,
                ':pickup_date' => $selectedOptions['pickup_date'],
                ':return_date' => $selectedOptions['return_date']
            ]);
            $result = $stmt->fetch();
            return $result && $result['available_count'] > 0;
            
        case 'package':
            $sql = "SELECT status FROM packages WHERE id = :id";
            $stmt = $db->getPDO()->prepare($sql);
            $stmt->execute([':id' => $itemId]);
            $result = $stmt->fetch();
            return $result && $result['status'] === 'active';
            
        default:
            return false;
    }
}

function calculateCartSummary($cartItems) {
    $totalItems = 0;
    $totalAmount = 0;
    $itemsByType = [];
    $unavailableItems = 0;
    
    foreach ($cartItems as $item) {
        $totalItems += $item['quantity'];
        $totalAmount += $item['total_price'];
        
        if (!isset($itemsByType[$item['item_type']])) {
            $itemsByType[$item['item_type']] = 0;
        }
        $itemsByType[$item['item_type']]++;
        
        if (!$item['is_available']) {
            $unavailableItems++;
        }
    }
    
    return [
        'total_items' => $totalItems,
        'total_amount' => $totalAmount,
        'items_by_type' => $itemsByType,
        'unavailable_items' => $unavailableItems,
        'currency' => 'USD',
        'can_checkout' => $unavailableItems === 0 && $totalItems > 0
    ];
}
?> 