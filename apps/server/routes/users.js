import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logUserActivity } from '../middleware/auth.js';
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

// Get all users (admin only) - migrated from users.php
router.get('/all', asyncHandler(async (req, res) => {
  // Check if user is admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  try {
    // Get user statistics
    const stats = await db.queryOne(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive
      FROM users
    `);

    // Get all users ordered by created_at DESC
    const users = await db.query(`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        role, 
        status, 
        created_at, 
        updated_at
      FROM users 
      ORDER BY created_at DESC
    `);

    // Log admin activity
    await logUserActivity(req.user.id, req.ip, 'admin_view_users', {
      total_users: stats.total,
      active_users: stats.active,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        users,
        statistics: {
          total: parseInt(stats.total),
          active: parseInt(stats.active),
          pending: parseInt(stats.pending),
          inactive: parseInt(stats.inactive)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
}));

// Update user status (admin only)
router.put('/:userId/status', asyncHandler(async (req, res) => {
  // Check if user is admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { userId } = req.params;
  const { status } = req.body;
  const validStatuses = ['active', 'pending', 'suspended'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
    });
  }

  try {
    // Update user status
    const result = await db.query(
      'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get updated user
    const updatedUser = await db.queryOne(
      'SELECT id, name, email, status FROM users WHERE id = ?',
      [userId]
    );

    // Log admin activity
    await logUserActivity(req.user.id, req.ip, 'admin_update_user_status', {
      target_user_id: userId,
      new_status: status,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: `User status updated to ${status}`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
}));

// Delete user (admin only)
router.delete('/:userId', asyncHandler(async (req, res) => {
  // Check if user is admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { userId } = req.params;

  // Prevent admin from deleting themselves
  if (parseInt(userId) === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete your own account'
    });
  }

  try {
    // Check if user exists
    const user = await db.queryOne(
      'SELECT id, name, email FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user
    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    // Log admin activity
    await logUserActivity(req.user.id, req.ip, 'admin_delete_user', {
      target_user_id: userId,
      target_user_email: user.email,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
}));

export default router; 