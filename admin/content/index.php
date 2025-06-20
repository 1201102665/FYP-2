<?php
require_once '../includes/auth.php';
requireAdminLogin();

$currentAdmin = getCurrentAdmin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Management - AeroTrav Admin</title>
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
            <a href="index.php" class="nav-item active">
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
            <h1 class="page-title">Content Management</h1>
            <p>Manage all travel content including flights, hotels, car rentals, and packages.</p>
        </div>

        <div class="manage-content-section" style="margin-top: 0; max-width: 800px;">
            <div class="content-buttons">
                <a href="flights.php" class="content-btn">
                    <span class="content-icon">✈️</span>
                    <div>
                        <div style="font-size: 18px; font-weight: 600;">Manage Flight</div>
                        <div style="font-size: 14px; color: #666; margin-top: 4px;">Add, edit, and manage flight listings</div>
                    </div>
                </a>
                <a href="hotels.php" class="content-btn">
                    <span class="content-icon">🏨</span>
                    <div>
                        <div style="font-size: 18px; font-weight: 600;">Manage Hotel</div>
                        <div style="font-size: 14px; color: #666; margin-top: 4px;">Add, edit, and manage hotel listings</div>
                    </div>
                </a>
                <a href="cars.php" class="content-btn">
                    <span class="content-icon">🚗</span>
                    <div>
                        <div style="font-size: 18px; font-weight: 600;">Manage Car Rental</div>
                        <div style="font-size: 14px; color: #666; margin-top: 4px;">Add, edit, and manage car rental options</div>
                    </div>
                </a>
                <a href="packages.php" class="content-btn">
                    <span class="content-icon">📦</span>
                    <div>
                        <div style="font-size: 18px; font-weight: 600;">Manage Packages</div>
                        <div style="font-size: 14px; color: #666; margin-top: 4px;">Create and manage travel packages</div>
                    </div>
                </a>
            </div>
        </div>
    </div>

    <script src="../js/admin.js"></script>
</body>
</html> 