<?php
/**
 * Admin Database Connection
 * 
 * DEPRECATED: This file now uses the shared PDO connection.
 * Please update your admin files to use: require_once '../../includes/db_connection.php';
 * and use getPDO() function instead of getDB().
 */

// Enable error reporting in development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include the new shared database connection
require_once __DIR__ . '/../../includes/db_connection.php';

// Legacy AdminDatabase class for backward compatibility
class AdminDatabase {
    private static $instance = null;
    private $conn;
    
    private function __construct() {
        // Get the PDO connection and wrap it
        $this->conn = DB::get();
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->conn;
    }
    
    // Legacy method - converts PDO to mysqli-like behavior
    public function query($sql) {
        try {
            $stmt = $this->conn->query($sql);
            return new PDOResultWrapper($stmt);
        } catch (PDOException $e) {
            error_log("Query error: " . $e->getMessage());
            return false;
        }
    }
    
    public function prepare($sql) {
        return $this->conn->prepare($sql);
    }
    
    public function escape($value) {
        // PDO doesn't need escaping - use prepared statements instead
        return addslashes($value);
    }
    
    public function getLastInsertId() {
        return $this->conn->lastInsertId();
    }
}

// Wrapper class to make PDO results work like mysqli results
class PDOResultWrapper {
    private $stmt;
    
    public function __construct($stmt) {
        $this->stmt = $stmt;
    }
    
    public function fetch_all($mode = null) {
        return $this->stmt->fetchAll();
    }
    
    public function fetch_assoc() {
        return $this->stmt->fetch();
    }
    
    public function num_rows() {
        return $this->stmt->rowCount();
    }
}

// Helper function to get database connection (for backward compatibility)
function getDB() {
    return AdminDatabase::getInstance()->getConnection();
}

// Helper function for admin authentication
// Note: getCurrentAdmin() is defined in auth.php
?> 