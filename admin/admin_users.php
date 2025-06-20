<?php
/**
 * ===================================================================
 * AeroTrav Admin Users Management API
 * Handles user management operations for administrators
 * ===================================================================
 */

// Enable error reporting and include database connection
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../includes/db_connection.php';

// Set JSON response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Check if user is logged in and is admin
    if (!isLoggedIn() || !isAdmin()) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Admin access required'
        ], 403);
    }
    
    $method = $_SERVER['REQUEST_METHOD'];
    $pdo = DB::get();
    
    switch ($method) {
        case 'GET':
            handleGetUsers($pdo);
            break;
            
        case 'POST':
            handleCreateUser($pdo);
            break;
            
        case 'PUT':
            handleUpdateUser($pdo);
            break;
            
        case 'DELETE':
            handleDeleteUser($pdo);
            break;
            
        default:
            sendJsonResponse([
                'success' => false,
                'message' => 'Method not allowed'
            ], 405);
    }
    
} catch (Exception $e) {
    logError("Admin users error: " . $e->getMessage());
    sendJsonResponse([
        'success' => false,
        'message' => 'Server error occurred'
    ], 500);
}

/**
 * Handle GET request - List all users
 */
function handleGetUsers($pdo) {
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? 20);
    $search = $_GET['search'] ?? '';
    $status = $_GET['status'] ?? '';
    $role = $_GET['role'] ?? '';
    
    $offset = ($page - 1) * $limit;
    
    // Build WHERE clause
    $where = [];
    $values = [];
    
    if (!empty($search)) {
        $where[] = '(name LIKE ? OR email LIKE ? OR phone LIKE ?)';
        $searchTerm = '%' . $search . '%';
        $values[] = $searchTerm;
        $values[] = $searchTerm;
        $values[] = $searchTerm;
    }
    
    if (!empty($status)) {
        $where[] = 'status = ?';
        $values[] = $status;
    }
    
    if (!empty($role)) {
        $where[] = 'role = ?';
        $values[] = $role;
    }
    
    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
    
    // Get users
    $sql = "SELECT 
                id, name, email, phone, role, status, 
                created_at, updated_at
            FROM users 
            $whereClause 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?";
    
    $values[] = $limit;
    $values[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);
    $users = $stmt->fetchAll();
    
    // Get total count
    $countSql = "SELECT COUNT(*) as total FROM users $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute(array_slice($values, 0, -2));
    $totalCount = $countStmt->fetch()['total'];
    
    // Format users data
    $formattedUsers = [];
    foreach ($users as $user) {
        $formattedUsers[] = [
            'id' => (int)$user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'role' => $user['role'],
            'status' => $user['status'],
            'created_at' => $user['created_at'],
            'updated_at' => $user['updated_at']
        ];
    }
    
    sendJsonResponse([
        'success' => true,
        'data' => [
            'users' => $formattedUsers,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => (int)$totalCount,
                'total_pages' => ceil($totalCount / $limit)
            ]
        ]
    ]);
}

/**
 * Handle POST request - Create new user
 */
function handleCreateUser($pdo) {
    $input = getJsonInput();
    
    if (!$input) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid JSON input'
        ], 400);
    }
    
    $required = ['name', 'email', 'password'];
    $missing = validateRequired($required, $input);
    
    if (!empty($missing)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Missing required fields: ' . implode(', ', $missing)
        ], 400);
    }
    
    $name = trim($input['name']);
    $email = trim(strtolower($input['email']));
    $password = $input['password'];
    $phone = trim($input['phone'] ?? '');
    $role = $input['role'] ?? 'customer';
    $status = $input['status'] ?? 'active';
    
    // Validate role
    if (!in_array($role, ['customer', 'admin'])) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid role. Must be customer or admin'
        ], 400);
    }
    
    // Validate status
    if (!in_array($status, ['active', 'inactive', 'banned'])) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid status'
        ], 400);
    }
    
    try {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $sql = "INSERT INTO users (name, email, password, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $email, $hashedPassword, $phone, $role, $status]);
        
        $userId = $pdo->lastInsertId();
        
        sendJsonResponse([
            'success' => true,
            'message' => 'User created successfully',
            'user_id' => (int)$userId
        ], 201);
        
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Email already exists'
            ], 409);
        }
        throw $e;
    }
}

/**
 * Handle PUT request - Update user
 */
function handleUpdateUser($pdo) {
    $input = getJsonInput();
    
    if (!$input || !isset($input['user_id'])) {
        sendJsonResponse([
            'success' => false,
            'message' => 'User ID required'
        ], 400);
    }
    
    $userId = (int)$input['user_id'];
    $updates = [];
    $values = [];
    
    // Build dynamic update query
    if (isset($input['name'])) {
        $updates[] = 'name = ?';
        $values[] = trim($input['name']);
    }
    
    if (isset($input['email'])) {
        $updates[] = 'email = ?';
        $values[] = trim(strtolower($input['email']));
    }
    
    if (isset($input['phone'])) {
        $updates[] = 'phone = ?';
        $values[] = trim($input['phone']);
    }
    
    if (isset($input['role']) && in_array($input['role'], ['customer', 'admin'])) {
        $updates[] = 'role = ?';
        $values[] = $input['role'];
    }
    
    if (isset($input['status']) && in_array($input['status'], ['active', 'inactive', 'banned'])) {
        $updates[] = 'status = ?';
        $values[] = $input['status'];
    }
    
    if (isset($input['password']) && !empty($input['password'])) {
        $updates[] = 'password = ?';
        $values[] = password_hash($input['password'], PASSWORD_DEFAULT);
    }
    
    if (empty($updates)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'No valid fields to update'
        ], 400);
    }
    
    $updates[] = 'updated_at = CURRENT_TIMESTAMP';
    $values[] = $userId;
    
    $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);
    
    if ($stmt->rowCount() > 0) {
        sendJsonResponse([
            'success' => true,
            'message' => 'User updated successfully'
        ]);
    } else {
        sendJsonResponse([
            'success' => false,
            'message' => 'User not found or no changes made'
        ], 404);
    }
}

/**
 * Handle DELETE request - Delete user
 */
function handleDeleteUser($pdo) {
    $input = getJsonInput();
    
    if (!$input || !isset($input['user_id'])) {
        sendJsonResponse([
            'success' => false,
            'message' => 'User ID required'
        ], 400);
    }
    
    $userId = (int)$input['user_id'];
    
    // Check if user exists
    $checkSql = "SELECT id FROM users WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$userId]);
    
    if (!$checkStmt->fetch()) {
        sendJsonResponse([
            'success' => false,
            'message' => 'User not found'
        ], 404);
    }
    
    // Delete user (this will cascade to related records due to foreign keys)
    $sql = "DELETE FROM users WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    
    sendJsonResponse([
        'success' => true,
        'message' => 'User deleted successfully'
    ]);
}
?> 