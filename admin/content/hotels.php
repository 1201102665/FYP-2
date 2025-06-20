<?php
require_once '../includes/auth.php';
requireAdminLogin();

$db = getDB();

// Handle form submission for adding/editing hotels
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $location = trim($_POST['location'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $price_per_night = floatval($_POST['price_per_night'] ?? 0);
    $rating = floatval($_POST['rating'] ?? 0);
    $available_rooms = intval($_POST['available_rooms'] ?? 0);
    $hotel_id = intval($_POST['hotel_id'] ?? 0);
    
    if ($hotel_id > 0) {
        // Update existing hotel
        $stmt = $db->prepare("UPDATE hotels SET name = ?, location = ?, description = ?, price_per_night = ?, rating = ?, available_rooms = ? WHERE id = ?");
        $stmt->bind_param("sssddii", $name, $location, $description, $price_per_night, $rating, $available_rooms, $hotel_id);
        $message = $stmt->execute() ? "Hotel updated successfully!" : "Error updating hotel.";
    } else {
        // Add new hotel
        $stmt = $db->prepare("INSERT INTO hotels (name, location, description, price_per_night, rating, available_rooms) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssddi", $name, $location, $description, $price_per_night, $rating, $available_rooms);
        $message = $stmt->execute() ? "Hotel added successfully!" : "Error adding hotel.";
    }
}

// Handle deletion
if (isset($_GET['delete'])) {
    $hotel_id = intval($_GET['delete']);
    $stmt = $db->prepare("DELETE FROM hotels WHERE id = ?");
    $stmt->bind_param("i", $hotel_id);
    $message = $stmt->execute() ? "Hotel deleted successfully!" : "Error deleting hotel.";
}

// Get hotel for editing
$editHotel = null;
if (isset($_GET['edit'])) {
    $edit_id = intval($_GET['edit']);
    $stmt = $db->prepare("SELECT * FROM hotels WHERE id = ?");
    $stmt->bind_param("i", $edit_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $editHotel = $result->fetch_assoc();
}

// Get all hotels
$hotelsQuery = "SELECT * FROM hotels ORDER BY created_at DESC";
$hotelsResult = $db->query($hotelsQuery);
$hotels = $hotelsResult->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Hotels - AeroTrav Admin</title>
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
            <h1 class="page-title">Manage Hotels</h1>
            <a href="index.php" style="color: #666; text-decoration: none;">← Back to Content Management</a>
        </div>

        <?php if (isset($message)): ?>
            <div class="<?= strpos($message, 'Error') === false ? 'success-message' : 'error-message' ?> mb-20">
                <?= htmlspecialchars($message) ?>
            </div>
        <?php endif; ?>

        <!-- Add/Edit Hotel Form -->
        <div class="form-container mb-20">
            <h2 class="section-title"><?= $editHotel ? 'Edit Hotel' : 'Add New Hotel' ?></h2>
            
            <form method="POST" action="">
                <?php if ($editHotel): ?>
                    <input type="hidden" name="hotel_id" value="<?= $editHotel['id'] ?>">
                <?php endif; ?>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="name">Hotel Name</label>
                        <input type="text" id="name" name="name" class="form-input" 
                               value="<?= htmlspecialchars($editHotel['name'] ?? '') ?>" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="location">Location</label>
                        <input type="text" id="location" name="location" class="form-input" 
                               value="<?= htmlspecialchars($editHotel['location'] ?? '') ?>" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="description">Description</label>
                    <textarea id="description" name="description" class="form-input" rows="3"><?= htmlspecialchars($editHotel['description'] ?? '') ?></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="price_per_night">Price per Night ($)</label>
                        <input type="number" step="0.01" id="price_per_night" name="price_per_night" class="form-input" 
                               value="<?= $editHotel['price_per_night'] ?? '' ?>" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="rating">Rating (1-5)</label>
                        <input type="number" step="0.1" min="1" max="5" id="rating" name="rating" class="form-input" 
                               value="<?= $editHotel['rating'] ?? '' ?>">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="available_rooms">Available Rooms</label>
                        <input type="number" id="available_rooms" name="available_rooms" class="form-input" 
                               value="<?= $editHotel['available_rooms'] ?? '' ?>" required>
                    </div>
                    <div class="form-group">
                        <!-- Empty for layout balance -->
                    </div>
                </div>
                
                <div class="form-actions">
                    <?php if ($editHotel): ?>
                        <a href="hotels.php" class="btn btn-outline">Cancel</a>
                    <?php endif; ?>
                    <button type="submit" class="btn btn-primary">
                        <?= $editHotel ? 'Update Hotel' : 'Add Hotel' ?>
                    </button>
                </div>
            </form>
        </div>

        <!-- Hotels Table -->
        <div class="form-container">
            <h2 class="section-title">All Hotels</h2>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Price/Night</th>
                        <th>Rating</th>
                        <th>Rooms</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($hotels)): ?>
                        <tr>
                            <td colspan="7" class="text-center">No hotels found</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($hotels as $hotel): ?>
                            <tr>
                                <td><?= htmlspecialchars($hotel['name']) ?></td>
                                <td><?= htmlspecialchars($hotel['location']) ?></td>
                                <td>$<?= number_format($hotel['price_per_night'], 2) ?></td>
                                <td><?= $hotel['rating'] ? number_format($hotel['rating'], 1) . ' ⭐' : 'N/A' ?></td>
                                <td><?= $hotel['available_rooms'] ?></td>
                                <td><?= date('M j, Y', strtotime($hotel['created_at'])) ?></td>
                                <td>
                                    <a href="?edit=<?= $hotel['id'] ?>" class="btn btn-outline">Edit</a>
                                    <a href="?delete=<?= $hotel['id'] ?>" class="btn btn-danger" 
                                       onclick="return confirm('Are you sure you want to delete this hotel?')">Delete</a>
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