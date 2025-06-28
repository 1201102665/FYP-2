import api from './api';

// Define types
export interface Hotel {
  id: number;
  name: string;
  chain?: string;
  category: string;
  star_rating: number;
  user_rating: number;
  rating: number; // Alias for compatibility
  address: string;
  city: string;
  country: string;
  location: string;
  destination: string;
  latitude?: number;
  longitude?: number;
  description: string;
  amenities: string[];
  images: string[];
  check_in_time?: string;
  check_out_time?: string;
  cancellation_policy?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  price_per_night: number;
  hotel_type: string;
  max_guests: number;
  rooms?: HotelRoom[];
}

export interface HotelRoom {
  id: number;
  room_type: string;
  description: string;
  max_occupancy: number;
  size_sqm?: number;
  bed_type?: string;
  amenities: string[];
  images: string[];
  base_price: number;
  total_rooms: number;
  available_rooms: number;
}

export interface HotelSearchParams {
  destination?: string;
  city?: string;
  country?: string;
  check_in?: string;
  check_out?: string;
  rooms?: number;
  adults?: number;
  children?: number;
  hotel_type?: string;
  min_rating?: number;
  max_price?: number;
  min_price?: number;
  amenities?: string[];
  sort_by?: string;
  page?: number;
  per_page?: number;
}

export interface HotelApiResponse<T> {
  success: boolean;
  data?: {
    hotels: T;
    pagination?: {
      current_page: number;
      per_page: number;
      total_results: number;
      total_pages: number;
      has_next_page: boolean;
      has_prev_page: boolean;
    };
    search_criteria?: any;
  };
  message?: string;
}

/**
 * Get all hotels with pagination
 */
export const getAllHotels = async (page: number = 1, per_page: number = 12): Promise<{ hotels: Hotel[], pagination: any }> => {
  try {
    console.log('🏨 Getting all hotels, page:', page, 'per_page:', per_page);

    const response = await api.get(`hotels?page=${page}&limit=${per_page}`) as any;
    console.log('📋 Hotels API response:', response);

    if (response && response.success && response.data) {
      return {
        hotels: response.data.hotels || [],
        pagination: response.data.pagination || {}
      };
    }

    throw new Error('Invalid API response format');

  } catch (error) {
    console.error('❌ Error fetching hotels:', error);
    throw error;
  }
};

export const browseHotels = async (page: number = 1, per_page: number = 12): Promise<{ hotels: Hotel[], pagination: any }> => {
  return getAllHotels(page, per_page);
};

export const searchHotels = async (searchParams: HotelSearchParams): Promise<{ hotels: Hotel[], pagination: any }> => {
  try {
    console.log('🔍 Searching hotels with params:', searchParams);

    const response = await api.post('hotels/search', searchParams) as any;
    console.log('📋 Hotel search response:', response);

    if (response && response.success && response.data) {
      return {
        hotels: response.data.hotels || [],
        pagination: response.data.pagination || {}
      };
    }

    throw new Error('Invalid search response format');

  } catch (error) {
    console.error('❌ Error searching hotels:', error);
    throw error;
  }
};

export const getHotelsByDestination = async (destination: string, checkIn?: string, checkOut?: string): Promise<Hotel[]> => {
  try {
    console.log('🏨 Getting hotels for destination:', destination);

    const response = await api.get(`hotels/destination/${encodeURIComponent(destination)}`) as any;
    console.log('📋 Hotels by destination response:', response);

    if (response && response.success && response.data) {
      return response.data.hotels || [];
    }

    throw new Error('Invalid API response format');

  } catch (error) {
    console.error('❌ Error fetching hotels by destination:', error);
    throw error;
  }
};

export const getHotelById = async (id: string | number): Promise<Hotel | null> => {
  try {
    console.log('🏨 Getting hotel by ID:', id);

    const response = await api.get(`hotels/${id}`) as any;
    console.log('📋 Hotel by ID response:', response);

    if (response && response.success && response.data) {
      return response.data.hotel;
    }

    return null;

  } catch (error) {
    console.error('❌ Error fetching hotel by ID:', error);
    return null;
  }
};

export const createHotel = async (hotelData: Omit<Hotel, 'id'>): Promise<Hotel> => {
  try {
    const response = await api.post('hotels', hotelData) as any;

    if (response && response.success && response.data) {
      return response.data.hotel;
    }

    throw new Error('Failed to create hotel');
  } catch (error) {
    console.error('❌ Error creating hotel:', error);
    throw error;
  }
};

export const updateHotel = async (id: number, hotelData: Partial<Hotel>): Promise<void> => {
  try {
    await api.put(`hotels/${id}`, hotelData);
  } catch (error) {
    console.error('❌ Error updating hotel:', error);
    throw error;
  }
};

export const deleteHotel = async (id: number): Promise<void> => {
  try {
    await api.delete(`hotels/${id}`);
  } catch (error) {
    console.error('❌ Error deleting hotel:', error);
    throw error;
  }
};

export default {
  getAllHotels,
  browseHotels,
  searchHotels,
  getHotelsByDestination,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
};