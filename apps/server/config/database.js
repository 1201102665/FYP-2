import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aerotrav',
  port: process.env.DB_PORT || '3306',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
  dateStrings: true,
  charset: 'utf8mb4'
};

console.log('📊 Database config:', {
  host: config.host,
  user: config.user,
  database: config.database,
  port: config.port
});

// Create the connection pool
const pool = mysql.createPool(config);

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    // Test JSON functionality
    return connection.query('SELECT JSON_CONTAINS(\'["a", "b"]\', \'"a"\') as test')
      .then(([results]) => {
        console.log('✅ JSON functions working:', results[0].test === 1);
        connection.release();
      });
  })
  .catch(err => {
    console.error('❌ Error connecting to database:', err.message);
  });

// Helper functions for database operations
const db = {
  // Execute a query
  query: async (sql, values) => {
    try {
      const [results] = await pool.execute(sql, values);
      return results;
    } catch (error) {
      console.error('❌ Database query error:', {
        sql,
        values,
        error: error.message
      });
      throw error;
    }
  },

  // Execute a query and return a single row
  queryOne: async (sql, values) => {
    try {
      const [results] = await pool.execute(sql, values);
      return results[0];
    } catch (error) {
      console.error('❌ Database queryOne error:', {
        sql,
        values,
        error: error.message
      });
      throw error;
    }
  },

  // Get the connection pool
  getPool: () => pool
};

export default db; 