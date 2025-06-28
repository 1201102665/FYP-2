import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import db from '../config/database.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Shared function for saving preferences
const saveUserPreferences = async (userId, preferences) => {
  const {
    preferred_activities,
    favorite_destinations,
    budget_range_min,
    budget_range_max,
    travel_style
  } = preferences;

  // Validate the data
  console.log('Validating input data');
  if (!Array.isArray(preferred_activities) || !Array.isArray(favorite_destinations)) {
    console.log('Invalid arrays:', { preferred_activities, favorite_destinations });
    throw new Error('Invalid data format: activities and destinations must be arrays');
  }

  // Convert budget values to numbers and validate
  const minBudget = Number(budget_range_min);
  const maxBudget = Number(budget_range_max);

  console.log('Budget values:', { minBudget, maxBudget });

  if (isNaN(minBudget) || isNaN(maxBudget)) {
    console.log('Invalid budget values');
    throw new Error('Invalid budget range: min and max must be numbers');
  }

  if (minBudget < 0 || maxBudget < minBudget) {
    console.log('Invalid budget range');
    throw new Error('Invalid budget range: min must be positive and max must be greater than min');
  }

  // Ensure travel_style is an array
  const validatedTravelStyle = Array.isArray(travel_style) ? travel_style : [travel_style].filter(Boolean);
  console.log('Validated travel style:', validatedTravelStyle);

  // Clear existing preferences for this user
  await db.query('DELETE FROM user_preferences WHERE user_id = ?', [userId]);

  // Prepare preferences to insert
  const preferencesToInsert = [
    { key: 'preferred_activities', value: JSON.stringify(preferred_activities) },
    { key: 'favorite_destinations', value: JSON.stringify(favorite_destinations) },
    { key: 'budget_range_min', value: minBudget.toString() },
    { key: 'budget_range_max', value: maxBudget.toString() },
    { key: 'travel_style', value: JSON.stringify(validatedTravelStyle) }
  ];

  // Insert new preferences
  for (const pref of preferencesToInsert) {
    await db.query(
      'INSERT INTO user_preferences (user_id, preference_key, preference_value) VALUES (?, ?, ?)',
      [userId, pref.key, pref.value]
    );
  }

  console.log('Preferences saved successfully');

  return {
    preferred_activities,
    favorite_destinations,
    budget_range_min: minBudget,
    budget_range_max: maxBudget,
    travel_style: validatedTravelStyle
  };
};

// Get user preferences
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  console.log('GET /preferences - Fetching preferences for user:', req.user.id);
  const userId = req.user.id;

  try {
    const [preferences] = await db.query(
      'SELECT preference_key, preference_value FROM user_preferences WHERE user_id = ?',
      [userId]
    );

    console.log('Fetched preferences:', preferences);

    if (!preferences || preferences.length === 0) {
      console.log('No preferences found, returning defaults');
      return res.json({
        preferred_activities: [],
        favorite_destinations: [],
        budget_range_min: 0,
        budget_range_max: 5000,
        travel_style: []
      });
    }

    // Convert array of key-value pairs to object
    const userPreferences = {};
    preferences.forEach(pref => {
      try {
        // Try to parse JSON values, fallback to string
        userPreferences[pref.preference_key] = JSON.parse(pref.preference_value);
      } catch (e) {
        // If parsing fails, use the raw value
        userPreferences[pref.preference_key] = pref.preference_value;
      }
    });

    console.log('Returning parsed preferences:', userPreferences);
    res.json(userPreferences);
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

  try {
    const savedData = await saveUserPreferences(userId, req.body);

    res.json({
      success: true,
      message: 'Preferences saved successfully',
      data: savedData
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

// Update user preferences (PUT endpoint for frontend compatibility)
router.put('/', authenticateToken, asyncHandler(async (req, res) => {
  console.log('PUT /preferences - Updating preferences');
  console.log('User:', req.user);
  console.log('Request body:', req.body);

  const userId = req.user.id;

  try {
    const savedData = await saveUserPreferences(userId, req.body);

    res.json({
      success: true,
      message: 'Preferences saved successfully',
      data: savedData
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

export default router; 