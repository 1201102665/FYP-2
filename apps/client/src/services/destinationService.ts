import api from './api';

// Define types
export interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  rating: number;
}



/**
 * Get all destinations from the database
 */
export const getDestinations = async (): Promise<Destination[]> => {
  try {
    const response = await api.get<Destination[]>('/destinations');
    return response || [];
  } catch (error) {
    console.error('❌ Error fetching destinations:', error);
    throw error;
  }
};

/**
 * Get a specific destination by ID
 */
export const getDestinationById = async (id: number): Promise<Destination | null> => {
  try {
    const response = await api.get<Destination>(`/destinations/${id}`);
    return response || null;
  } catch (error) {
    console.error(`❌ Error fetching destination ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new destination
 */
export const createDestination = async (destinationData: Omit<Destination, 'id'>): Promise<Destination> => {
  try {
    const response = await api.post<Destination>('destinations', destinationData);
    return response;
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
    await api.put<void>(`destinations/${id}`, destinationData);
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
    await api.delete<void>(`destinations/${id}`);
  } catch (error) {
    console.error(`Error deleting destination with ID ${id}:`, error);
    throw error;
  }
};

export default {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
};