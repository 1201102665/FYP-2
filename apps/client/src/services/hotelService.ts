import api from './api';

// Define types
export interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  price_per_night: number;
  rating: number;
  image: string;
  amenities: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface HotelSearchParams {
  destination?: string;
  check_in?: string;
  check_out?: string;
  rooms?: number;
  adults?: number;
  children?: number;
  category?: string;
  min_rating?: number;
  filters?: any;
  sort_by?: string;
  page?: number;
  per_page?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  hotels?: T; // API returns hotels in different structure
  message?: string;
  search_criteria?: any;
  pagination?: {
    current_page: number;
    per_page: number;
    total_results: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

/**
 * Get all hotels
 */
export const getAllHotels = async (): Promise<Hotel[]> => {
  try {
    const response = await api.get<ApiResponse<Hotel[]>>('hotels/search');
    
    // Handle different response structures
    const hotels = response.data || response.hotels || [];
    
    // Parse amenities from JSON string if needed
    return hotels.map((hotel) => {
      if (typeof hotel.amenities === 'string') {
        return {
          ...hotel,
          amenities: JSON.parse(hotel.amenities)
        };
      }
      return hotel;
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error;
  }
};

/**
 * Search for hotels based on search parameters
 */
export const searchHotels = async (searchParams: HotelSearchParams): Promise<Hotel[]> => {
  try {
    const response = await api.post<ApiResponse<Hotel[]>>('hotels/search', searchParams);
    
    // Handle different response structures
    const hotels = response.data || response.hotels || [];

    // Parse amenities from JSON string if needed
    return hotels.map((hotel) => {
      if (typeof hotel.amenities === 'string') {
        return {
          ...hotel,
          amenities: JSON.parse(hotel.amenities)
        };
      }
      return hotel;
    });
  } catch (error) {
    console.error('Error searching hotels:', error);
    throw error;
  }
};

/**
 * Get a single hotel by ID
 */
export const getHotelById = async (id: number): Promise<Hotel> => {
  try {
    const response = await api.get<ApiResponse<Hotel>>(`hotels/${id}`);
    
    // Handle different response structures
    const hotel = response.data || response.hotels;
    
    // Parse amenities from JSON string if needed
    if (typeof hotel.amenities === 'string') {
      hotel.amenities = JSON.parse(hotel.amenities);
    }

    return hotel;
  } catch (error) {
    console.error(`Error fetching hotel with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new hotel
 */
export const createHotel = async (hotelData: Omit<Hotel, 'id'>): Promise<Hotel> => {
  try {
    const response = await api.post<ApiResponse<Hotel>>('hotels', hotelData);
    return response.data || response.hotels;
  } catch (error) {
    console.error('Error creating hotel:', error);
    throw error;
  }
};

/**
 * Update an existing hotel
 */
export const updateHotel = async (id: number, hotelData: Partial<Hotel>): Promise<void> => {
  try {
    await api.put<ApiResponse<void>>(`hotels/${id}`, hotelData);
  } catch (error) {
    console.error(`Error updating hotel with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a hotel
 */
export const deleteHotel = async (id: number): Promise<void> => {
  try {
    await api.delete<ApiResponse<void>>(`hotels/${id}`);
  } catch (error) {
    console.error(`Error deleting hotel with ID ${id}:`, error);
    throw error;
  }
};

export default {
  getAllHotels,
  searchHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
};