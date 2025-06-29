import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken, logUserActivity } from '../middleware/auth.js';
import db from '../config/database.js';

const router = express.Router();

// Default POST endpoint for creating bookings from frontend
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  console.log('🔍 Booking creation request received:');
  console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
  console.log('👤 User ID:', req.user.id);
  console.log('📦 Items:', req.body.items);
  console.log('💰 Total Amount:', req.body.totalAmount);

  const userId = req.user.id;
  const {
    userId: requestUserId,
    userEmail,
    userName,
    items,
    paymentMethod,
    paymentIntentId,
    totalAmount
  } = req.body;

  // Validate required fields with detailed error messages
  if (!items) {
    console.log('❌ Items validation failed: items is undefined/null');
    return res.status(400).json({
      success: false,
      message: 'Items are required'
    });
  }

  if (!Array.isArray(items)) {
    console.log('❌ Items validation failed: items is not an array, type:', typeof items);
    return res.status(400).json({
      success: false,
      message: 'Items must be an array'
    });
  }

  if (items.length === 0) {
    console.log('❌ Items validation failed: items array is empty');
    return res.status(400).json({
      success: false,
      message: 'Items array cannot be empty'
    });
  }

  if (!totalAmount) {
    console.log('❌ Total amount validation failed: totalAmount is undefined/null');
    return res.status(400).json({
      success: false,
      message: 'Total amount is required'
    });
  }

  if (totalAmount <= 0) {
    console.log('❌ Total amount validation failed: totalAmount <= 0, value:', totalAmount);
    return res.status(400).json({
      success: false,
      message: 'Total amount must be greater than 0'
    });
  }

  console.log('✅ All validations passed, proceeding with booking creation...');

  try {
    // Start transaction
    await db.query('START TRANSACTION');

    // Generate unique booking reference
    let bookingReference = 'BK' + new Date().toISOString().slice(0, 10).replace(/-/g, '') +
      String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    // Ensure booking reference is unique
    const existingBooking = await db.queryOne(
      'SELECT id FROM bookings WHERE booking_reference = ?',
      [bookingReference]
    );

    if (existingBooking) {
      bookingReference = 'BK' + Date.now() + String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    }

    // Prepare booking details
    const bookingDetails = items.map((item) => ({
      service_id: parseInt(item.id),
      service_type: item.type,
      service_name: item.name,
      quantity: parseInt(item.quantity),
      unit_price: parseFloat(item.price),
      total_price: parseFloat(item.price) * parseInt(item.quantity),
      details: item.details || {}
    }));

    // Determine service type for booking
    const serviceTypes = [...new Set(items.map((item) => item.type))];
    const mainServiceType = serviceTypes.length === 1 ? serviceTypes[0] : 'mixed';

    // Insert booking
    const bookingResult = await db.query(`
      INSERT INTO bookings 
      (user_id, booking_reference, service_type, details, total_amount, 
       payment_status, booking_status, booking_date, special_requests) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      bookingReference,
      mainServiceType,
      JSON.stringify(bookingDetails),
      totalAmount,
      'completed', // Payment is already processed
      'confirmed',
      new Date().toISOString().split('T')[0],
      `User: ${userName}, Email: ${userEmail}`
    ]);

    const bookingId = bookingResult.insertId;

    // Commit transaction
    await db.query('COMMIT');

    // Log user activity
    await logUserActivity(userId, req.ip, 'booking_created', {
      booking_id: bookingId,
      booking_reference: bookingReference,
      total_amount: totalAmount,
      items_count: items.length,
      user_agent: req.get('User-Agent')
    });

    // Return success response
    res.json({
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId: parseInt(bookingId),
        bookingReference: bookingReference,
        total_amount: totalAmount,
        items_count: items.length,
        service_type: mainServiceType
      }
    });

  } catch (error) {
    // Rollback transaction
    await db.query('ROLLBACK');
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Booking creation failed. Please try again.'
    });
  }
}));

// Create car booking with driver details
router.post('/car-booking', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    carId,
    driverDetails,
    paymentDetails,
    pickupDate,
    dropoffDate,
    pickupLocation,
    totalAmount,
    bookingDetails
  } = req.body;

  // Validate required fields
  if (!carId || !driverDetails || !paymentDetails || !totalAmount) {
    return res.status(400).json({
      success: false,
      message: 'Missing required booking information'
    });
  }

  try {
    // Start transaction
    await db.query('START TRANSACTION');

    // Get car details
    const car = await db.queryOne('SELECT * FROM cars WHERE id = ? AND status = "available"', [carId]);

    if (!car) {
      await db.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Car not found or unavailable'
      });
    }

    // Generate unique booking reference
    let bookingReference = 'CAR' + new Date().toISOString().slice(0, 10).replace(/-/g, '') +
      String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    // Ensure booking reference is unique
    const existingBooking = await db.queryOne(
      'SELECT id FROM bookings WHERE booking_reference = ?',
      [bookingReference]
    );

    if (existingBooking) {
      bookingReference = 'CAR' + Date.now() + String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    }

    // Prepare booking details
    const carBookingDetails = {
      car: {
        id: car.id,
        make: car.make,
        model: car.model,
        category: car.category,
        daily_rate: car.daily_rate
      },
      driver: driverDetails,
      pickup: {
        date: pickupDate,
        location: pickupLocation
      },
      dropoff: {
        date: dropoffDate,
        location: pickupLocation
      },
      pricing: bookingDetails,
      payment_method: 'credit_card'
    };

    // Insert booking
    const bookingResult = await db.query(`
      INSERT INTO bookings 
      (user_id, booking_reference, service_type, details, total_amount, 
       payment_status, booking_status, booking_date, return_date, special_requests) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      bookingReference,
      'car',
      JSON.stringify(carBookingDetails),
      totalAmount,
      'completed', // Assume payment is processed
      'confirmed',
      pickupDate,
      dropoffDate,
      `Driver: ${driverDetails.name}, Phone: ${driverDetails.countryCode}${driverDetails.phoneNumber}`
    ]);

    const bookingId = bookingResult.insertId;

    // Update car availability (optional - depending on your business logic)
    // await db.query('UPDATE cars SET available_cars = available_cars - 1 WHERE id = ?', [carId]);

    // Commit transaction
    await db.query('COMMIT');

    // Log user activity
    await logUserActivity(userId, req.ip, 'car_booking_created', {
      booking_id: bookingId,
      booking_reference: bookingReference,
      car_id: carId,
      total_amount: totalAmount,
      user_agent: req.get('User-Agent')
    });

    // Return success response
    res.json({
      success: true,
      message: 'Car booking created successfully',
      data: {
        booking_id: parseInt(bookingId),
        booking_reference: bookingReference,
        total_amount: totalAmount,
        car_details: car,
        driver_details: driverDetails,
        booking_status: 'confirmed',
        payment_status: 'completed'
      }
    });

  } catch (error) {
    // Rollback transaction
    await db.query('ROLLBACK');
    console.error('Car booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Car booking failed. Please try again.'
    });
  }
}));

// Create booking from cart - migrated from checkout_submit.php
router.post('/checkout', authenticateToken, asyncHandler(async (req, res) => {
  console.log('Checkout request received:', req.body);

  const userId = req.user.id;
  const {
    booking_date = new Date().toISOString().split('T')[0],
    return_date = null,
    special_requests = '',
    payment_method = 'pending'
  } = req.body;

  // Validate booking date
  if (!/^\d{4}-\d{2}-\d{2}$/.test(booking_date)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid booking date format. Use YYYY-MM-DD'
    });
  }

  try {
    // Start transaction
    await db.query('START TRANSACTION');

    // Get user's cart items
    const cartItems = await db.query(`
      SELECT 
        c.service_id,
        c.service_type,
        c.quantity,
        c.details
      FROM carts c
      WHERE c.user_id = ?
    `, [userId]);

    if (cartItems.length === 0) {
      await db.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate total amount and prepare booking details
    let totalAmount = 0.0;
    const bookingDetails = [];
    const serviceTypes = [];

    for (const item of cartItems) {
      const serviceInfo = await getServiceForCheckout(item.service_id, item.service_type);

      if (!serviceInfo) {
        await db.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: `Service not found or unavailable: ${item.service_type} ID ${item.service_id}`
        });
      }

      const itemTotal = serviceInfo.price * item.quantity;
      totalAmount += itemTotal;

      bookingDetails.push({
        service_id: parseInt(item.service_id),
        service_type: item.service_type,
        service_name: serviceInfo.name,
        quantity: parseInt(item.quantity),
        unit_price: parseFloat(serviceInfo.price),
        total_price: itemTotal,
        details: JSON.parse(item.details || '{}'),
        service_info: serviceInfo
      });

      serviceTypes.push(item.service_type);
    }

    // Determine service type for booking
    const uniqueServiceTypes = [...new Set(serviceTypes)];
    const mainServiceType = uniqueServiceTypes.length === 1 ? uniqueServiceTypes[0] : 'mixed';

    // Generate unique booking reference
    let bookingReference = 'BK' + new Date().toISOString().slice(0, 10).replace(/-/g, '') +
      String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    // Ensure booking reference is unique
    const existingBooking = await db.queryOne(
      'SELECT id FROM bookings WHERE booking_reference = ?',
      [bookingReference]
    );

    if (existingBooking) {
      bookingReference = 'BK' + Date.now() + String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    }

    // Insert booking
    const bookingResult = await db.query(`
      INSERT INTO bookings 
      (user_id, booking_reference, service_type, details, total_amount, 
       payment_status, booking_status, booking_date, return_date, special_requests) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      bookingReference,
      mainServiceType,
      JSON.stringify(bookingDetails),
      totalAmount,
      'pending',
      'pending',
      booking_date,
      return_date,
      special_requests
    ]);

    const bookingId = bookingResult.insertId;

    // Clear user's cart
    await db.query('DELETE FROM carts WHERE user_id = ?', [userId]);

    // Commit transaction
    await db.query('COMMIT');

    // Log user activity
    await logUserActivity(userId, req.ip, 'booking_created', {
      booking_id: bookingId,
      booking_reference: bookingReference,
      total_amount: totalAmount,
      items_count: bookingDetails.length,
      user_agent: req.get('User-Agent')
    });

    // Return success response
    res.json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking_id: parseInt(bookingId),
        booking_reference: bookingReference,
        total_amount: totalAmount,
        payment_instructions: generatePaymentInstructions(payment_method, totalAmount, bookingReference),
        booking_details: {
          booking_date,
          return_date,
          special_requests,
          items_count: bookingDetails.length,
          service_type: mainServiceType
        }
      }
    });

  } catch (error) {
    // Rollback transaction
    await db.query('ROLLBACK');
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Checkout failed. Please try again.'
    });
  }
}));

// Get user's bookings
router.get('/my-bookings', authenticateToken, asyncHandler(async (req, res) => {
  try {
    const bookings = await db.query(`
      SELECT 
        id,
        booking_reference,
        service_type,
        total_amount,
        payment_status,
        booking_status,
        booking_date,
        return_date,
        special_requests,
        created_at,
        updated_at
      FROM bookings 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        bookings: bookings.map(booking => ({
          ...booking,
          id: parseInt(booking.id),
          total_amount: parseFloat(booking.total_amount)
        }))
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
}));

// Get booking details
router.get('/:bookingId', authenticateToken, asyncHandler(async (req, res) => {
  console.log('🟢 /bookings/:bookingId got:', req.params);
  const { bookingId } = req.params;

  try {
    const booking = await db.queryOne(`
      SELECT 
        id,
        booking_reference,
        service_type,
        details,
        total_amount,
        payment_status,
        booking_status,
        booking_date,
        return_date,
        special_requests,
        created_at,
        updated_at
      FROM bookings 
      WHERE id = ? AND user_id = ?
    `, [bookingId, req.user.id]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: {
        booking: {
          ...booking,
          id: parseInt(booking.id),
          total_amount: parseFloat(booking.total_amount),
          details: JSON.parse(booking.details || '[]')
        }
      }
    });

  } catch (error) {
    console.error('Get booking details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details'
    });
  }
}));

// Update booking status (admin only)
router.put('/:bookingId/status', asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { bookingId } = req.params;
  const { booking_status, payment_status } = req.body;

  const validBookingStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

  if (booking_status && !validBookingStatuses.includes(booking_status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid booking status'
    });
  }

  if (payment_status && !validPaymentStatuses.includes(payment_status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment status'
    });
  }

  try {
    const updates = [];
    const values = [];

    if (booking_status) {
      updates.push('booking_status = ?');
      values.push(booking_status);
    }

    if (payment_status) {
      updates.push('payment_status = ?');
      values.push(payment_status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid updates provided'
      });
    }

    updates.push('updated_at = NOW()');
    values.push(bookingId);

    const result = await db.query(
      `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Log admin activity
    await logUserActivity(req.user.id, req.ip, 'admin_update_booking_status', {
      booking_id: bookingId,
      booking_status,
      payment_status,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Booking status updated successfully'
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    });
  }
}));

// Cancel booking
router.put('/:bookingId/cancel', asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { bookingId } = req.params;
  const { reason = '' } = req.body;

  try {
    // Check if booking exists and belongs to user
    const booking = await db.queryOne(
      'SELECT id, booking_status, payment_status FROM bookings WHERE id = ? AND user_id = ?',
      [bookingId, req.user.id]
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.booking_status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.booking_status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    // Update booking status
    await db.query(
      'UPDATE bookings SET booking_status = ?, special_requests = CONCAT(special_requests, ?, ?), updated_at = NOW() WHERE id = ?',
      [
        'cancelled',
        special_requests ? '\n' : '',
        `Cancellation reason: ${reason}`,
        bookingId
      ]
    );

    // Log user activity
    await logUserActivity(req.user.id, req.ip, 'booking_cancelled', {
      booking_id: bookingId,
      reason,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
}));

// Helper function to get service for checkout
async function getServiceForCheckout(serviceId, serviceType) {
  try {
    let query;
    switch (serviceType) {
      case 'hotel':
        query = `SELECT id, name, price_per_night as price FROM hotels WHERE id = ? AND status = 'active'`;
        break;
      case 'flight':
        query = `SELECT id, CONCAT(airline, ' ', flight_number) as name, price FROM flights WHERE id = ? AND status = 'active'`;
        break;
      case 'car':
        query = `SELECT id, CONCAT(make, ' ', model) as name, price_per_day as price FROM cars WHERE id = ? AND status = 'active' AND available = 1`;
        break;
      case 'package':
        query = `SELECT id, name, price FROM packages WHERE id = ? AND status = 'active'`;
        break;
      default:
        return null;
    }

    const service = await db.queryOne(query, [serviceId]);
    if (!service) return null;

    return {
      id: parseInt(service.id),
      name: service.name,
      price: parseFloat(service.price)
    };
  } catch (error) {
    return null;
  }
}

// Helper function to generate payment instructions
function generatePaymentInstructions(paymentMethod, amount, bookingReference) {
  const instructions = {
    pending: {
      method: 'Bank Transfer',
      instructions: `Please transfer ${amount} to our bank account and reference: ${bookingReference}`,
      note: 'Payment confirmation may take 1-2 business days'
    },
    stripe: {
      method: 'Credit Card',
      instructions: 'Complete payment through our secure payment gateway',
      note: 'Payment will be processed immediately'
    },
    paypal: {
      method: 'PayPal',
      instructions: 'You will be redirected to PayPal to complete payment',
      note: 'Payment will be processed immediately'
    }
  };

  return instructions[paymentMethod] || instructions.pending;
}

export default router; 