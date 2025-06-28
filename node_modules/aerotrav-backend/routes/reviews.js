import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logUserActivity, authenticateToken } from '../middleware/auth.js';
import db from '../config/database.js';

const router = express.Router();

// Submit review - updated to match new database schema
router.post('/submit', authenticateToken, asyncHandler(async (req, res) => {
  console.log('🟢 /reviews/submit got:', req.body);
  // Check if user is logged in
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'You must be logged in to submit a review'
    });
  }

  const userId = req.user.id;
  const {
    item_type,
    item_id,
    booking_id,
    overall_rating,
    cleanliness_rating,
    service_rating,
    location_rating,
    value_rating,
    title,
    comment,
    pros,
    cons
  } = req.body;

  // Validate required fields
  if (!item_type || !item_id || !overall_rating || !title || !comment) {
    return res.status(400).json({
      success: false,
      message: 'item_type, item_id, overall_rating, title, and comment are required'
    });
  }

  // Validate item type
  const validTypes = ['hotel', 'flight', 'car', 'package'];
  if (!validTypes.includes(item_type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid item type. Must be one of: ' + validTypes.join(', ')
    });
  }

  // Validate overall rating
  if (overall_rating < 1 || overall_rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Overall rating must be between 1 and 5'
    });
  }

  // Validate optional ratings
  const optionalRatings = [cleanliness_rating, service_rating, location_rating, value_rating];
  for (const rating of optionalRatings) {
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'All ratings must be between 1 and 5'
      });
    }
  }

  try {
    // Check if user has already reviewed this item
    const existingReview = await db.queryOne(`
      SELECT id FROM reviews 
      WHERE user_id = ? AND item_type = ? AND item_id = ?
    `, [userId, item_type, item_id]);

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this item'
      });
    }

    // Insert the review
    const result = await db.query(`
      INSERT INTO reviews (
        user_id, item_type, item_id, booking_id, overall_rating,
        cleanliness_rating, service_rating, location_rating, value_rating,
        title, comment, pros, cons, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      userId, item_type, item_id, booking_id || null, overall_rating,
      cleanliness_rating || null, service_rating || null, location_rating || null, value_rating || null,
      title, comment, pros || null, cons || null
    ]);

    const reviewId = result.insertId;

    // Log user activity
    await logUserActivity(userId, req.ip, 'review_submitted', {
      review_id: reviewId,
      item_type,
      item_id,
      overall_rating,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        review_id: reviewId
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
        r.user_id,
        r.item_type,
        r.item_id,
        r.booking_id,
        r.overall_rating,
        r.cleanliness_rating,
        r.service_rating,
        r.location_rating,
        r.value_rating,
        r.title,
        r.comment,
        r.pros,
        r.cons,
        r.helpful_votes,
        r.verified_stay,
        r.status,
        r.created_at,
        u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.item_type = ? AND r.item_id = ? AND r.status = 'approved'
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [serviceType, serviceId, parseInt(limit), offset]);

    // Get review statistics
    const stats = await db.queryOne(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(overall_rating) as average_rating,
        SUM(CASE WHEN overall_rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN overall_rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN overall_rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN overall_rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN overall_rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM reviews 
      WHERE item_type = ? AND item_id = ? AND status = 'approved'
    `, [serviceType, serviceId]);

    res.json({
      success: true,
      data: {
        reviews,
        stats: {
          ...stats,
          average_rating: parseFloat(stats.average_rating || 0)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
}));

// Get user's reviews
router.get('/user', asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'You must be logged in to view your reviews'
    });
  }

  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await db.query(`
      SELECT 
        r.id,
        r.item_type,
        r.item_id,
        r.overall_rating,
        r.title,
        r.comment,
        r.status,
        r.created_at,
        CASE 
          WHEN r.item_type = 'hotel' THEN h.name
          WHEN r.item_type = 'package' THEN p.name
          WHEN r.item_type = 'flight' THEN CONCAT(f.airline, ' - ', f.flight_number)
          WHEN r.item_type = 'car' THEN c.model
        END as item_name
      FROM reviews r
      LEFT JOIN hotels h ON r.item_type = 'hotel' AND r.item_id = h.id
      LEFT JOIN packages p ON r.item_type = 'package' AND r.item_id = p.id
      LEFT JOIN flights f ON r.item_type = 'flight' AND r.item_id = f.id
      LEFT JOIN cars c ON r.item_type = 'car' AND r.item_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, parseInt(limit), offset]);

    res.json({
      success: true,
      data: {
        reviews
      }
    });

  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your reviews'
    });
  }
}));

// Vote on a review
router.post('/:reviewId/vote', asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'You must be logged in to vote on reviews'
    });
  }

  const userId = req.user.id;
  const { reviewId } = req.params;
  const { vote_type } = req.body;

  if (!['helpful', 'not_helpful'].includes(vote_type)) {
    return res.status(400).json({
      success: false,
      message: 'Vote type must be helpful or not_helpful'
    });
  }

  try {
    // Check if user has already voted on this review
    const existingVote = await db.queryOne(`
      SELECT id FROM review_votes 
      WHERE review_id = ? AND user_id = ?
    `, [reviewId, userId]);

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted on this review'
      });
    }

    // Insert vote
    await db.query(`
      INSERT INTO review_votes (review_id, user_id, vote_type)
      VALUES (?, ?, ?)
    `, [reviewId, userId, vote_type]);

    // Update helpful votes count if vote is helpful
    if (vote_type === 'helpful') {
      await db.query(`
        UPDATE reviews 
        SET helpful_votes = helpful_votes + 1 
        WHERE id = ?
      `, [reviewId]);
    }

    res.json({
      success: true,
      message: 'Vote recorded successfully'
    });

  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record vote'
    });
  }
}));

// Check if user can review a specific item
router.get('/can-review/:itemType/:itemId', asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'You must be logged in to check review eligibility'
    });
  }

  const userId = req.user.id;
  const { itemType, itemId } = req.params;

  try {
    // Check if user has already reviewed this item
    const existingReview = await db.queryOne(`
      SELECT id FROM reviews 
      WHERE user_id = ? AND item_type = ? AND item_id = ?
    `, [userId, itemType, itemId]);

    // Check if user has booked this item (for verified stay badge)
    const hasBooked = await db.queryOne(`
      SELECT bi.id FROM booking_items bi
      JOIN bookings b ON bi.booking_id = b.id
      WHERE b.user_id = ? AND bi.service_type = ? AND bi.service_id = ?
    `, [userId, itemType, itemId]);

    res.json({
      success: true,
      data: {
        can_review: !existingReview,
        has_booked: !!hasBooked
      }
    });

  } catch (error) {
    console.error('Error checking review eligibility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check review eligibility'
    });
  }
}));

export default router; 