import { get, post, put, del } from './api';
import { mockCars, mockCarReservations, mockCarReviews } from './mockData';

export interface Car {
  id: number;
  name: string;
  price: number;
  location: string;
  image: string;
  category: string;
  features: string[];
}

export interface CarReservation {
  id: string;
  carName: string;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  status: 'active' | 'upcoming' | 'completed';
}

export interface CarReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface CarSearchParams {
  pickupLocation?: string;
  dropoffLocation?: string;
  pickupDate?: string;
  pickupTime?: string;
  priceRange?: [number, number];
  category?: string[];
}

// Get all cars
export const getAllCars = async (): Promise<Car[]> => {
  try {
    // Use a relative API URL with no leading slash
    const { data, error } = await get('cars');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching cars:', error);
    // Return mock data as fallback
    return mockCars;
  }
};

// Search cars
export const searchCars = async (params: CarSearchParams): Promise<Car[]> => {
  try {
    // Use a relative API URL with no leading slash
    const { data, error } = await get('cars/search', params);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error searching cars:', error);

    // Filter mock data based on search parameters
    let filteredCars = [...mockCars];

    if (params.pickupLocation) {
      filteredCars = filteredCars.filter((car) =>
      car.location.toLowerCase().includes(params.pickupLocation!.toLowerCase()));
    }

    if (params.priceRange) {
      filteredCars = filteredCars.filter((car) =>
      car.price >= params.priceRange![0] && car.price <= params.priceRange![1]);
    }

    if (params.category && params.category.length > 0) {
      filteredCars = filteredCars.filter((car) =>
      params.category!.some((cat) => car.category.includes(cat)));
    }

    return filteredCars;
  }
};

// Get car by ID
export const getCarById = async (id: number): Promise<Car | null> => {
  try {
    // Use a relative API URL with no leading slash
    const { data, error } = await get(`cars/${id}`);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching car with ID ${id}:`, error);
    // Return mock data as fallback
    const car = mockCars.find((car) => car.id === id);
    return car || null;
  }
};

// Create a car reservation
export const createCarReservation = async (reservation: Omit<CarReservation, 'id' | 'status'>): Promise<CarReservation> => {
  try {
    // Use a relative API URL with no leading slash
    const { data, error } = await post('car-reservations', reservation);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating car reservation:', error);
    // Generate a mock reservation
    return {
      id: Math.random().toString(36).substring(2, 9),
      ...reservation,
      status: 'upcoming'
    };
  }
};

// Get reservations for a user
export const getUserCarReservations = async (userId: string): Promise<CarReservation[]> => {
  try {
    // Use a relative API URL with no leading slash
    const { data, error } = await get(`car-reservations?userId=${userId}`);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user car reservations:', error);
    // Return mock data as fallback
    return mockCarReservations;
  }
};

// Create a car review
export const createCarReview = async (review: Omit<CarReview, 'id' | 'date'>): Promise<CarReview> => {
  try {
    // Use a relative API URL with no leading slash
    const { data, error } = await post('car-reviews', review);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating car review:', error);
    // Generate a mock review
    return {
      id: Math.random().toString(36).substring(2, 9),
      ...review,
      date: new Date().toLocaleDateString()
    };
  }
};

// Get car reviews
export const getCarReviews = async (): Promise<CarReview[]> => {
  try {
    // Use a relative API URL with no leading slash
    const { data, error } = await get('car-reviews');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching car reviews:', error);
    // Return mock data as fallback
    return mockCarReviews;
  }
};

export default {
  getAllCars,
  searchCars,
  getCarById,
  createCarReservation,
  getUserCarReservations,
  createCarReview,
  getCarReviews
};