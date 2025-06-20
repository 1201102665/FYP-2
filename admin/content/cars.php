<?php
require_once '../includes/auth.php';
requireAdminLogin();

$db = getDB();

// Handle form submission for adding/editing car rentals
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $company_name = trim($_POST['company_name'] ?? '');
    $model = trim($_POST['model'] ?? '');
    $type = trim($_POST['type'] ?? '');
    $daily_rate = floatval($_POST['daily_rate'] ?? 0);
    $availability_status = $_POST['availability_status'] ?? 'available';
    $car_id = intval($_POST['car_id'] ?? 0);
    
    if ($car_id > 0) {
        // Update existing car rental
        $stmt = $db->prepare("UPDATE car_rentals SET company_name = ?, model = ?, type = ?, daily_rate = ?, availability_status = ? WHERE id = ?");
        $stmt->bind_param("sssdsi", $company_name, $model, $type, $daily_rate, $availability_status, $car_id);
        $message = $stmt->execute() ? "Car rental updated successfully!" : "Error updating car rental.";
    } else {
        // Add new car rental
        $stmt = $db->prepare("INSERT INTO car_rentals (company_name, model, type, daily_rate, availability_status) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssds", $company_name, $model, $type, $daily_rate, $availability_status);
        $message = $stmt->execute() ? "Car rental added successfully!" : "Error adding car rental.";
    }
}

// Handle deletion
if (isset($_GET['delete'])) {
    $car_id = intval($_GET['delete']);
    $stmt = $db->prepare("DELETE FROM car_rentals WHERE id = ?");
    $stmt->bind_param("i", $car_id);
    $message = $stmt->execute() ? "Car rental deleted successfully!" : "Error deleting car rental.";
}

// Get car rental for editing
$editCar = null;
if (isset($_GET['edit'])) {
    $edit_id = intval($_GET['edit']);
    $stmt = $db->prepare("SELECT * FROM car_rentals WHERE id = ?");
    $stmt->bind_param("i", $edit_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $editCar = $result->fetch_assoc();
}

// Get all car rentals
$carsQuery = "SELECT * FROM car_rentals ORDER BY created_at DESC";
$carsResult = $db->query($carsQuery);
$cars = $carsResult->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Car Rentals - AeroTrav Admin</title>
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
            <h1 class="page-title">Manage Car Rentals</h1>
            <a href="index.php" style="color: #666; text-decoration: none;">← Back to Content Management</a>
        </div>

        <?php if (isset($message)): ?>
            <div class="<?= strpos($message, 'Error') === false ? 'success-message' : 'error-message' ?> mb-20">
                <?= htmlspecialchars($message) ?>
            </div>
        <?php endif; ?>

        <!-- Add/Edit Car Rental Form -->
        <div class="form-container mb-20">
            <h2 class="section-title"><?= $editCar ? 'Edit Car Rental' : 'Add New Car Rental' ?></h2>
            
            <form method="POST" action="">
                <?php if ($editCar): ?>
                    <input type="hidden" name="car_id" value="<?= $editCar['id'] ?>">
                <?php endif; ?>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="company_name">Company Name</label>
                        <input type="text" id="company_name" name="company_name" class="form-input" 
                               value="<?= htmlspecialchars($editCar['company_name'] ?? '') ?>" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="model">Model</label>
                        <input type="text" id="model" name="model" class="form-input" 
                               value="<?= htmlspecialchars($editCar['model'] ?? '') ?>" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="type">Type</label>
                        <select id="type" name="type" class="form-input" required>
                            <option value="">Select Type</option>
                            <option value="Sedan" <?= ($editCar['type'] ?? '') === 'Sedan' ? 'selected' : '' ?>>Sedan</option>
                            <option value="SUV" <?= ($editCar['type'] ?? '') === 'SUV' ? 'selected' : '' ?>>SUV</option>
                            <option value="Compact" <?= ($editCar['type'] ?? '') === 'Compact' ? 'selected' : '' ?>>Compact</option>
                            <option value="Luxury" <?= ($editCar['type'] ?? '') === 'Luxury' ? 'selected' : '' ?>>Luxury</option>
                            <option value="Convertible" <?= ($editCar['type'] ?? '') === 'Convertible' ? 'selected' : '' ?>>Convertible</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="daily_rate">Daily Rate ($)</label>
                        <input type="number" step="0.01" id="daily_rate" name="daily_rate" class="form-input" 
                               value="<?= $editCar['daily_rate'] ?? '' ?>" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="availability_status">Availability Status</label>
                        <select id="availability_status" name="availability_status" class="form-input" required>
                            <option value="available" <?= ($editCar['availability_status'] ?? '') === 'available' ? 'selected' : '' ?>>Available</option>
                            <option value="unavailable" <?= ($editCar['availability_status'] ?? '') === 'unavailable' ? 'selected' : '' ?>>Unavailable</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <!-- Empty for layout balance -->
                    </div>
                </div>
                
                <div class="form-actions">
                    <?php if ($editCar): ?>
                        <a href="cars.php" class="btn btn-outline">Cancel</a>
                    <?php endif; ?>
                    <button type="submit" class="btn btn-primary">
                        <?= $editCar ? 'Update Car Rental' : 'Add Car Rental' ?>
                    </button>
                </div>
            </form>
        </div>

        <!-- Car Rentals Table -->
        <div class="form-container">
            <h2 class="section-title">All Car Rentals</h2>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Model</th>
                        <th>Type</th>
                        <th>Daily Rate</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($cars)): ?>
                        <tr>
                            <td colspan="7" class="text-center">No car rentals found</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($cars as $car): ?>
                            <tr>
                                <td><?= htmlspecialchars($car['company_name']) ?></td>
                                <td><?= htmlspecialchars($car['model']) ?></td>
                                <td><?= htmlspecialchars($car['type']) ?></td>
                                <td>$<?= number_format($car['daily_rate'], 2) ?></td>
                                <td>
                                    <span class="btn btn-<?= $car['availability_status'] === 'available' ? 'success' : 'danger' ?>" style="font-size: 10px; padding: 4px 8px;">
                                        <?= ucfirst($car['availability_status']) ?>
                                    </span>
                                </td>
                                <td><?= date('M j, Y', strtotime($car['created_at'])) ?></td>
                                <td>
                                    <a href="?edit=<?= $car['id'] ?>" class="btn btn-outline">Edit</a>
                                    <a href="?delete=<?= $car['id'] ?>" class="btn btn-danger" 
                                       onclick="return confirm('Are you sure you want to delete this car rental?')">Delete</a>
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