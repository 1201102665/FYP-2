import { get, post, put } from './api';
import { CartItem } from '@/contexts/CartContext';

export interface Booking {
  id: number;
  booking_reference: string;
  user_id: string;
  user_email: string;
  user_name: string;
  total_amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  payment_method: string;
  payment_intent_id?: string;
  created_at: string;
  updated_at: string;
  items: BookingItem[];
  item_count?: number;
}

export interface BookingItem {
  id: number;
  booking_id: number;
  item_id: string;
  item_type: 'flight' | 'hotel' | 'car' | 'package';
  item_name: string;
  quantity: number;
  price: number;
  details: Record<string, any>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// Create a payment intent
export const createPaymentIntent = async (amount: number): Promise<PaymentIntentResponse> => {
  const { data, error } = await post('/api/bookings/payment-intent', {
    amount,
    currency: 'usd'
  });

  if (error) throw error;
  return data;
};

// Create a new booking
export const createBooking = async (
userId: string,
userEmail: string,
userName: string,
items: CartItem[],
paymentMethod: string,
paymentIntentId: string | undefined,
totalAmount: number)
: Promise<{bookingId: number;bookingReference: string;}> => {
  const { data, error } = await post('/api/bookings', {
    userId,
    userEmail,
    userName,
    items,
    paymentMethod,
    paymentIntentId,
    totalAmount
  });

  if (error) throw error;
  return data;
};

// Get all bookings for a user
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const { data, error } = await get(`/api/bookings/user/${userId}`);

  if (error) throw error;
  return data;
};

// Get a single booking by ID or reference
export const getBooking = async (idOrReference: string | number): Promise<Booking> => {
  const { data, error } = await get(`/api/bookings/${idOrReference}`);

  if (error) throw error;
  return data;
};

// Update booking status
export const updateBookingStatus = async (
id: number,
status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED')
: Promise<void> => {
  const { error } = await put(`/api/bookings/${id}/status`, { status });

  if (error) throw error;
};

export default {
  createPaymentIntent,
  createBooking,
  getUserBookings,
  getBooking,
  updateBookingStatus
};