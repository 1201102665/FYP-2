import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import db from '../config/database.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Get user preferences
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  console.log('GET /preferences - Fetching preferences for user:', req.user.id);
  const userId = req.user.id;
  
  try {
    const [preferences] = await db.query(
      'SELECT * FROM user_preferences WHERE user_id = ?',
      [userId]
    );

    console.log('Fetched preferences:', preferences);

    if (!preferences) {
      console.log('No preferences found, returning defaults');
      return res.json({
        preferred_activities: [],
        favorite_destinations: [],
        budget_range_min: 0,
        budget_range_max: 5000,
        travel_style: []
      });
    }

    // Parse JSON fields if they're strings
    if (typeof preferences.preferred_activities === 'string') {
      preferences.preferred_activities = JSON.parse(preferences.preferred_activities);
    }
    if (typeof preferences.favorite_destinations === 'string') {
      preferences.favorite_destinations = JSON.parse(preferences.favorite_destinations);
    }
    if (typeof preferences.travel_style === 'string') {
      preferences.travel_style = JSON.parse(preferences.travel_style);
    }

    console.log('Returning parsed preferences:', preferences);
    res.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
}));

// Save user preferences
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  console.log('POST /preferences - Saving preferences');
  console.log('User:', req.user);
  console.log('Request body:', req.body);

  const userId = req.user.id;
  const {
    preferred_activities,
    favorite_destinations,
    budget_range_min,
    budget_range_max,
    travel_style
  } = req.body;

  try {
    // First check if a record exists
    const [existingPrefs] = await db.query(
      'SELECT id FROM user_preferences WHERE user_id = ?',
      [userId]
    );
    console.log('Existing preferences check:', existingPrefs);

    // Validate the data
    console.log('Validating input data');
    if (!Array.isArray(preferred_activities) || !Array.isArray(favorite_destinations)) {
      console.log('Invalid arrays:', { preferred_activities, favorite_destinations });
      return res.status(400).json({ 
        error: 'Invalid data format: activities and destinations must be arrays' 
      });
    }

    // Convert budget values to numbers and validate
    const minBudget = Number(budget_range_min);
    const maxBudget = Number(budget_range_max);

    console.log('Budget values:', { minBudget, maxBudget });

    if (isNaN(minBudget) || isNaN(maxBudget)) {
      console.log('Invalid budget values');
      return res.status(400).json({ 
        error: 'Invalid budget range: min and max must be numbers' 
      });
    }

    if (minBudget < 0 || maxBudget < minBudget) {
      console.log('Invalid budget range');
      return res.status(400).json({ 
        error: 'Invalid budget range: min must be positive and max must be greater than min' 
      });
    }

    // Ensure travel_style is an array
    const validatedTravelStyle = Array.isArray(travel_style) ? travel_style : [travel_style].filter(Boolean);
    console.log('Validated travel style:', validatedTravelStyle);

    let query;
    let params;

    if (existingPrefs) {
      console.log('Updating existing preferences');
      query = `
        UPDATE user_preferences 
        SET 
          preferred_activities = ?,
          favorite_destinations = ?,
          budget_range_min = ?,
          budget_range_max = ?,
          travel_style = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `;
      params = [
        JSON.stringify(preferred_activities),
        JSON.stringify(favorite_destinations),
        minBudget,
        maxBudget,
        JSON.stringify(validatedTravelStyle),
        userId
      ];
    } else {
      console.log('Inserting new preferences');
      query = `
        INSERT INTO user_preferences 
        (user_id, preferred_activities, favorite_destinations, budget_range_min, budget_range_max, travel_style)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      params = [
        userId,
        JSON.stringify(preferred_activities),
        JSON.stringify(favorite_destinations),
        minBudget,
        maxBudget,
        JSON.stringify(validatedTravelStyle)
      ];
    }

    console.log('Executing query:', query);
    console.log('With parameters:', params);

    const result = await db.query(query, params);
    console.log('Database operation result:', result);

    // Verify the save by fetching the updated data
    const [savedPrefs] = await db.query(
      'SELECT * FROM user_preferences WHERE user_id = ?',
      [userId]
    );
    console.log('Verified saved preferences:', savedPrefs);

    res.json({ 
      success: true,
      message: 'Preferences saved successfully',
      data: {
        preferred_activities,
        favorite_destinations,
        budget_range_min: minBudget,
        budget_range_max: maxBudget,
        travel_style: validatedTravelStyle
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to save preferences',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

export default router; 