-- Migration: Create reviews table for package ratings and reviews
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  package_id INT NOT NULL,
  rating INT NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  -- Optionally, add foreign keys if you want strict integrity:
  -- ,FOREIGN KEY (user_id) REFERENCES users(id)
  -- ,FOREIGN KEY (package_id) REFERENCES packages(id)
); 