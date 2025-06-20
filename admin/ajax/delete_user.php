<?php
/**
 * Admin AJAX: Delete User
 * Sets user status to 'suspended' instead of actual deletion using PDO
 */

// Enable error reporting in development
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../includes/auth.php';
require_once '../../includes/db_connection.php';

requireAdminLogin();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

$user_id = intval($_POST['user_id'] ?? 0);

if ($user_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid user ID']);
    exit();
}

try {
    $pdo = getPDO();
    
    // Check if user is an admin
    $checkStmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $checkStmt->execute([$user_id]);
    $user = $checkStmt->fetch();
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit();
    }
    
    if ($user['role'] === 'admin') {
        echo json_encode(['success' => false, 'message' => 'Cannot delete admin users']);
        exit();
    }
    
    // Instead of actually deleting, we'll set status to 'suspended'
    $stmt = $pdo->prepare("UPDATE users SET status = 'suspended', updated_at = NOW() WHERE id = ? AND role != 'admin'");
    $success = $stmt->execute([$user_id]);
    
    if ($success) {
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'User suspended successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found or is an admin']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
} catch (PDOException $e) {
    error_log("Database error in delete_user.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} catch (Exception $e) {
    error_log("Error in delete_user.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An unexpected error occurred']);
}
?> 