<?php
/**
 * ===================================================================
 * AeroTrav User Login Handler
 * Handles user authentication and session management
 * ===================================================================
 */

// Enable error reporting and include database connection
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once 'includes/db_connection.php';

// Set JSON response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

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
    // Get JSON input from request body
    $input = getJsonInput();
    
    if (!$input) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid JSON input'
        ], 400);
    }
    
    // Validate required fields
    $required = ['email', 'password'];
    $missing = validateRequired($required, $input);
    
    if (!empty($missing)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Missing required fields: ' . implode(', ', $missing)
        ], 400);
    }
    
    // Extract and sanitize input data
    $email = trim(strtolower($input['email']));
    $password = $input['password'];
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }
    
    // Get database connection
    $pdo = DB::get();
    
    // Query users table for matching email
    $sql = "SELECT id, name, email, password, role, status FROM users WHERE email = ? AND status = 'active'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]);
    
    $user = $stmt->fetch();
    
    // Check if user exists
    if (!$user) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }
    
    // Start session and set session variables
    session_start();
    $_SESSION['user_id'] = (int)$user['id'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    
    // Determine redirect URL based on role
    $redirectUrl = ($user['role'] === 'admin') ? 'admin/dashboard.php' : 'user/dashboard.php';
    
    // Return success response
    sendJsonResponse([
        'success' => true,
        'message' => 'Login successful',
        'redirect' => $redirectUrl,
        'user' => [
            'id' => (int)$user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ], 200);
    
} catch (PDOException $e) {
    // Log the error
    logError("Login database error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Server error'
    ], 500);
    
} catch (Exception $e) {
    // Log any other errors
    logError("Login error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Server error'
    ], 500);
}
?> 