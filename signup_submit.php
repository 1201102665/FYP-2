<?php
/**
 * ===================================================================
 * AeroTrav User Signup Handler
 * Handles user registration with validation and secure password hashing
 * ===================================================================
 */

// Suppress all output before JSON response
ob_start();

// Enable error reporting but log errors instead of displaying
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);
require_once 'includes/db_connection.php';

// Clean any output that might have been generated
ob_clean();

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

// Enable detailed error logging
error_log("=== SIGNUP DEBUG START ===");
error_log("Received POST data: " . print_r($_POST, true));
error_log("Received raw input: " . file_get_contents('php://input'));
error_log("Content-Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));

try {
    // Try to get JSON input first
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    
    // If JSON parsing failed, fallback to POST data
    if (json_last_error() !== JSON_ERROR_NONE) {
        $input = $_POST;
        error_log("JSON parsing failed, using POST data. JSON Error: " . json_last_error_msg());
    } else {
        error_log("Successfully parsed JSON input");
    }
    
    if (empty($input)) {
        error_log("No input data received");
        sendJsonResponse([
            'success' => false,
            'message' => 'No input data received'
        ], 400);
    }
    
    error_log("Final input data: " . print_r($input, true));
    
    // Validate required fields
    $required = ['name', 'email', 'password', 'phone'];
    $missing = validateRequired($required, $input);
    
    if (!empty($missing)) {
        error_log("Missing required fields: " . implode(', ', $missing));
        sendJsonResponse([
            'success' => false,
            'message' => 'Missing required fields: ' . implode(', ', $missing)
        ], 400);
    }
    
    // Extract and sanitize input data
    $name = trim($input['name']);
    $email = trim(strtolower($input['email']));
    $password = $input['password'];
    $phone = trim($input['phone']);
    
    error_log("Processing signup for email: $email");
    
    // Additional validation
    if (strlen($name) < 2) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Name must be at least 2 characters long'
        ], 400);
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid email format'
        ], 400);
    }
    
    if (strlen($password) < 6) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Password must be at least 6 characters long'
        ], 400);
    }
    
    if (strlen($phone) < 10) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Phone number must be at least 10 digits'
        ], 400);
    }
    
    error_log("All validation passed");
    
    // Hash the password using default algorithm
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    error_log("Password hashed successfully");
    
    // Get database connection
    try {
        $pdo = DB::get();
        error_log("Database connection obtained");
        
        // Test database connection
        $testQuery = $pdo->query("SELECT 1 as test");
        if (!$testQuery) {
            throw new Exception("Database connection test failed");
        }
        error_log("Database connection test passed");
        
        // Check if users table exists
        $tableCheck = $pdo->query("SHOW TABLES LIKE 'users'");
        if (!$tableCheck || $tableCheck->rowCount() === 0) {
            throw new Exception("Users table does not exist. Please run database_schema.sql");
        }
        error_log("Users table exists");
        
        // Check if email already exists
        $emailCheck = $pdo->prepare("SELECT COUNT(*) as count FROM users WHERE email = ?");
        $emailCheck->execute([$email]);
        $emailExists = $emailCheck->fetch()['count'] > 0;
        
        if ($emailExists) {
            error_log("Email already exists: $email");
            sendJsonResponse([
                'success' => false,
                'message' => 'Email already registered'
            ], 409);
        }
        
        error_log("Email is unique, proceeding with insert");
        
    } catch (Exception $e) {
        error_log("Database connection error: " . $e->getMessage());
        throw $e;
    }
    
    // Prepare INSERT statement
    $sql = "INSERT INTO users (name, email, password, phone, role, status) VALUES (?, ?, ?, ?, 'customer', 'active')";
    error_log("Preparing SQL: $sql");
    error_log("Parameters: name=$name, email=$email, phone=$phone");
    
    $stmt = $pdo->prepare($sql);
    
    if (!$stmt) {
        $errorInfo = $pdo->errorInfo();
        error_log("Failed to prepare statement. Error: " . print_r($errorInfo, true));
        throw new Exception("Failed to prepare SQL statement");
    }
    
    error_log("Statement prepared successfully");
    
    // Execute the statement
    $executeResult = $stmt->execute([$name, $email, $hashedPassword, $phone]);
    
    if (!$executeResult) {
        $errorInfo = $stmt->errorInfo();
        error_log("Failed to execute statement. Error: " . print_r($errorInfo, true));
        throw new Exception("Failed to execute SQL statement: " . $errorInfo[2]);
    }
    
    error_log("Statement executed successfully");
    
    // Get the new user ID
    $userId = $pdo->lastInsertId();
    error_log("New user ID: $userId");
    
    if (!$userId) {
        error_log("lastInsertId() returned empty value");
        throw new Exception("Failed to get new user ID");
    }
    
    // Verify the user was actually inserted
    $verifyStmt = $pdo->prepare("SELECT id, name, email FROM users WHERE id = ?");
    $verifyStmt->execute([$userId]);
    $insertedUser = $verifyStmt->fetch();
    
    if (!$insertedUser) {
        error_log("User verification failed - user not found in database");
        throw new Exception("User was not properly inserted into database");
    }
    
    error_log("User verification successful: " . print_r($insertedUser, true));
    error_log("=== SIGNUP SUCCESS ===");
    
    // Return success response
    sendJsonResponse([
        'success' => true,
        'message' => 'Registration successful',
        'user_id' => (int)$userId,
        'debug_info' => [
            'inserted_user' => $insertedUser,
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ], 201);
    
} catch (PDOException $e) {
    error_log("PDO Exception: " . $e->getMessage());
    error_log("PDO Error Code: " . $e->getCode());
    error_log("PDO Error Info: " . print_r($e->errorInfo ?? [], true));
    
    // Check for duplicate email (SQLSTATE 23000 is integrity constraint violation)
    if ($e->getCode() == 23000) {
        // Check if it's specifically a duplicate email
        if (strpos($e->getMessage(), 'email') !== false) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Email already registered'
            ], 409);
        }
    }
    
    // Log the error
    logError("Signup error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Database error occurred',
        'debug_message' => $e->getMessage() // Remove this in production
    ], 500);
    
} catch (Exception $e) {
    error_log("General Exception: " . $e->getMessage());
    error_log("Exception trace: " . $e->getTraceAsString());
    
    // Log any other errors
    logError("Signup error: " . $e->getMessage());
    
    // Return generic server error
    sendJsonResponse([
        'success' => false,
        'message' => 'Server error occurred',
        'debug_message' => $e->getMessage() // Remove this in production
    ], 500);
}
?>