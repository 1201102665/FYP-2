import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { optionalAuth, generateSessionId, logUserActivity } from '../middleware/auth.js';
import { validateFlightSearch } from '../utils/validation.js';
import { getAirlineLogo, getAirlineName as getAirlineNameFromUtil } from '../utils/airlineLogos.js';
import db from '../config/database.js';

const router = express.Router();

// Helper function to calculate duration in minutes between two datetime strings
const calculateDurationMinutes = (departureTime, arrivalTime) => {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  return Math.round((arrival - departure) / (1000 * 60)); // Convert to minutes
};

// Helper function to format duration
const formatDuration = (minutes) => {
  if (!minutes) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours && remainingMinutes) {
    return `${hours}h ${remainingMinutes}m`;
  } else if (hours) {
    return `${hours}h`;
  } else if (remainingMinutes) {
    return `${remainingMinutes}m`;
  }
  return 'N/A';
};

// Helper function to transform database flight data to frontend format
const transformFlightData = (flight) => {
  const durationMinutes = calculateDurationMinutes(flight.departure_time, flight.arrival_time);
  
  return {
    id: flight.id,
    airline: flight.airline,
    airline_logo: flight.airline_logo,
    flight_number: flight.flight_number,
    origin: 'KUL', // Extracted from departure airport
    destination: 'DAD', // Extracted from arrival airport  
    origin_code: 'KUL',
    destination_code: 'DAD',
    origin_airport: flight.departure_airport || flight.origin_airport || 'Kuala Lumpur International Airport',
    destination_airport: flight.arrival_airport || flight.destination_airport || 'Da Nang International Airport',
    departure_time: flight.departure_time,
    arrival_time: flight.arrival_time,
    duration: durationMinutes,
    price: parseFloat(flight.price_economy || flight.price_myr || flight.price_eur || 0),
    currency: flight.price_myr ? 'MYR' : 'EUR',
    stops: flight.stops,
    status: 'scheduled',
    aircraft: flight.aircraft_type || flight.aircraft || 'Boeing 737',
    cabin_class: flight.travel_class || 'Economy',
    available_seats: flight.available_economy || Math.floor(Math.random() * 50) + 10,
    class: flight.travel_class || 'Economy',
    // Additional flight details
    base_fare: parseFloat(flight.base_fare_eur || flight.price_economy || 0),
    taxes: parseFloat(flight.taxes_eur || 0),
    cabin_baggage_kg: flight.cabin_baggage_kg || 7,
    checked_baggage_kg: flight.checked_baggage_kg || 20,
    refundable: flight.refundable || false,
    on_time_performance: flight.on_time_performance_pct || 90,
    carbon_footprint: flight.carbon_footprint || 'Medium',
    wifi_available: flight.wifi_available || true,
    entertainment_available: flight.entertainment_available || true,
    meals_available: flight.meals_available || true,
    cancellation_policy: flight.cancellation_policy || 'Standard cancellation policy applies',
    change_policy: flight.change_policy || 'Changes allowed with fee',
    created_at: flight.created_at,
    updated_at: flight.updated_at
  };
};

// Get tomorrow's date in YYYY-MM-DD format for default searches
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

// Browse flights endpoint (GET) - fetches from MySQL database
router.get('/browse', optionalAuth, asyncHandler(async (req, res) => {
  const { page = 1, per_page = 8 } = req.query;
  const userId = req.user ? req.user.id : null;
  const sessionId = generateSessionId(req);

  try {
    console.log('Browse flights request - fetching from database...');
    
    // Log activity
    await logUserActivity(userId, sessionId, 'flight_browse', {
      page,
      per_page,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(per_page);
    const limit = parseInt(per_page);

    // Get total count
    const countResult = await db.queryOne(`
      SELECT COUNT(*) as total 
      FROM flights f 
      WHERE f.status = ?
    `, ['scheduled']);
    const totalCount = countResult.total;

    // Fetch flights with pagination
    const flights = await db.query(`
      SELECT 
        f.id, f.flight_number, a.name as airline, a.logo_url as airline_logo,
        o.name as departure_airport, o.iata_code as departure_code, o.city as departure_city,
        d.name as arrival_airport, d.iata_code as arrival_code, d.city as arrival_city,
        f.departure_time, f.arrival_time, f.duration_minutes, f.price_myr as price, f.stops,
        f.aircraft_type, f.travel_class, f.created_at
      FROM flights f 
      JOIN airlines a ON f.airline_id = a.id
      JOIN airports o ON f.origin_airport_id = o.id
      JOIN airports d ON f.destination_airport_id = d.id
      WHERE f.status = ?
      ORDER BY f.departure_time ASC 
      LIMIT ? OFFSET ?
    `, ['scheduled', limit, offset]);

    // Transform the flight data to match expected format
    const transformedFlights = flights.map(flight => {
      return {
        id: parseInt(flight.id),
        flight_number: flight.flight_number,
        airline: flight.airline,
        airline_logo: flight.airline_logo,
        departure_airport: flight.departure_airport,
        departure_code: flight.departure_code,
        departure_city: flight.departure_city,
        arrival_airport: flight.arrival_airport,
        arrival_code: flight.arrival_code,
        arrival_city: flight.arrival_city,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        departure_datetime: flight.departure_time, // Alias for frontend compatibility
        arrival_datetime: flight.arrival_time, // Alias for frontend compatibility
        duration: formatDuration(flight.duration_minutes),
        duration_minutes: parseInt(flight.duration_minutes),
        price: parseFloat(flight.price),
        price_myr: parseFloat(flight.price),
        stops: parseInt(flight.stops),
        aircraft_type: flight.aircraft_type,
        travel_class: flight.travel_class,
        origin: flight.departure_code, // For frontend compatibility
        destination: flight.arrival_code, // For frontend compatibility
        origin_code: flight.departure_code,
        destination_code: flight.arrival_code,
        status: 'scheduled',
        created_at: flight.created_at
      };
    });

    console.log(`📊 Total flights found: ${totalCount}, returning page ${page} with ${transformedFlights.length} flights`);

    res.json({
      success: true,
      flights: transformedFlights,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(per_page),
        total_results: totalCount,
        total_pages: Math.ceil(totalCount / parseInt(per_page)),
        has_next_page: offset + limit < totalCount,
        has_prev_page: parseInt(page) > 1
      },
      message: totalCount > 0 ? `Found ${totalCount} flights` : 'No flights available'
    });

  } catch (error) {
    console.error('Browse flights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to browse flights',
      error: error.message
    });
  }
}));

// Search flights endpoint (POST) - searches MySQL database
router.post('/search', optionalAuth, validateFlightSearch, asyncHandler(async (req, res) => {
  const {
    origin,
    destination,
    departure_date,
    return_date,
    passengers = 1,
    class: flightClass = 'Economy',
    max = 20
  } = req.body;

  const userId = req.user ? req.user.id : null;
  const sessionId = generateSessionId(req);

  try {
    console.log('Flight search request:', { origin, destination, departure_date, passengers, class: flightClass });
    
    // Log search activity
    await logUserActivity(userId, sessionId, 'flight_search', {
      origin,
      destination,
      departure_date,
      return_date,
      passengers,
      class: flightClass,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    // If no specific search criteria, redirect to browse mode
    if (!origin || !destination) {
      console.log('No search criteria provided, redirecting to browse mode...');
      return res.redirect('/api/flights/browse');
    }

    // Use provided date or tomorrow if not specified
    const searchDate = departure_date || getTomorrowDate();

    // Build the search query with proper JOINs
    let searchQuery = `
      SELECT 
        f.id, f.flight_number, a.name as airline, a.logo_url as airline_logo,
        o.name as departure_airport, o.iata_code as departure_code, o.city as departure_city,
        d.name as arrival_airport, d.iata_code as arrival_code, d.city as arrival_city,
        f.departure_time, f.arrival_time, f.duration_minutes, f.price_myr as price, f.stops,
        f.aircraft_type, f.travel_class, f.created_at
      FROM flights f 
      JOIN airlines a ON f.airline_id = a.id
      JOIN airports o ON f.origin_airport_id = o.id
      JOIN airports d ON f.destination_airport_id = d.id
      WHERE f.status = ?
    `;
    let queryParams = ['scheduled'];

    // Add airport search criteria (search in airport names, codes, and cities)
    if (origin) {
      searchQuery += ' AND (o.name LIKE ? OR o.iata_code LIKE ? OR o.city LIKE ?)';
      queryParams.push(`%${origin}%`, `%${origin.toUpperCase()}%`, `%${origin}%`);
    }

    if (destination) {
      searchQuery += ' AND (d.name LIKE ? OR d.iata_code LIKE ? OR d.city LIKE ?)';
      queryParams.push(`%${destination}%`, `%${destination.toUpperCase()}%`, `%${destination}%`);
    }

    // Add date search (if specific date provided)
    if (departure_date) {
      searchQuery += ' AND DATE(f.departure_time) = ?';
      queryParams.push(searchDate);
    }

    // Add travel class filter
    if (flightClass && flightClass !== 'all') {
      searchQuery += ' AND f.travel_class = ?';
      queryParams.push(flightClass);
    }

    // Add ordering and limit
    searchQuery += ' ORDER BY f.departure_time ASC LIMIT ?';
    queryParams.push(Math.min(max, 50));

    console.log('🔍 Database search query:', searchQuery);
    console.log('🔍 Query parameters:', queryParams);

    // Execute the search
    const flights = await db.query(searchQuery, queryParams);

    console.log(`✅ Database returned ${flights.length} flight offers`);

    // Transform the flight data to match expected format
    const transformedFlights = flights.map(flight => {
      return {
        id: parseInt(flight.id),
        flight_number: flight.flight_number,
        airline: flight.airline,
        airline_logo: flight.airline_logo,
        departure_airport: flight.departure_airport,
        departure_code: flight.departure_code,
        departure_city: flight.departure_city,
        arrival_airport: flight.arrival_airport,
        arrival_code: flight.arrival_code,
        arrival_city: flight.arrival_city,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        departure_datetime: flight.departure_time, // Alias for frontend compatibility
        arrival_datetime: flight.arrival_time, // Alias for frontend compatibility
        duration: formatDuration(flight.duration_minutes),
        duration_minutes: parseInt(flight.duration_minutes),
        price: parseFloat(flight.price),
        price_myr: parseFloat(flight.price),
        stops: parseInt(flight.stops),
        aircraft_type: flight.aircraft_type,
        travel_class: flight.travel_class,
        origin: flight.departure_code, // For frontend compatibility
        destination: flight.arrival_code, // For frontend compatibility
        origin_code: flight.departure_code,
        destination_code: flight.arrival_code,
        status: 'scheduled',
        created_at: flight.created_at
      };
    });

    res.json({
      success: true,
      flights: transformedFlights,
      search_criteria: { origin, destination, departure_date: searchDate, passengers },
      message: transformedFlights.length > 0 ? `Found ${transformedFlights.length} flights` : 'No flights found for the specified route and date',
      total_results: transformedFlights.length
    });

  } catch (error) {
    console.error('Flight search error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to search flights',
      error: error.message
    });
  }
}));

// Get flight details by ID
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user ? req.user.id : null;
  const sessionId = generateSessionId(req);
  
  try {
    // Log activity
    await logUserActivity(userId, sessionId, 'flight_details_view', {
      flight_id: id,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    // Fetch flight details from database
    const flight = await db.queryOne(`
      SELECT 
        f.id, f.flight_number, a.name as airline, a.logo_url as airline_logo,
        o.name as departure_airport, o.iata_code as departure_code, o.city as departure_city,
        d.name as arrival_airport, d.iata_code as arrival_code, d.city as arrival_city,
        f.departure_time, f.arrival_time, f.duration_minutes, f.price_myr as price, f.stops,
        f.aircraft_type, f.travel_class, f.created_at
      FROM flights f 
      JOIN airlines a ON f.airline_id = a.id
      JOIN airports o ON f.origin_airport_id = o.id
      JOIN airports d ON f.destination_airport_id = d.id
      WHERE f.id = ?
    `, [id]);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    // Transform the flight data to match expected format
    const transformedFlight = {
      id: parseInt(flight.id),
      flight_number: flight.flight_number,
      airline: flight.airline,
      airline_logo: flight.airline_logo,
      departure_airport: flight.departure_airport,
      departure_code: flight.departure_code,
      departure_city: flight.departure_city,
      arrival_airport: flight.arrival_airport,
      arrival_code: flight.arrival_code,
      arrival_city: flight.arrival_city,
      departure_time: flight.departure_time,
      arrival_time: flight.arrival_time,
      departure_datetime: flight.departure_time, // Alias for frontend compatibility
      arrival_datetime: flight.arrival_time, // Alias for frontend compatibility
      duration: formatDuration(flight.duration_minutes),
      duration_minutes: parseInt(flight.duration_minutes),
      price: parseFloat(flight.price),
      price_myr: parseFloat(flight.price),
      stops: parseInt(flight.stops),
      aircraft_type: flight.aircraft_type,
      travel_class: flight.travel_class,
      origin: flight.departure_code, // For frontend compatibility
      destination: flight.arrival_code, // For frontend compatibility
      origin_code: flight.departure_code,
      destination_code: flight.arrival_code,
      status: 'scheduled',
      created_at: flight.created_at
    };

    res.json({
      success: true,
      flight: transformedFlight,
      message: 'Flight details retrieved successfully'
    });

  } catch (error) {
    console.error('Flight details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get flight details',
      error: error.message
    });
  }
}));

export default router; 