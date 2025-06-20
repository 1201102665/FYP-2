<?php
require_once 'includes/auth.php';
requireAdminLogin();

$db = getDB();

// Get pending users (for new users section)
$pendingUsersQuery = "SELECT id, name, email, created_at FROM users WHERE status = 'pending' ORDER BY created_at DESC LIMIT 8";
$pendingUsersResult = $db->query($pendingUsersQuery);
$pendingUsers = $pendingUsersResult->fetchAll();

// Count total pending users for +X display
$totalPendingQuery = "SELECT COUNT(*) as count FROM users WHERE status = 'pending'";
$totalPendingResult = $db->query($totalPendingQuery);
$totalPending = $totalPendingResult->fetch()['count'];

// Get pending bookings (for new bookings section) - only if bookings table exists
try {
    $pendingBookingsQuery = "
        SELECT b.id AS booking_id, b.user_id, u.name AS user_name, b.total_amount, b.created_at AS booking_date
        FROM bookings b 
        JOIN users u ON b.user_id = u.id 
        WHERE b.status = 'pending' 
        ORDER BY b.created_at DESC 
        LIMIT 5
    ";
    $pendingBookingsResult = $db->query($pendingBookingsQuery);
    $pendingBookings = $pendingBookingsResult->fetchAll();
} catch (Exception $e) {
    $pendingBookings = []; // Table doesn't exist yet
}

// Get pending ratings (for ratings section) - only if ratings table exists
try {
    $pendingRatingsQuery = "
        SELECT r.id AS rating_id, r.user_id, u.name AS user_name, r.package_id, p.name AS package_title, r.stars, r.comment
        FROM ratings r 
        JOIN users u ON r.user_id = u.id 
        JOIN packages p ON r.package_id = p.id 
        WHERE r.status = 'pending' 
        ORDER BY r.created_at DESC 
        LIMIT 6
    ";
    $pendingRatingsResult = $db->query($pendingRatingsQuery);
    $pendingRatings = $pendingRatingsResult->fetchAll();
} catch (Exception $e) {
    $pendingRatings = []; // Tables don't exist yet
}

$currentAdmin = getCurrentAdmin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - AeroTrav</title>
    <link rel="stylesheet" href="css/admin.css">
</head>
<body>
    <!-- Sidebar -->
    <div class="sidebar">
        <div class="logo-section">
            <div class="logo">TRV01</div>
        </div>
        
        <nav class="nav-menu">
            <a href="index.php" class="nav-item active">
                <span class="nav-icon">📊</span>
                Dashboard
            </a>
            <a href="users/index.php" class="nav-item">
                <span class="nav-icon">👥</span>
                Users
            </a>
            <a href="bookings/index.php" class="nav-item">
                <span class="nav-icon">📅</span>
                Bookings
            </a>
            <a href="content/index.php" class="nav-item">
                <span class="nav-icon">📝</span>
                Content
            </a>
            <a href="ratings/index.php" class="nav-item">
                <span class="nav-icon">⭐</span>
                Ratings
            </a>
        </nav>
        
        <div class="logout-section">
            <a href="logout.php" class="logout-btn">
                <span class="nav-icon">🚪</span>
                Logout
            </a>
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
        <div class="page-header">
            <h1 class="page-title">Admin Dashboard</h1>
            <p>Welcome back, <?= htmlspecialchars($currentAdmin['username']) ?>!</p>
        </div>

        <div class="dashboard-grid">
            <div class="dashboard-left">
                <!-- New Users Section -->
                <div class="new-users-section">
                    <h2 class="section-title">New Users</h2>
                    <div class="users-avatars">
                        <?php foreach (array_slice($pendingUsers, 0, 7) as $user): ?>
                            <div class="user-avatar" title="<?= htmlspecialchars($user['name']) ?> - <?= date('M j, Y', strtotime($user['created_at'])) ?>">
                                <?= strtoupper(substr($user['name'], 0, 2)) ?>
                            </div>
                        <?php endforeach; ?>
                        
                        <?php if ($totalPending > 7): ?>
                            <div class="user-avatar plus-count">
                                +<?= $totalPending - 7 ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($totalPending == 0): ?>
                            <p style="color: #666; font-style: italic;">No pending user registrations</p>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Manage Content Section -->
                <div class="manage-content-section">
                    <h2 class="section-title">Manage Content</h2>
                    <div class="content-buttons">
                        <a href="content/flights.php" class="content-btn">
                            <span class="content-icon">✈️</span>
                            Manage Flight
                        </a>
                        <a href="content/hotels.php" class="content-btn">
                            <span class="content-icon">🏨</span>
                            Manage Hotel
                        </a>
                        <a href="content/cars.php" class="content-btn">
                            <span class="content-icon">🚗</span>
                            Manage Car Rental
                        </a>
                        <a href="content/packages.php" class="content-btn">
                            <span class="content-icon">📦</span>
                            Manage Packages
                        </a>
                    </div>
                </div>
            </div>

            <!-- New Bookings Section -->
            <div class="dashboard-right">
                <div class="bookings-section">
                    <h3>New Bookings</h3>
                    <?php if (empty($pendingBookings)): ?>
                        <p style="color: #666; font-style: italic;">No pending bookings</p>
                    <?php else: ?>
                        <?php foreach ($pendingBookings as $booking): ?>
                            <div class="booking-item" data-booking-id="<?= $booking['booking_id'] ?>">
                                <div class="booking-info">
                                    <div class="booking-id">OD<?= str_pad($booking['booking_id'], 4, '0', STR_PAD_LEFT) ?></div>
                                    <div class="booking-customer"><?= htmlspecialchars($booking['user_name']) ?></div>
                                    <div class="booking-customer">U<?= $booking['user_id'] ?></div>
                                    <div class="booking-amount">Total Amount: $<?= number_format($booking['total_amount'], 2) ?></div>
                                </div>
                                <div class="booking-actions">
                                    <button onclick="viewBookingDetails(<?= $booking['booking_id'] ?>)" class="btn btn-outline">View Order Details</button>
                                    <button onclick="approveBooking(<?= $booking['booking_id'] ?>)" class="btn btn-primary">Approve</button>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Ratings Section -->
        <div class="ratings-section">
            <h2 class="section-title">Ratings</h2>
            <?php if (empty($pendingRatings)): ?>
                <p style="color: #666; font-style: italic;">No pending ratings</p>
            <?php else: ?>
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
                            <div class="review-text"><?= htmlspecialchars($rating['comment']) ?></div>
                            <div class="rating-actions">
                                <button onclick="approveRating(<?= $rating['rating_id'] ?>)" class="btn btn-success">Approve</button>
                                <button onclick="deleteRating(<?= $rating['rating_id'] ?>)" class="btn btn-danger">Delete</button>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <script src="js/admin.js"></script>
</body>
</html> 