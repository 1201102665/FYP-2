<?php
require_once '../includes/auth.php';
requireAdminLogin();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

$rating_id = intval($_POST['rating_id'] ?? 0);

if ($rating_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid rating ID']);
    exit();
}

$db = getDB();

try {
    $stmt = $db->prepare("UPDATE ratings SET status = 'deleted' WHERE id = ?");
    $stmt->bind_param("i", $rating_id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Rating deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Rating not found']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?> 