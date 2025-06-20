<?php
require_once '../includes/auth.php';
requireAdminLogin();

$db = getDB();

// Initialize variables
$pendingBookings = [];
$allBookings = [];
$totalBookings = 0;
$totalPages = 1;
$page = intval($_GET['page'] ?? 1);
$limit = 20;
$offset = ($page - 1) * $limit;

try {
    // Get pending bookings
    $pendingBookingsQuery = "
        SELECT b.id AS booking_id, b.booking_reference, b.user_id, u.name AS user_name, b.user_email, 
               b.total_amount, b.payment_method, b.created_at AS booking_date
        FROM bookings b 
        JOIN users u ON b.user_id = u.id 
        WHERE b.status = 'pending' 
        ORDER BY b.created_at DESC
    ";
    $pendingBookingsResult = $db->query($pendingBookingsQuery);
    $pendingBookings = $pendingBookingsResult->fetchAll();

    // Get all bookings with pagination
    $allBookingsQuery = "
        SELECT b.id, b.booking_reference, u.name AS user_name, b.user_email, 
               b.total_amount, b.status, b.payment_method, b.created_at
        FROM bookings b 
        JOIN users u ON b.user_id = u.id 
        ORDER BY b.created_at DESC 
        LIMIT $limit OFFSET $offset
    ";
    $allBookingsResult = $db->query($allBookingsQuery);
    $allBookings = $allBookingsResult->fetchAll();

    // Get total bookings count for pagination
    $totalBookingsQuery = "SELECT COUNT(*) as count FROM bookings";
    $totalBookingsResult = $db->query($totalBookingsQuery);
    $totalBookings = $totalBookingsResult->fetch()['count'];
    $totalPages = ceil($totalBookings / $limit);
    
} catch (Exception $e) {
    // Bookings table doesn't exist yet - will show "No bookings found"
    error_log("Bookings table not found: " . $e->getMessage());
}

$currentAdmin = getCurrentAdmin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bookings Management - AeroTrav Admin</title>
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
            <a href="index.php" class="nav-item active">
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
            <h1 class="page-title">Bookings Management</h1>
            <p>Review and manage customer bookings and reservations.</p>
        </div>

        <!-- Pending Bookings Section -->
        <?php if (!empty($pendingBookings)): ?>
            <div class="new-users-section mb-20">
                <h2 class="section-title">Pending Bookings</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px;">
                    <?php foreach ($pendingBookings as $booking): ?>
                        <div class="rating-card" data-booking-id="<?= $booking['booking_id'] ?>">
                            <div class="reviewer-name">Booking #<?= htmlspecialchars($booking['booking_reference']) ?></div>
                            <div class="review-text">
                                <strong>Customer:</strong> <?= htmlspecialchars($booking['user_name']) ?><br>
                                <strong>Email:</strong> <?= htmlspecialchars($booking['user_email']) ?><br>
                                <strong>Amount:</strong> $<?= number_format($booking['total_amount'], 2) ?><br>
                                <strong>Payment:</strong> <?= ucfirst($booking['payment_method']) ?><br>
                                <strong>Date:</strong> <?= date('M j, Y g:i A', strtotime($booking['booking_date'])) ?>
                            </div>
                            <div class="rating-actions">
                                <button onclick="viewBookingDetails(<?= $booking['booking_id'] ?>)" class="btn btn-outline">View Details</button>
                                <button onclick="approveBooking(<?= $booking['booking_id'] ?>)" class="btn btn-success">Approve</button>
                                <button onclick="cancelBooking(<?= $booking['booking_id'] ?>)" class="btn btn-danger">Cancel</button>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- All Bookings Table -->
        <div class="form-container">
            <h2 class="section-title">All Bookings</h2>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Reference</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($allBookings)): ?>
                        <tr>
                            <td colspan="8" class="text-center">No bookings found</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($allBookings as $booking): ?>
                            <tr>
                                <td><?= htmlspecialchars($booking['booking_reference']) ?></td>
                                <td><?= htmlspecialchars($booking['user_name']) ?></td>
                                <td><?= htmlspecialchars($booking['user_email']) ?></td>
                                <td>$<?= number_format($booking['total_amount'], 2) ?></td>
                                <td><?= ucfirst($booking['payment_method']) ?></td>
                                <td>
                                    <span class="btn btn-<?= $booking['status'] === 'approved' ? 'success' : ($booking['status'] === 'pending' ? 'primary' : 'danger') ?>" style="font-size: 10px; padding: 4px 8px;">
                                        <?= ucfirst($booking['status']) ?>
                                    </span>
                                </td>
                                <td><?= date('M j, Y', strtotime($booking['created_at'])) ?></td>
                                <td>
                                    <button onclick="viewBookingDetails(<?= $booking['id'] ?>)" class="btn btn-outline" style="font-size: 10px; padding: 4px 8px;">View</button>
                                    <?php if ($booking['status'] === 'pending'): ?>
                                        <button onclick="approveBooking(<?= $booking['id'] ?>)" class="btn btn-success" style="font-size: 10px; padding: 4px 8px;">Approve</button>
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
</body>
</html> 