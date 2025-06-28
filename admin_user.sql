-- Add Admin User to AeroTrav Database
-- Email: aeroadmin@trav.com  
-- Password: aero1234 (hashed with bcrypt)

-- Insert admin user with bcrypt hashed password
INSERT INTO users (name, email, password, role, status, created_at, updated_at)
VALUES (
  'AeroTrav Admin',
  'aeroadmin@trav.com',
  '$2b$10$K7L1OJ45/4CC2LUP0VTsHONkwu6jXOWs1NM2zHJE3xQ3Z.xqhAWL.', -- bcrypt hash of "aero1234"
  'admin',
  'active',
  NOW(),
  NOW()
);

-- Verify the user was created
SELECT id, name, email, role, status, created_at FROM users WHERE email = 'aeroadmin@trav.com'; 