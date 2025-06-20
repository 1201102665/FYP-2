import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logUserActivity, generateSessionId } from '../middleware/auth.js';
import db from '../config/database.js';

const router = express.Router();

// Search endpoint - migrated from search_submit.php
router.post('/', asyncHandler(async (req, res) => {
  const { search_type, ...searchParams } = req.body;

  // Validate search type
  const validSearchTypes = ['hotels', 'flights', 'cars', 'packages'];
  if (!search_type || !validSearchTypes.includes(search_type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid search_type. Must be one of: ' + validSearchTypes.join(', ')
    });
  }

  try {
    let query = '';
    let params = [];
    let searchParameters = { search_type };
    let results = [];

    switch (search_type) {
      case 'flights':
        query = "SELECT * FROM flights WHERE 1=1";
        
        if (searchParams.origin) {
          query += " AND origin LIKE ?";
          params.push('%' + searchParams.origin + '%');
          searchParameters.origin = searchParams.origin;
        }
        
        if (searchParams.destination) {
          query += " AND destination LIKE ?";
          params.push('%' + searchParams.destination + '%');
          searchParameters.destination = searchParams.destination;
        }
        
        if (searchParams.departure_date) {
          query += " AND DATE(departure_time) = ?";
          params.push(searchParams.departure_date);
          searchParameters.departure_date = searchParams.departure_date;
        }
        
        if (searchParams.passengers) {
          query += " AND available_seats >= ?";
          params.push(parseInt(searchParams.passengers));
          searchParameters.passengers = searchParams.passengers;
        }
        
        query += " ORDER BY departure_time ASC";
        break;

      case 'hotels':
        query = "SELECT * FROM hotels WHERE 1=1";
        
        if (searchParams.location) {
          query += " AND location LIKE ?";
          params.push('%' + searchParams.location + '%');
          searchParameters.location = searchParams.location;
        }
        
        if (searchParams.check_in && searchParams.check_out) {
          searchParameters.check_in = searchParams.check_in;
          searchParameters.check_out = searchParams.check_out;
        }
        
        if (searchParams.rooms) {
          query += " AND available_rooms >= ?";
          params.push(parseInt(searchParams.rooms));
          searchParameters.rooms = searchParams.rooms;
        }
        
        if (searchParams.min_price) {
          query += " AND price_per_night >= ?";
          params.push(parseFloat(searchParams.min_price));
          searchParameters.min_price = searchParams.min_price;
        }
        
        if (searchParams.max_price) {
          query += " AND price_per_night <= ?";
          params.push(parseFloat(searchParams.max_price));
          searchParameters.max_price = searchParams.max_price;
        }
        
        query += " ORDER BY rating DESC, price_per_night ASC";
        break;

      case 'cars':
        query = "SELECT * FROM cars WHERE 1=1";
        
        if (searchParams.location) {
          query += " AND location LIKE ?";
          params.push('%' + searchParams.location + '%');
          searchParameters.location = searchParams.location;
        }
        
        if (searchParams.car_type) {
          query += " AND type = ?";
          params.push(searchParams.car_type);
          searchParameters.car_type = searchParams.car_type;
        }
        
        if (searchParams.pickup_date && searchParams.return_date) {
          searchParameters.pickup_date = searchParams.pickup_date;
          searchParameters.return_date = searchParams.return_date;
        }
        
        if (searchParams.min_price) {
          query += " AND price_per_day >= ?";
          params.push(parseFloat(searchParams.min_price));
          searchParameters.min_price = searchParams.min_price;
        }
        
        if (searchParams.max_price) {
          query += " AND price_per_day <= ?";
          params.push(parseFloat(searchParams.max_price));
          searchParameters.max_price = searchParams.max_price;
        }
        
        query += " ORDER BY price_per_day ASC";
        break;

      case 'packages':
        query = "SELECT * FROM packages WHERE 1=1";
        
        if (searchParams.destination) {
          query += " AND destination LIKE ?";
          params.push('%' + searchParams.destination + '%');
          searchParameters.destination = searchParams.destination;
        }
        
        if (searchParams.duration) {
          query += " AND duration = ?";
          params.push(parseInt(searchParams.duration));
          searchParameters.duration = searchParams.duration;
        }
        
        if (searchParams.min_price) {
          query += " AND price >= ?";
          params.push(parseFloat(searchParams.min_price));
          searchParameters.min_price = searchParams.min_price;
        }
        
        if (searchParams.max_price) {
          query += " AND price <= ?";
          params.push(parseFloat(searchParams.max_price));
          searchParameters.max_price = searchParams.max_price;
        }
        
        if (searchParams.start_date) {
          query += " AND start_date >= ?";
          params.push(searchParams.start_date);
          searchParameters.start_date = searchParams.start_date;
        }
        
        query += " ORDER BY price ASC";
        break;
    }

    // Execute the search query
    results = await db.query(query, params);
    const resultsCount = results.length;

    // Log the search activity
    const userId = req.user?.id || null;
    const sessionId = generateSessionId(req);
    
    // Insert search log
    if (userId) {
      await db.query(`
        INSERT INTO search_logs (user_id, search_type, search_parameters, results_count, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `, [
        userId,
        search_type,
        JSON.stringify(searchParameters),
        resultsCount,
        req.ip,
        req.get('User-Agent')
      ]);

      // Log user activity
      await logUserActivity(userId, sessionId, 'search_performed', {
        search_type,
        results_count: resultsCount,
        search_parameters: searchParameters
      });
    }

    res.json({
      success: true,
      search_type,
      results_count: resultsCount,
      results,
      search_parameters: searchParameters
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

// Get search history for user
router.get('/history', asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  try {
    const searchHistory = await db.query(`
      SELECT 
        id,
        search_type,
        search_parameters,
        results_count,
        created_at
      FROM search_logs 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 20
    `, [req.user.id]);

    res.json({
      success: true,
      history: searchHistory.map(entry => ({
        ...entry,
        search_parameters: JSON.parse(entry.search_parameters)
      }))
    });
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch search history'
    });
  }
}));

// Enhanced Hotels Search - migrated from search_hotels.php
router.get('/hotels', asyncHandler(async (req, res) => {
  const {
    destination = '',
    checkin_date = '',
    checkout_date = '',
    min_price = 0,
    max_price = 999999,
    guests = 1,
    rooms = 1,
    rating = 0,
    amenities = '',
    hotel_type = '',
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
      whereConditions.push('(destination LIKE ? OR location LIKE ? OR name LIKE ?)');
      values.push(`%${destination}%`, `%${destination}%`, `%${destination}%`);
    }

    if (parseFloat(min_price) > 0) {
      whereConditions.push('price_per_night >= ?');
      values.push(parseFloat(min_price));
    }

    if (parseFloat(max_price) < 999999) {
      whereConditions.push('price_per_night <= ?');
      values.push(parseFloat(max_price));
    }

    if (parseInt(guests) > 0) {
      whereConditions.push('max_guests >= ?');
      values.push(parseInt(guests));
    }

    if (parseFloat(rating) > 0) {
      whereConditions.push('rating >= ?');
      values.push(parseFloat(rating));
    }

    if (hotel_type && hotel_type !== 'all') {
      whereConditions.push('hotel_type = ?');
      values.push(hotel_type);
    }

    if (amenities) {
      const amenityList = amenities.split(',').map(a => a.trim());
      amenityList.forEach(amenity => {
        whereConditions.push('amenities LIKE ?');
        values.push(`%${amenity}%`);
      });
    }

    // Build ORDER BY clause
    let orderBy = 'rating DESC, price_per_night ASC';
    switch (sort_by) {
      case 'price_low':
        orderBy = 'price_per_night ASC';
        break;
      case 'price_high':
        orderBy = 'price_per_night DESC';
        break;
      case 'rating_high':
        orderBy = 'rating DESC';
        break;
      case 'rating_low':
        orderBy = 'rating ASC';
        break;
      case 'name':
        orderBy = 'name ASC';
        break;
    }

    const whereClause = whereConditions.join(' AND ');
    
    // Get hotels
    const hotels = await db.query(`
      SELECT 
        id, name, description, destination, location, price_per_night,
        images, amenities, rating, hotel_type, max_guests, created_at
      FROM hotels 
      WHERE ${whereClause} 
      ORDER BY ${orderBy} 
      LIMIT ? OFFSET ?
    `, [...values, parseInt(limit), offset]);

    // Get total count for pagination
    const countResult = await db.queryOne(`
      SELECT COUNT(*) as total FROM hotels WHERE ${whereClause}
    `, values);

    // Format hotels data
    const formattedHotels = hotels.map(hotel => ({
      id: parseInt(hotel.id),
      name: hotel.name,
      description: hotel.description,
      destination: hotel.destination,
      location: hotel.location,
      price_per_night: parseFloat(hotel.price_per_night),
      images: JSON.parse(hotel.images || '[]'),
      amenities: JSON.parse(hotel.amenities || '[]'),
      rating: parseFloat(hotel.rating),
      hotel_type: hotel.hotel_type,
      max_guests: parseInt(hotel.max_guests),
      created_at: hotel.created_at
    }));

    // Log search activity
    if (req.user) {
      await logUserActivity(req.user.id, req.ip, 'hotel_search', {
        destination,
        checkin_date,
        checkout_date,
        guests,
        rooms,
        user_agent: req.get('User-Agent')
      });
    }

    res.json({
      success: true,
      data: {
        hotels: formattedHotels,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: parseInt(countResult.total),
          total_pages: Math.ceil(countResult.total / parseInt(limit)),
          has_more: (offset + parseInt(limit)) < countResult.total
        },
        search_criteria: {
          destination,
          checkin_date,
          checkout_date,
          min_price: parseFloat(min_price),
          max_price: parseFloat(max_price),
          guests: parseInt(guests),
          rooms: parseInt(rooms),
          rating: parseFloat(rating),
          amenities,
          hotel_type,
          sort_by
        }
      }
    });

  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching hotels'
    });
  }
}));

// Enhanced Flights Search - migrated from search_flights.php
router.get('/flights', asyncHandler(async (req, res) => {
  const {
    departure_city = '',
    arrival_city = '',
    departure_date = '',
    return_date = '',
    trip_type = 'one-way',
    passengers = 1,
    class_type = 'economy',
    min_price = 0,
    max_price = 999999,
    airline = '',
    stops = '',
    sort_by = '',
    page = 1,
    limit = 10
  } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    // Build WHERE clause based on filters
    const whereConditions = ['status = ?'];
    const values = ['active'];

    if (departure_city) {
      whereConditions.push('departure_city LIKE ?');
      values.push(`%${departure_city}%`);
    }

    if (arrival_city) {
      whereConditions.push('arrival_city LIKE ?');
      values.push(`%${arrival_city}%`);
    }

    if (departure_date) {
      whereConditions.push('DATE(departure_time) = ?');
      values.push(departure_date);
    }

    if (parseFloat(min_price) > 0) {
      whereConditions.push('price >= ?');
      values.push(parseFloat(min_price));
    }

    if (parseFloat(max_price) < 999999) {
      whereConditions.push('price <= ?');
      values.push(parseFloat(max_price));
    }

    if (airline && airline !== 'all') {
      whereConditions.push('airline = ?');
      values.push(airline);
    }

    if (stops && stops !== 'all') {
      if (stops === 'direct') {
        whereConditions.push('stops = 0');
      } else {
        whereConditions.push('stops = ?');
        values.push(parseInt(stops));
      }
    }

    // Build ORDER BY clause
    let orderBy = 'price ASC, departure_time ASC';
    switch (sort_by) {
      case 'price_low':
        orderBy = 'price ASC';
        break;
      case 'price_high':
        orderBy = 'price DESC';
        break;
      case 'departure_early':
        orderBy = 'departure_time ASC';
        break;
      case 'departure_late':
        orderBy = 'departure_time DESC';
        break;
      case 'arrival_early':
        orderBy = 'arrival_time ASC';
        break;
      case 'duration_short':
        orderBy = 'duration ASC';
        break;
    }

    const whereClause = whereConditions.join(' AND ');
    
    // Get flights
    const flights = await db.query(`
      SELECT 
        id, flight_number, airline, departure_city, arrival_city,
        departure_time, arrival_time, duration, price, stops,
        aircraft_type, class_type, created_at
      FROM flights 
      WHERE ${whereClause} 
      ORDER BY ${orderBy} 
      LIMIT ? OFFSET ?
    `, [...values, parseInt(limit), offset]);

    // Get total count for pagination
    const countResult = await db.queryOne(`
      SELECT COUNT(*) as total FROM flights WHERE ${whereClause}
    `, values);

    // Format flights data
    const formattedFlights = flights.map(flight => ({
      id: parseInt(flight.id),
      flight_number: flight.flight_number,
      airline: flight.airline,
      departure_city: flight.departure_city,
      arrival_city: flight.arrival_city,
      departure_time: flight.departure_time,
      arrival_time: flight.arrival_time,
      duration: flight.duration,
      price: parseFloat(flight.price),
      stops: parseInt(flight.stops),
      aircraft_type: flight.aircraft_type,
      class_type: flight.class_type,
      created_at: flight.created_at
    }));

    // Log search activity
    if (req.user) {
      await logUserActivity(req.user.id, req.ip, 'flight_search', {
        departure_city,
        arrival_city,
        departure_date,
        trip_type,
        passengers,
        user_agent: req.get('User-Agent')
      });
    }

    res.json({
      success: true,
      data: {
        flights: formattedFlights,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: parseInt(countResult.total),
          total_pages: Math.ceil(countResult.total / parseInt(limit)),
          has_more: (offset + parseInt(limit)) < countResult.total
        },
        search_criteria: {
          departure_city,
          arrival_city,
          departure_date,
          return_date,
          trip_type,
          passengers: parseInt(passengers),
          class_type,
          min_price: parseFloat(min_price),
          max_price: parseFloat(max_price),
          airline,
          stops,
          sort_by
        }
      }
    });

  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching flights'
    });
  }
}));

// Enhanced Cars Search - migrated from search_cars.php
router.get('/cars', asyncHandler(async (req, res) => {
  const {
    pickup_location = '',
    dropoff_location = '',
    pickup_date = '',
    pickup_time = '',
    dropoff_date = '',
    dropoff_time = '',
    car_type = '',
    transmission = '',
    fuel_type = '',
    seats = 1,
    min_price = 0,
    max_price = 999999,
    features = '',
    sort_by = '',
    page = 1,
    limit = 10
  } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    // Build WHERE clause based on filters
    const whereConditions = ['status = ?'];
    const values = ['active'];

    if (pickup_location) {
      whereConditions.push('(pickup_locations LIKE ? OR dropoff_locations LIKE ?)');
      values.push(`%${pickup_location}%`, `%${pickup_location}%`);
    }

    if (dropoff_location) {
      whereConditions.push('(pickup_locations LIKE ? OR dropoff_locations LIKE ?)');
      values.push(`%${dropoff_location}%`, `%${dropoff_location}%`);
    }

    if (parseFloat(min_price) > 0) {
      whereConditions.push('price_per_day >= ?');
      values.push(parseFloat(min_price));
    }

    if (parseFloat(max_price) < 999999) {
      whereConditions.push('price_per_day <= ?');
      values.push(parseFloat(max_price));
    }

    if (car_type && car_type !== 'all') {
      whereConditions.push('car_type = ?');
      values.push(car_type);
    }

    if (transmission && transmission !== 'all') {
      whereConditions.push('transmission = ?');
      values.push(transmission);
    }

    if (fuel_type && fuel_type !== 'all') {
      whereConditions.push('fuel_type = ?');
      values.push(fuel_type);
    }

    if (parseInt(seats) > 0) {
      whereConditions.push('seats >= ?');
      values.push(parseInt(seats));
    }

    if (features) {
      const featureList = features.split(',').map(f => f.trim());
      featureList.forEach(feature => {
        whereConditions.push('features LIKE ?');
        values.push(`%${feature}%`);
      });
    }

    // Build ORDER BY clause
    let orderBy = 'price_per_day ASC, model ASC';
    switch (sort_by) {
      case 'price_low':
        orderBy = 'price_per_day ASC';
        break;
      case 'price_high':
        orderBy = 'price_per_day DESC';
        break;
      case 'model':
        orderBy = 'model ASC';
        break;
      case 'brand':
        orderBy = 'brand ASC';
        break;
      case 'seats':
        orderBy = 'seats DESC';
        break;
    }

    const whereClause = whereConditions.join(' AND ');
    
    // Get cars
    const cars = await db.query(`
      SELECT 
        id, brand, model, car_type, transmission, fuel_type,
        seats, price_per_day, features, images, pickup_locations,
        dropoff_locations, created_at
      FROM cars 
      WHERE ${whereClause} 
      ORDER BY ${orderBy} 
      LIMIT ? OFFSET ?
    `, [...values, parseInt(limit), offset]);

    // Get total count for pagination
    const countResult = await db.queryOne(`
      SELECT COUNT(*) as total FROM cars WHERE ${whereClause}
    `, values);

    // Format cars data
    const formattedCars = cars.map(car => ({
      id: parseInt(car.id),
      brand: car.brand,
      model: car.model,
      car_type: car.car_type,
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      seats: parseInt(car.seats),
      price_per_day: parseFloat(car.price_per_day),
      features: JSON.parse(car.features || '[]'),
      images: JSON.parse(car.images || '[]'),
      pickup_locations: JSON.parse(car.pickup_locations || '[]'),
      dropoff_locations: JSON.parse(car.dropoff_locations || '[]'),
      created_at: car.created_at
    }));

    // Log search activity  
    if (req.user) {
      await logUserActivity(req.user.id, req.ip, 'car_search', {
        pickup_location,
        dropoff_location,
        pickup_date,
        car_type,
        seats,
        user_agent: req.get('User-Agent')
      });
    }

    res.json({
      success: true,
      data: {
        cars: formattedCars,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: parseInt(countResult.total),
          total_pages: Math.ceil(countResult.total / parseInt(limit)),
          has_more: (offset + parseInt(limit)) < countResult.total
        },
        search_criteria: {
          pickup_location,
          dropoff_location,
          pickup_date,
          pickup_time,
          dropoff_date,
          dropoff_time,
          car_type,
          transmission,
          fuel_type,
          seats: parseInt(seats),
          min_price: parseFloat(min_price),
          max_price: parseFloat(max_price),
          features,
          sort_by
        }
      }
    });

  } catch (error) {
    console.error('Car search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching cars'
    });
  }
}));

export default router; 