import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logUserActivity } from '../middleware/auth.js';
import db from '../config/database.js';

const router = express.Router();

// Submit review - migrated from rating_submit.php
router.post('/submit', asyncHandler(async (req, res) => {
  // Check if user is logged in
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'You must be logged in to submit a review'
    });
  }

  const userId = req.user.id;
  const { service_id, service_type, stars, comment = '' } = req.body;

  // Validate required fields
  if (!service_id || !service_type || !stars) {
    return res.status(400).json({
      success: false,
      message: 'service_id, service_type, and stars are required'
    });
  }

  // Validate service type
  const validTypes = ['hotel', 'flight', 'car', 'package'];
  if (!validTypes.includes(service_type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid service type. Must be one of: ' + validTypes.join(', ')
    });
  }

  // Validate star rating
  if (stars < 1 || stars > 5) {
    return res.status(400).json({
      success: false,
      message: 'Stars rating must be between 1 and 5'
    });
  }

  try {
    // Verify service exists
    const serviceExists = await verifyServiceExists(service_id, service_type);
    if (!serviceExists) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user has already reviewed this service
    const existingReview = await db.queryOne(`
      SELECT id FROM reviews 
      WHERE user_id = ? AND service_id = ? AND service_type = ? AND status != 'deleted'
    `, [userId, service_id, service_type]);

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this service'
      });
    }

    // Insert the review with pending status
    const reviewResult = await db.query(`
      INSERT INTO reviews (user_id, service_id, service_type, stars, comment, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'pending', NOW())
    `, [userId, service_id, service_type, stars, comment]);

    const reviewId = reviewResult.insertId;

    // Log user activity
    await logUserActivity(userId, req.ip, 'review_submitted', {
      review_id: reviewId,
      service_id,
      service_type,
      stars,
      user_agent: req.get('User-Agent')
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully and is pending approval',
      data: {
        review_id: parseInt(reviewId),
        service_id: parseInt(service_id),
        service_type,
        stars: parseInt(stars),
        comment,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review. Please try again.'
    });
  }
}));

// Get reviews for a service
router.get('/service/:serviceType/:serviceId', asyncHandler(async (req, res) => {
  const { serviceType, serviceId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const validTypes = ['hotel', 'flight', 'car', 'package'];
  if (!validTypes.includes(serviceType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid service type'
    });
  }

  try {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await db.query(`
      SELECT 
        r.id,
        r.stars,
        r.comment,
        r.created_at,
        u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.service_id = ? AND r.service_type = ? AND r.status = 'approved'
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [serviceId, serviceType, parseInt(limit), offset]);

    // Get review statistics
    const stats = await db.queryOne(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(stars) as average_rating,
        SUM(CASE WHEN stars = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN stars = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN stars = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN stars = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN stars = 1 THEN 1 ELSE 0 END) as one_star
      FROM reviews 
      WHERE service_id = ? AND service_type = ? AND status = 'approved'
    `, [serviceId, serviceType]);

    res.json({
      success: true,
      data: {
        reviews: reviews.map(review => ({
          ...review,
          id: parseInt(review.id)
        })),
        statistics: {
          total_reviews: parseInt(stats.total_reviews || 0),
          average_rating: parseFloat(stats.average_rating || 0),
          rating_distribution: {
            5: parseInt(stats.five_star || 0),
            4: parseInt(stats.four_star || 0),
            3: parseInt(stats.three_star || 0),
            2: parseInt(stats.two_star || 0),
            1: parseInt(stats.one_star || 0)
          }
        },
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total_pages: Math.ceil((stats.total_reviews || 0) / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
}));

// Admin: Approve/reject review
router.put('/admin/:reviewId/status', asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { reviewId } = req.params;
  const { status } = req.body;

  const validStatuses = ['approved', 'rejected', 'pending'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
    });
  }

  try {
    const result = await db.query(
      'UPDATE reviews SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, reviewId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Log admin activity
    await logUserActivity(req.user.id, req.ip, 'admin_review_status_update', {
      review_id: reviewId,
      new_status: status,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: `Review ${status} successfully`
    });

  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review status'
    });
  }
}));

// Helper function to verify service exists
async function verifyServiceExists(serviceId, serviceType) {
  try {
    let query;
    switch (serviceType) {
      case 'hotel':
        query = "SELECT id FROM hotels WHERE id = ?";
        break;
      case 'flight':
        query = "SELECT id FROM flights WHERE id = ?";
        break;
      case 'car':
        query = "SELECT id FROM cars WHERE id = ?";
        break;
      case 'package':
        query = "SELECT id FROM packages WHERE id = ?";
        break;
      default:
        return false;
    }

    const result = await db.queryOne(query, [serviceId]);
    return result !== null;
  } catch (error) {
    return false;
  }
}

export default router; 