import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'dev',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

async function setupDatabase() {
  let connection;
  
  try {
    // Create connection without database selected
    connection = await mysql.createConnection(config);
    
    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS aerotrav_fyp');
    
    // Use the database
    await connection.query('USE aerotrav_fyp');
    
    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = schemaSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.includes('CREATE TABLE')) {
        try {
          await connection.query(statement + ';');
          console.log('✅ Created table:', statement.match(/CREATE TABLE `(\w+)`/)[1]);
        } catch (err) {
          if (err.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log('⚠️ Table already exists:', statement.match(/CREATE TABLE `(\w+)`/)[1]);
          } else {
            throw err;
          }
        }
      }
    }
    
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('✅ Database setup completed successfully');
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase(); 