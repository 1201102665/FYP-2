import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateHotelSearch } from '../utils/validation.js';
import db from '../config/database.js';

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

// Helper function to transform hotel data
const transformHotelData = (hotel, rooms = []) => {
  return {
    id: hotel.id,
    name: hotel.name,
    chain: hotel.chain,
    category: hotel.category,
    star_rating: parseFloat(hotel.star_rating || 0),
    user_rating: parseFloat(hotel.user_rating || 0),
    rating: parseFloat(hotel.user_rating || 0), // Alias for compatibility
    address: hotel.address,
    city: hotel.city,
    country: hotel.country,
    location: `${hotel.city}, ${hotel.country}`,
    destination: hotel.city,
    latitude: parseFloat(hotel.latitude || 0),
    longitude: parseFloat(hotel.longitude || 0),
    description: hotel.description,
    amenities: parseJsonField(hotel.amenities),
    images: parseJsonField(hotel.images),
    check_in_time: hotel.check_in_time,
    check_out_time: hotel.check_out_time,
    cancellation_policy: hotel.cancellation_policy,
    contact_email: hotel.contact_email,
    contact_phone: hotel.contact_phone,
    website: hotel.website,
    status: hotel.status,
    created_at: hotel.created_at,
    updated_at: hotel.updated_at,
    // Calculate price from rooms if available
    price_per_night: rooms.length > 0 ? Math.min(...rooms.map(r => parseFloat(r.base_price))) : 0,
    hotel_type: hotel.category,
    max_guests: rooms.length > 0 ? Math.max(...rooms.map(r => parseInt(r.max_occupancy))) : 2,
    rooms: rooms.map(room => ({
      id: room.id,
      room_type: room.room_type,
      description: room.description,
      max_occupancy: parseInt(room.max_occupancy),
      size_sqm: parseInt(room.size_sqm || 0),
      bed_type: room.bed_type,
      amenities: parseJsonField(room.amenities),
      images: parseJsonField(room.images),
      base_price: parseFloat(room.base_price),
      total_rooms: parseInt(room.total_rooms),
      available_rooms: parseInt(room.available_rooms)
    }))
  };
};

// Browse all hotels (paginated)
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;

  try {
    console.log('🏨 Browsing hotels - Page:', page, 'Limit:', limit);

    // Get hotels with their cheapest room price
    const hotelsQuery = `
      SELECT 
        h.*,
        MIN(hr.base_price) as min_price,
        COUNT(hr.id) as room_count
      FROM hotels h
      LEFT JOIN hotel_rooms hr ON h.id = hr.hotel_id
      WHERE h.status = 'active'
      GROUP BY h.id
      ORDER BY h.user_rating DESC, h.star_rating DESC
      LIMIT ? OFFSET ?
    `;

    const hotels = await db.query(hotelsQuery, [limit, offset]);
    
    // Get total count for pagination
    const countResult = await db.queryOne('SELECT COUNT(*) as total FROM hotels WHERE status = "active"');
    const total = countResult.total;

    // Get rooms for each hotel
    const hotelIds = hotels.map(h => h.id);
    let rooms = [];
    
    if (hotelIds.length > 0) {
      const roomsQuery = `
        SELECT * FROM hotel_rooms 
        WHERE hotel_id IN (${hotelIds.map(() => '?').join(',')})
        ORDER BY base_price ASC
      `;
      rooms = await db.query(roomsQuery, hotelIds);
    }

    // Group rooms by hotel
    const roomsByHotel = rooms.reduce((acc, room) => {
      if (!acc[room.hotel_id]) acc[room.hotel_id] = [];
      acc[room.hotel_id].push(room);
      return acc;
    }, {});

    // Transform hotel data
    const transformedHotels = hotels.map(hotel => 
      transformHotelData(hotel, roomsByHotel[hotel.id] || [])
    );

    const pagination = {
      current_page: page,
      per_page: limit,
      total_results: total,
      total_pages: Math.ceil(total / limit),
      has_next_page: page < Math.ceil(total / limit),
      has_prev_page: page > 1
    };

    console.log('✅ Found', transformedHotels.length, 'hotels');

    res.json({
      success: true,
      data: {
        hotels: transformedHotels,
        pagination
      }
    });

  } catch (error) {
    console.error('❌ Error browsing hotels:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotels',
      error: error.message
    });
  }
}));

// Hotel Search
router.post('/search', optionalAuth, validateHotelSearch, asyncHandler(async (req, res) => {
  const {
    destination, city, country, check_in, check_out,
    rooms = 1, adults = 2, children = 0,
    hotel_type, min_rating, max_price, min_price,
    amenities = [], sort_by = 'recommended',
    page = 1, per_page = 20
  } = req.body;

  try {
    console.log('🔍 Hotel search request:', req.body);

    // Base query with index hints for better performance
    let query = `
      SELECT DISTINCT
        h.*,
        MIN(hr.base_price) as min_price,
        COUNT(hr.id) as room_count
      FROM hotels h USE INDEX (idx_status_search)
      LEFT JOIN hotel_rooms hr ON h.id = hr.hotel_id
      WHERE h.status = 'active'
    `;
    
    const queryParams = [];

    // Location filters with optimized LIKE patterns
    if (destination) {
      const searchTerms = destination.trim().split(/\s+/).filter(Boolean);
      if (searchTerms.length > 0) {
        const searchConditions = searchTerms.map(() => 
          `(h.name LIKE ? OR h.city LIKE ? OR h.country LIKE ? OR h.address LIKE ?)`
        ).join(' AND ');
        query += ` AND (${searchConditions})`;
        searchTerms.forEach(term => {
          const searchTerm = `%${term}%`;
          queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
        });
      }
    }
    
    if (city) {
      query += ` AND h.city LIKE ?`;
      queryParams.push(`%${city}%`);
    }
    
    if (country) {
      query += ` AND h.country LIKE ?`;
      queryParams.push(`%${country}%`);
    }

    // Rating filter
    if (min_rating) {
      query += ` AND h.user_rating >= ?`;
      queryParams.push(parseFloat(min_rating));
    }

    // Hotel type filter
    if (hotel_type && hotel_type !== 'all') {
      query += ` AND h.category = ?`;
      queryParams.push(hotel_type);
    }

    // Amenities filter with JSON search optimization
    if (amenities && amenities.length > 0) {
      const amenityConditions = amenities.map(() => 
        `JSON_CONTAINS(h.amenities, JSON_QUOTE(?), '$')`
      ).join(' AND ');
      query += ` AND (${amenityConditions})`;
      amenities.forEach(amenity => {
        queryParams.push(amenity);
      });
    }

    // Group by hotel
    query += ` GROUP BY h.id`;

    // Price filters
    if (min_price) {
      query += ` HAVING min_price >= ?`;
      queryParams.push(parseFloat(min_price));
    }
    if (max_price) {
      query += ` ${min_price ? 'AND' : 'HAVING'} min_price <= ?`;
      queryParams.push(parseFloat(max_price));
    }

    // Sorting
    query += ` ORDER BY `;
    switch (sort_by) {
      case 'price_low':
        query += 'min_price ASC';
        break;
      case 'price_high':
        query += 'min_price DESC';
        break;
      case 'rating':
        query += 'h.user_rating DESC, min_price ASC';
        break;
      case 'distance':
        query += 'h.user_rating DESC, min_price ASC'; // Fallback to rating for now
        break;
      default: // recommended
        query += 'h.user_rating DESC, h.star_rating DESC, min_price ASC';
    }

    // Pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(per_page, (page - 1) * per_page);

    // Execute search query with timeout and error handling
    let hotels = [];
    try {
      console.log('🔍 Executing search query:', { query, params: queryParams });
      hotels = await Promise.race([
        db.query(query, queryParams),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 5000)
        )
      ]);
    } catch (queryError) {
      console.error('❌ Primary query failed:', queryError);
      
      // Fallback to simpler query if complex one fails
      const fallbackQuery = `
        SELECT DISTINCT h.*
        FROM hotels h
        WHERE h.status = 'active'
        ${destination ? 'AND (h.name LIKE ? OR h.city LIKE ?)' : ''}
        ORDER BY h.user_rating DESC
        LIMIT ?
      `;
      
      const fallbackParams = destination 
        ? [`%${destination}%`, `%${destination}%`, per_page]
        : [per_page];
      
      console.log('🔄 Trying fallback query:', { fallbackQuery, fallbackParams });
      hotels = await db.query(fallbackQuery, fallbackParams);
    }

    // If still no hotels found, return empty result with success status
    if (!hotels || !hotels.length) {
      return res.json({
        success: true,
        data: {
          hotels: [],
          pagination: {
            current_page: page,
            per_page,
            total_results: 0,
            total_pages: 0,
            has_next_page: false,
            has_prev_page: false
          },
          search_criteria: req.body
        }
      });
    }

    // Get rooms with error handling
    let rooms = [];
    const hotelIds = hotels.map(h => h.id);
    
    if (hotelIds.length > 0) {
      try {
        const roomsQuery = `
          SELECT * FROM hotel_rooms 
          WHERE hotel_id IN (${hotelIds.map(() => '?').join(',')})
          ORDER BY base_price ASC
        `;
        rooms = await db.query(roomsQuery, hotelIds);
      } catch (roomsError) {
        console.error('❌ Error fetching rooms:', roomsError);
        // Continue without rooms data
      }
    }

    // Group rooms by hotel with safe fallbacks
    const roomsByHotel = rooms.reduce((acc, room) => {
      if (!acc[room.hotel_id]) acc[room.hotel_id] = [];
      acc[room.hotel_id].push(room);
      return acc;
    }, {});

    // Transform hotel data with safe parsing
    const transformedHotels = hotels.map(hotel => {
      try {
        return transformHotelData(hotel, roomsByHotel[hotel.id] || []);
      } catch (transformError) {
        console.error('❌ Error transforming hotel data:', transformError);
        // Return basic hotel data if transform fails
        return {
          id: hotel.id,
          name: hotel.name,
          city: hotel.city,
          country: hotel.country,
          status: hotel.status
        };
      }
    }).filter(Boolean); // Remove any null results

    const pagination = {
      current_page: page,
      per_page,
      total_results: transformedHotels.length,
      total_pages: Math.ceil(transformedHotels.length / per_page),
      has_next_page: page < Math.ceil(transformedHotels.length / per_page),
      has_prev_page: page > 1
    };

    console.log('✅ Hotel search completed. Found', transformedHotels.length, 'hotels');

    res.json({
      success: true,
      data: {
        hotels: transformedHotels,
        pagination,
        search_criteria: {
          destination, city, country, check_in, check_out,
          rooms, adults, children, hotel_type, min_rating,
          max_price, min_price, amenities, sort_by
        }
      }
    });

  } catch (error) {
    console.error('❌ Hotel search error:', error);
    
    // Return a more graceful error response
    res.status(error.status || 500).json({
      success: false,
      message: 'We encountered an issue while searching for hotels. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

// Get search suggestions for autocomplete
router.get('/suggestions', optionalAuth, asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.length < 2) {
    return res.json({
      success: true,
      data: { suggestions: [] }
    });
  }

  try {
    console.log('🔍 Getting search suggestions for:', q);

    const searchTerm = `%${q}%`;
    
    // Get hotel names and cities that match the search term
    const suggestions = await db.query(`
      SELECT DISTINCT 
        name as suggestion,
        'hotel' as type,
        city,
        country
      FROM hotels 
      WHERE status = 'active' 
        AND name LIKE ?
      
      UNION
      
      SELECT DISTINCT 
        CONCAT(city, ', ', country) as suggestion,
        'destination' as type,
        city,
        country
      FROM hotels 
      WHERE status = 'active' 
        AND (city LIKE ? OR country LIKE ?)
      
      ORDER BY suggestion ASC
      LIMIT 10
    `, [searchTerm, searchTerm, searchTerm]);

    const formattedSuggestions = suggestions.map(s => s.suggestion);

    console.log('✅ Found', formattedSuggestions.length, 'suggestions');

    res.json({
      success: true,
      data: {
        suggestions: formattedSuggestions
      }
    });

  } catch (error) {
    console.error('❌ Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching suggestions',
      error: error.message
    });
  }
}));

// Get single hotel by ID
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const hotelId = parseInt(req.params.id);
  
  if (!hotelId || isNaN(hotelId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid hotel ID'
    });
  }

  try {
    console.log('🏨 Getting hotel by ID:', hotelId);

    // Get hotel details
    const hotel = await db.queryOne(
      'SELECT * FROM hotels WHERE id = ? AND status = "active"',
      [hotelId]
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Get hotel rooms
    const rooms = await db.query(
      'SELECT * FROM hotel_rooms WHERE hotel_id = ? ORDER BY base_price ASC',
      [hotelId]
    );

    const transformedHotel = transformHotelData(hotel, rooms);

    console.log('✅ Found hotel:', transformedHotel.name);

    res.json({
      success: true,
      data: {
        hotel: transformedHotel
      }
    });

  } catch (error) {
    console.error('❌ Error getting hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotel details',
      error: error.message
    });
  }
}));

// Get hotels by destination/city (for destination-based searches)
router.get('/destination/:destination', optionalAuth, asyncHandler(async (req, res) => {
  const destination = req.params.destination;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;

  try {
    console.log('🏨 Getting hotels for destination:', destination);

    const query = `
      SELECT 
        h.*,
        MIN(hr.base_price) as min_price,
        COUNT(hr.id) as room_count
      FROM hotels h
      LEFT JOIN hotel_rooms hr ON h.id = hr.hotel_id
      WHERE h.status = 'active' 
        AND (h.city LIKE ? OR h.country LIKE ? OR h.address LIKE ?)
      GROUP BY h.id
      ORDER BY h.user_rating DESC, h.star_rating DESC
      LIMIT ? OFFSET ?
    `;

    const searchTerm = `%${destination}%`;
    const hotels = await db.query(query, [searchTerm, searchTerm, searchTerm, limit, offset]);

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT h.id) as total 
      FROM hotels h 
      WHERE h.status = 'active' 
        AND (h.city LIKE ? OR h.country LIKE ? OR h.address LIKE ?)
    `;
    const countResult = await db.queryOne(countQuery, [searchTerm, searchTerm, searchTerm]);
    const total = countResult.total;

    // Get rooms for each hotel
    const hotelIds = hotels.map(h => h.id);
    let rooms = [];
    
    if (hotelIds.length > 0) {
      const roomsQuery = `
        SELECT * FROM hotel_rooms 
        WHERE hotel_id IN (${hotelIds.map(() => '?').join(',')})
        ORDER BY base_price ASC
      `;
      rooms = await db.query(roomsQuery, hotelIds);
    }

    // Group rooms by hotel
    const roomsByHotel = rooms.reduce((acc, room) => {
      if (!acc[room.hotel_id]) acc[room.hotel_id] = [];
      acc[room.hotel_id].push(room);
      return acc;
    }, {});

    // Transform hotel data
    const transformedHotels = hotels.map(hotel => 
      transformHotelData(hotel, roomsByHotel[hotel.id] || [])
    );

    const pagination = {
      current_page: page,
      per_page: limit,
      total_results: total,
      total_pages: Math.ceil(total / limit),
      has_next_page: page < Math.ceil(total / limit),
      has_prev_page: page > 1
    };

    console.log('✅ Found', transformedHotels.length, 'hotels for destination:', destination);

    res.json({
      success: true,
      data: {
        hotels: transformedHotels,
        pagination,
        destination
      }
    });

  } catch (error) {
    console.error('❌ Error getting hotels by destination:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotels for destination',
      error: error.message
    });
  }
}));

export default router; 