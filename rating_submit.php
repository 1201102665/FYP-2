<?php
/**
 * Rating Submission Handler
 * Processes user ratings and reviews
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
$requiredFields = ['package_id', 'stars'];
$errors = validateRequired($requiredFields, $_POST);

if (!empty($errors)) {
    sendJsonResponse(['error' => 'Missing required fields', 'details' => $errors], 400);
}

// Get current user ID - must be logged in to submit rating
$userId = getCurrentUserId();
if (!$userId) {
    sendJsonResponse(['error' => 'You must be logged in to submit a rating'], 401);
}

// Sanitize and validate input
$packageId = (int)$_POST['package_id'];
$stars = (int)$_POST['stars'];
$comment = isset($_POST['comment']) ? trim($_POST['comment']) : '';

// Validate star rating
if ($stars < 1 || $stars > 5) {
    sendJsonResponse(['error' => 'Stars rating must be between 1 and 5'], 400);
}

// Validate package exists
try {
    $packageStmt = $pdo->prepare("SELECT id FROM packages WHERE id = ?");
    $packageStmt->execute([$packageId]);
    
    if (!$packageStmt->fetch()) {
        sendJsonResponse(['error' => 'Package not found'], 404);
    }
    
    // Check if user has already rated this package
    $existingRatingStmt = $pdo->prepare("
        SELECT id FROM ratings 
        WHERE user_id = ? AND package_id = ? AND status != 'deleted'
    ");
    $existingRatingStmt->execute([$userId, $packageId]);
    
    if ($existingRatingStmt->fetch()) {
        sendJsonResponse(['error' => 'You have already rated this package'], 409);
    }
    
    // Optional: Check if user has actually booked this package
    // This is commented out as it might be too restrictive for some use cases
    /*
    $bookingStmt = $pdo->prepare("
        SELECT b.id FROM bookings b
        JOIN booking_items bi ON b.id = bi.booking_id
        WHERE b.user_id = ? AND bi.item_type = 'package' AND bi.item_id = ?
        AND b.status = 'completed'
    ");
    $bookingStmt->execute([$userId, $packageId]);
    
    if (!$bookingStmt->fetch()) {
        sendJsonResponse(['error' => 'You can only rate packages you have booked'], 403);
    }
    */
    
    // Insert the rating with default pending status
    $ratingStmt = $pdo->prepare("
        INSERT INTO ratings (user_id, package_id, stars, comment, status, created_at)
        VALUES (?, ?, ?, ?, 'pending', NOW())
    ");
    
    $ratingStmt->execute([$userId, $packageId, $stars, $comment]);
    
    $ratingId = $pdo->lastInsertId();
    
    sendJsonResponse([
        'success' => true,
        'message' => 'Rating submitted successfully and is pending approval',
        'rating_id' => $ratingId,
        'package_id' => $packageId,
        'stars' => $stars,
        'comment' => $comment,
        'status' => 'pending'
    ], 201);
    
} catch (PDOException $e) {
    error_log("Rating submission error: " . $e->getMessage());
    sendJsonResponse(['error' => 'Failed to submit rating. Please try again.'], 500);
}
?> 