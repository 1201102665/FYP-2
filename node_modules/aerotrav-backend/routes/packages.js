import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logUserActivity } from '../middleware/auth.js';
import db from '../config/database.js';

const router = express.Router();

// AI Itinerary Generator - migrated from ai_itinerary.php
router.post('/ai-itinerary', asyncHandler(async (req, res) => {
  const { 
    destination, 
    budget, 
    duration, 
    interests = [], 
    travel_style = 'balanced',
    accommodation_type = 'hotel',
    group_size = 1 
  } = req.body;

  // Validate required fields
  if (!destination || !budget || !duration) {
    return res.status(400).json({
      success: false,
      message: 'destination, budget, and duration are required'
    });
  }

  // Validate input ranges
  if (budget <= 0 || budget > 100000) {
    return res.status(400).json({
      success: false,
      message: 'Budget must be between 1 and 100,000'
    });
  }

  if (duration <= 0 || duration > 30) {
    return res.status(400).json({
      success: false,
      message: 'Duration must be between 1 and 30 days'
    });
  }

  try {
    // Generate itinerary based on preferences
    const itinerary = await generateItinerary(
      destination, 
      budget, 
      duration, 
      interests, 
      travel_style, 
      accommodation_type, 
      group_size
    );

    // Log user activity if authenticated
    if (req.user) {
      await logUserActivity(req.user.id, req.ip, 'ai_itinerary_generated', {
        destination,
        budget,
        duration,
        travel_style,
        user_agent: req.get('User-Agent')
      });
    }

    res.json({
      success: true,
      data: {
        itinerary,
        preferences: {
          destination,
          budget,
          duration,
          interests,
          travel_style,
          accommodation_type,
          group_size
        },
        generated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('AI Itinerary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating itinerary'
    });
  }
}));

// Enhanced package search - migrated from search_packages.php
router.get('/search', asyncHandler(async (req, res) => {
  const {
    destination = '',
    min_duration = 0,
    max_duration = 365,
    min_price = 0,
    max_price = 999999,
    max_people = 1,
    difficulty_level = '',
    season = '',
    sort_by = '',
    page = 1,
    limit = 10
  } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    // Build WHERE clause based on filters
    const whereConditions = ['status = ?'];
    const values = ['active'];

    if (destination) {
      whereConditions.push('destination LIKE ?');
      values.push(`%${destination}%`);
    }

    if (parseInt(min_duration) > 0) {
      whereConditions.push('duration_days >= ?');
      values.push(parseInt(min_duration));
    }

    if (parseInt(max_duration) < 365) {
      whereConditions.push('duration_days <= ?');
      values.push(parseInt(max_duration));
    }

    if (parseFloat(min_price) > 0) {
      whereConditions.push('price >= ?');
      values.push(parseFloat(min_price));
    }

    if (parseFloat(max_price) < 999999) {
      whereConditions.push('price <= ?');
      values.push(parseFloat(max_price));
    }

    if (parseInt(max_people) > 0) {
      whereConditions.push('max_people >= ?');
      values.push(parseInt(max_people));
    }

    if (difficulty_level) {
      whereConditions.push('difficulty_level = ?');
      values.push(difficulty_level);
    }

    if (season && season !== 'all') {
      whereConditions.push('(season = ? OR season = "all")');
      values.push(season);
    }

    // Build ORDER BY clause
    let orderBy = 'price ASC, duration_days ASC';
    switch (sort_by) {
      case 'price_low':
        orderBy = 'price ASC';
        break;
      case 'price_high':
        orderBy = 'price DESC';
        break;
      case 'duration_short':
        orderBy = 'duration_days ASC';
        break;
      case 'duration_long':
        orderBy = 'duration_days DESC';
        break;
      case 'name':
        orderBy = 'name ASC';
        break;
      case 'destination':
        orderBy = 'destination ASC';
        break;
    }

    const whereClause = whereConditions.join(' AND ');
    
    // Get packages
    const packages = await db.query(`
      SELECT 
        id, name, description, destination, duration_days, price,
        includes, excludes, itinerary, images, max_people,
        difficulty_level, season, created_at
      FROM packages 
      WHERE ${whereClause} 
      ORDER BY ${orderBy} 
      LIMIT ? OFFSET ?
    `, [...values, parseInt(limit), offset]);

    // Get total count for pagination
    const countResult = await db.queryOne(`
      SELECT COUNT(*) as total FROM packages WHERE ${whereClause}
    `, values);

    // Format packages data
    const formattedPackages = packages.map(pkg => ({
      id: parseInt(pkg.id),
      name: pkg.name,
      description: pkg.description,
      destination: pkg.destination,
      duration_days: parseInt(pkg.duration_days),
      price: parseFloat(pkg.price),
      includes: JSON.parse(pkg.includes || '[]'),
      excludes: JSON.parse(pkg.excludes || '[]'),
      itinerary: JSON.parse(pkg.itinerary || '[]'),
      images: JSON.parse(pkg.images || '[]'),
      max_people: parseInt(pkg.max_people),
      difficulty_level: pkg.difficulty_level,
      season: pkg.season,
      created_at: pkg.created_at
    }));

    res.json({
      success: true,
      data: {
        packages: formattedPackages,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: parseInt(countResult.total),
          total_pages: Math.ceil(countResult.total / parseInt(limit)),
          has_more: (offset + parseInt(limit)) < countResult.total
        },
        filters_applied: {
          destination,
          min_duration: parseInt(min_duration),
          max_duration: parseInt(max_duration),
          min_price: parseFloat(min_price),
          max_price: parseFloat(max_price),
          max_people: parseInt(max_people),
          difficulty_level,
          season,
          sort_by
        }
      }
    });

  } catch (error) {
    console.error('Package search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching packages'
    });
  }
}));

// Get package details
router.get('/:packageId', asyncHandler(async (req, res) => {
  const { packageId } = req.params;

  try {
    const packageData = await db.queryOne(`
      SELECT * FROM packages WHERE id = ? AND status = 'active'
    `, [packageId]);

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Format package data
    const formattedPackage = {
      id: parseInt(packageData.id),
      name: packageData.name,
      description: packageData.description,
      destination: packageData.destination,
      duration_days: parseInt(packageData.duration_days),
      price: parseFloat(packageData.price),
      includes: JSON.parse(packageData.includes || '[]'),
      excludes: JSON.parse(packageData.excludes || '[]'),
      itinerary: JSON.parse(packageData.itinerary || '[]'),
      images: JSON.parse(packageData.images || '[]'),
      max_people: parseInt(packageData.max_people),
      difficulty_level: packageData.difficulty_level,
      season: packageData.season,
      created_at: packageData.created_at
    };

    res.json({
      success: true,
      data: {
        package: formattedPackage
      }
    });

  } catch (error) {
    console.error('Get package details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching package details'
    });
  }
}));

// Helper function to generate itinerary (AI-like algorithm)
async function generateItinerary(destination, budget, duration, interests, travelStyle, accommodationType, groupSize) {
  // Calculate daily budget
  const dailyBudget = budget / duration;

  // Budget allocation percentages based on travel style
  const budgetAllocation = {
    luxury: { accommodation: 0.5, food: 0.25, activities: 0.15, transport: 0.1 },
    budget: { accommodation: 0.3, food: 0.2, activities: 0.3, transport: 0.2 },
    balanced: { accommodation: 0.4, food: 0.25, activities: 0.25, transport: 0.1 }
  };

  const allocation = budgetAllocation[travelStyle] || budgetAllocation.balanced;

  // Get available services for the destination
  const hotels = await getHotelsByDestination(destination, dailyBudget * allocation.accommodation);
  const packages = await getPackagesByDestination(destination, budget);
  const activities = generateActivitiesByInterests(interests, destination);

  // Generate itinerary structure
  const itinerary = {
    destination,
    total_budget: budget,
    duration_days: duration,
    daily_budget: dailyBudget,
    budget_breakdown: {
      accommodation: dailyBudget * allocation.accommodation * duration,
      food: dailyBudget * allocation.food * duration,
      activities: dailyBudget * allocation.activities * duration,
      transport: dailyBudget * allocation.transport * duration
    },
    recommended_hotels: hotels.slice(0, 3),
    recommended_packages: packages.slice(0, 2),
    daily_schedule: []
  };

  // Generate daily schedule
  for (let day = 1; day <= duration; day++) {
    const daySchedule = generateDaySchedule(day, duration, activities, dailyBudget, allocation, interests);
    itinerary.daily_schedule.push(daySchedule);
  }

  // Calculate estimated costs
  itinerary.estimated_total_cost = calculateEstimatedCost(itinerary);

  return itinerary;
}

// Helper function to get hotels by destination
async function getHotelsByDestination(destination, maxDailyRate) {
  try {
    const hotels = await db.query(`
      SELECT * FROM hotels 
      WHERE destination LIKE ? 
      AND price_per_night <= ? 
      AND status = 'active' 
      ORDER BY rating DESC, price_per_night ASC 
      LIMIT 5
    `, [`%${destination}%`, maxDailyRate]);

    return hotels.map(hotel => ({
      id: parseInt(hotel.id),
      name: hotel.name,
      location: hotel.location,
      price_per_night: parseFloat(hotel.price_per_night),
      rating: parseFloat(hotel.rating),
      amenities: JSON.parse(hotel.amenities || '[]')
    }));
  } catch (error) {
    return [];
  }
}

// Helper function to get packages by destination
async function getPackagesByDestination(destination, maxBudget) {
  try {
    const packages = await db.query(`
      SELECT * FROM packages 
      WHERE destination LIKE ? 
      AND price <= ? 
      AND status = 'active' 
      ORDER BY price ASC 
      LIMIT 3
    `, [`%${destination}%`, maxBudget]);

    return packages.map(pkg => ({
      id: parseInt(pkg.id),
      name: pkg.name,
      description: pkg.description,
      price: parseFloat(pkg.price),
      duration_days: parseInt(pkg.duration_days)
    }));
  } catch (error) {
    return [];
  }
}

// Helper function to generate activities by interests
function generateActivitiesByInterests(interests, destination) {
  const activityDatabase = {
    adventure: ['Hiking', 'Rock Climbing', 'White Water Rafting', 'Zip Lining', 'Bungee Jumping'],
    culture: ['Museum Tours', 'Historical Sites', 'Local Markets', 'Art Galleries', 'Cultural Shows'],
    nature: ['Wildlife Safari', 'National Parks', 'Beach Walks', 'Nature Photography', 'Bird Watching'],
    food: ['Food Tours', 'Cooking Classes', 'Local Restaurants', 'Street Food', 'Wine Tasting'],
    relaxation: ['Spa Treatments', 'Beach Time', 'Meditation', 'Yoga Classes', 'Leisure Walks'],
    nightlife: ['Night Clubs', 'Live Music', 'Bars & Pubs', 'Night Markets', 'Evening Shows']
  };

  let activities = [];
  interests.forEach(interest => {
    if (activityDatabase[interest]) {
      activities = activities.concat(activityDatabase[interest]);
    }
  });

  // Add some default activities if no interests specified
  if (activities.length === 0) {
    activities = ['City Tour', 'Local Sightseeing', 'Photography Walk', 'Local Cuisine', 'Shopping'];
  }

  return [...new Set(activities)]; // Remove duplicates
}

// Helper function to generate day schedule
function generateDaySchedule(day, totalDays, activities, dailyBudget, allocation, interests) {
  const activityBudget = dailyBudget * allocation.activities;
  const foodBudget = dailyBudget * allocation.food;

  return {
    day,
    date: new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    morning: {
      time: '09:00 - 12:00',
      activity: activities[Math.floor(Math.random() * activities.length)],
      estimated_cost: Math.round(activityBudget * 0.4),
      description: 'Start your day with an exciting activity'
    },
    afternoon: {
      time: '14:00 - 17:00',
      activity: activities[Math.floor(Math.random() * activities.length)],
      estimated_cost: Math.round(activityBudget * 0.6),
      description: 'Continue exploring in the afternoon'
    },
    evening: {
      time: '19:00 - 22:00',
      activity: 'Dinner & Local Experience',
      estimated_cost: Math.round(foodBudget),
      description: 'Enjoy local cuisine and evening entertainment'
    },
    daily_budget_used: Math.round(activityBudget + foodBudget),
    highlights: day === 1 ? ['Arrival & Check-in'] : 
               day === totalDays ? ['Departure Preparation'] : 
               ['Full Day Exploration']
  };
}

// Helper function to calculate estimated cost
function calculateEstimatedCost(itinerary) {
  const accommodationCost = itinerary.budget_breakdown.accommodation;
  const foodCost = itinerary.budget_breakdown.food;
  const activitiesCost = itinerary.budget_breakdown.activities;
  const transportCost = itinerary.budget_breakdown.transport;

  return {
    accommodation: accommodationCost,
    food: foodCost,
    activities: activitiesCost,
    transport: transportCost,
    total: accommodationCost + foodCost + activitiesCost + transportCost,
    savings_vs_budget: itinerary.total_budget - (accommodationCost + foodCost + activitiesCost + transportCost)
  };
}

export default router; 