<?php
require_once '../includes/auth.php';
requireAdminLogin();

$db = getDB();

// Handle form submission for adding/editing flights
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $airline = trim($_POST['airline'] ?? '');
    $flight_number = trim($_POST['flight_number'] ?? '');
    $origin = trim($_POST['origin'] ?? '');
    $destination = trim($_POST['destination'] ?? '');
    $departure_time = $_POST['departure_time'] ?? '';
    $arrival_time = $_POST['arrival_time'] ?? '';
    $price = floatval($_POST['price'] ?? 0);
    $available_seats = intval($_POST['available_seats'] ?? 0);
    $flight_id = intval($_POST['flight_id'] ?? 0);
    
    if ($flight_id > 0) {
        // Update existing flight
        $stmt = $db->prepare("UPDATE flights SET airline = ?, flight_number = ?, origin = ?, destination = ?, departure_time = ?, arrival_time = ?, price = ?, available_seats = ? WHERE id = ?");
        $stmt->bind_param("ssssssdii", $airline, $flight_number, $origin, $destination, $departure_time, $arrival_time, $price, $available_seats, $flight_id);
        $message = $stmt->execute() ? "Flight updated successfully!" : "Error updating flight.";
    } else {
        // Add new flight
        $stmt = $db->prepare("INSERT INTO flights (airline, flight_number, origin, destination, departure_time, arrival_time, price, available_seats) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssdi", $airline, $flight_number, $origin, $destination, $departure_time, $arrival_time, $price, $available_seats);
        $message = $stmt->execute() ? "Flight added successfully!" : "Error adding flight.";
    }
}

// Handle deletion
if (isset($_GET['delete'])) {
    $flight_id = intval($_GET['delete']);
    $stmt = $db->prepare("DELETE FROM flights WHERE id = ?");
    $stmt->bind_param("i", $flight_id);
    $message = $stmt->execute() ? "Flight deleted successfully!" : "Error deleting flight.";
}

// Get flight for editing
$editFlight = null;
if (isset($_GET['edit'])) {
    $edit_id = intval($_GET['edit']);
    $stmt = $db->prepare("SELECT * FROM flights WHERE id = ?");
    $stmt->bind_param("i", $edit_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $editFlight = $result->fetch_assoc();
}

// Get all flights
$flightsQuery = "SELECT * FROM flights ORDER BY created_at DESC";
$flightsResult = $db->query($flightsQuery);
$flights = $flightsResult->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Flights - AeroTrav Admin</title>
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
            <h1 class="page-title">Manage Flights</h1>
            <a href="index.php" style="color: #666; text-decoration: none;">← Back to Content Management</a>
        </div>

        <?php if (isset($message)): ?>
            <div class="<?= strpos($message, 'Error') === false ? 'success-message' : 'error-message' ?> mb-20">
                <?= htmlspecialchars($message) ?>
            </div>
        <?php endif; ?>

        <!-- Add/Edit Flight Form -->
        <div class="form-container mb-20">
            <h2 class="section-title"><?= $editFlight ? 'Edit Flight' : 'Add New Flight' ?></h2>
            
            <form method="POST" action="">
                <?php if ($editFlight): ?>
                    <input type="hidden" name="flight_id" value="<?= $editFlight['id'] ?>">
                <?php endif; ?>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="airline">Airline</label>
                        <input type="text" id="airline" name="airline" class="form-input" 
                               value="<?= htmlspecialchars($editFlight['airline'] ?? '') ?>" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="flight_number">Flight Number</label>
                        <input type="text" id="flight_number" name="flight_number" class="form-input" 
                               value="<?= htmlspecialchars($editFlight['flight_number'] ?? '') ?>" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="origin">Origin</label>
                        <input type="text" id="origin" name="origin" class="form-input" 
                               value="<?= htmlspecialchars($editFlight['origin'] ?? '') ?>" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="destination">Destination</label>
                        <input type="text" id="destination" name="destination" class="form-input" 
                               value="<?= htmlspecialchars($editFlight['destination'] ?? '') ?>" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="departure_time">Departure Time</label>
                        <input type="datetime-local" id="departure_time" name="departure_time" class="form-input" 
                               value="<?= $editFlight ? date('Y-m-d\TH:i', strtotime($editFlight['departure_time'])) : '' ?>" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="arrival_time">Arrival Time</label>
                        <input type="datetime-local" id="arrival_time" name="arrival_time" class="form-input" 
                               value="<?= $editFlight ? date('Y-m-d\TH:i', strtotime($editFlight['arrival_time'])) : '' ?>" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="price">Price ($)</label>
                        <input type="number" step="0.01" id="price" name="price" class="form-input" 
                               value="<?= $editFlight['price'] ?? '' ?>" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="available_seats">Available Seats</label>
                        <input type="number" id="available_seats" name="available_seats" class="form-input" 
                               value="<?= $editFlight['available_seats'] ?? '' ?>" required>
                    </div>
                </div>
                
                <div class="form-actions">
                    <?php if ($editFlight): ?>
                        <a href="flights.php" class="btn btn-outline">Cancel</a>
                    <?php endif; ?>
                    <button type="submit" class="btn btn-primary">
                        <?= $editFlight ? 'Update Flight' : 'Add Flight' ?>
                    </button>
                </div>
            </form>
        </div>

        <!-- Flights Table -->
        <div class="form-container">
            <h2 class="section-title">All Flights</h2>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Flight Number</th>
                        <th>Airline</th>
                        <th>Route</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Price</th>
                        <th>Seats</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($flights)): ?>
                        <tr>
                            <td colspan="8" class="text-center">No flights found</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($flights as $flight): ?>
                            <tr>
                                <td><?= htmlspecialchars($flight['flight_number']) ?></td>
                                <td><?= htmlspecialchars($flight['airline']) ?></td>
                                <td><?= htmlspecialchars($flight['origin']) ?> → <?= htmlspecialchars($flight['destination']) ?></td>
                                <td><?= date('M j, Y g:i A', strtotime($flight['departure_time'])) ?></td>
                                <td><?= date('M j, Y g:i A', strtotime($flight['arrival_time'])) ?></td>
                                <td>$<?= number_format($flight['price'], 2) ?></td>
                                <td><?= $flight['available_seats'] ?></td>
                                <td>
                                    <a href="?edit=<?= $flight['id'] ?>" class="btn btn-outline">Edit</a>
                                    <a href="?delete=<?= $flight['id'] ?>" class="btn btn-danger" 
                                       onclick="return confirm('Are you sure you want to delete this flight?')">Delete</a>
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