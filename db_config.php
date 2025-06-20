<?php
/**
 * Legacy Database Configuration File
 * 
 * DEPRECATED: This file is now redirecting to the new shared PDO connection.
 * Please update your files to use: require_once 'includes/db_connection.php';
 * and use getPDO() function instead of $pdo variable.
 */

// Enable error reporting in development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include the new shared database connection
require_once 'includes/db_connection.php';

// For backward compatibility, create $pdo variable
$pdo = getPDO();

// All helper functions are now in includes/db_connection.php
// This file maintained for backward compatibility only
?> 