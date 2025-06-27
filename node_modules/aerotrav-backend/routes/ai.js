import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import db from '../config/database.js';

const router = express.Router();

// Initialize the model with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Enhanced travel planning prompt for AeroTrav
const createTravelPrompt = (userMessage, userContext = '') => `
You are AeroTrav's expert AI travel planner assistant. You help users plan amazing trips with detailed, practical advice.

${userContext ? `User Context: ${userContext}` : ''}

User Request: ${userMessage}

Please provide a comprehensive, structured response covering:

1. **Destination Overview**
   - Key highlights and attractions
   - Best time to visit (considering weather and crowds)
   - Weather considerations and seasonal variations
   - Cultural highlights and local customs

2. **Suggested Itinerary**
   - Day-by-day breakdown with realistic timing
   - Must-see attractions and hidden gems
   - Local experiences and cultural activities
   - Recommended duration for each activity

3. **Budget Breakdown**
   - Accommodation estimates (budget, mid-range, luxury options)
   - Transportation costs (flights, local transport, transfers)
   - Food and dining expenses
   - Activities and entrance fees
   - Additional expenses (souvenirs, tips, etc.)

4. **Travel Tips**
   - Local transportation options and tips
   - Accommodation recommendations by area
   - Food recommendations and local cuisine
   - Cultural considerations and etiquette
   - Language tips and useful phrases

5. **Safety & Practical Advice**
   - Important safety precautions
   - Emergency contacts and local emergency numbers
   - Health considerations and vaccinations
   - Local customs to respect
   - Travel insurance recommendations

6. **Booking Recommendations**
   - Suggested booking timeline
   - Peak vs off-peak considerations
   - Package deals vs independent travel
   - AeroTrav services that could help

Keep the response friendly, practical, and focused on helping the traveler have the best possible experience. 
Format with clear sections and bullet points for easy reading.
Include specific, actionable advice rather than generic information.
`;

// Enhanced trip planner endpoint
router.post('/trip-planner', async (req, res) => {
  try {
    const { message, userContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Processing AI trip planning request:', { message: message.substring(0, 100) + '...' });

    // Get the chat model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" });

    // Generate the response with enhanced prompt
    const prompt = createTravelPrompt(message, userContext);
    const result = await model.generateContent(prompt);
    const response = await result.response;

    console.log('AI trip planning response generated successfully');

    res.json({ 
      response: response.text(),
      timestamp: new Date().toISOString(),
      requestType: 'trip-planning'
    });
  } catch (error) {
    console.error('AI Trip Planner Error:', error);
    res.status(500).json({
      error: 'Failed to get AI response',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Enhanced recommendation system with multiple travel options
router.get("/recommendations", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { type = 'packages', limit = 10 } = req.query;

    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    // Get user preferences
    const userPrefs = await db.query(
      `SELECT preference_key, preference_value
       FROM user_preferences
       WHERE user_id = ?`,
      [userId]
    );

    // Get user activity history for better recommendations
    const userActivity = await db.query(
      `SELECT activity_type, activity_data
       FROM user_activities
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );

    // Parse preferences
    const preferences = {};
    userPrefs.forEach(pref => {
      try {
        preferences[pref.preference_key] = JSON.parse(pref.preference_value);
      } catch (e) {
        preferences[pref.preference_key] = pref.preference_value;
      }
    });

    const budgetRange = preferences.budget_range || [500, 5000];
    const interests = preferences.interests || [];
    const preferredCategories = preferences.categories || [];
    const travelStyle = preferences.travel_style || 'balanced';

    const [minBudget, maxBudget] = budgetRange;

    let recommendations = [];

    if (type === 'packages') {
      // Get packages with enhanced filtering
      const packages = await db.query(
        `SELECT p.*, 
                COUNT(r.id) as review_count,
                AVG(r.overall_rating) as avg_rating
         FROM packages p
         LEFT JOIN reviews r ON p.id = r.item_id AND r.item_type = 'package' AND r.status = 'approved'
         WHERE p.base_price BETWEEN ? AND ? 
         AND p.status = 'active'
         GROUP BY p.id
         ORDER BY p.featured DESC, avg_rating DESC, p.base_price ASC
         LIMIT ?`,
        [minBudget, maxBudget, parseInt(limit) * 2] // Get more to filter
      );

      // Enhanced scoring algorithm
      recommendations = packages
        .map(pkg => {
          let score = 0;
          let reasons = [];
          let matchDetails = {};

          // Category preference (40% weight)
          if (preferredCategories.includes(pkg.category)) {
            score += 0.4;
            reasons.push(`Matches your preferred category: ${pkg.category}`);
            matchDetails.category = pkg.category;
          }

          // Interest matching (30% weight)
          if (pkg.highlights && interests.length > 0) {
            try {
              const highlights = JSON.parse(pkg.highlights);
              const highlightText = highlights.join(' ').toLowerCase();
              let interestMatches = 0;
              
              interests.forEach(interest => {
                if (highlightText.includes(interest.toLowerCase())) {
                  interestMatches++;
                  reasons.push(`Includes your interest: ${interest}`);
                }
              });
              
              score += (interestMatches / interests.length) * 0.3;
              matchDetails.interests = interestMatches;
            } catch (e) {
              console.error('Error parsing highlights:', e);
            }
          }

          // Budget optimization (15% weight)
          const budgetMidpoint = (minBudget + maxBudget) / 2;
          const budgetDistance = Math.abs(pkg.base_price - budgetMidpoint);
          const budgetScore = Math.max(0, 1 - (budgetDistance / budgetMidpoint));
          score += budgetScore * 0.15;

          // Rating and popularity (10% weight)
          if (pkg.avg_rating) {
            score += (pkg.avg_rating / 5) * 0.1;
            reasons.push(`Highly rated: ${pkg.avg_rating.toFixed(1)}/5 stars`);
          }

          // Featured package bonus (5% weight)
          if (pkg.featured) {
            score += 0.05;
            reasons.push('Featured package');
          }

          // Duration preference (if specified)
          if (preferences.preferred_duration) {
            const preferredDuration = preferences.preferred_duration;
            const durationDiff = Math.abs(pkg.duration_days - preferredDuration);
            if (durationDiff <= 2) {
              score += 0.05;
              reasons.push(`Matches your preferred trip duration`);
            }
          }

          return {
            ...pkg,
            score: Math.min(1, score),
            reason: reasons.length > 0 ? reasons.join(', ') : 'General recommendation',
            matchDetails,
            recommendationType: 'package'
          };
        })
        .filter(p => p.score > 0.1)
        .sort((a, b) => b.score - a.score)
        .slice(0, parseInt(limit));

    } else if (type === 'destinations') {
      // Get destination recommendations based on user preferences
      const destinations = await db.query(
        `SELECT DISTINCT destination_city, destination_country,
                COUNT(*) as package_count,
                AVG(base_price) as avg_price,
                GROUP_CONCAT(DISTINCT category) as categories
         FROM packages
         WHERE status = 'active'
         GROUP BY destination_city, destination_country
         HAVING package_count >= 2
         ORDER BY package_count DESC
         LIMIT ?`,
        [parseInt(limit)]
      );

      recommendations = destinations.map(dest => ({
        destination: `${dest.destination_city}, ${dest.destination_country}`,
        packageCount: dest.package_count,
        avgPrice: dest.avg_price,
        categories: dest.categories.split(','),
        score: 0.8, // Base score for destination recommendations
        reason: `Popular destination with ${dest.package_count} available packages`,
        recommendationType: 'destination'
      }));
    }

    res.json({
      recommendations,
      userPreferences: {
        budgetRange,
        interests,
        preferredCategories,
        travelStyle
      },
      totalFound: recommendations.length
    });

  } catch (err) {
    console.error('AI Recommendations Error:', err);
    next(err);
  }
});

// Save user preferences with enhanced validation
router.post("/preferences", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { 
      budget_range, 
      interests, 
      categories, 
      travel_style,
      preferred_duration,
      preferred_season,
      group_size,
      accommodation_preference
    } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    // Validate budget range
    if (budget_range && (!Array.isArray(budget_range) || budget_range.length !== 2)) {
      return res.status(400).json({ error: "Budget range must be an array with min and max values" });
    }

    // Clear existing preferences
    await db.query(
      'DELETE FROM user_preferences WHERE user_id = ?',
      [userId]
    );

    // Prepare preferences with validation
    const preferences = [
      { key: 'budget_range', value: JSON.stringify(budget_range || [500, 5000]) },
      { key: 'interests', value: JSON.stringify(interests || []) },
      { key: 'categories', value: JSON.stringify(categories || []) },
      { key: 'travel_style', value: travel_style || 'balanced' },
      { key: 'preferred_duration', value: preferred_duration || null },
      { key: 'preferred_season', value: preferred_season || null },
      { key: 'group_size', value: group_size || 1 },
      { key: 'accommodation_preference', value: accommodation_preference || 'standard' }
    ];

    // Insert preferences
    for (const pref of preferences) {
      if (pref.value !== null) {
        await db.query(
          `INSERT INTO user_preferences (user_id, preference_key, preference_value)
           VALUES (?, ?, ?)`,
          [userId, pref.key, pref.value]
        );
      }
    }

    res.json({ 
      success: true, 
      message: 'Preferences saved successfully',
      preferences: preferences.reduce((acc, pref) => {
        acc[pref.key] = pref.value;
        return acc;
      }, {})
    });
  } catch (err) {
    console.error('Save Preferences Error:', err);
    next(err);
  }
});

// Get user preferences with enhanced formatting
router.get("/preferences", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    const preferences = await db.query(
      `SELECT preference_key, preference_value
       FROM user_preferences
       WHERE user_id = ?`,
      [userId]
    );

    const formattedPrefs = {};
    preferences.forEach(pref => {
      try {
        formattedPrefs[pref.preference_key] = JSON.parse(pref.preference_value);
      } catch (e) {
        formattedPrefs[pref.preference_key] = pref.preference_value;
      }
    });

    res.json({
      preferences: formattedPrefs,
      hasPreferences: Object.keys(formattedPrefs).length > 0
    });
  } catch (err) {
    console.error('Get Preferences Error:', err);
    next(err);
  }
});

// Enhanced AI chat with context awareness
router.post("/chat", optionalAuth, async (req, res) => {
  try {
    const { message, context, chatHistory = [] } = req.body;
    const userId = req.user?.id;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get user context if authenticated
    let userContext = '';
    if (userId) {
      const userPrefs = await db.query(
        `SELECT preference_key, preference_value
         FROM user_preferences
         WHERE user_id = ?`,
        [userId]
      );
      
      if (userPrefs.length > 0) {
        const prefs = userPrefs.reduce((acc, pref) => {
          try {
            acc[pref.preference_key] = JSON.parse(pref.preference_value);
          } catch (e) {
            acc[pref.preference_key] = pref.preference_value;
          }
          return acc;
        }, {});
        
        userContext = `User has saved preferences: ${JSON.stringify(prefs)}. `;
      }
    }

    // Build context-aware prompt
    const chatPrompt = `
You are AeroTrav's AI travel assistant, a helpful and knowledgeable travel expert.

${userContext}

${context ? `Additional Context: ${context}` : ''}

${chatHistory.length > 0 ? `Previous conversation:\n${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n` : ''}

User: ${message}

Please provide helpful, accurate, and friendly travel advice. Focus on:
- Practical travel information and tips
- Destination recommendations based on user preferences
- Travel planning guidance
- Booking advice and AeroTrav services
- Cultural insights and local knowledge
- Safety and practical considerations

Keep responses concise but informative. Be conversational and helpful.
If the user asks about specific destinations, provide relevant details about attractions, weather, best times to visit, and practical tips.
If they ask about booking, mention how AeroTrav can help with flights, hotels, cars, and packages.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" });
    const result = await model.generateContent(chatPrompt);
    const response = await result.response;

    res.json({ 
      response: response.text(),
      timestamp: new Date().toISOString(),
      requestType: 'chat',
      userId: userId || null
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      error: 'Failed to get AI response',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// New endpoint: Get AI-powered travel insights
router.get("/insights", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { destination, type = 'general' } = req.query;

    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    let prompt = '';
    
    if (type === 'destination' && destination) {
      prompt = `Provide travel insights for ${destination}. Include:
      - Best time to visit
      - Must-see attractions
      - Local cuisine recommendations
      - Cultural tips
      - Budget considerations
      - Safety advice`;
    } else {
      // General travel insights based on user preferences
      const userPrefs = await db.query(
        `SELECT preference_key, preference_value
         FROM user_preferences
         WHERE user_id = ?`,
        [userId]
      );

      const preferences = {};
      userPrefs.forEach(pref => {
        try {
          preferences[pref.preference_key] = JSON.parse(pref.preference_value);
        } catch (e) {
          preferences[pref.preference_key] = pref.preference_value;
        }
      });

      prompt = `Based on these user preferences: ${JSON.stringify(preferences)}, provide personalized travel insights including:
      - Recommended destinations
      - Travel tips
      - Budget advice
      - Seasonal recommendations
      - Cultural insights`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({
      insights: response.text(),
      type,
      destination: destination || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Insights Error:', error);
    next(error);
  }
});

export default router;
