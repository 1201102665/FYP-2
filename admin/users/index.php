<?php
/**
 * Admin Users Management Page
 * Displays and manages all users with PDO connection
 */

// Enable error reporting in development
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../includes/auth.php';
require_once '../../includes/db_connection.php';

requireAdminLogin();

try {
    // Get PDO connection
    $pdo = DB::get();
    
    // Get pending users
    $pendingUsersStmt = $pdo->prepare("SELECT id, name, email, created_at FROM users WHERE status = 'pending' ORDER BY created_at DESC");
    $pendingUsersStmt->execute();
    $pendingUsers = $pendingUsersStmt->fetchAll();
    
    // Get all users with pagination
    $page = intval($_GET['page'] ?? 1);
    $limit = 20;
    $offset = ($page - 1) * $limit;
    
    $allUsersStmt = $pdo->prepare("
        SELECT id, name, email, phone, role, status, created_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT :limit OFFSET :offset
    ");
    $allUsersStmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $allUsersStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $allUsersStmt->execute();
    $allUsers = $allUsersStmt->fetchAll();
    
    // Get total users count for pagination
    $totalUsersStmt = $pdo->prepare("SELECT COUNT(*) as count FROM users");
    $totalUsersStmt->execute();
    $totalUsers = $totalUsersStmt->fetch()['count'];
    $totalPages = ceil($totalUsers / $limit);
    
    $currentAdmin = getCurrentAdmin();
    
} catch (PDOException $e) {
    error_log("Database error in admin users page: " . $e->getMessage());
    $pendingUsers = [];
    $allUsers = [];
    $totalUsers = 0;
    $totalPages = 1;
    $error_message = "Error loading users data. Please try again.";
} catch (Exception $e) {
    error_log("Error in admin users page: " . $e->getMessage());
    $pendingUsers = [];
    $allUsers = [];
    $totalUsers = 0;
    $totalPages = 1;
    $error_message = "An unexpected error occurred. Please try again.";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Users Management - AeroTrav Admin</title>
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="logo-section">
            <div class="logo">TRV01</div>
        </div>
        
        <nav class="nav-menu">
            <a href="../index.php" class="nav-item">
                <span class="nav-icon">📊</span>
                Dashboard
            </a>
            <a href="index.php" class="nav-item active">
                <span class="nav-icon">👥</span>
                Users
            </a>
            <a href="../bookings/index.php" class="nav-item">
                <span class="nav-icon">📅</span>
                Bookings
            </a>
            <a href="../content/index.php" class="nav-item">
                <span class="nav-icon">📝</span>
                Content
            </a>
            <a href="../ratings/index.php" class="nav-item">
                <span class="nav-icon">⭐</span>
                Ratings
            </a>
        </nav>
        
        <div class="logout-section">
            <a href="../logout.php" class="logout-btn">
                <span class="nav-icon">🚪</span>
                Logout
            </a>
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <div class="page-header">
            <h1 class="page-title">Users Management</h1>
        </div>

        <?php if (isset($error_message)): ?>
            <div style="background: #ff4444; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <strong>Error:</strong> <?= htmlspecialchars($error_message) ?>
            </div>
        <?php endif; ?>

        <!-- Pending Users Section -->
        <?php if (!empty($pendingUsers)): ?>
            <div class="new-users-section mb-20">
                <h2 class="section-title">Pending User Registrations</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <?php foreach ($pendingUsers as $user): ?>
                        <div class="rating-card" data-user-id="<?= $user['id'] ?>">
                            <div class="reviewer-name"><?= htmlspecialchars($user['name']) ?></div>
                            <div class="review-text">
                                Email: <?= htmlspecialchars($user['email']) ?><br>
                                Registered: <?= date('M j, Y g:i A', strtotime($user['created_at'])) ?>
                            </div>
                            <div class="rating-actions">
                                <button onclick="approveUser(<?= $user['id'] ?>)" class="btn btn-success">Approve</button>
                                <button onclick="deleteUser(<?= $user['id'] ?>)" class="btn btn-danger">Reject</button>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- All Users Table -->
        <div class="form-container">
            <h2 class="section-title">All Users</h2>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Registered</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($allUsers)): ?>
                        <tr>
                            <td colspan="8" class="text-center">No users found</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($allUsers as $user): ?>
                            <tr>
                                <td><?= $user['id'] ?></td>
                                <td><?= htmlspecialchars($user['name']) ?></td>
                                <td><?= htmlspecialchars($user['email']) ?></td>
                                <td><?= htmlspecialchars($user['phone'] ?? 'N/A') ?></td>
                                <td>
                                    <span class="btn btn-<?= $user['role'] === 'admin' ? 'danger' : 'outline' ?>" style="font-size: 10px; padding: 4px 8px;">
                                        <?= ucfirst($user['role']) ?>
                                    </span>
                                </td>
                                <td>
                                    <span class="btn btn-<?= $user['status'] === 'active' ? 'success' : ($user['status'] === 'pending' ? 'primary' : 'danger') ?>" style="font-size: 10px; padding: 4px 8px;">
                                        <?= ucfirst($user['status']) ?>
                                    </span>
                                </td>
                                <td><?= date('M j, Y', strtotime($user['created_at'])) ?></td>
                                <td>
                                    <a href="edit.php?id=<?= $user['id'] ?>" class="btn btn-outline">Edit</a>
                                    <?php if ($user['role'] !== 'admin'): ?>
                                        <button onclick="deleteUser(<?= $user['id'] ?>)" class="btn btn-danger">Delete</button>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>

            <!-- Pagination -->
            <?php if ($totalPages > 1): ?>
                <div style="margin-top: 20px; text-align: center;">
                    <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                        <a href="?page=<?= $i ?>" class="btn <?= $i === $page ? 'btn-primary' : 'btn-outline' ?>" style="margin: 0 2px;">
                            <?= $i ?>
                        </a>
                    <?php endfor; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <script src="../js/admin.js"></script>
    <script>
        function approveUser(userId) {
            if (!confirm('Are you sure you want to approve this user?')) {
                return;
            }
            
            fetch('../ajax/approve_user.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `user_id=${userId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('User approved successfully!', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    showToast('Error approving user: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Error approving user', 'error');
            });
        }

        function deleteUser(userId) {
            if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                return;
            }
            
            fetch('../ajax/delete_user.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `user_id=${userId}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast('User deleted successfully!', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    showToast('Error deleting user: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Error deleting user', 'error');
            });
        }
    </script>
</body>
</html> 