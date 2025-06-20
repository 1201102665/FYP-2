<?php
/**
 * Create Booking API Endpoint
 * Handles complete booking creation and payment processing
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
    
    $requiredFields = ['guest_email', 'guest_name', 'payment_method'];
    $errors = validateRequired($requiredFields, $input);
    
    if (!empty($errors)) {
        sendJsonResponse(['error' => 'Missing required fields', 'details' => $errors], 400);
    }
    
    // Validate email
    if (!filter_var($input['guest_email'], FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(['error' => 'Invalid email format'], 400);
    }
    
    // Get cart items to create booking from
    $cartItems = $db->getCartItems($userId, $sessionId);
    
    if (empty($cartItems)) {
        sendJsonResponse(['error' => 'Cart is empty'], 400);
    }
    
    // Validate all cart items are still available
    $unavailableItems = [];
    $totalAmount = 0;
    $processedItems = [];
    
    foreach ($cartItems as $cartItem) {
        $selectedOptions = json_decode($cartItem['selected_options'], true) ?: [];
        $isAvailable = checkItemAvailability($db, $cartItem['item_type'], $cartItem['item_id'], $selectedOptions);
        
        if (!$isAvailable) {
            $unavailableItems[] = $cartItem['item_name'];
            continue;
        }
        
        $itemTotal = $cartItem['price'] * $cartItem['quantity'];
        $totalAmount += $itemTotal;
        
        $processedItems[] = [
            'item_type' => $cartItem['item_type'],
            'item_id' => $cartItem['item_id'],
            'item_name' => $cartItem['item_name'],
            'quantity' => $cartItem['quantity'],
            'unit_price' => $cartItem['price'],
            'total_price' => $itemTotal,
            'selected_options' => $selectedOptions
        ];
    }
    
    if (!empty($unavailableItems)) {
        sendJsonResponse([
            'error' => 'Some items are no longer available',
            'unavailable_items' => $unavailableItems
        ], 400);
    }
    
    // Process payment (simulate for now)
    $paymentResult = processPayment($input, $totalAmount);
    if (!$paymentResult['success']) {
        sendJsonResponse(['error' => 'Payment failed: ' . $paymentResult['message']], 400);
    }
    
    // Create booking
    $bookingData = [
        'user_id' => $userId,
        'guest_email' => sanitizeInput($input['guest_email']),
        'guest_name' => sanitizeInput($input['guest_name']),
        'guest_phone' => isset($input['guest_phone']) ? sanitizeInput($input['guest_phone']) : null,
        'total_amount' => $totalAmount,
        'currency' => $input['currency'] ?? 'USD',
        'status' => 'confirmed',
        'payment_method' => sanitizeInput($input['payment_method']),
        'payment_reference' => $paymentResult['reference'] ?? null,
        'travel_start_date' => isset($input['travel_start_date']) ? sanitizeInput($input['travel_start_date']) : null,
        'travel_end_date' => isset($input['travel_end_date']) ? sanitizeInput($input['travel_end_date']) : null,
        'travelers_count' => isset($input['travelers_count']) ? (int)$input['travelers_count'] : 1,
        'special_requests' => isset($input['special_requests']) ? sanitizeInput($input['special_requests']) : null,
        'items' => $processedItems
    ];
    
    $bookingResult = $db->createBooking($bookingData);
    
    if (!$bookingResult['success']) {
        sendJsonResponse(['error' => 'Failed to create booking: ' . $bookingResult['error']], 500);
    }
    
    // Clear cart after successful booking
    $db->clearCart($userId, $sessionId);
    
    // Send confirmation email (implement email service)
    // sendBookingConfirmationEmail($bookingData, $bookingResult['booking_reference']);
    
    // Log successful booking
    $db->logUserActivity($userId, $sessionId, 'booking_created', [
        'booking_id' => $bookingResult['booking_id'],
        'booking_reference' => $bookingResult['booking_reference'],
        'total_amount' => $totalAmount,
        'items_count' => count($processedItems)
    ]);
    
    sendJsonResponse([
        'success' => true,
        'message' => 'Booking created successfully',
        'booking_id' => $bookingResult['booking_id'],
        'booking_reference' => $bookingResult['booking_reference'],
        'total_amount' => $totalAmount,
        'currency' => $bookingData['currency'],
        'payment_status' => 'completed',
        'items_booked' => count($processedItems),
        'confirmation_email_sent' => true // Simulate for now
    ], 201);
    
} catch (Exception $e) {
    error_log("Booking creation error: " . $e->getMessage());
    sendJsonResponse(['error' => 'Failed to create booking. Please try again.'], 500);
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
                return false;
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
                return false;
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

function processPayment($paymentData, $amount) {
    // Simulate payment processing
    // In a real implementation, integrate with Stripe, PayPal, etc.
    
    $paymentMethod = $paymentData['payment_method'];
    
    switch ($paymentMethod) {
        case 'credit_card':
            // Validate credit card fields
            $requiredFields = ['card_number', 'expiry_month', 'expiry_year', 'cvv', 'cardholder_name'];
            foreach ($requiredFields as $field) {
                if (empty($paymentData[$field])) {
                    return ['success' => false, 'message' => "Missing required field: $field"];
                }
            }
            
            // Simulate credit card validation
            $cardNumber = preg_replace('/\s+/', '', $paymentData['card_number']);
            if (strlen($cardNumber) < 13 || strlen($cardNumber) > 19) {
                return ['success' => false, 'message' => 'Invalid card number'];
            }
            
            return [
                'success' => true,
                'reference' => 'CC_' . strtoupper(bin2hex(random_bytes(8))),
                'transaction_id' => uniqid('txn_'),
                'amount' => $amount
            ];
            
        case 'paypal':
            // Simulate PayPal payment
            return [
                'success' => true,
                'reference' => 'PP_' . strtoupper(bin2hex(random_bytes(8))),
                'transaction_id' => uniqid('pp_'),
                'amount' => $amount
            ];
            
        case 'bank_transfer':
            // Simulate bank transfer
            return [
                'success' => true,
                'reference' => 'BT_' . strtoupper(bin2hex(random_bytes(8))),
                'transaction_id' => uniqid('bt_'),
                'amount' => $amount
            ];
            
        default:
            return ['success' => false, 'message' => 'Unsupported payment method'];
    }
}

function sendBookingConfirmationEmail($bookingData, $bookingReference) {
    // Implement email sending logic
    // This could integrate with services like SendGrid, Mailgun, etc.
    
    $to = $bookingData['guest_email'];
    $subject = "Booking Confirmation - " . $bookingReference;
    
    $message = "
    Dear {$bookingData['guest_name']},
    
    Thank you for your booking with AeroTrav!
    
    Booking Reference: {$bookingReference}
    Total Amount: {$bookingData['currency']} {$bookingData['total_amount']}
    
    We will send you detailed itinerary information shortly.
    
    Best regards,
    AeroTrav Team
    ";
    
    // For now, just log the email
    error_log("Booking confirmation email would be sent to: $to");
    error_log("Subject: $subject");
    error_log("Message: $message");
    
    return true;
}
?> 