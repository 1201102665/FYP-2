import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aerotrav',
  charset: 'utf8mb4',
  timezone: '+00:00',
  connectionLimit: 100,
  queueLimit: 0,
  dateStrings: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Database connection class
class Database {
  constructor() {
    this.pool = pool;
  }

  // Get a connection from the pool
  async getConnection() {
    try {
      return await this.pool.getConnection();
    } catch (error) {
      console.error('Error getting database connection:', error);
      throw error;
    }
  }

  // Execute a query
  async query(sql, params = []) {
    try {
      const [rows, fields] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      console.error('SQL:', sql);
      console.error('Params:', params);
      throw error;
    }
  }

  // Execute a query and return the first row
  async queryOne(sql, params = []) {
    try {
      const rows = await this.query(sql, params);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Begin transaction
  async beginTransaction() {
    const connection = await this.getConnection();
    await connection.beginTransaction();
    return connection;
  }

  // Commit transaction
  async commit(connection) {
    await connection.commit();
    connection.release();
  }

  // Rollback transaction
  async rollback(connection) {
    await connection.rollback();
    connection.release();
  }

  // Test database connection
  async testConnection() {
    try {
      const result = await this.query('SELECT 1 as test_connection');
      return result[0].test_connection === 1;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  // Get database statistics
  async getConnectionStats() {
    try {
      const stats = {
        total_connections: this.pool.config.connectionLimit,
        active_connections: this.pool._allConnections.length,
        idle_connections: this.pool._freeConnections.length,
        queued_requests: this.pool._connectionQueue.length
      };
      return stats;
    } catch (error) {
      console.error('Error getting connection stats:', error);
      return null;
    }
  }

  // Close all connections
  async closeAllConnections() {
    try {
      await this.pool.end();
      console.log('All database connections closed');
    } catch (error) {
      console.error('Error closing database connections:', error);
    }
  }
}

// Create and export database instance
const db = new Database();

// Test connection on startup
(async () => {
  try {
    const isConnected = await db.testConnection();
    if (isConnected) {
      console.log('✅ Database connection established successfully');
    } else {
      console.error('❌ Database connection test failed');
    }
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  }
})();

export default db; 