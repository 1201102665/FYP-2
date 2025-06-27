-- Create user_preferences table
CREATE TABLE IF NOT EXISTS `user_preferences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `preferred_activities` JSON DEFAULT NULL,
  `favorite_destinations` JSON DEFAULT NULL,
  `budget_range_min` decimal(10,2) DEFAULT 0.00,
  `budget_range_max` decimal(10,2) DEFAULT 5000.00,
  `travel_style` JSON DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for better query performance
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id); 