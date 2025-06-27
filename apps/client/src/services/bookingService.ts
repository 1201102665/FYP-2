import { get, post, put } from './api';
import type { CartItem } from '@/contexts/CartContext';

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
  details: Record<string, unknown>;
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

// Create a car booking with driver details
export const createCarBooking = async (
  carId: number,
  driverDetails: unknown,
  paymentDetails: unknown,
  pickupDate: string,
  dropoffDate: string,
  pickupLocation: string,
  totalAmount: number,
  bookingDetails: unknown
): Promise<{
  booking_id: number;
  booking_reference: string;
  total_amount: number;
  car_details: unknown;
  driver_details: unknown;
  booking_status: string;
  payment_status: string;
}> => {
  return await post<{
    booking_id: number;
    booking_reference: string;
    total_amount: number;
    car_details: unknown;
    driver_details: unknown;
    booking_status: string;
    payment_status: string;
  }>('/api/bookings/car-booking', {
    carId,
    driverDetails,
    paymentDetails,
    pickupDate,
    dropoffDate,
    pickupLocation,
    totalAmount,
    bookingDetails
  });
};

export default {
  createPaymentIntent,
  createBooking,
  createCarBooking,
  getUserBookings,
  getBooking,
  updateBookingStatus
};