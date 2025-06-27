import db from './config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('Running all pending migrations...');
    
    // Create migrations table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get list of executed migrations
    const executedMigrations = await db.query('SELECT name FROM migrations');
    const executedMigrationNames = new Set(executedMigrations.map(m => m.name));

    // Get all migration files
    const migrationsDir = path.join(__dirname, '../../database/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // Ensure migrations run in order

    // Run pending migrations
    for (const migrationFile of migrationFiles) {
      if (!executedMigrationNames.has(migrationFile)) {
        console.log(`Running migration: ${migrationFile}`);
        
        const migrationPath = path.join(migrationsDir, migrationFile);
        const migration = fs.readFileSync(migrationPath, 'utf8');
        
        // Split the migration into individual statements
        const statements = migration.split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt);
        
        await db.transaction(async (connection) => {
          // Execute each statement
          for (const statement of statements) {
            console.log('Executing:', statement);
            await connection.query(statement);
          }
          
          // Record the migration
          await connection.query('INSERT INTO migrations (name) VALUES (?)', [migrationFile]);
        });
        
        console.log(`Migration ${migrationFile} completed successfully!`);
      }
    }
    
    console.log('All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations(); 