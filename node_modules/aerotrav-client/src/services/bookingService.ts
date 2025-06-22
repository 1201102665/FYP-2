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
  return await post<PaymentIntentResponse>('/api/bookings/payment-intent', {
    amount,
    currency: 'usd'
  });
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
  return await post<{bookingId: number;bookingReference: string;}>('/api/bookings', {
    userId,
    userEmail,
    userName,
    items,
    paymentMethod,
    paymentIntentId,
    totalAmount
  });
};

// Get all bookings for a user
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  return await get<Booking[]>(`/api/bookings/user/${userId}`);
};

// Get a single booking by ID or reference
export const getBooking = async (idOrReference: string | number): Promise<Booking> => {
  return await get<Booking>(`/api/bookings/${idOrReference}`);
};

// Update booking status
export const updateBookingStatus = async (
id: number,
status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED')
: Promise<void> => {
  await put<void>(`/api/bookings/${id}/status`, { status });
};

export default {
  createPaymentIntent,
  createBooking,
  getUserBookings,
  getBooking,
  updateBookingStatus
};