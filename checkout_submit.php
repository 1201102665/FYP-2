<?php
/**
 * ===================================================================
 * AeroTrav Checkout API
 * Processes cart checkout and creates bookings
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
            'message' => 'Please log in to complete checkout'
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
    
    // Extract checkout data
    $bookingDate = $input['booking_date'] ?? date('Y-m-d');
    $returnDate = $input['return_date'] ?? null;
    $specialRequests = $input['special_requests'] ?? '';
    $paymentMethod = $input['payment_method'] ?? 'pending';
    
    // Validate booking date
    if (!DateTime::createFromFormat('Y-m-d', $bookingDate)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid booking date format. Use YYYY-MM-DD'
        ], 400);
    }
    
    // Get database connection
    $pdo = DB::get();
    
    // Start transaction
    $pdo->beginTransaction();
    
    try {
        // Get user's cart items
        $cartSql = "SELECT 
                        c.service_id,
                        c.service_type,
                        c.quantity,
                        c.details
                    FROM carts c
                    WHERE c.user_id = ?";
        
        $cartStmt = $pdo->prepare($cartSql);
        $cartStmt->execute([$userId]);
        $cartItems = $cartStmt->fetchAll();
        
        if (empty($cartItems)) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Cart is empty'
            ], 400);
        }
        
        // Calculate total amount and prepare booking details
        $totalAmount = 0.0;
        $bookingDetails = [];
        $serviceTypes = [];
        
        foreach ($cartItems as $item) {
            $serviceInfo = getServiceForCheckout($pdo, $item['service_id'], $item['service_type']);
            
            if (!$serviceInfo) {
                throw new Exception("Service not found or unavailable: {$item['service_type']} ID {$item['service_id']}");
            }
            
            $itemTotal = $serviceInfo['price'] * $item['quantity'];
            $totalAmount += $itemTotal;
            
            $bookingDetails[] = [
                'service_id' => (int)$item['service_id'],
                'service_type' => $item['service_type'],
                'service_name' => $serviceInfo['name'],
                'quantity' => (int)$item['quantity'],
                'unit_price' => (float)$serviceInfo['price'],
                'total_price' => $itemTotal,
                'details' => json_decode($item['details'], true) ?: [],
                'service_info' => $serviceInfo
            ];
            
            $serviceTypes[] = $item['service_type'];
        }
        
        // Determine service type for booking
        $uniqueServiceTypes = array_unique($serviceTypes);
        $mainServiceType = count($uniqueServiceTypes) === 1 ? $uniqueServiceTypes[0] : 'mixed';
        
        // Generate unique booking reference
        $bookingReference = 'BK' . date('Ymd') . sprintf('%06d', mt_rand(100000, 999999));
        
        // Ensure booking reference is unique
        $refCheckSql = "SELECT id FROM bookings WHERE booking_reference = ?";
        $refCheckStmt = $pdo->prepare($refCheckSql);
        $refCheckStmt->execute([$bookingReference]);
        
        if ($refCheckStmt->fetch()) {
            $bookingReference = 'BK' . date('YmdHis') . sprintf('%04d', mt_rand(1000, 9999));
        }
        
        // Insert booking
        $bookingSql = "INSERT INTO bookings 
                       (user_id, booking_reference, service_type, details, total_amount, 
                        payment_status, booking_status, booking_date, return_date, special_requests) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $bookingStmt = $pdo->prepare($bookingSql);
        $bookingStmt->execute([
            $userId,
            $bookingReference,
            $mainServiceType,
            json_encode($bookingDetails),
            $totalAmount,
            'pending',
            'pending',
            $bookingDate,
            $returnDate,
            $specialRequests
        ]);
        
        $bookingId = $pdo->lastInsertId();
        
        // Clear user's cart
        $clearCartSql = "DELETE FROM carts WHERE user_id = ?";
        $clearCartStmt = $pdo->prepare($clearCartSql);
        $clearCartStmt->execute([$userId]);
        
        // Commit transaction
        $pdo->commit();
        
        // Return success response
        sendJsonResponse([
            'success' => true,
            'message' => 'Booking created successfully',
            'booking_id' => (int)$bookingId,
            'booking_reference' => $bookingReference,
            'total_amount' => $totalAmount,
            'payment_instructions' => generatePaymentInstructions($paymentMethod, $totalAmount, $bookingReference),
            'booking_details' => [
                'booking_date' => $bookingDate,
                'return_date' => $returnDate,
                'special_requests' => $specialRequests,
                'items_count' => count($bookingDetails),
                'service_type' => $mainServiceType
            ]
        ]);
        
    } catch (Exception $e) {
        // Rollback transaction
        $pdo->rollback();
        throw $e;
    }
    
} catch (PDOException $e) {
    // Log the error
    logError("Checkout database error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Database error occurred during checkout'
    ], 500);
    
} catch (Exception $e) {
    // Log any other errors
    logError("Checkout error: " . $e->getMessage());
    
    // Return error response
    sendJsonResponse([
        'success' => false,
        'message' => $e->getMessage()
    ], 500);
}

/**
 * Get service information for checkout
 */
function getServiceForCheckout($pdo, $serviceId, $serviceType) {
    try {
        switch ($serviceType) {
            case 'hotel':
                $sql = "SELECT id, name, price_per_night as price FROM hotels WHERE id = ? AND status = 'active'";
                break;
            case 'flight':
                $sql = "SELECT id, CONCAT(airline, ' ', flight_number) as name, price FROM flights WHERE id = ? AND status = 'active'";
                break;
            case 'car':
                $sql = "SELECT id, CONCAT(make, ' ', model) as name, price_per_day as price FROM cars WHERE id = ? AND status = 'active' AND available = 1";
                break;
            case 'package':
                $sql = "SELECT id, name, price FROM packages WHERE id = ? AND status = 'active'";
                break;
            default:
                return null;
        }
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$serviceId]);
        $result = $stmt->fetch();
        
        return $result ? [
            'id' => (int)$result['id'],
            'name' => $result['name'],
            'price' => (float)$result['price']
        ] : null;
        
    } catch (Exception $e) {
        return null;
    }
}

/**
 * Generate payment instructions
 */
function generatePaymentInstructions($paymentMethod, $amount, $bookingReference) {
    $instructions = [
        'amount' => $amount,
        'booking_reference' => $bookingReference,
        'payment_method' => $paymentMethod,
        'instructions' => []
    ];
    
    switch ($paymentMethod) {
        case 'credit_card':
            $instructions['instructions'] = [
                'Please proceed to payment gateway',
                'Your booking will be confirmed upon successful payment',
                'Keep your booking reference for future communications'
            ];
            break;
            
        case 'bank_transfer':
            $instructions['instructions'] = [
                'Transfer amount to: AeroTrav Account',
                'Account Number: 1234567890',
                'Reference: ' . $bookingReference,
                'Send payment confirmation to: payments@aerotrav.com'
            ];
            break;
            
        default:
            $instructions['instructions'] = [
                'Payment is pending confirmation',
                'You will receive payment instructions via email',
                'Booking reference: ' . $bookingReference
            ];
    }
    
    return $instructions;
}
?> 