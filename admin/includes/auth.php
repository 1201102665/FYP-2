<?php
session_start();
require_once 'db_connection.php';

// Check if admin is logged in
function isAdminLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

// Require admin login (redirect if not logged in)
function requireAdminLogin() {
    if (!isAdminLoggedIn()) {
        header('Location: /FYP2_AeroTrav/admin/login.php');
        exit();
    }
}

// Login admin
function loginAdmin($username, $password) {
    $db = getDB();
    
    $stmt = $db->prepare("SELECT id, username, password_hash FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();
    
    if ($admin) {
        // For demo purposes, we'll also accept plain text password "admin123"
        if (password_verify($password, $admin['password_hash']) || 
            ($password === 'admin123' && $admin['username'] === 'admin')) {
            
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            
            return true;
        }
    }
    
    return false;
}

// Logout admin
function logoutAdmin() {
    session_destroy();
    header('Location: /FYP2_AeroTrav/admin/login.php');
    exit();
}

// Get current admin info
function getCurrentAdmin() {
    if (isAdminLoggedIn()) {
        return [
            'id' => $_SESSION['admin_id'],
            'username' => $_SESSION['admin_username']
        ];
    }
    return null;
}
?> 