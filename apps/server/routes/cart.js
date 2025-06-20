import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logUserActivity } from '../middleware/auth.js';
import db from '../config/database.js';

const router = express.Router();

// Add to cart - migrated from cart_add.php
router.post('/add', asyncHandler(async (req, res) => {
  // Check if user is logged in
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Please log in to add items to cart'
    });
  }

  const userId = req.user.id;
  const { service_id, service_type, quantity = 1, details = {} } = req.body;

  // Validate required fields
  if (!service_id || !service_type) {
    return res.status(400).json({
      success: false,
      message: 'service_id and service_type are required'
    });
  }

  // Validate service type
  const validTypes = ['hotel', 'flight', 'car', 'package'];
  if (!validTypes.includes(service_type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid service type. Must be one of: ' + validTypes.join(', ')
    });
  }

  // Validate quantity
  if (quantity < 1 || quantity > 10) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be between 1 and 10'
    });
  }

  try {
    // Verify that the service exists and is available
    const serviceExists = await verifyServiceExists(service_id, service_type);
    if (!serviceExists) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or unavailable'
      });
    }

    // Check if item already exists in cart
    const existingItem = await db.queryOne(
      'SELECT id, quantity FROM carts WHERE user_id = ? AND service_id = ? AND service_type = ?',
      [userId, service_id, service_type]
    );

    let message;
    let finalQuantity;

    if (existingItem) {
      // Update existing cart item
      finalQuantity = Math.min(existingItem.quantity + quantity, 10);
      
      await db.query(
        'UPDATE carts SET quantity = ?, details = ?, added_at = CURRENT_TIMESTAMP WHERE id = ?',
        [finalQuantity, JSON.stringify(details), existingItem.id]
      );
      
      message = 'Cart item updated successfully';
    } else {
      // Insert new cart item
      await db.query(
        'INSERT INTO carts (user_id, service_id, service_type, quantity, details) VALUES (?, ?, ?, ?, ?)',
        [userId, service_id, service_type, quantity, JSON.stringify(details)]
      );
      
      finalQuantity = quantity;
      message = 'Item added to cart successfully';
    }

    // Get updated cart count
    const cartCountResult = await db.queryOne(
      'SELECT COUNT(*) as cart_count FROM carts WHERE user_id = ?',
      [userId]
    );

    // Log user activity
    await logUserActivity(userId, req.ip, 'cart_add_item', {
      service_id,
      service_type,
      quantity: finalQuantity,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message,
      data: {
        cart_count: parseInt(cartCountResult.cart_count),
        service_id: parseInt(service_id),
        service_type,
        quantity: finalQuantity
      }
    });

  } catch (error) {
    console.error('Cart add error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
}));

// Get cart - migrated from cart_view.php
router.get('/', asyncHandler(async (req, res) => {
  // Check if user is logged in
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Please log in to view cart'
    });
  }

  const userId = req.user.id;

  try {
    // Get all cart items for the user
    const cartItems = await db.query(`
      SELECT 
        c.id as cart_id,
        c.service_id,
        c.service_type,
        c.quantity,
        c.details,
        c.added_at
      FROM carts c
      WHERE c.user_id = ?
      ORDER BY c.added_at DESC
    `, [userId]);

    if (cartItems.length === 0) {
      return res.json({
        success: true,
        data: {
          cart_items: [],
          total_items: 0,
          total_amount: 0.0,
          cart_summary: {
            hotels: 0,
            flights: 0,
            cars: 0,
            packages: 0
          }
        },
        message: 'Cart is empty'
      });
    }

    // Fetch detailed information for each cart item
    const detailedCartItems = [];
    let totalAmount = 0.0;
    const cartSummary = { hotels: 0, flights: 0, cars: 0, packages: 0 };

    for (const item of cartItems) {
      const serviceDetails = await getServiceDetails(item.service_id, item.service_type);
      
      if (serviceDetails) {
        const itemTotal = serviceDetails.price * item.quantity;
        totalAmount += itemTotal;

        detailedCartItems.push({
          cart_id: parseInt(item.cart_id),
          service_id: parseInt(item.service_id),
          service_type: item.service_type,
          quantity: parseInt(item.quantity),
          details: JSON.parse(item.details || '{}'),
          added_at: item.added_at,
          service_info: serviceDetails,
          item_total: itemTotal
        });

        // Update cart summary
        cartSummary[item.service_type + 's']++;
      }
    }

    res.json({
      success: true,
      data: {
        cart_items: detailedCartItems,
        total_items: detailedCartItems.length,
        total_amount: totalAmount,
        cart_summary: cartSummary,
        user_id: userId
      }
    });

  } catch (error) {
    console.error('Cart view error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
}));

// Update cart item quantity
router.put('/update/:cartId', asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { cartId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1 || quantity > 10) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be between 1 and 10'
    });
  }

  try {
    const result = await db.query(
      'UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, cartId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Cart item updated successfully'
    });

  } catch (error) {
    console.error('Cart update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
}));

// Remove item from cart
router.delete('/remove/:cartId', asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { cartId } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM carts WHERE id = ? AND user_id = ?',
      [cartId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Log user activity
    await logUserActivity(req.user.id, req.ip, 'cart_remove_item', {
      cart_id: cartId,
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Cart remove error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
}));

// Clear entire cart
router.delete('/clear', asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  try {
    await db.query('DELETE FROM carts WHERE user_id = ?', [req.user.id]);

    // Log user activity
    await logUserActivity(req.user.id, req.ip, 'cart_cleared', {
      user_agent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Cart clear error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
}));

// Helper function to verify service exists
async function verifyServiceExists(serviceId, serviceType) {
  try {
    let query;
    switch (serviceType) {
      case 'hotel':
        query = "SELECT id FROM hotels WHERE id = ? AND status = 'active'";
        break;
      case 'flight':
        query = "SELECT id FROM flights WHERE id = ? AND status = 'active'";
        break;
      case 'car':
        query = "SELECT id FROM cars WHERE id = ? AND status = 'active' AND available = 1";
        break;
      case 'package':
        query = "SELECT id FROM packages WHERE id = ? AND status = 'active'";
        break;
      default:
        return false;
    }

    const result = await db.queryOne(query, [serviceId]);
    return result !== null;
  } catch (error) {
    return false;
  }
}

// Helper function to get service details
async function getServiceDetails(serviceId, serviceType) {
  try {
    let query;
    switch (serviceType) {
      case 'hotel':
        query = `SELECT 
                  id, name, location, destination, 
                  price_per_night as price, rating, 
                  amenities, images 
                FROM hotels 
                WHERE id = ? AND status = 'active'`;
        break;
      case 'flight':
        query = `SELECT 
                  id, airline, flight_number,
                  departure_city, arrival_city,
                  departure_time, arrival_time,
                  price, class, aircraft_type
                FROM flights 
                WHERE id = ? AND status = 'active'`;
        break;
      case 'car':
        query = `SELECT 
                  id, make, model, year, type, location,
                  price_per_day as price, fuel_type, 
                  seats, transmission, features, images
                FROM cars 
                WHERE id = ? AND status = 'active' AND available = 1`;
        break;
      case 'package':
        query = `SELECT 
                  id, name, description, destination, 
                  duration_days, price, includes, 
                  excludes, difficulty_level, images
                FROM packages 
                WHERE id = ? AND status = 'active'`;
        break;
      default:
        return null;
    }

    const service = await db.queryOne(query, [serviceId]);
    if (!service) return null;

    // Format service data
    return {
      id: parseInt(service.id),
      name: service.name || `${service.make} ${service.model}` || service.airline,
      price: parseFloat(service.price),
      ...service
    };
  } catch (error) {
    return null;
  }
}

export default router; 