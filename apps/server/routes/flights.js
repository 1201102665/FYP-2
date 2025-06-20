import express from 'express';
import Amadeus from 'amadeus';
import { asyncHandler } from '../middleware/errorHandler.js';
import { optionalAuth, generateSessionId, logUserActivity } from '../middleware/auth.js';
import { validateFlightSearch } from '../utils/validation.js';
import { getAirlineLogo, getAirlineName as getAirlineNameFromUtil } from '../utils/airlineLogos.js';

const router = express.Router();

// Create a single, long-lived Amadeus client instance
// This automatically handles token refresh internally
let amadeusClient = null;

const initializeAmadeusClient = () => {
  if (!amadeusClient) {
    console.log('Initializing Amadeus client...');
    
    // Get credentials from environment variables
    const apiKey = process.env.AMADEUS_API_KEY;
    const apiSecret = process.env.AMADEUS_API_SECRET;
    const nodeEnv = process.env.NODE_ENV;
    
    // Verify environment variables are loaded
    if (!apiKey || !apiSecret) {
      console.error('❌ Amadeus API credentials not found in environment variables:');
      console.error('- AMADEUS_API_KEY:', apiKey ? '✅ Found' : '❌ Missing');
      console.error('- AMADEUS_API_SECRET:', apiSecret ? '✅ Found' : '❌ Missing');
      throw new Error('Amadeus API credentials not configured. Please check your environment variables.');
    }
    
    amadeusClient = new Amadeus({
      clientId: apiKey,
      clientSecret: apiSecret,
      hostname: nodeEnv === 'production' ? 'production' : 'test' // Use test environment by default
    });
    
    console.log('✅ Amadeus client initialized successfully');
    console.log(`🌍 Environment: ${nodeEnv === 'production' ? 'Production' : 'Test'}`);
  }
  return amadeusClient;
};

// Helper function to get airline name from IATA code
const getAirlineName = (iataCode) => {
  const airlines = {
    'AA': 'American Airlines',
    'AC': 'Air Canada', 
    'AF': 'Air France',
    'AK': 'AirAsia',
    'BA': 'British Airways',
    'CX': 'Cathay Pacific',
    'DL': 'Delta Air Lines',
    'EK': 'Emirates',
    'JQ': 'Jetstar',
    'KL': 'KLM',
    'LH': 'Lufthansa',
    'MH': 'Malaysia Airlines',
    'QF': 'Qantas',
    'QR': 'Qatar Airways',
    'SG': 'SpiceJet',
    'SQ': 'Singapore Airlines',
    'TG': 'Thai Airways',
    'UA': 'United Airlines',
    'VJ': 'VietJet Air',
    'VN': 'Vietnam Airlines'
  };
  return airlines[iataCode] || iataCode;
};

// Format duration from ISO 8601 format to readable format
const formatDuration = (isoDuration) => {
  if (!isoDuration) return 'N/A';
  
  // Parse ISO 8601 duration (e.g., "PT2H30M" -> "2h 30m")
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;
  
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  
  if (hours && minutes) {
    return `${hours}h ${minutes}m`;
  } else if (hours) {
    return `${hours}h`;
  } else if (minutes) {
    return `${minutes}m`;
  }
  return 'N/A';
};

// Get tomorrow's date in YYYY-MM-DD format for default searches
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

// Generate fallback flight data when API fails
const generateFallbackFlights = (origin, destination) => {
  const airlines = ['VJ', 'AK', 'MH', 'SQ', 'TG'];
  const fallbackFlights = [];
  
  for (let i = 0; i < 3; i++) {
    const airline = airlines[i % airlines.length];
    const departureHour = 8 + (i * 4);
    const arrivalHour = departureHour + 3;
    
    const departureTime = new Date();
    departureTime.setDate(departureTime.getDate() + 1);
    departureTime.setHours(departureHour, 30, 0, 0);
    
    const arrivalTime = new Date();
    arrivalTime.setDate(arrivalTime.getDate() + 1);
    arrivalTime.setHours(arrivalHour, 45, 0, 0);
    
    fallbackFlights.push({
      id: `fallback_${i}`,
      airline: getAirlineNameFromUtil(airline),
      airline_logo: getAirlineLogo(airline),
      flight_number: `${airline}${826 + i}`,
      origin: origin || 'KUL',
      destination: destination || 'DAD',
      origin_code: origin || 'KUL',
      destination_code: destination || 'DAD',
      departure_time: departureTime.toISOString(),
      arrival_time: arrivalTime.toISOString(),
      duration: '3h 15m',
      price: 299 + (i * 50),
      currency: 'EUR',
      stops: 0,
      status: 'scheduled',
      aircraft: 'A320',
      cabin_class: 'ECONOMY'
    });
  }
  
  return fallbackFlights;
};

// Popular flight routes for browsing
const getPopularRoutes = () => [
  { origin: 'KUL', destination: 'DAD' }, // Kuala Lumpur to Da Nang
  { origin: 'KUL', destination: 'SGN' }, // Kuala Lumpur to Ho Chi Minh
  { origin: 'KUL', destination: 'BKK' }, // Kuala Lumpur to Bangkok
  { origin: 'KUL', destination: 'SIN' }, // Kuala Lumpur to Singapore
  { origin: 'KUL', destination: 'NRT' }, // Kuala Lumpur to Tokyo
  { origin: 'SIN', destination: 'NRT' }, // Singapore to Tokyo
  { origin: 'BKK', destination: 'NRT' }, // Bangkok to Tokyo
  { origin: 'SGN', destination: 'BKK' }  // Ho Chi Minh to Bangkok
];

// Transform Amadeus flight offer to our format
const transformFlightOffer = (offer, index) => {
  try {
    const itinerary = offer.itineraries[0]; // First (outbound) itinerary
    const segment = itinerary.segments[0]; // First segment
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];
    
    // Get airline info
    const airlineCode = segment.carrierCode;
    const airline = getAirlineName(airlineCode);
    
    // Parse price
    const price = parseFloat(offer.price.total);
    const currency = offer.price.currency;
    
    // Calculate stops
    const stops = itinerary.segments.length - 1;
    
    return {
      id: offer.id || `flight_${index}`,
      airline: getAirlineNameFromUtil(airlineCode),
      airline_logo: getAirlineLogo(airlineCode),
      flight_number: `${airlineCode}${segment.number}`,
      origin: segment.departure.iataCode,
      destination: lastSegment.arrival.iataCode,
      origin_code: segment.departure.iataCode,
      destination_code: lastSegment.arrival.iataCode,
      departure_time: segment.departure.at,
      arrival_time: lastSegment.arrival.at,
      duration: formatDuration(itinerary.duration),
      price: price,
      currency: currency,
      stops: stops,
      status: 'scheduled',
      aircraft: segment.aircraft?.code || 'N/A',
      cabin_class: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY'
    };
  } catch (error) {
    console.error('Error transforming flight offer:', error);
    return null;
  }
};

// Browse flights endpoint (GET)
router.get('/browse', optionalAuth, asyncHandler(async (req, res) => {
  const { page = 1, per_page = 8 } = req.query;
  const userId = req.user ? req.user.id : null;
  const sessionId = generateSessionId(req);

  try {
    console.log('Browse flights request - initializing Amadeus client...');
    const amadeus = initializeAmadeusClient();
    
    // Log activity
    await logUserActivity(userId, sessionId, 'flight_browse', {
      page,
      per_page,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    const popularRoutes = getPopularRoutes();
    const routesToFetch = popularRoutes.slice(0, 3); // Limit to 3 routes to avoid API limits
    const allFlights = [];
    const departureDate = getTomorrowDate();

    console.log(`Fetching flights for ${routesToFetch.length} popular routes on ${departureDate}...`);

    // Fetch flights for each popular route
    for (const route of routesToFetch) {
      try {
        console.log(`Searching flights: ${route.origin} → ${route.destination}`);
        
        const response = await amadeus.shopping.flightOffersSearch.get({
          originLocationCode: route.origin,
          destinationLocationCode: route.destination,
          departureDate: departureDate,
          adults: 1,
          max: 5 // Limit per route
        });

        if (response.data && response.data.length > 0) {
          const transformedFlights = response.data
            .map((offer, index) => transformFlightOffer(offer, index))
            .filter(flight => flight !== null);
          
          allFlights.push(...transformedFlights);
          console.log(`✅ Found ${transformedFlights.length} flights for ${route.origin} → ${route.destination}`);
        } else {
          console.log(`⚠️ No flights found for ${route.origin} → ${route.destination}`);
        }
      } catch (routeError) {
        console.warn(`Failed to fetch flights for ${route.origin} → ${route.destination}:`, routeError.message);
      }
    }

    // Paginate results
    const startIndex = (parseInt(page) - 1) * parseInt(per_page);
    const endIndex = startIndex + parseInt(per_page);
    const paginatedFlights = allFlights.slice(startIndex, endIndex);

    console.log(`📊 Total flights found: ${allFlights.length}, returning page ${page} with ${paginatedFlights.length} flights`);

    res.json({
      success: true,
      flights: paginatedFlights,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(per_page),
        total_results: allFlights.length,
        total_pages: Math.ceil(allFlights.length / parseInt(per_page)),
        has_next_page: endIndex < allFlights.length,
        has_prev_page: parseInt(page) > 1
      },
      message: `Found ${allFlights.length} flights from popular routes`
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

// Search flights endpoint (POST)
router.post('/search', optionalAuth, validateFlightSearch, asyncHandler(async (req, res) => {
  const {
    origin,
    destination,
    departure_date,
    return_date,
    passengers = 1,
    class: flightClass = 'ECONOMY',
    max = 20
  } = req.body;

  const userId = req.user ? req.user.id : null;
  const sessionId = generateSessionId(req);

  try {
    console.log('Flight search request:', { origin, destination, departure_date, passengers });
    const amadeus = initializeAmadeusClient();
    
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

    // If no specific search criteria, use browse mode
    if (!origin || !destination) {
      console.log('No search criteria provided, redirecting to browse mode...');
      return res.redirect('/api/flights/browse');
    }

    // Use provided date or tomorrow if not specified
    const searchDate = departure_date || getTomorrowDate();

    // Prepare search parameters
    const searchParams = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: searchDate,
      adults: passengers,
      max: Math.min(max, 250) // Amadeus allows max 250 results
    };

    // Add return date for round trip
    if (return_date) {
      searchParams.returnDate = return_date;
    }

    // Add travel class if specified
    if (flightClass && flightClass.toUpperCase() !== 'ECONOMY') {
      searchParams.travelClass = flightClass.toUpperCase();
    }

    console.log('🔍 Amadeus search parameters:', searchParams);

    // Search flights using Amadeus SDK with timeout
    const searchPromise = amadeus.shopping.flightOffersSearch.get(searchParams);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout after 15 seconds')), 15000)
    );
    
    const response = await Promise.race([searchPromise, timeoutPromise]);

    console.log(`✅ Amadeus returned ${response.data ? response.data.length : 0} flight offers`);

    if (!response.data || response.data.length === 0) {
      return res.json({
        success: true,
        flights: [],
        message: 'No flights found for the specified route and date',
        search_criteria: { origin, destination, departure_date: searchDate, passengers }
      });
    }

    // Transform flight offers to our format
    const transformedFlights = response.data
      .map((offer, index) => transformFlightOffer(offer, index))
      .filter(flight => flight !== null);

    console.log(`📋 Transformed ${transformedFlights.length} flights successfully`);

    res.json({
      success: true,
      flights: transformedFlights,
      search_criteria: { origin, destination, departure_date: searchDate, passengers },
      message: `Found ${transformedFlights.length} flights`,
      total_results: transformedFlights.length
    });

  } catch (error) {
    console.error('Flight search error:', error);
    
    // Handle specific Amadeus errors
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.error_description || error.message;
      
      if (statusCode === 400) {
        // Return fallback data for invalid search parameters
        console.log('⚠️ Invalid search parameters, providing fallback data');
        return res.json({
          success: true,
          flights: generateFallbackFlights(origin, destination),
          message: 'Showing sample flights due to search parameter issues',
          search_criteria: { origin, destination, departure_date: searchDate, passengers },
          source: 'fallback'
        });
      } else if (statusCode === 401) {
        return res.status(500).json({
          success: false,
          message: 'API authentication failed',
          error: 'Please check Amadeus API credentials'
        });
      } else if (statusCode === 429) {
        // Rate limit exceeded - provide fallback data
        console.log('⚠️ API rate limit exceeded, providing fallback data');
        return res.json({
          success: true,
          flights: generateFallbackFlights(origin, destination),
          message: 'Showing sample flights due to API rate limits',
          search_criteria: { origin, destination, departure_date: searchDate, passengers },
          source: 'fallback'
        });
      }
    }

    // For timeout or other errors, provide fallback data instead of throwing error
    if (error.message.includes('timeout') || error.message.includes('network')) {
      console.log('⚠️ Network timeout, providing fallback data');
      return res.json({
        success: true,
        flights: generateFallbackFlights(origin, destination),
        message: 'Showing sample flights due to network issues',
        search_criteria: { origin, destination, departure_date: searchDate, passengers },
        source: 'fallback'
      });
    }

    // Last resort - return minimal error but keep success true to prevent infinite loading
    res.json({
      success: true,
      flights: [],
      message: 'No flights available at the moment. Please try again later.',
      search_criteria: { origin, destination, departure_date: searchDate, passengers },
      error: 'Service temporarily unavailable'
    });
  }
}));

// Get flight details by ID (if needed for future use)
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // For now, return a placeholder response
  // In a real implementation, you might store flight details in your database
  res.json({
    success: false,
    message: 'Flight details endpoint not implemented. Use search to get flight information.'
  });
}));

export default router; 