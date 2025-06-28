import express from 'express';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import db from '../config/database.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Helper function to parse JSON fields safely
const parseJsonField = (field) => {
  if (!field) return [];
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      return [];
    }
  }
  return field;
};

// Helper function to generate proper car image URLs
const generateCarImageUrls = (images, carMake, carModel, carCategory) => {
  if (!images || images.length === 0) {
    // Return category-specific fallback images
    const fallbacks = getCategoryFallbackImages(carCategory);
    return fallbacks;
  }

  // Convert relative paths to full URLs or use fallbacks
  const processedImages = images.map(image => {
    if (image.startsWith('http')) {
      return image; // Already a full URL
    }

    // For local images, check if they exist, otherwise use fallbacks
    const imageUrl = `/images/cars/${image}`;

    // For now, since we don't have the actual car images, use specific fallbacks
    const fallback = getCategoryFallbackImages(carCategory)[0];
    return fallback;
  });

  return processedImages;
};

// Helper function to get category-specific fallback images
const getCategoryFallbackImages = (category) => {
  const fallbackImages = {
    luxury: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60'
    ],
    suv: [
      'https://images.unsplash.com/photo-1566473179817-0a9e8b10e43e?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1580293666864-c0d2b8e8e98e?w=800&auto=format&fit=crop&q=60'
    ],
    economy: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&auto=format&fit=crop&q=60'
    ],
    compact: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1607734834512-7973f6d4d799?w=800&auto=format&fit=crop&q=60'
    ],
    standard: [
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&auto=format&fit=crop&q=60'
    ],
    premium: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1571876019459-4c3c81db85c8?w=800&auto=format&fit=crop&q=60'
    ]
  };

  return fallbackImages[category] || fallbackImages.standard;
};

// Debug endpoint to check raw database content
router.get('/debug', asyncHandler(async (req, res) => {
  try {
    console.log('🔧 Debug: Checking raw database content');

    // Get all cars with their makes and categories
    const cars = await db.query('SELECT id, make, model, category FROM cars LIMIT 20');

    console.log('🔧 Debug: Raw cars from DB:', cars);

    res.json({
      success: true,
      debug: true,
      total_cars: cars.length,
      cars: cars,
      makes: [...new Set(cars.map(car => car.make))],
      categories: [...new Set(cars.map(car => car.category))]
    });

  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug failed',
      error: error.message
    });
  }
}));

// Debug search endpoint
router.get('/debug-search/:term', asyncHandler(async (req, res) => {
  try {
    const { term } = req.params;
    console.log('🔧 Debug search for:', term);

    // Test simple searches
    const bmwCars = await db.query('SELECT * FROM cars WHERE LOWER(make) LIKE \'%bmw%\'');
    const mercedesCars = await db.query('SELECT * FROM cars WHERE LOWER(make) LIKE \'%mercedes%\'');
    const luxuryCars = await db.query('SELECT * FROM cars WHERE LOWER(category) = \'luxury\'');

    res.json({
      success: true,
      debug_search: term,
      bmw_cars: bmwCars.length,
      mercedes_cars: mercedesCars.length,
      luxury_cars: luxuryCars.length,
      bmw_results: bmwCars,
      mercedes_results: mercedesCars,
      luxury_results: luxuryCars
    });

  } catch (error) {
    console.error('❌ Debug search error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug search failed',
      error: error.message
    });
  }
}));

// Simple GET endpoint to retrieve all cars
router.get('/', asyncHandler(async (req, res) => {
  try {
    // First check if we have any cars in the database
    const [{ count }] = await db.query('SELECT COUNT(*) as count FROM cars');

    if (count === 0) {
      return res.json({
        success: true,
        data: {
          cars: [],
          pagination: {
            current_page: 1,
            per_page: 10,
            total_results: 0,
            total_pages: 0,
            has_next_page: false,
            has_prev_page: false
          }
        }
      });
    }

    const { page = 1, per_page = 12 } = req.query;
    const offset = (page - 1) * per_page;

    // Get cars with pagination
    const cars = await db.query(
      'SELECT * FROM cars WHERE status = "available" LIMIT ? OFFSET ?',
      [parseInt(per_page), offset]
    );

    // Transform the data to ensure proper JSON parsing
    const transformedCars = cars.map(car => ({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      category: car.category,
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      doors: car.doors,
      seats: car.seats,
      luggage_capacity: car.luggage_capacity,
      air_conditioning: Boolean(car.air_conditioning),
      features: parseJsonField(car.features),
      images: generateCarImageUrls(parseJsonField(car.images), car.make, car.model, car.category),
      daily_rate: parseFloat(car.daily_rate),
      location_city: car.location_city,
      location_country: car.location_country,
      rental_company: car.rental_company,
      available_cars: parseInt(car.available_cars),
      mileage_limit: parseInt(car.mileage_limit),
      min_driver_age: parseInt(car.min_driver_age),
      status: car.status,
      rating: 4.5,
      review_count: Math.floor(Math.random() * 50) + 10
    }));

    res.json({
      success: true,
      data: {
        cars: transformedCars,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(per_page),
          total_results: parseInt(count),
          total_pages: Math.ceil(count / per_page),
          has_next_page: offset + cars.length < count,
          has_prev_page: page > 1
        }
      }
    });

  } catch (error) {
    console.error('❌ Error getting cars:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cars',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

// Car Search endpoint with proper filtering
router.post('/search', asyncHandler(async (req, res) => {
  try {
    // First check if we have any cars in the database
    const [{ count }] = await db.query('SELECT COUNT(*) as count FROM cars');

    if (count === 0) {
      return res.json({
        success: true,
        data: {
          cars: [],
          pagination: {
            current_page: 1,
            per_page: 10,
            total_results: 0,
            total_pages: 0,
            has_next_page: false,
            has_prev_page: false
          }
        }
      });
    }

    const {
      pickup_location,
      return_location,
      pickup_date,
      return_date,
      category,
      transmission,
      min_price,
      max_price,
      features,
      sort_by,
      page = 1,
      per_page = 10
    } = req.body;

    // Build the WHERE clause
    const whereConditions = [];
    const values = [];

    // Location and car search - simplified and reliable
    if (pickup_location && pickup_location.trim() !== '') {
      const searchTerm = pickup_location.toLowerCase().trim();

      // Special handling for common brands and categories
      const commonBrands = {
        'mercedes': 'mercedes-benz',
        'mercedes benz': 'mercedes-benz',
        'mercedes-benz': 'mercedes-benz',
        'bmw': 'bmw',
        'audi': 'audi',
        'toyota': 'toyota',
        'honda': 'honda'
      };

      const commonCategories = ['luxury', 'suv', 'economy', 'compact'];

      // Check if it's a common brand search
      if (commonBrands[searchTerm]) {
        whereConditions.push('LOWER(make) LIKE ?');
        values.push(`%${commonBrands[searchTerm]}%`);
      }
      // Check if it's a category search
      else if (commonCategories.includes(searchTerm)) {
        whereConditions.push('LOWER(category) LIKE ?');
        values.push(`%${searchTerm}%`);
      }
      // General search
      else {
        whereConditions.push('(LOWER(make) LIKE ? OR LOWER(model) LIKE ? OR LOWER(category) LIKE ? OR LOWER(location_city) LIKE ? OR LOWER(location_country) LIKE ?)');
        values.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
      }
    }

    // Category filter
    if (category && category !== 'all') {
      whereConditions.push('LOWER(category) LIKE ?');
      values.push(`%${category.toLowerCase()}%`);
    }

    // Transmission filter
    if (transmission && transmission !== 'all') {
      whereConditions.push('LOWER(transmission) LIKE ?');
      values.push(`%${transmission.toLowerCase()}%`);
    }

    // Price range filter
    if (min_price) {
      whereConditions.push('daily_rate >= ?');
      values.push(parseFloat(min_price));
    }
    if (max_price) {
      whereConditions.push('daily_rate <= ?');
      values.push(parseFloat(max_price));
    }

    // Features filter - using JSON_CONTAINS for proper JSON field handling
    if (features && features.length > 0) {
      const featureConditions = features.map(feature => {
        values.push(feature.toLowerCase());
        return 'JSON_CONTAINS(LOWER(features), LOWER(?))';
      });
      whereConditions.push(`(${featureConditions.join(' OR ')})`);
    }

    // Build the ORDER BY clause
    let orderBy = 'RAND()'; // Default to random for recommended
    switch (sort_by) {
      case 'price_low':
        orderBy = 'daily_rate ASC';
        break;
      case 'price_high':
        orderBy = 'daily_rate DESC';
        break;
      case 'rating':
        orderBy = 'RAND()';
        break;
      case 'popularity':
        orderBy = 'available_cars ASC';
        break;
    }

    // Calculate pagination
    const offset = (page - 1) * per_page;

    // Build the final query
    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Get cars with pagination
    const cars = await db.query(
      `SELECT * FROM cars ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...values, parseInt(per_page), offset]
    );

    // Get total count for pagination
    const [{ total }] = await db.query(
      `SELECT COUNT(*) as total FROM cars ${whereClause}`,
      values
    );

    // Transform the data to ensure proper JSON parsing
    const transformedCars = cars.map(car => ({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      category: car.category,
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      doors: car.doors,
      seats: car.seats,
      luggage_capacity: car.luggage_capacity,
      air_conditioning: Boolean(car.air_conditioning),
      features: parseJsonField(car.features),
      images: generateCarImageUrls(parseJsonField(car.images), car.make, car.model, car.category),
      daily_rate: parseFloat(car.daily_rate),
      location_city: car.location_city,
      location_country: car.location_country,
      rental_company: car.rental_company,
      available_cars: parseInt(car.available_cars),
      mileage_limit: parseInt(car.mileage_limit),
      min_driver_age: parseInt(car.min_driver_age),
      status: car.status,
      rating: 4.5,
      review_count: Math.floor(Math.random() * 50) + 10
    }));

    res.json({
      success: true,
      data: {
        cars: transformedCars,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(per_page),
          total_results: parseInt(total),
          total_pages: Math.ceil(total / per_page),
          has_next_page: offset + cars.length < total,
          has_prev_page: page > 1
        }
      }
    });

  } catch (error) {
    console.error('❌ Error searching cars:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search cars',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

// Enhanced autocomplete endpoint for car search fields
router.get('/autocomplete', asyncHandler(async (req, res) => {
  const { field, q = '' } = req.query;
  let suggestions = [];

  if (field === 'make') {
    const rows = await db.query('SELECT DISTINCT make FROM cars');
    suggestions = rows.map(row => row.make);
  } else if (field === 'category') {
    const rows = await db.query('SELECT DISTINCT category FROM cars');
    suggestions = rows.map(row => row.category);
  } else if (field === 'seats') {
    const rows = await db.query('SELECT DISTINCT seats FROM cars');
    suggestions = rows.map(row => row.seats);
  } else if (field === 'location_country') {
    const searchTerm = `%${q}%`;
    const rows = await db.query('SELECT DISTINCT location_country FROM cars WHERE location_country LIKE ? LIMIT 10', [searchTerm]);
    suggestions = rows.map(row => row.location_country);
  } else if (field === 'location_city') {
    const searchTerm = `%${q}%`;
    const rows = await db.query('SELECT DISTINCT location_city FROM cars WHERE location_city LIKE ? LIMIT 10', [searchTerm]);
    suggestions = rows.map(row => row.location_city);
  } else if (field === 'daily_rate') {
    const rows = await db.query('SELECT DISTINCT daily_rate FROM cars');
    suggestions = rows.map(row => row.daily_rate);
  } else {
    return res.status(400).json({ success: false, message: 'Invalid field for autocomplete' });
  }

  res.json({ success: true, suggestions });
}));

// Get car details by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const car = await db.queryOne('SELECT * FROM cars WHERE id = ?', [id]);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Transform the car data
    const transformedCar = {
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      category: car.category,
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      doors: car.doors,
      seats: car.seats,
      luggage_capacity: car.luggage_capacity,
      air_conditioning: Boolean(car.air_conditioning),
      features: parseJsonField(car.features),
      images: generateCarImageUrls(parseJsonField(car.images), car.make, car.model, car.category),
      daily_rate: parseFloat(car.daily_rate),
      location_city: car.location_city,
      location_country: car.location_country,
      rental_company: car.rental_company,
      available_cars: parseInt(car.available_cars),
      mileage_limit: parseInt(car.mileage_limit),
      min_driver_age: parseInt(car.min_driver_age),
      status: car.status,
      rating: 4.5, // Default rating
      review_count: Math.floor(Math.random() * 50) + 10 // Random review count for demo
    };

    res.json({
      success: true,
      data: transformedCar
    });

  } catch (error) {
    console.error('❌ Error fetching car details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch car details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

export default router; 