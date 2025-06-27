import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from '../middleware/errorHandler.js';

// Validation middleware to check for errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: {
        type: 'ValidationError',
        code: null,
        details: errors.array().map(error => ({
          field: error.param,
          message: error.msg,
          value: error.value
        }))
      }
    });
  }
  next();
};

// Common validation rules
export const commonValidations = {
  // Email validation
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  // Password validation
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  // Name validation
  name: body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  // Phone validation
  phone: body('phone')
    .optional()
    .matches(/^(\+\d{1,3}[- ]?)?\d{10,14}$/)
    .withMessage('Please provide a valid phone number'),

  // ID parameter validation
  id: param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),

  // Date validation
  date: (field) => body(field)
    .isISO8601()
    .withMessage(`${field} must be a valid date in ISO8601 format (YYYY-MM-DD)`),

  // Pagination validation
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ]
};

// User registration validation
export const validateUserRegistration = [
  commonValidations.name,
  commonValidations.email,
  commonValidations.password,
  commonValidations.phone,
  handleValidationErrors
];

// User login validation
export const validateUserLogin = [
  commonValidations.email,
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Flight search validation
export const validateFlightSearch = [
  body('origin')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Origin must be between 2 and 100 characters'),
  body('destination')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Destination must be between 2 and 100 characters'),
  body('departure_date')
    .optional()
    .isISO8601()
    .withMessage('Departure date must be in YYYY-MM-DD format'),
  body('return_date')
    .optional()
    .isISO8601()
    .withMessage('Return date must be in YYYY-MM-DD format'),
  body('passengers')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Passengers must be between 1 and 20'),
  body('class')
    .optional()
    .isIn(['Economy', 'Business', 'First', 'economy', 'business', 'first'])
    .withMessage('Class must be Economy, Business, or First'),
  handleValidationErrors
];

// Hotel search validation
export const validateHotelSearch = [
  body('destination')
    .optional()
    .trim(),
  body('check_in')
    .optional()
    .custom((value) => {
      if (!value || value === '') return true;
      if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error('Check-in date must be in YYYY-MM-DD format');
      }
      return true;
    }),
  body('check_out')
    .optional()
    .custom((value) => {
      if (!value || value === '') return true;
      if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error('Check-out date must be in YYYY-MM-DD format');
      }
      return true;
    }),
  body('rooms')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Rooms must be between 1 and 10')
    .default(1),
  body('adults')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Adults must be between 1 and 20')
    .default(2),
  body('children')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Children must be between 0 and 10')
    .default(0),
  body('hotel_type')
    .optional()
    .isIn(['luxury', 'business', 'resort', 'boutique', 'budget', 'all'])
    .withMessage('Invalid hotel type')
    .default('all'),
  body('min_rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Minimum rating must be between 0 and 5'),
  body('max_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  body('min_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array')
    .default([]),
  body('sort_by')
    .optional()
    .isIn(['price_low', 'price_high', 'rating', 'distance', 'recommended'])
    .withMessage('Invalid sort option')
    .default('recommended'),
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .default(1),
  body('per_page')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Per page must be between 1 and 100')
    .default(20),
  handleValidationErrors
];

// Car search validation
export const validateCarSearch = [
  body('pickup_location')
    .optional()
    .trim()
    .isLength({ min: 0, max: 100 })
    .withMessage('Pickup location must not exceed 100 characters'),
  body('pickup_date')
    .optional()
    .custom((value) => {
      if (value && value !== '') {
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
      }
      return true;
    })
    .withMessage('Pickup date must be in YYYY-MM-DD format'),
  body('return_date')
    .optional()
    .custom((value) => {
      if (value && value !== '') {
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
      }
      return true;
    })
    .withMessage('Return date must be in YYYY-MM-DD format'),
  body('category')
    .optional()
    .custom((value) => {
      if (!value || value === 'all') return true;
      return ['economy', 'compact', 'midsize', 'full-size', 'luxury', 'suv', 'van', 'minivan'].includes(value);
    })
    .withMessage('Invalid car category'),
  body('transmission')
    .optional()
    .custom((value) => {
      if (!value || value === 'all') return true;
      return ['automatic', 'manual'].includes(value);
    })
    .withMessage('Invalid transmission type'),
  body('min_price')
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === '') return true;
      return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
    })
    .withMessage('Minimum price must be a positive number'),
  body('max_price')
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === '') return true;
      return !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
    })
    .withMessage('Maximum price must be a positive number'),
  body('features')
    .optional()
    .custom((value) => {
      if (!value) return true;
      return Array.isArray(value);
    })
    .withMessage('Features must be an array'),
  body('sort_by')
    .optional()
    .custom((value) => {
      if (!value) return true;
      return ['recommended', 'price_low', 'price_high', 'rating'].includes(value);
    })
    .withMessage('Invalid sort option'),
  body('page')
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === '') return true;
      return Number.isInteger(Number(value)) && Number(value) >= 1;
    })
    .withMessage('Page must be a positive integer'),
  body('per_page')
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === '') return true;
      const num = Number(value);
      return Number.isInteger(num) && num >= 1 && num <= 50;
    })
    .withMessage('Per page must be between 1 and 50'),
  handleValidationErrors
];

// Package search validation
export const validatePackageSearch = [
  body('destination')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Destination must be between 2 and 100 characters'),
  body('travelers')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Travelers must be between 1 and 20'),
  body('start_date')
    .optional()
    .isISO8601()
    .withMessage('Start date must be in YYYY-MM-DD format'),
  body('duration_min')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Minimum duration must be a positive integer'),
  body('duration_max')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum duration must be a positive integer'),
  handleValidationErrors
];

// Cart validation
export const validateAddToCart = [
  body('item_type')
    .isIn(['flight', 'hotel', 'car', 'package'])
    .withMessage('Item type must be flight, hotel, car, or package'),
  body('item_id')
    .isInt({ min: 1 })
    .withMessage('Item ID must be a positive integer'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10'),
  handleValidationErrors
];

// Booking validation
export const validateBooking = [
  body('guest_name')
    .notEmpty()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Guest name is required and must be between 2 and 100 characters'),
  body('guest_email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid guest email is required'),
  body('payment_method')
    .isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer'])
    .withMessage('Payment method must be credit_card, debit_card, paypal, or bank_transfer'),
  handleValidationErrors
];

// Review validation
export const validateReview = [
  body('item_type')
    .isIn(['flight', 'hotel', 'car', 'package'])
    .withMessage('Item type must be flight, hotel, car, or package'),
  body('item_id')
    .isInt({ min: 1 })
    .withMessage('Item ID must be a positive integer'),
  body('overall_rating')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Overall rating must be between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Comment must not exceed 2000 characters'),
  handleValidationErrors
];

// Utility functions
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

export const validateRequired = (requiredFields, data) => {
  const missing = [];
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missing.push(field);
    }
  }
  return missing;
}; 