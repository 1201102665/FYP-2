import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '.env');
dotenv.config({ path: envPath });

// Required environment variables
const requiredVars = [
  'PORT',
  'DB_HOST',
  'DB_USER',
  'DB_NAME',
  'JWT_SECRET'
];

console.log('🔍 Checking environment configuration...');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('Creating default .env file...');
  
  const defaultEnv = `PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=aerotrav_fyp
DB_PORT=3306
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development`;

  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ Default .env file created');
  
  // Reload environment variables
  dotenv.config({ path: envPath });
}

// Check required variables
let missingVars = [];
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

console.log('✅ All required environment variables are set');
console.log('📊 Current configuration:');
console.log('- PORT:', process.env.PORT);
console.log('- DB_HOST:', process.env.DB_HOST);
console.log('- DB_NAME:', process.env.DB_NAME);
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