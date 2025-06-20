import api from './api';
import { mockDestinations } from './mockData';

// Define types
export interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  rating: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Get all destinations
 */
export const getAllDestinations = async (): Promise<Destination[]> => {
  try {
    const response = await api.get<ApiResponse<Destination[]>>('destinations');
    return response.data;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    // Return mock data if the API call fails
    console.info('Using mock destination data');
    return mockDestinations;
  }
};

/**
 * Get a single destination by ID
 */
export const getDestinationById = async (id: number): Promise<Destination> => {
  try {
    const response = await api.get<ApiResponse<Destination>>(`destinations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching destination with ID ${id}:`, error);
    // Return mock data if the API call fails
    const mockDestination = mockDestinations.find((d) => d.id === id);
    if (mockDestination) {
      console.info(`Using mock data for destination ID ${id}`);
      return mockDestination;
    }
    throw error;
  }
};

/**
 * Create a new destination
 */
export const createDestination = async (destinationData: Omit<Destination, 'id'>): Promise<Destination> => {
  try {
    const response = await api.post<ApiResponse<Destination>>('destinations', destinationData);
    return response.data;
  } catch (error) {
    console.error('Error creating destination:', error);
    throw error;
  }
};

/**
 * Update an existing destination
 */
export const updateDestination = async (id: number, destinationData: Partial<Destination>): Promise<void> => {
  try {
    await api.put<ApiResponse<void>>(`destinations/${id}`, destinationData);
  } catch (error) {
    console.error(`Error updating destination with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a destination
 */
export const deleteDestination = async (id: number): Promise<void> => {
  try {
    await api.delete<ApiResponse<void>>(`destinations/${id}`);
  } catch (error) {
    console.error(`Error deleting destination with ID ${id}:`, error);
    throw error;
  }
};

export default {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
};