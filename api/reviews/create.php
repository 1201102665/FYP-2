<?php
/**
 * Create Review API Endpoint
 */

require_once '../../includes/enhanced_db_connection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

try {
    requireLogin();
    
    $db = getDB();
    $userId = getCurrentUserId();
    
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    
    $requiredFields = ['item_type', 'item_id', 'overall_rating'];
    $errors = validateRequired($requiredFields, $input);
    
    if (!empty($errors)) {
        sendJsonResponse(['error' => 'Missing required fields', 'details' => $errors], 400);
    }
    
    $reviewData = [
        'user_id' => $userId,
        'item_type' => sanitizeInput($input['item_type']),
        'item_id' => (int)$input['item_id'],
        'booking_id' => isset($input['booking_id']) ? (int)$input['booking_id'] : null,
        'overall_rating' => (float)$input['overall_rating'],
        'cleanliness_rating' => isset($input['cleanliness_rating']) ? (float)$input['cleanliness_rating'] : null,
        'service_rating' => isset($input['service_rating']) ? (float)$input['service_rating'] : null,
        'location_rating' => isset($input['location_rating']) ? (float)$input['location_rating'] : null,
        'value_rating' => isset($input['value_rating']) ? (float)$input['value_rating'] : null,
        'title' => isset($input['title']) ? sanitizeInput($input['title']) : null,
        'comment' => isset($input['comment']) ? sanitizeInput($input['comment']) : null,
        'pros' => isset($input['pros']) ? sanitizeInput($input['pros']) : null,
        'cons' => isset($input['cons']) ? sanitizeInput($input['cons']) : null,
        'verified_stay' => false // Set based on booking verification
    ];
    
    // Validate rating
    if ($reviewData['overall_rating'] < 1 || $reviewData['overall_rating'] > 5) {
        sendJsonResponse(['error' => 'Overall rating must be between 1 and 5'], 400);
    }
    
    // Validate item type
    $validTypes = ['flight', 'hotel', 'car', 'package'];
    if (!in_array($reviewData['item_type'], $validTypes)) {
        sendJsonResponse(['error' => 'Invalid item type'], 400);
    }
    
    // Check if user already reviewed this item
    $existingReview = $db->getPDO()->prepare("
        SELECT id FROM reviews 
        WHERE user_id = ? AND item_type = ? AND item_id = ? AND status != 'deleted'
    ");
    $existingReview->execute([$userId, $reviewData['item_type'], $reviewData['item_id']]);
    
    if ($existingReview->fetch()) {
        sendJsonResponse(['error' => 'You have already reviewed this item'], 409);
    }
    
    $success = $db->addReview($reviewData);
    
    if (!$success) {
        sendJsonResponse(['error' => 'Failed to submit review'], 500);
    }
    
    sendJsonResponse([
        'success' => true,
        'message' => 'Review submitted successfully and is pending approval',
        'review_data' => $reviewData
    ], 201);
    
} catch (Exception $e) {
    error_log("Review creation error: " . $e->getMessage());
    sendJsonResponse(['error' => 'Failed to submit review'], 500);
}
?> 