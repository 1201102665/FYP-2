import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'dev',
  password: process.env.DB_PASSWORD || '12345678',
  database: process.env.DB_NAME || 'aerotrav-fyp', // Using hyphen instead of space
  port: process.env.DB_PORT || '3306',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
  dateStrings: true,
  charset: 'utf8mb4',
  namedPlaceholders: true
};

console.log('📊 Database config:', {
  host: config.host,
  user: config.user,
  database: config.database,
  port: config.port
});

// Create the connection pool
const pool = mysql.createPool(config);

// Helper function to get a connection from the pool
const getPool = () => pool;

// Helper function to execute a query
const query = async (sql, values = []) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(sql, values);
    return rows;
  } finally {
    connection.release();
  }
};

// Helper function to execute a single-row query
const queryOne = async (sql, values = []) => {
  const rows = await query(sql, values);
  return rows[0];
};

// Helper function to execute a transaction
const transaction = async (callback) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Test the connection and create database if it doesn't exist
const initializeDatabase = async () => {
  const rootConfig = { ...config };
  delete rootConfig.database; // Remove database from config to connect without selecting a database

  const tempPool = mysql.createPool(rootConfig);
  try {
    const connection = await tempPool.getConnection();
    await connection.query('CREATE DATABASE IF NOT EXISTS `aerotrav-fyp` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    await connection.query('USE `aerotrav-fyp`');
    
    // Create users table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        role ENUM('user', 'admin') DEFAULT 'user',
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ Database and users table initialized successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    await tempPool.end();
  }
};

// Initialize the database when this module is imported
initializeDatabase().catch(console.error);

export default {
  getPool,
  query,
  queryOne,
  transaction
}; 