import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import flightRoutes from './flights.js';
import hotelRoutes from './hotels.js';
import carRoutes from './cars.js';
import bookingRoutes from './bookings.js';
import packageRoutes from './packages.js';
import reviewRoutes from './reviews.js';
import paymentRoutes from './payments.js';
import aiRoutes from './ai.js';
import preferencesRoutes from './preferences.js';

const router = express.Router();

// Register routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/flights', flightRoutes);
router.use('/hotels', hotelRoutes);
router.use('/cars', carRoutes);
router.use('/bookings', bookingRoutes);
router.use('/packages', packageRoutes);
router.use('/reviews', reviewRoutes);
router.use('/payments', paymentRoutes);
router.use('/ai', aiRoutes);
router.use('/preferences', preferencesRoutes);

export default router; 