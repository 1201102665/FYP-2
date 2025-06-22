import api from './api';

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  category: string;
  transmission: string;
  fuel_type: string;
  doors: number;
  seats: number;
  luggage_capacity: number;
  air_conditioning: boolean;
  features: string[];
  images: string[];
  daily_rate: number;
  location_city: string;
  location_country: string;
  available: boolean;
}

export interface CarSearchParams {
  location?: string;
  pickup_date?: string;
  return_date?: string;
  category?: string;
  transmission?: string;
  min_price?: number;
  max_price?: number;
}

export interface CarReservation {
  id: number;
  car_id: number;
  user_id: number;
  pickup_date: string;
  return_date: string;
  total_cost: number;
  status: string;
}

export interface CarReview {
  id: number;
  car_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

/**
 * Get all cars from the database
 */
export const getCars = async (): Promise<Car[]> => {
  try {
    const response = await api.get<Car[]>('/cars');
    return response || [];
  } catch (error) {
    console.error('❌ Error fetching cars:', error);
    throw error;
  }
};

/**
 * Search cars with filters
 */
export const searchCars = async (searchParams: CarSearchParams): Promise<Car[]> => {
  try {
    const response = await api.post<Car[]>('/cars/search', searchParams);
    return response || [];
  } catch (error) {
    console.error('❌ Error searching cars:', error);
    throw error;
  }
};

/**
 * Get a specific car by ID
 */
export const getCarById = async (id: number): Promise<Car | null> => {
  try {
    const response = await api.get<Car>(`/cars/${id}`);
    return response || null;
  } catch (error) {
    console.error(`❌ Error fetching car ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a car reservation
 */
export const createCarReservation = async (reservationData: Omit<CarReservation, 'id'>): Promise<CarReservation> => {
  try {
    const response = await api.post<CarReservation>('/cars/reservations', reservationData);
    return response;
  } catch (error) {
    console.error('❌ Error creating car reservation:', error);
    throw error;
  }
};

/**
 * Get car reservations
 */
export const getCarReservations = async (): Promise<CarReservation[]> => {
  try {
    const response = await api.get<CarReservation[]>('/cars/reservations');
    return response || [];
  } catch (error) {
    console.error('❌ Error fetching car reservations:', error);
    throw error;
  }
};

/**
 * Create a car review
 */
export const createCarReview = async (reviewData: Omit<CarReview, 'id'>): Promise<CarReview> => {
  try {
    const response = await api.post<CarReview>('/cars/reviews', reviewData);
    return response;
  } catch (error) {
    console.error('❌ Error creating car review:', error);
    throw error;
  }
};

/**
 * Get car reviews
 */
export const getCarReviews = async (carId?: number): Promise<CarReview[]> => {
  try {
    const url = carId ? `/cars/${carId}/reviews` : '/cars/reviews';
    const response = await api.get<CarReview[]>(url);
    return response || [];
  } catch (error) {
    console.error('❌ Error fetching car reviews:', error);
    throw error;
  }
};