import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth, logUserActivity } from '../middleware/auth.js';
import db from '../config/database.js';

const router = express.Router();

// Admin Dashboard - Get system overview
router.get('/dashboard', asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  try {
    // Get user statistics
    const userStats = await db.queryOne(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_users,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_users_30d
      FROM users
    `);

    // Get booking statistics
    const bookingStats = await db.queryOne(`
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN booking_status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
        SUM(CASE WHEN booking_status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_bookings_30d,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as total_revenue
      FROM bookings
    `);

    // Get recent activity
    const recentBookings = await db.query(`
      SELECT 
        b.id,
        b.booking_reference,
        b.service_type,
        b.total_amount,
        b.booking_status,
        b.payment_status,
        b.created_at,
        u.name as user_name,
        u.email as user_email
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
      LIMIT 10
    `);

    // Get search statistics
    const searchStats = await db.queryOne(`
      SELECT 
        COUNT(*) as total_searches,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as searches_7d
      FROM search_logs
    `);

    // Log admin activity
    await logUserActivity(req.user.id, req.ip, 'admin_dashboard_view', {
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        user_statistics: {
          total: parseInt(userStats.total_users || 0),
          active: parseInt(userStats.active_users || 0),
          pending: parseInt(userStats.pending_users || 0),
          new_30d: parseInt(userStats.new_users_30d || 0)
        },
        booking_statistics: {
          total: parseInt(bookingStats.total_bookings || 0),
          confirmed: parseInt(bookingStats.confirmed_bookings || 0),
          pending: parseInt(bookingStats.pending_bookings || 0),
          new_30d: parseInt(bookingStats.new_bookings_30d || 0),
          total_revenue: parseFloat(bookingStats.total_revenue || 0)
        },
        search_statistics: {
          total: parseInt(searchStats.total_searches || 0),
          recent_7d: parseInt(searchStats.searches_7d || 0)
        },
        recent_bookings: recentBookings.map(booking => ({
          ...booking,
          id: parseInt(booking.id),
          total_amount: parseFloat(booking.total_amount)
        }))
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
}));

// Admin Bookings Management
router.get('/bookings', asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { 
    status, 
    payment_status, 
    page = 1, 
    limit = 20,
    search = ''
  } = req.query;

  try {
    let whereConditions = ['1=1'];
    let queryParams = [];

    if (status) {
      whereConditions.push('b.booking_status = ?');
      queryParams.push(status);
    }

    if (payment_status) {
      whereConditions.push('b.payment_status = ?');
      queryParams.push(payment_status);
    }

    if (search) {
      whereConditions.push('(b.booking_reference LIKE ? OR u.name LIKE ? OR u.email LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const bookings = await db.query(`
      SELECT 
        b.id,
        b.booking_reference,
        b.service_type,
        b.total_amount,
        b.booking_status,
        b.payment_status,
        b.booking_date,
        b.return_date,
        b.created_at,
        b.updated_at,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `, [...queryParams, parseInt(limit), offset]);

    // Get total count
    const countResult = await db.queryOne(`
      SELECT COUNT(*) as total
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE ${whereConditions.join(' AND ')}
    `, queryParams);

    res.json({
      success: true,
      data: {
        bookings: bookings.map(booking => ({
          ...booking,
          id: parseInt(booking.id),
          total_amount: parseFloat(booking.total_amount)
        })),
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(countResult.total / parseInt(limit)),
          total_records: parseInt(countResult.total),
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Admin bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
}));

// Admin Analytics
router.get('/analytics', asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { period = '30d' } = req.query;
  
  let dateFilter;
  switch (period) {
    case '7d':
      dateFilter = 'DATE_SUB(NOW(), INTERVAL 7 DAY)';
      break;
    case '30d':
      dateFilter = 'DATE_SUB(NOW(), INTERVAL 30 DAY)';
      break;
    case '90d':
      dateFilter = 'DATE_SUB(NOW(), INTERVAL 90 DAY)';
      break;
    case '1y':
      dateFilter = 'DATE_SUB(NOW(), INTERVAL 1 YEAR)';
      break;
    default:
      dateFilter = 'DATE_SUB(NOW(), INTERVAL 30 DAY)';
  }

  try {
    // Revenue analytics
    const revenueData = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as bookings_count,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as daily_revenue
      FROM bookings 
      WHERE created_at >= ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Service type analytics
    const serviceAnalytics = await db.query(`
      SELECT 
        service_type,
        COUNT(*) as booking_count,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as revenue
      FROM bookings 
      WHERE created_at >= ${dateFilter}
      GROUP BY service_type
    `);

    // User registration analytics
    const userRegistrations = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as registrations
      FROM users 
      WHERE created_at >= ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Top search terms
    const topSearches = await db.query(`
      SELECT 
        JSON_EXTRACT(search_parameters, '$.search_type') as search_type,
        COUNT(*) as search_count
      FROM search_logs 
      WHERE created_at >= ${dateFilter}
      GROUP BY search_type
      ORDER BY search_count DESC
      LIMIT 10
    `);

    // Log admin activity
    await logUserActivity(req.user.id, req.ip, 'admin_analytics_view', {
      period,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        period,
        revenue_analytics: revenueData.map(item => ({
          ...item,
          daily_revenue: parseFloat(item.daily_revenue || 0)
        })),
        service_analytics: serviceAnalytics.map(item => ({
          ...item,
          revenue: parseFloat(item.revenue || 0)
        })),
        user_registrations: userRegistrations,
        top_searches: topSearches.map(item => ({
          search_type: item.search_type?.replace(/"/g, ''),
          count: parseInt(item.search_count)
        }))
      }
    });

  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
}));

// System Settings Management
router.get('/settings', asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  try {
    // Get system settings (if you have a settings table)
    // For now, return some default system info
    const systemInfo = {
      server_status: 'operational',
      database_status: 'connected',
      total_api_calls: 0, // This could be tracked
      uptime: process.uptime(),
      node_version: process.version,
      memory_usage: process.memoryUsage()
    };

    res.json({
      success: true,
      data: {
        system_info: systemInfo
      }
    });

  } catch (error) {
    console.error('Admin settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system settings'
    });
  }
}));

// Content Management System - migrated from legacy admin interface

// Get all content types for management
router.get('/content', requireAuth, asyncHandler(async (req, res) => {
  // Only allow admin users
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  try {
    // Get counts for all content types
    const flightsCount = await db.queryOne('SELECT COUNT(*) as count FROM flights');
    const hotelsCount = await db.queryOne('SELECT COUNT(*) as count FROM hotels');
    const carsCount = await db.queryOne('SELECT COUNT(*) as count FROM cars');
    const packagesCount = await db.queryOne('SELECT COUNT(*) as count FROM packages');

    // Get recent content additions (last 7 days)
    const recentFlights = await db.query(`
      SELECT id, flight_number, airline, departure_city, arrival_city, created_at
      FROM flights 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const recentHotels = await db.query(`
      SELECT id, name, destination, location, created_at
      FROM hotels 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const recentCars = await db.query(`
      SELECT id, brand, model, car_type, created_at
      FROM cars 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const recentPackages = await db.query(`
      SELECT id, name, destination, duration_days, created_at
      FROM packages 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        content_counts: {
          flights: parseInt(flightsCount.count),
          hotels: parseInt(hotelsCount.count),
          cars: parseInt(carsCount.count),
          packages: parseInt(packagesCount.count)
        },
        recent_additions: {
          flights: recentFlights,
          hotels: recentHotels,
          cars: recentCars,
          packages: recentPackages
        }
      }
    });

  } catch (error) {
    console.error('Content management error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content management data'
    });
  }
}));

// Flight Management - migrated from content/flights.php
router.get('/flights', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { page = 1, limit = 20, status = '', airline = '', search = '' } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const whereConditions = [];
    const values = [];

    if (status) {
      whereConditions.push('status = ?');
      values.push(status);
    }

    if (airline) {
      whereConditions.push('airline = ?');
      values.push(airline);
    }

    if (search) {
      whereConditions.push('(flight_number LIKE ? OR departure_city LIKE ? OR arrival_city LIKE ?)');
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const flights = await db.query(`
      SELECT * FROM flights 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `, [...values, parseInt(limit), offset]);

    const countResult = await db.queryOne(`
      SELECT COUNT(*) as total FROM flights ${whereClause}
    `, values);

    res.json({
      success: true,
      data: {
        flights,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: parseInt(countResult.total),
          total_pages: Math.ceil(countResult.total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Flight management error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching flight data'
    });
  }
}));

// Hotel Management - migrated from content/hotels.php
router.get('/hotels', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { page = 1, limit = 20, status = '', destination = '', search = '' } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const whereConditions = [];
    const values = [];

    if (status) {
      whereConditions.push('status = ?');
      values.push(status);
    }

    if (destination) {
      whereConditions.push('destination LIKE ?');
      values.push(`%${destination}%`);
    }

    if (search) {
      whereConditions.push('(name LIKE ? OR location LIKE ?)');
      values.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const hotels = await db.query(`
      SELECT * FROM hotels 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `, [...values, parseInt(limit), offset]);

    const countResult = await db.queryOne(`
      SELECT COUNT(*) as total FROM hotels ${whereClause}
    `, values);

    res.json({
      success: true,
      data: {
        hotels,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: parseInt(countResult.total),
          total_pages: Math.ceil(countResult.total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Hotel management error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotel data'
    });
  }
}));

// Car Management - migrated from content/cars.php
router.get('/cars', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { page = 1, limit = 20, status = '', brand = '', search = '' } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const whereConditions = [];
    const values = [];

    if (status) {
      whereConditions.push('status = ?');
      values.push(status);
    }

    if (brand) {
      whereConditions.push('brand = ?');
      values.push(brand);
    }

    if (search) {
      whereConditions.push('(brand LIKE ? OR model LIKE ? OR car_type LIKE ?)');
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const cars = await db.query(`
      SELECT * FROM cars 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `, [...values, parseInt(limit), offset]);

    const countResult = await db.queryOne(`
      SELECT COUNT(*) as total FROM cars ${whereClause}
    `, values);

    res.json({
      success: true,
      data: {
        cars,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: parseInt(countResult.total),
          total_pages: Math.ceil(countResult.total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Car management error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching car data'
    });
  }
}));

// Package Management - migrated from content/packages.php
router.get('/packages', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { page = 1, limit = 20, status = '', destination = '', search = '' } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const whereConditions = [];
    const values = [];

    if (status) {
      whereConditions.push('status = ?');
      values.push(status);
    }

    if (destination) {
      whereConditions.push('destination LIKE ?');
      values.push(`%${destination}%`);
    }

    if (search) {
      whereConditions.push('(name LIKE ? OR description LIKE ?)');
      values.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const packages = await db.query(`
      SELECT * FROM packages 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `, [...values, parseInt(limit), offset]);

    const countResult = await db.queryOne(`
      SELECT COUNT(*) as total FROM packages ${whereClause}
    `, values);

    res.json({
      success: true,
      data: {
        packages,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: parseInt(countResult.total),
          total_pages: Math.ceil(countResult.total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Package management error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching package data'
    });
  }
}));

// Update content item status (activate/deactivate)
router.put('/content/:type/:id/status', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { type, id } = req.params;
  const { status } = req.body;

  // Validate content type
  const validTypes = ['flights', 'hotels', 'cars', 'packages'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid content type'
    });
  }

  // Validate status
  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be either active or inactive'
    });
  }

  try {
    await db.query(`
      UPDATE ${type} SET status = ?, updated_at = NOW() WHERE id = ?
    `, [status, id]);

    // Log admin activity
    await logUserActivity(req.user.id, req.ip, `${type}_status_updated`, {
      content_type: type,
      content_id: parseInt(id),
      new_status: status,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: `${type.slice(0, -1)} status updated successfully`
    });

  } catch (error) {
    console.error('Content status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating content status'
    });
  }
}));

// Delete content item
router.delete('/content/:type/:id', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const { type, id } = req.params;

  // Validate content type
  const validTypes = ['flights', 'hotels', 'cars', 'packages'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid content type'
    });
  }

  try {
    // Check if content exists
    const content = await db.queryOne(`SELECT id FROM ${type} WHERE id = ?`, [id]);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: `${type.slice(0, -1)} not found`
      });
    }

    // Delete the content
    await db.query(`DELETE FROM ${type} WHERE id = ?`, [id]);

    // Log admin activity
    await logUserActivity(req.user.id, req.ip, `${type}_deleted`, {
      content_type: type,
      content_id: parseInt(id),
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: `${type.slice(0, -1)} deleted successfully`
    });

  } catch (error) {
    console.error('Content deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting content'
    });
  }
}));

// System Information - migrated from admin dashboard
router.get('/system-info', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  try {
    // Database statistics
    const dbStats = {
      users: await db.queryOne('SELECT COUNT(*) as count FROM users'),
      bookings: await db.queryOne('SELECT COUNT(*) as count FROM bookings'),
      reviews: await db.queryOne('SELECT COUNT(*) as count FROM reviews'),
      flights: await db.queryOne('SELECT COUNT(*) as count FROM flights'),
      hotels: await db.queryOne('SELECT COUNT(*) as count FROM hotels'),
      cars: await db.queryOne('SELECT COUNT(*) as count FROM cars'),
      packages: await db.queryOne('SELECT COUNT(*) as count FROM packages')
    };

    // Recent activity
    const recentActivity = await db.query(`
      SELECT * FROM user_activity 
      ORDER BY created_at DESC 
      LIMIT 20
    `);

    // Server information
    const serverInfo = {
      node_version: process.version,
      uptime: process.uptime(),
      memory_usage: process.memoryUsage(),
      platform: process.platform,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: {
        database_stats: dbStats,
        recent_activity: recentActivity,
        server_info: serverInfo
      }
    });

  } catch (error) {
    console.error('System info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system information'
    });
  }
}));

export default router; 