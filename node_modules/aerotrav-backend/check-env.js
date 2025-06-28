import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Required environment variables
const requiredEnvVars = [
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_DATABASE'
];

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\n📝 Please create a .env file with the following variables:');
  console.error(`
# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=aerotrav_fyp
`);
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set!\n');
  
  // Additional checks
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security');
  }
  
  if (!process.env.JWT_EXPIRES_IN.match(/^\d+[hdwmy]$/)) {
    console.warn('⚠️  WARNING: JWT_EXPIRES_IN should be in format: 7d, 24h, 1w, 1m, 1y');
  }
}

console.log('📊 Current configuration:');
console.log('- DB_HOST:', process.env.DB_HOST);
console.log('- DB_NAME:', process.env.DB_DATABASE);
console.log('- NODE_ENV:', process.env.NODE_ENV);

// Test database connection
import db from './config/database.js';

try {
  const connection = await db.getPool().getConnection();
  console.log('✅ Database connection successful');
  connection.release();
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
}

console.log('✅ Environment check complete'); 