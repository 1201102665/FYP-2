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
  details?: BookingItem[];
  booking_status?: string;
  payment_status?: string;
  booking_date?: string;
  special_requests?: string;
}

export interface BookingItem {
  id: number;
  booking_id: number;
  item_id: string;
  item_type: 'flight' | 'hotel' | 'car' | 'package';
  item_name: string;
  quantity: number;
  price: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: Record<string, any>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// Create a payment intent
export const createPaymentIntent = async (amount: number): Promise<PaymentIntentResponse> => {
  return await post<PaymentIntentResponse>('bookings/payment-intent', {
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
  : Promise<{ bookingId: number; bookingReference: string; }> => {
  const response = await post<{ data: { bookingId: number; bookingReference: string; } }>('bookings', {
    userId,
    userEmail,
    userName,
    items,
    paymentMethod,
    paymentIntentId,
    totalAmount
  });
  return response.data;
};

// Get all bookings for the authenticated user
export const getUserBookings = async (): Promise<Booking[]> => {
  const response = await get<{ data: { bookings: Booking[] } }>('bookings/my-bookings');
  return response.data.bookings;
};

// Get a single booking by ID
export const getBooking = async (id: string | number): Promise<Booking> => {
  const response = await get<{ data: { booking: Booking } }>(`bookings/${id}`);
  return response.data.booking;
};

// Update booking status
export const updateBookingStatus = async (
  id: number,
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED')
  : Promise<void> => {
  await put<void>(`bookings/${id}/status`, { status });
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
  }>('bookings/car-booking', {
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