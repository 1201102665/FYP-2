<?php
/**
 * Enhanced Database Connection Class for AeroTrav
 * Comprehensive database operations and helper functions
 */

class AeroTravDB {
    private static $instance = null;
    private $pdo;
    private $config;

    private function __construct() {
        $this->config = [
            'host' => $_ENV['DB_HOST'] ?? 'localhost',
            'port' => $_ENV['DB_PORT'] ?? '3306',
            'dbname' => $_ENV['DB_NAME'] ?? 'aerotrav',
            'username' => $_ENV['DB_USERNAME'] ?? 'root',
            'password' => $_ENV['DB_PASSWORD'] ?? '',
            'charset' => 'utf8mb4'
        ];
        
        $this->connect();
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function connect() {
        try {
            $dsn = "mysql:host={$this->config['host']};port={$this->config['port']};dbname={$this->config['dbname']};charset={$this->config['charset']}";
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET sql_mode='STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO'"
            ];

            $this->pdo = new PDO($dsn, $this->config['username'], $this->config['password'], $options);
            
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed. Please try again later.");
        }
    }

    public function getPDO() {
        return $this->pdo;
    }

    // ===================================================================
    // USER MANAGEMENT FUNCTIONS
    // ===================================================================

    public function createUser($userData) {
        $sql = "INSERT INTO users (name, email, password, phone, role, status, created_at) 
                VALUES (:name, :email, :password, :phone, :role, :status, NOW())";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':name' => $userData['name'],
            ':email' => $userData['email'],
            ':password' => password_hash($userData['password'], PASSWORD_BCRYPT, ['cost' => 12]),
            ':phone' => $userData['phone'] ?? null,
            ':role' => $userData['role'] ?? 'user',
            ':status' => $userData['status'] ?? 'pending'
        ]);
    }

    public function getUserByEmail($email) {
        $sql = "SELECT * FROM users WHERE email = :email AND status != 'inactive'";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':email' => $email]);
        return $stmt->fetch();
    }

    public function getUserById($userId) {
        $sql = "SELECT * FROM users WHERE id = :id AND status != 'inactive'";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $userId]);
        return $stmt->fetch();
    }

    public function updateUserProfile($userId, $profileData) {
        $fields = [];
        $params = [':id' => $userId];
        
        foreach ($profileData as $key => $value) {
            if (in_array($key, ['name', 'phone', 'date_of_birth', 'gender', 'nationality', 'passport_number', 'preferred_language', 'preferred_currency'])) {
                $fields[] = "$key = :$key";
                $params[":$key"] = $value;
            }
        }
        
        if (empty($fields)) return false;
        
        $sql = "UPDATE users SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($params);
    }

    public function verifyPassword($email, $password) {
        $user = $this->getUserByEmail($email);
        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }
        return false;
    }

    // ===================================================================
    // SEARCH FUNCTIONS
    // ===================================================================

    public function searchFlights($criteria) {
        $sql = "SELECT f.*, 
                       al.name as airline_name, al.code as airline_code,
                       origin.name as origin_name, origin.city as origin_city,
                       dest.name as destination_name, dest.city as destination_city
                FROM flights f
                JOIN airlines al ON f.airline_id = al.id
                JOIN airports origin ON f.origin_airport_id = origin.id
                JOIN airports dest ON f.destination_airport_id = dest.id
                WHERE f.status = 'scheduled'";
        
        $params = [];
        
        if (!empty($criteria['origin'])) {
            $sql .= " AND (origin.iata_code = :origin OR origin.city LIKE :origin_city)";
            $params[':origin'] = $criteria['origin'];
            $params[':origin_city'] = '%' . $criteria['origin'] . '%';
        }
        
        if (!empty($criteria['destination'])) {
            $sql .= " AND (dest.iata_code = :destination OR dest.city LIKE :dest_city)";
            $params[':destination'] = $criteria['destination'];
            $params[':dest_city'] = '%' . $criteria['destination'] . '%';
        }
        
        if (!empty($criteria['departure_date'])) {
            $sql .= " AND DATE(f.departure_time) = :departure_date";
            $params[':departure_date'] = $criteria['departure_date'];
        }
        
        if (!empty($criteria['passengers'])) {
            $class = $criteria['class'] ?? 'economy';
            $sql .= " AND f.available_$class >= :passengers";
            $params[':passengers'] = $criteria['passengers'];
        }
        
        $sql .= " ORDER BY f.departure_time ASC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function searchHotels($criteria) {
        $sql = "SELECT h.*, 
                       AVG(r.overall_rating) as avg_rating,
                       COUNT(r.id) as review_count
                FROM hotels h
                LEFT JOIN reviews r ON h.id = r.item_id AND r.item_type = 'hotel' AND r.status = 'approved'
                WHERE h.status = 'active'";
        
        $params = [];
        
        if (!empty($criteria['city'])) {
            $sql .= " AND h.city LIKE :city";
            $params[':city'] = '%' . $criteria['city'] . '%';
        }
        
        if (!empty($criteria['country'])) {
            $sql .= " AND h.country LIKE :country";
            $params[':country'] = '%' . $criteria['country'] . '%';
        }
        
        if (!empty($criteria['category'])) {
            $sql .= " AND h.category = :category";
            $params[':category'] = $criteria['category'];
        }
        
        if (!empty($criteria['min_rating'])) {
            $sql .= " AND h.star_rating >= :min_rating";
            $params[':min_rating'] = $criteria['min_rating'];
        }
        
        $sql .= " GROUP BY h.id ORDER BY avg_rating DESC, h.star_rating DESC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function searchCars($criteria) {
        $sql = "SELECT * FROM cars WHERE status = 'available'";
        $params = [];
        
        if (!empty($criteria['location_city'])) {
            $sql .= " AND location_city LIKE :location_city";
            $params[':location_city'] = '%' . $criteria['location_city'] . '%';
        }
        
        if (!empty($criteria['category'])) {
            $sql .= " AND category = :category";
            $params[':category'] = $criteria['category'];
        }
        
        if (!empty($criteria['min_price'])) {
            $sql .= " AND daily_rate >= :min_price";
            $params[':min_price'] = $criteria['min_price'];
        }
        
        if (!empty($criteria['max_price'])) {
            $sql .= " AND daily_rate <= :max_price";
            $params[':max_price'] = $criteria['max_price'];
        }
        
        $sql .= " ORDER BY daily_rate ASC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function searchPackages($criteria) {
        $sql = "SELECT p.*, 
                       AVG(r.overall_rating) as avg_rating,
                       COUNT(r.id) as review_count
                FROM packages p
                LEFT JOIN reviews r ON p.id = r.item_id AND r.item_type = 'package' AND r.status = 'approved'
                WHERE p.status = 'active'";
        
        $params = [];
        
        if (!empty($criteria['destination'])) {
            $sql .= " AND (p.destination_city LIKE :destination OR p.destination_country LIKE :destination)";
            $params[':destination'] = '%' . $criteria['destination'] . '%';
        }
        
        if (!empty($criteria['category'])) {
            $sql .= " AND p.category = :category";
            $params[':category'] = $criteria['category'];
        }
        
        if (!empty($criteria['duration_min'])) {
            $sql .= " AND p.duration_days >= :duration_min";
            $params[':duration_min'] = $criteria['duration_min'];
        }
        
        if (!empty($criteria['duration_max'])) {
            $sql .= " AND p.duration_days <= :duration_max";
            $params[':duration_max'] = $criteria['duration_max'];
        }
        
        if (!empty($criteria['min_price'])) {
            $sql .= " AND p.base_price >= :min_price";
            $params[':min_price'] = $criteria['min_price'];
        }
        
        if (!empty($criteria['max_price'])) {
            $sql .= " AND p.base_price <= :max_price";
            $params[':max_price'] = $criteria['max_price'];
        }
        
        $sql .= " GROUP BY p.id ORDER BY p.featured DESC, avg_rating DESC, p.base_price ASC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    // ===================================================================
    // CART FUNCTIONS
    // ===================================================================

    public function addToCart($userId, $sessionId, $itemData) {
        $sql = "INSERT INTO cart_items (user_id, session_id, item_type, item_id, quantity, selected_options, price, created_at)
                VALUES (:user_id, :session_id, :item_type, :item_id, :quantity, :selected_options, :price, NOW())
                ON DUPLICATE KEY UPDATE 
                quantity = quantity + :quantity2,
                price = :price2,
                updated_at = NOW()";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':user_id' => $userId,
            ':session_id' => $sessionId,
            ':item_type' => $itemData['item_type'],
            ':item_id' => $itemData['item_id'],
            ':quantity' => $itemData['quantity'] ?? 1,
            ':quantity2' => $itemData['quantity'] ?? 1,
            ':selected_options' => json_encode($itemData['selected_options'] ?? []),
            ':price' => $itemData['price'],
            ':price2' => $itemData['price']
        ]);
    }

    public function getCartItems($userId, $sessionId) {
        $sql = "SELECT ci.*, 
                       CASE ci.item_type
                           WHEN 'flight' THEN (SELECT CONCAT(al.name, ' ', f.flight_number) FROM flights f JOIN airlines al ON f.airline_id = al.id WHERE f.id = ci.item_id)
                           WHEN 'hotel' THEN (SELECT h.name FROM hotels h WHERE h.id = ci.item_id)
                           WHEN 'car' THEN (SELECT CONCAT(c.make, ' ', c.model) FROM cars c WHERE c.id = ci.item_id)
                           WHEN 'package' THEN (SELECT p.name FROM packages p WHERE p.id = ci.item_id)
                       END as item_name
                FROM cart_items ci
                WHERE (ci.user_id = :user_id OR ci.session_id = :session_id)
                ORDER BY ci.created_at DESC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':user_id' => $userId, ':session_id' => $sessionId]);
        return $stmt->fetchAll();
    }

    public function removeFromCart($cartItemId, $userId = null, $sessionId = null) {
        $sql = "DELETE FROM cart_items WHERE id = :id";
        $params = [':id' => $cartItemId];
        
        if ($userId) {
            $sql .= " AND user_id = :user_id";
            $params[':user_id'] = $userId;
        } elseif ($sessionId) {
            $sql .= " AND session_id = :session_id";
            $params[':session_id'] = $sessionId;
        }
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($params);
    }

    public function clearCart($userId = null, $sessionId = null) {
        $sql = "DELETE FROM cart_items WHERE ";
        $params = [];
        
        if ($userId) {
            $sql .= "user_id = :user_id";
            $params[':user_id'] = $userId;
        } elseif ($sessionId) {
            $sql .= "session_id = :session_id";
            $params[':session_id'] = $sessionId;
        } else {
            return false;
        }
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($params);
    }

    // ===================================================================
    // BOOKING FUNCTIONS
    // ===================================================================

    public function createBooking($bookingData) {
        try {
            $this->pdo->beginTransaction();
            
            // Generate booking reference
            $bookingRef = $this->generateBookingReference();
            
            // Insert main booking
            $sql = "INSERT INTO bookings (
                        booking_reference, user_id, guest_email, guest_name, guest_phone,
                        total_amount, currency, status, payment_method, payment_reference,
                        travel_start_date, travel_end_date, travelers_count, special_requests,
                        created_at
                    ) VALUES (
                        :booking_reference, :user_id, :guest_email, :guest_name, :guest_phone,
                        :total_amount, :currency, :status, :payment_method, :payment_reference,
                        :travel_start_date, :travel_end_date, :travelers_count, :special_requests,
                        NOW()
                    )";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':booking_reference' => $bookingRef,
                ':user_id' => $bookingData['user_id'] ?? null,
                ':guest_email' => $bookingData['guest_email'],
                ':guest_name' => $bookingData['guest_name'],
                ':guest_phone' => $bookingData['guest_phone'] ?? null,
                ':total_amount' => $bookingData['total_amount'],
                ':currency' => $bookingData['currency'] ?? 'USD',
                ':status' => $bookingData['status'] ?? 'pending',
                ':payment_method' => $bookingData['payment_method'],
                ':payment_reference' => $bookingData['payment_reference'] ?? null,
                ':travel_start_date' => $bookingData['travel_start_date'] ?? null,
                ':travel_end_date' => $bookingData['travel_end_date'] ?? null,
                ':travelers_count' => $bookingData['travelers_count'] ?? 1,
                ':special_requests' => $bookingData['special_requests'] ?? null
            ]);
            
            $bookingId = $this->pdo->lastInsertId();
            
            // Insert booking items
            foreach ($bookingData['items'] as $item) {
                $this->addBookingItem($bookingId, $item);
            }
            
            $this->pdo->commit();
            
            return [
                'success' => true,
                'booking_id' => $bookingId,
                'booking_reference' => $bookingRef
            ];
            
        } catch (Exception $e) {
            $this->pdo->rollBack();
            error_log("Booking creation failed: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    private function addBookingItem($bookingId, $itemData) {
        $sql = "INSERT INTO booking_items (
                    booking_id, item_type, item_id, item_name, quantity,
                    unit_price, total_price, selected_options, status
                ) VALUES (
                    :booking_id, :item_type, :item_id, :item_name, :quantity,
                    :unit_price, :total_price, :selected_options, 'pending'
                )";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':booking_id' => $bookingId,
            ':item_type' => $itemData['item_type'],
            ':item_id' => $itemData['item_id'],
            ':item_name' => $itemData['item_name'],
            ':quantity' => $itemData['quantity'] ?? 1,
            ':unit_price' => $itemData['unit_price'],
            ':total_price' => $itemData['total_price'],
            ':selected_options' => json_encode($itemData['selected_options'] ?? [])
        ]);
        
        $bookingItemId = $this->pdo->lastInsertId();
        
        // Create specific booking records based on item type
        switch ($itemData['item_type']) {
            case 'flight':
                $this->createFlightBooking($bookingItemId, $itemData);
                break;
            case 'hotel':
                $this->createHotelBooking($bookingItemId, $itemData);
                break;
            case 'car':
                $this->createCarBooking($bookingItemId, $itemData);
                break;
            case 'package':
                $this->createPackageBooking($bookingItemId, $itemData);
                break;
        }
    }

    private function createFlightBooking($bookingItemId, $itemData) {
        $sql = "INSERT INTO flight_bookings (
                    booking_item_id, flight_id, passenger_name, passenger_email,
                    passenger_phone, seat_class, meal_preference, special_assistance,
                    passport_number, passport_expiry, status
                ) VALUES (
                    :booking_item_id, :flight_id, :passenger_name, :passenger_email,
                    :passenger_phone, :seat_class, :meal_preference, :special_assistance,
                    :passport_number, :passport_expiry, 'booked'
                )";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':booking_item_id' => $bookingItemId,
            ':flight_id' => $itemData['item_id'],
            ':passenger_name' => $itemData['passenger_name'],
            ':passenger_email' => $itemData['passenger_email'] ?? null,
            ':passenger_phone' => $itemData['passenger_phone'] ?? null,
            ':seat_class' => $itemData['seat_class'] ?? 'economy',
            ':meal_preference' => $itemData['meal_preference'] ?? null,
            ':special_assistance' => $itemData['special_assistance'] ?? null,
            ':passport_number' => $itemData['passport_number'] ?? null,
            ':passport_expiry' => $itemData['passport_expiry'] ?? null
        ]);
    }

    private function createHotelBooking($bookingItemId, $itemData) {
        $sql = "INSERT INTO hotel_bookings (
                    booking_item_id, hotel_id, room_id, check_in_date, check_out_date,
                    nights, rooms_count, adults_count, children_count, guest_name,
                    guest_email, guest_phone, special_requests, status
                ) VALUES (
                    :booking_item_id, :hotel_id, :room_id, :check_in_date, :check_out_date,
                    :nights, :rooms_count, :adults_count, :children_count, :guest_name,
                    :guest_email, :guest_phone, :special_requests, 'booked'
                )";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':booking_item_id' => $bookingItemId,
            ':hotel_id' => $itemData['item_id'],
            ':room_id' => $itemData['room_id'],
            ':check_in_date' => $itemData['check_in_date'],
            ':check_out_date' => $itemData['check_out_date'],
            ':nights' => $itemData['nights'],
            ':rooms_count' => $itemData['rooms_count'] ?? 1,
            ':adults_count' => $itemData['adults_count'] ?? 2,
            ':children_count' => $itemData['children_count'] ?? 0,
            ':guest_name' => $itemData['guest_name'],
            ':guest_email' => $itemData['guest_email'] ?? null,
            ':guest_phone' => $itemData['guest_phone'] ?? null,
            ':special_requests' => $itemData['special_requests'] ?? null
        ]);
    }

    private function createCarBooking($bookingItemId, $itemData) {
        $sql = "INSERT INTO car_bookings (
                    booking_item_id, car_id, pickup_date, return_date, rental_days,
                    pickup_location, return_location, driver_name, driver_email,
                    driver_phone, driver_license_number, driver_age, status
                ) VALUES (
                    :booking_item_id, :car_id, :pickup_date, :return_date, :rental_days,
                    :pickup_location, :return_location, :driver_name, :driver_email,
                    :driver_phone, :driver_license_number, :driver_age, 'booked'
                )";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':booking_item_id' => $bookingItemId,
            ':car_id' => $itemData['item_id'],
            ':pickup_date' => $itemData['pickup_date'],
            ':return_date' => $itemData['return_date'],
            ':rental_days' => $itemData['rental_days'],
            ':pickup_location' => $itemData['pickup_location'],
            ':return_location' => $itemData['return_location'],
            ':driver_name' => $itemData['driver_name'],
            ':driver_email' => $itemData['driver_email'] ?? null,
            ':driver_phone' => $itemData['driver_phone'] ?? null,
            ':driver_license_number' => $itemData['driver_license_number'],
            ':driver_age' => $itemData['driver_age']
        ]);
    }

    private function createPackageBooking($bookingItemId, $itemData) {
        $sql = "INSERT INTO package_bookings (
                    booking_item_id, package_id, start_date, end_date, travelers_count,
                    lead_traveler_name, lead_traveler_email, lead_traveler_phone,
                    travelers_details, special_requests, status
                ) VALUES (
                    :booking_item_id, :package_id, :start_date, :end_date, :travelers_count,
                    :lead_traveler_name, :lead_traveler_email, :lead_traveler_phone,
                    :travelers_details, :special_requests, 'booked'
                )";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':booking_item_id' => $bookingItemId,
            ':package_id' => $itemData['item_id'],
            ':start_date' => $itemData['start_date'],
            ':end_date' => $itemData['end_date'],
            ':travelers_count' => $itemData['travelers_count'],
            ':lead_traveler_name' => $itemData['lead_traveler_name'],
            ':lead_traveler_email' => $itemData['lead_traveler_email'] ?? null,
            ':lead_traveler_phone' => $itemData['lead_traveler_phone'] ?? null,
            ':travelers_details' => json_encode($itemData['travelers_details'] ?? []),
            ':special_requests' => $itemData['special_requests'] ?? null
        ]);
    }

    public function getBookingByReference($bookingReference) {
        $sql = "SELECT b.*, 
                       bi.item_type, bi.item_id, bi.item_name, bi.quantity, 
                       bi.unit_price, bi.total_price, bi.selected_options
                FROM bookings b
                LEFT JOIN booking_items bi ON b.id = bi.booking_id
                WHERE b.booking_reference = :booking_reference";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':booking_reference' => $bookingReference]);
        return $stmt->fetchAll();
    }

    public function getUserBookings($userId, $limit = 20, $offset = 0) {
        $sql = "SELECT * FROM bookings 
                WHERE user_id = :user_id 
                ORDER BY created_at DESC 
                LIMIT :limit OFFSET :offset";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // ===================================================================
    // REVIEW FUNCTIONS
    // ===================================================================

    public function addReview($reviewData) {
        $sql = "INSERT INTO reviews (
                    user_id, item_type, item_id, booking_id, overall_rating,
                    cleanliness_rating, service_rating, location_rating, value_rating,
                    title, comment, pros, cons, verified_stay, status, created_at
                ) VALUES (
                    :user_id, :item_type, :item_id, :booking_id, :overall_rating,
                    :cleanliness_rating, :service_rating, :location_rating, :value_rating,
                    :title, :comment, :pros, :cons, :verified_stay, 'pending', NOW()
                )";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':user_id' => $reviewData['user_id'],
            ':item_type' => $reviewData['item_type'],
            ':item_id' => $reviewData['item_id'],
            ':booking_id' => $reviewData['booking_id'] ?? null,
            ':overall_rating' => $reviewData['overall_rating'],
            ':cleanliness_rating' => $reviewData['cleanliness_rating'] ?? null,
            ':service_rating' => $reviewData['service_rating'] ?? null,
            ':location_rating' => $reviewData['location_rating'] ?? null,
            ':value_rating' => $reviewData['value_rating'] ?? null,
            ':title' => $reviewData['title'] ?? null,
            ':comment' => $reviewData['comment'] ?? null,
            ':pros' => $reviewData['pros'] ?? null,
            ':cons' => $reviewData['cons'] ?? null,
            ':verified_stay' => $reviewData['verified_stay'] ?? false
        ]);
    }

    public function getReviews($itemType, $itemId, $status = 'approved', $limit = 20, $offset = 0) {
        $sql = "SELECT r.*, u.name as user_name
                FROM reviews r
                JOIN users u ON r.user_id = u.id
                WHERE r.item_type = :item_type AND r.item_id = :item_id AND r.status = :status
                ORDER BY r.created_at DESC
                LIMIT :limit OFFSET :offset";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':item_type', $itemType);
        $stmt->bindValue(':item_id', $itemId, PDO::PARAM_INT);
        $stmt->bindValue(':status', $status);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // ===================================================================
    // UTILITY FUNCTIONS
    // ===================================================================

    public function generateBookingReference() {
        do {
            $reference = 'TRV' . strtoupper(bin2hex(random_bytes(4)));
            $exists = $this->checkBookingReferenceExists($reference);
        } while ($exists);
        
        return $reference;
    }

    private function checkBookingReferenceExists($reference) {
        $sql = "SELECT COUNT(*) FROM bookings WHERE booking_reference = :reference";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':reference' => $reference]);
        return $stmt->fetchColumn() > 0;
    }

    public function logSearchActivity($userId, $sessionId, $searchData) {
        $sql = "INSERT INTO search_logs (
                    user_id, session_id, search_type, search_query, 
                    filters_applied, results_count, ip_address, user_agent, created_at
                ) VALUES (
                    :user_id, :session_id, :search_type, :search_query,
                    :filters_applied, :results_count, :ip_address, :user_agent, NOW()
                )";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':user_id' => $userId,
            ':session_id' => $sessionId,
            ':search_type' => $searchData['search_type'],
            ':search_query' => json_encode($searchData['search_query']),
            ':filters_applied' => json_encode($searchData['filters_applied'] ?? []),
            ':results_count' => $searchData['results_count'] ?? 0,
            ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
            ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
        ]);
    }

    public function logUserActivity($userId, $sessionId, $activityType, $activityData = []) {
        $sql = "INSERT INTO user_activities (
                    user_id, session_id, activity_type, activity_data,
                    page_url, ip_address, user_agent, created_at
                ) VALUES (
                    :user_id, :session_id, :activity_type, :activity_data,
                    :page_url, :ip_address, :user_agent, NOW()
                )";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':user_id' => $userId,
            ':session_id' => $sessionId,
            ':activity_type' => $activityType,
            ':activity_data' => json_encode($activityData),
            ':page_url' => $_SERVER['REQUEST_URI'] ?? '',
            ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
            ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
        ]);
    }

    public function getPopularDestinations($limit = 10) {
        $sql = "SELECT destination_city, destination_country, COUNT(*) as search_count
                FROM search_logs 
                WHERE search_type IN ('packages', 'hotels') 
                AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                GROUP BY destination_city, destination_country
                ORDER BY search_count DESC
                LIMIT :limit";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getFeaturedPackages($limit = 6) {
        $sql = "SELECT p.*, AVG(r.overall_rating) as avg_rating, COUNT(r.id) as review_count
                FROM packages p
                LEFT JOIN reviews r ON p.id = r.item_id AND r.item_type = 'package' AND r.status = 'approved'
                WHERE p.status = 'active' AND p.featured = TRUE
                GROUP BY p.id
                ORDER BY avg_rating DESC, p.created_at DESC
                LIMIT :limit";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}

// ===================================================================
// GLOBAL HELPER FUNCTIONS
// ===================================================================

function getDB() {
    return AeroTravDB::getInstance();
}

function getCurrentUserId() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    return $_SESSION['user_id'] ?? null;
}

function getCurrentUser() {
    $userId = getCurrentUserId();
    if ($userId) {
        return getDB()->getUserById($userId);
    }
    return null;
}

function isLoggedIn() {
    return getCurrentUserId() !== null;
}

function requireLogin() {
    if (!isLoggedIn()) {
        sendJsonResponse(['error' => 'Authentication required'], 401);
        exit;
    }
}

function validateRequired($fields, $data) {
    $errors = [];
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim($data[$field]) === '') {
            $errors[] = "Field '$field' is required";
        }
    }
    return $errors;
}

function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function generateSessionId() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    return session_id();
}

// ===================================================================
// ERROR HANDLING AND LOGGING
// ===================================================================

// Enable error reporting in development
if ($_ENV['APP_ENV'] === 'development' || !isset($_ENV['APP_ENV'])) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

// Custom error handler
function handleError($errno, $errstr, $errfile, $errline) {
    $errorMessage = "Error [$errno]: $errstr in $errfile on line $errline";
    error_log($errorMessage);
    
    if ($_ENV['APP_ENV'] === 'development') {
        sendJsonResponse(['error' => 'Internal server error', 'debug' => $errorMessage], 500);
    } else {
        sendJsonResponse(['error' => 'Internal server error'], 500);
    }
}

set_error_handler('handleError');

// Initialize database connection
try {
    $db = getDB();
} catch (Exception $e) {
    error_log("Database initialization failed: " . $e->getMessage());
    sendJsonResponse(['error' => 'Service temporarily unavailable'], 503);
    exit;
}
?>
</rewritten_file>