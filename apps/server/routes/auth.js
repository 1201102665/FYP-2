import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateToken, hashPassword, verifyPassword, logUserActivity, generateSessionId } from '../middleware/auth.js';
import { validateUserRegistration, validateUserLogin } from '../utils/validation.js';
import db from '../config/database.js';

const router = express.Router();

// User Registration (converted from signup_submit.php)
router.post('/register', (req, res, next) => {
  console.log('🟢 /register got:', req.body);
  next();
}, validateUserRegistration, asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await db.queryOne(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const result = await db.query(
    `INSERT INTO users (name, email, password, phone, role, status, created_at) 
  VALUES (?, ?, ?, ?, 'user', 'active', NOW())`,
    [name, email, hashedPassword, phone || null]
  );

  // Get created user
  const user = await db.queryOne(
    'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
    [result.insertId]
  );

  // Generate token
  const token = generateToken(user);

  // Log activity
  const sessionId = generateSessionId(req);
  await logUserActivity(user.id, sessionId, 'user_registered', {
    ip_address: req.ip,
    user_agent: req.get('User-Agent')
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      created_at: user.created_at
    },
    token
  });
}));

// User Login (converted from login_submit.php)
router.post('/login', validateUserLogin, asyncHandler(async (req, res) => {
  console.log('🟢 /login got:', req.body);
  console.log('Login attempt:', { email: req.body.email });
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing credentials');
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Get user by email
  const user = await db.queryOne(
    'SELECT id, name, email, password, role, status FROM users WHERE email = ?',
    [email]
  );

  console.log('User found:', user ? 'yes' : 'no');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if user is active
  if (user.status !== 'active') {
    console.log('User not active:', user.status);
    return res.status(401).json({
      success: false,
      message: 'Account is not active. Please contact support.'
    });
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password);
  console.log('Password valid:', isValidPassword);

  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  try {
    // Generate token
    const token = generateToken(user);
    console.log('Token generated successfully');

    // Log activity
    const sessionId = generateSessionId(req);
    await logUserActivity(user.id, sessionId, 'user_login', {
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
}));

// Get current user profile
router.get('/profile', asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const jwt = (await import('jsonwebtoken')).default;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.queryOne(
      `SELECT id, name, email, phone, role, status, profile_image, date_of_birth, 
              gender, nationality, passport_number, preferred_language, preferred_currency,
              created_at, updated_at 
      FROM users WHERE id = ? AND status = "active"`,
      [decoded.id]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
}));

// Password Reset Request
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await db.queryOne(
    'SELECT id, email FROM users WHERE email = ? AND status = "active"',
    [email]
  );

  // Always return success for security reasons (don't reveal if email exists)
  if (!user) {
    return res.json({
      success: true,
      message: 'If the email exists in our system, a password reset link has been sent.'
    });
  }

  // In a real application, you would:
  // 1. Generate a reset token
  // 2. Store it in the database with expiration
  // 3. Send reset email

  // For now, just log the activity
  const sessionId = generateSessionId(req);
  await logUserActivity(user.id, sessionId, 'password_reset_requested', {
    ip_address: req.ip,
    user_agent: req.get('User-Agent')
  });

  res.json({
    success: true,
    message: 'If the email exists in our system, a password reset link has been sent.'
  });
}));

// Logout (clear client-side token, log activity)
router.post('/logout', asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const jwt = (await import('jsonwebtoken')).default;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Log logout activity
      const sessionId = generateSessionId(req);
      await logUserActivity(decoded.id, sessionId, 'user_logout', {
        ip_address: req.ip,
        user_agent: req.get('User-Agent')
      });
    } catch (error) {
      // Token invalid, but that's okay for logout
    }
  }

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// Legacy PHP compatibility endpoints
router.post('/signup_submit.php', (req, res, next) => {
  req.url = '/register';
  next();
});

router.post('/login_submit.php', (req, res, next) => {
  req.url = '/login';
  next();
});

export default router; 