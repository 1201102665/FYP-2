import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import db from '../config/database.js';

const router = express.Router();

// Get user profile
router.get('/profile', asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
}));

// Update user profile
router.put('/profile', asyncHandler(async (req, res) => {
  const { name, phone, date_of_birth, nationality, passport_number } = req.body;
  const userId = req.user.id;

  try {
    // Update user in database
    await db.query(
      `UPDATE users SET 
         name = ?, 
         phone = ?, 
         date_of_birth = ?, 
         nationality = ?, 
         passport_number = ?,
         updated_at = NOW()
       WHERE id = ?`,
      [name, phone, date_of_birth, nationality, passport_number, userId]
    );

    // Get updated user data
    const updatedUser = await db.queryOne(
      `SELECT id, name, email, phone, role, status, profile_image, date_of_birth, 
              gender, nationality, passport_number, preferred_language, preferred_currency,
              created_at, updated_at 
       FROM users WHERE id = ?`,
      [userId]
    );

    res.json({ 
      success: true, 
      user: updatedUser,
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile' 
    });
  }
}));

export default router; 