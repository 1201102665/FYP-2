import db from './config/database.js';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    console.log('Running migration to add booking columns...');
    
    const migrationPath = path.join(process.cwd(), '../../database/migrations/add_booking_columns.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the migration into individual statements
    const statements = migration.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim());
        await db.query(statement);
      }
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 