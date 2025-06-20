<?php
/**
 * ===================================================================
 * AeroTrav Centralized Database Connection
 * Provides centralized database access with error handling
 * ===================================================================
 */

// Enable error reporting for development
ini_set('display_errors', 1);
error_reporting(E_ALL);

/**
 * Database Connection Class
 * Singleton Pattern for efficient resource management
 */
class DB {
    
    // Private static PDO instance
    private static $pdo = null;
    
    /**
     * Get PDO connection instance
     * @return PDO
     */
    public static function get() {
        if (self::$pdo === null) {
            self::connect();
        }
        return self::$pdo;
    }
    
    /**
     * Establish database connection
     */
    private static function connect() {
        try {
            // Database connection parameters
            $dsn = 'mysql:host=127.0.0.1;dbname=aerotrav;charset=utf8mb4';
            $username = 'root';
            $password = '';
            
            // PDO options for security and performance
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_PERSISTENT => true // Add persistent connections
            ];
            
            // Create PDO connection
            self::$pdo = new PDO($dsn, $username, $password, $options);
            
            // Verify connection
            $result = self::$pdo->query('SELECT 1');
            if (!$result) {
                throw new PDOException('Database connection test failed');
            }
            
            error_log('Database connection established successfully');
            
        } catch (PDOException $e) {
            // Log detailed error information
            $errorMessage = sprintf(
                "Database connection failed: %s\nTrace: %s",
                $e->getMessage(),
                $e->getTraceAsString()
            );
            error_log($errorMessage);
            
            // Return JSON error response and stop execution
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed',
                'debug_message' => $e->getMessage() // Only in development
            ]);
            exit();
        }
    }
    
    /**
     * Prevent cloning
     */
    private function __clone() {}
    
    /**
     * Prevent unserialization
     */
    public function __wakeup() {}
}

/**
 * ===================================================================
 * UTILITY FUNCTIONS
 * ===================================================================
 */

/**
 * Send JSON response with appropriate headers
 * @param array $data Response data
 * @param int $statusCode HTTP status code
 */
function sendJsonResponse($data, $statusCode = 200) {
    // Clean any output buffer to ensure clean JSON response
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Get JSON input from request body
 * @return array|null Parsed JSON data or null if invalid
 */
function getJsonInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true);
}

/**
 * Validate required fields
 * @param array $required Required field names
 * @param array $data Input data
 * @return array Array of missing fields
 */
function validateRequired($required, $data) {
    $missing = [];
    foreach ($required as $field) {
        if (!isset($data[$field]) || trim($data[$field]) === '') {
            $missing[] = $field;
        }
    }
    return $missing;
}

/**
 * Start session if not already started
 */
function ensureSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

/**
 * Check if user is logged in
 * @return bool True if logged in, false otherwise
 */
function isLoggedIn() {
    ensureSession();
    return isset($_SESSION['user_id']);
}

/**
 * Check if user is admin
 * @return bool True if admin, false otherwise
 */
function isAdmin() {
    ensureSession();
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

/**
 * Get current user ID
 * @return int|null User ID or null if not logged in
 */
function getCurrentUserId() {
    ensureSession();
    return $_SESSION['user_id'] ?? null;
}

/**
 * Log error message
 * @param string $message Error message
 */
function logError($message) {
    $logDir = __DIR__ . '/../logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    error_log($message, 3, $logDir . '/error.log');
}

/**
 * ===================================================================
 * HELPER FUNCTIONS
 * Convenient functions for common database operations
 * ===================================================================
 */

/**
 * Hash password securely
 * @param string $password Plain text password
 * @return string Hashed password
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

/**
 * Verify password against hash
 * @param string $password Plain text password
 * @param string $hash Hashed password from database
 * @return bool True if password matches, false otherwise
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Require admin access or redirect/exit
 * @param string $redirectUrl URL to redirect to if not admin
 */
function requireAdmin($redirectUrl = null) {
    if (!isAdmin()) {
        if ($redirectUrl) {
            header("Location: $redirectUrl");
            exit();
        } else {
            sendJsonResponse(['error' => 'Admin access required'], 403);
        }
    }
}

/**
 * Log user activity (for audit trail)
 * @param string $action Action performed
 * @param array $details Additional details
 */
function logUserActivity($action, $details = []) {
    $userId = getCurrentUserId();
    $data = [
        'user_id' => $userId,
        'action' => $action,
        'details' => $details,
        'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    error_log("AeroTrav Activity: " . json_encode($data));
}

/**
 * ===================================================================
 * DATABASE TESTING FUNCTION
 * Test database connection and basic operations
 * ===================================================================
 */

/**
 * Test database connection and return status
 * @return array Test results
 */
function testDatabaseConnection() {
    try {
        $pdo = DB::get();
        
        // Test basic query
        $stmt = $pdo->query("SELECT VERSION() as version, NOW() as current_time");
        $result = $stmt->fetch();
        
        // Test users table access
        $stmt = $pdo->query("SELECT COUNT(*) as user_count FROM users");
        $userCount = $stmt->fetch()['user_count'];
        
        return [
            'success' => true,
            'mysql_version' => $result['version'],
            'current_time' => $result['current_time'],
            'user_count' => $userCount,
            'message' => 'Database connection successful'
        ];
        
    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => $e->getMessage(),
            'message' => 'Database connection failed'
        ];
    }
}

/**
 * ===================================================================
 * INITIALIZATION
 * Auto-test connection when file is included (development only)
 * ===================================================================
 */

// Only run auto-test in development mode
if (defined('AEROTRAV_DEBUG') && AEROTRAV_DEBUG === true) {
    $testResult = testDatabaseConnection();
    if (!$testResult['success']) {
        error_log("AeroTrav Database Test Failed: " . $testResult['error']);
    }
}

?> 
?>