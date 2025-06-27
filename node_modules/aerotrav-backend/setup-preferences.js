import db from './config/database.js';

async function setupPreferencesTable() {
  try {
    console.log('Setting up user_preferences table...');

    // Create the user_preferences table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        preferred_activities JSON DEFAULT NULL,
        favorite_destinations JSON DEFAULT NULL,
        budget_range_min DECIMAL(10,2) DEFAULT 0.00,
        budget_range_max DECIMAL(10,2) DEFAULT 5000.00,
        travel_style JSON DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY user_id (user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Add index if it doesn't exist
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id)
    `).catch(err => {
      // Ignore error if index already exists
      if (!err.message.includes('Duplicate key name')) {
        throw err;
      }
    });

    console.log('✅ User preferences table setup complete');
  } catch (error) {
    console.error('❌ Error setting up user_preferences table:', error);
    throw error;
  }
}

// Run the setup
setupPreferencesTable().catch(console.error); 