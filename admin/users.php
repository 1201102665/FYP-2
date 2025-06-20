<?php
/**
 * ===================================================================
 * AeroTrav Admin Users Management Page
 * Displays all users with admin authentication and error handling
 * ===================================================================
 */

// Include database connection and helper functions
require_once '../includes/db_connection.php';

// Start session and check admin authentication
ensureSession();

// Check if user is logged in and is admin
if (!getCurrentUserId()) {
    header('Location: login.php?redirect=' . urlencode($_SERVER['REQUEST_URI']));
    exit();
}

if (!isAdmin()) {
    header('Location: ../index.html?error=access_denied');
    exit();
}

// Initialize variables
$users = [];
$error_message = '';
$success_message = '';
$total_users = 0;
$active_users = 0;
$pending_users = 0;
$suspended_users = 0;

try {
    // ===================================================================
    // DATABASE OPERATIONS
    // ===================================================================
    
    // Get database connection
    $pdo = getPDO();
    
    // Get user statistics
    $statsStmt = $pdo->prepare("
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended
        FROM users
    ");
    $statsStmt->execute();
    $stats = $statsStmt->fetch();
    
    $total_users = $stats['total'];
    $active_users = $stats['active'];
    $pending_users = $stats['pending'];
    $suspended_users = $stats['suspended'];
    
    // Get all users ordered by created_at DESC
    $usersStmt = $pdo->prepare("
        SELECT 
            id, 
            name, 
            email, 
            phone, 
            role, 
            status, 
            created_at, 
            updated_at
        FROM users 
        ORDER BY created_at DESC
    ");
    $usersStmt->execute();
    $users = $usersStmt->fetchAll();
    
    // Log admin activity
    logUserActivity('admin_view_users', [
        'total_users' => $total_users,
        'active_users' => $active_users
    ]);
    
} catch (PDOException $e) {
    error_log("Admin Users Page Database Error: " . $e->getMessage());
    $error_message = "Database error occurred while loading users. Please try again.";
    
} catch (Exception $e) {
    error_log("Admin Users Page Error: " . $e->getMessage());
    $error_message = "An unexpected error occurred. Please try again.";
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Users Management - AeroTrav Admin</title>
    <style>
        /* ===================================================================
         * ADMIN STYLES
         * Clean and modern styling for the admin interface
         * =================================================================== */
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: #2c3e50;
            color: white;
            padding: 1rem 2rem;
            margin-bottom: 2rem;
            border-radius: 8px;
        }
        
        .header h1 {
            margin-bottom: 0.5rem;
        }
        
        .breadcrumb {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9rem;
        }
        
        .stat-total { color: #3498db; }
        .stat-active { color: #27ae60; }
        .stat-pending { color: #f39c12; }
        .stat-suspended { color: #e74c3c; }
        
        .alert {
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
            border-left: 4px solid;
        }
        
        .alert-error {
            background-color: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }
        
        .alert-success {
            background-color: #d4edda;
            border-color: #28a745;
            color: #155724;
        }
        
        .table-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .table-header {
            background: #34495e;
            color: white;
            padding: 1rem;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #495057;
        }
        
        tr:hover {
            background-color: #f8f9fa;
        }
        
        .status-badge {
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .status-active {
            background-color: #d4edda;
            color: #155724;
        }
        
        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }
        
        .status-suspended {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .role-badge {
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .role-admin {
            background-color: #e1ecf4;
            color: #0c5460;
        }
        
        .role-user {
            background-color: #f0f0f0;
            color: #495057;
        }
        
        .no-data {
            text-align: center;
            padding: 3rem;
            color: #666;
        }
        
        .back-link {
            display: inline-block;
            background: #6c757d;
            color: white;
            padding: 0.5rem 1rem;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 2rem;
        }
        
        .back-link:hover {
            background: #5a6268;
        }
        
        .user-email {
            font-family: monospace;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Page Header -->
        <div class="header">
            <h1>Users Management</h1>
            <div class="breadcrumb">Admin Panel &gt; Users</div>
        </div>
        
        <!-- Error/Success Messages -->
        <?php if ($error_message): ?>
            <div class="alert alert-error">
                <strong>Error:</strong> <?= htmlspecialchars($error_message) ?>
            </div>
        <?php endif; ?>
        
        <?php if ($success_message): ?>
            <div class="alert alert-success">
                <strong>Success:</strong> <?= htmlspecialchars($success_message) ?>
            </div>
        <?php endif; ?>
        
        <!-- Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number stat-total"><?= number_format($total_users) ?></div>
                <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-number stat-active"><?= number_format($active_users) ?></div>
                <div class="stat-label">Active Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-number stat-pending"><?= number_format($pending_users) ?></div>
                <div class="stat-label">Pending Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-number stat-suspended"><?= number_format($suspended_users) ?></div>
                <div class="stat-label">Suspended Users</div>
            </div>
        </div>
        
        <!-- Users Table -->
        <div class="table-container">
            <div class="table-header">
                <h2>All Users</h2>
            </div>
            
            <?php if (empty($users) && empty($error_message)): ?>
                <div class="no-data">
                    <h3>No Users Found</h3>
                    <p>There are no users in the system yet.</p>
                </div>
            <?php elseif (!empty($users)): ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $user): ?>
                            <tr>
                                <td><?= htmlspecialchars($user['id']) ?></td>
                                <td><?= htmlspecialchars($user['name']) ?></td>
                                <td class="user-email"><?= htmlspecialchars($user['email']) ?></td>
                                <td><?= htmlspecialchars($user['phone'] ?: 'N/A') ?></td>
                                <td>
                                    <span class="role-badge role-<?= htmlspecialchars($user['role']) ?>">
                                        <?= ucfirst(htmlspecialchars($user['role'])) ?>
                                    </span>
                                </td>
                                <td>
                                    <span class="status-badge status-<?= htmlspecialchars($user['status']) ?>">
                                        <?= ucfirst(htmlspecialchars($user['status'])) ?>
                                    </span>
                                </td>
                                <td><?= date('M j, Y g:i A', strtotime($user['created_at'])) ?></td>
                                <td><?= date('M j, Y g:i A', strtotime($user['updated_at'])) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
        
        <!-- Navigation -->
        <a href="index.php" class="back-link">← Back to Admin Dashboard</a>
    </div>
    
    <script>
        /**
         * ===================================================================
         * ADMIN JAVASCRIPT
         * Basic functionality for the admin interface
         * ===================================================================
         */
        
        // Auto-refresh page every 30 seconds to show new users
        setTimeout(function() {
            location.reload();
        }, 30000);
        
        // Log page view
        console.log('AeroTrav Admin - Users page loaded');
        console.log('Total users displayed:', <?= count($users) ?>);
    </script>
</body>
</html> 