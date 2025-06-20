<?php
/**
 * Admin AJAX: Approve User
 * Updates user status from pending to active using PDO
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
    
    $stmt = $pdo->prepare("UPDATE users SET status = 'active', updated_at = NOW() WHERE id = ? AND status = 'pending'");
    $success = $stmt->execute([$user_id]);
    
    if ($success) {
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'User approved successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found or already approved']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
} catch (PDOException $e) {
    error_log("Database error in approve_user.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} catch (Exception $e) {
    error_log("Error in approve_user.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An unexpected error occurred']);
}
?> 