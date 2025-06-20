<?php
require_once '../includes/auth.php';
requireAdminLogin();

$db = getDB();

// Initialize variables
$pendingRatings = [];
$allRatings = [];

try {
    // Get pending ratings
    $pendingRatingsQuery = "
        SELECT r.id AS rating_id, r.user_id, u.name AS user_name, r.package_id, p.name AS package_title, r.stars, r.comment, r.created_at
        FROM ratings r 
        JOIN users u ON r.user_id = u.id 
        JOIN packages p ON r.package_id = p.id 
        WHERE r.status = 'pending' 
        ORDER BY r.created_at DESC
    ";
    $pendingRatingsResult = $db->query($pendingRatingsQuery);
    $pendingRatings = $pendingRatingsResult->fetchAll();

    // Get all ratings
    $allRatingsQuery = "
        SELECT r.id, u.name AS user_name, p.name AS package_title, r.stars, r.comment, r.status, r.created_at
        FROM ratings r 
        JOIN users u ON r.user_id = u.id 
        JOIN packages p ON r.package_id = p.id 
        ORDER BY r.created_at DESC
    ";
    $allRatingsResult = $db->query($allRatingsQuery);
    $allRatings = $allRatingsResult->fetchAll();
    
} catch (Exception $e) {
    // Ratings or packages table doesn't exist yet - will show "No ratings found"
    error_log("Ratings table not found: " . $e->getMessage());
}

$currentAdmin = getCurrentAdmin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ratings Management - AeroTrav Admin</title>
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
            <a href="../users/index.php" class="nav-item">
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
            <a href="index.php" class="nav-item active">
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
            <h1 class="page-title">Ratings Management</h1>
            <p>Review and moderate user ratings to maintain quality standards.</p>
        </div>

        <!-- Pending Ratings Section -->
        <?php if (!empty($pendingRatings)): ?>
            <div class="ratings-section mb-20">
                <h2 class="section-title">Pending Reviews</h2>
                <div class="ratings-grid">
                    <?php foreach ($pendingRatings as $rating): ?>
                        <div class="rating-card" data-rating-id="<?= $rating['rating_id'] ?>">
                            <div class="stars">
                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                    <span class="star <?= $i <= $rating['stars'] ? '' : 'empty' ?>">
                                        <?= $i <= $rating['stars'] ? '★' : '☆' ?>
                                    </span>
                                <?php endfor; ?>
                            </div>
                            <div class="reviewer-name"><?= htmlspecialchars($rating['user_name']) ?></div>
                            <div style="font-size: 12px; color: #888; margin-bottom: 8px;">
                                Package: <?= htmlspecialchars($rating['package_title']) ?><br>
                                Date: <?= date('M j, Y', strtotime($rating['created_at'])) ?>
                            </div>
                            <div class="review-text"><?= htmlspecialchars($rating['comment']) ?></div>
                            <div class="rating-actions">
                                <button onclick="approveRating(<?= $rating['rating_id'] ?>)" class="btn btn-success">Approve</button>
                                <button onclick="deleteRating(<?= $rating['rating_id'] ?>)" class="btn btn-danger">Delete</button>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- All Ratings Table -->
        <div class="form-container">
            <h2 class="section-title">All Reviews</h2>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Package</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($allRatings)): ?>
                        <tr>
                            <td colspan="7" class="text-center">No ratings found</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($allRatings as $rating): ?>
                            <tr>
                                <td><?= htmlspecialchars($rating['user_name']) ?></td>
                                <td><?= htmlspecialchars($rating['package_title']) ?></td>
                                <td>
                                    <div class="stars">
                                        <?php for ($i = 1; $i <= 5; $i++): ?>
                                            <span class="star <?= $i <= $rating['stars'] ? '' : 'empty' ?>" style="font-size: 14px;">
                                                <?= $i <= $rating['stars'] ? '★' : '☆' ?>
                                            </span>
                                        <?php endfor; ?>
                                    </div>
                                </td>
                                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                    <?= htmlspecialchars($rating['comment']) ?>
                                </td>
                                <td>
                                    <span class="btn btn-<?= $rating['status'] === 'approved' ? 'success' : ($rating['status'] === 'pending' ? 'primary' : 'danger') ?>" style="font-size: 10px; padding: 4px 8px;">
                                        <?= ucfirst($rating['status']) ?>
                                    </span>
                                </td>
                                <td><?= date('M j, Y', strtotime($rating['created_at'])) ?></td>
                                <td>
                                    <?php if ($rating['status'] === 'pending'): ?>
                                        <button onclick="approveRating(<?= $rating['id'] ?>)" class="btn btn-success" style="font-size: 10px; padding: 4px 8px;">Approve</button>
                                        <button onclick="deleteRating(<?= $rating['id'] ?>)" class="btn btn-danger" style="font-size: 10px; padding: 4px 8px;">Delete</button>
                                    <?php elseif ($rating['status'] === 'approved'): ?>
                                        <button onclick="deleteRating(<?= $rating['id'] ?>)" class="btn btn-danger" style="font-size: 10px; padding: 4px 8px;">Delete</button>
                                    <?php else: ?>
                                        <span style="color: #888; font-size: 12px;">Deleted</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="../js/admin.js"></script>
</body>
</html> 