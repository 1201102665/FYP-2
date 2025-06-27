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
  rental_company: string;
  available_cars: number;
  mileage_limit: number;
  min_driver_age: number;
  status: string;
  rating?: number;
  review_count?: number;
}

export interface CarSearchParams {
  pickup_location?: string;
  return_location?: string;
  pickup_date?: string;
  return_date?: string;
  category?: string;
  transmission?: string;
  min_price?: number;
  max_price?: number;
  features?: string[];
  sort_by?: string;
  page?: number;
  per_page?: number;
}

export interface CarApiResponse {
  success: boolean;
  data: Car[];
  pagination?: {
    current_page: number;
    per_page: number;
    total_results: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
  message?: string;
}

export interface CarReservation {
  id: number;
  car_id: number;
  user_id: number;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  return_location: string;
  total_price: number;
  status: string;
  created_at: string;
}

export interface CarReview {
  id: number;
  car_id: number;
  user_id: number;
  rating: number;
  comment: string;
  reviewer_name: string;
  reviewer_avatar?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total_results: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

// Helper function to get category-specific fallback images
const getCategoryFallbackImages = (category: string) => {
  const fallbackImages = {
    luxury: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60'
    ],
    suv: [
      'https://images.unsplash.com/photo-1566473179817-0a9e8b10e43e?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1580293666864-c0d2b8e8e98e?w=800&auto=format&fit=crop&q=60'
    ],
    economy: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&auto=format&fit=crop&q=60'
    ],
    compact: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1607734834512-7973f6d4d799?w=800&auto=format&fit=crop&q=60'
    ],
    standard: [
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=800&auto=format&fit=crop&q=60'
    ],
    premium: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1571876019459-4c3c81db85c8?w=800&auto=format&fit=crop&q=60'
    ]
  };
  
  return fallbackImages[category as keyof typeof fallbackImages] || fallbackImages.standard;
};

// Helper function to ensure proper image handling
const processCarImages = (car: Car): string[] => {
  // If images are already properly formatted, return them
  if (Array.isArray(car.images) && car.images.length > 0 && car.images[0].startsWith('http')) {
    return car.images;
  }
  
  // Parse string images if needed
  let images: string[] = [];
  if (typeof car.images === 'string') {
    try {
      images = (car.images as string).startsWith('[') ? JSON.parse(car.images) : [car.images];
    } catch (e) {
      images = [];
    }
  } else if (Array.isArray(car.images)) {
    images = car.images;
  }
  
  // If no valid images or they're just filenames, use category fallbacks
  if (images.length === 0 || !images[0].startsWith('http')) {
    return getCategoryFallbackImages(car.category);
  }
  
  return images;
};

/**
 * Get all cars with pagination
 */
export const getCars = async (
  page: number = 1, 
  per_page: number = 12
): Promise<{ success: boolean, data?: { cars: Car[], pagination: PaginatedResponse<Car>['pagination'] } }> => {
  try {
    console.log('🚗 Getting all cars, page:', page, 'per_page:', per_page);
    
    const response = await api.get<{ success: boolean; data: { cars: Car[]; pagination: PaginatedResponse<Car>['pagination'] } }>('cars', { page, per_page });
    
    console.log('📋 Cars API result:', response.data);
    
    if (!response.success) {
      return { success: false };
    }
    
    // Transform the data to ensure images are properly handled
    const transformedCars = (response.data.cars || []).map((car: Car) => ({
      ...car,
      images: processCarImages(car),
      features: Array.isArray(car.features)
        ? car.features
        : (typeof car.features === 'string'
            ? ((car.features as string).startsWith('[')
                ? JSON.parse(car.features as string)
                : [car.features])
            : []),
      rating: car.rating || 4.0 + Math.random() * 1.0,
      review_count: car.review_count || Math.floor(Math.random() * 100) + 10
    }));

    return {
      success: true,
      data: {
        cars: transformedCars,
        pagination: response.data.pagination
      }
    };

  } catch (error) {
    console.error('❌ Error fetching cars:', error);
    return { success: false };
  }
};

/**
 * Search cars with filters
 */
export const searchCars = async (searchParams: CarSearchParams): Promise<{ success: boolean, data?: { cars: Car[], pagination: PaginatedResponse<Car>['pagination'] } }> => {
  try {
    console.log('🔍 Searching cars with params:', searchParams);
    
    if (!searchParams.pickup_location && !searchParams.category && !searchParams.transmission && !searchParams.features?.length) {
      console.log('📝 No search params provided, getting all cars');
      return getCars(searchParams.page, searchParams.per_page);
    }
    
    const response = await api.post<{ success: boolean; data: { cars: Car[]; pagination: PaginatedResponse<Car>['pagination'] } }>('/cars/search', searchParams);
    
    console.log('📋 Search API result:', response.data);
    
    if (!response.success) {
      console.log('❌ Search failed:', response.data);
      return { success: false };
    }
    
    const transformedCars = (response.data.cars || []).map((car: Car) => ({
      ...car,
      images: processCarImages(car),
      features: Array.isArray(car.features)
        ? car.features
        : (typeof car.features === 'string'
            ? ((car.features as string).startsWith('[')
                ? JSON.parse(car.features as string)
                : [car.features])
            : []),
      rating: car.rating || 4.0 + Math.random() * 1.0,
      review_count: car.review_count || Math.floor(Math.random() * 100) + 10
    }));

    console.log('✅ Transformed cars:', transformedCars.length);

    return {
      success: true,
      data: {
        cars: transformedCars,
        pagination: response.data.pagination
      }
    };

  } catch (error) {
    console.error('❌ Error searching cars:', error);
    return { success: false };
  }
};

/**
 * Get car by ID with proper image handling
 */
export const getCarById = async (id: string | number): Promise<Car | null> => {
  try {
    console.log('🚗 Getting car by ID:', id);

    const response = await api.get<{ success: boolean; data: Car; message?: string }>(`cars/${id}`);

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch car');
    }

    const car = response.data;
    if (!car) return null;

    return {
      ...car,
      images: processCarImages(car),
      features: Array.isArray(car.features)
        ? car.features
        : (typeof car.features === 'string'
            ? ((car.features as string).startsWith('[')
                ? JSON.parse(car.features as string)
                : [car.features])
            : []),
      rating: car.rating || 4.0 + Math.random() * 1.0,
      review_count: car.review_count || Math.floor(Math.random() * 100) + 10
    };

  } catch (error) {
    console.error('❌ Error fetching car by ID:', error);
    return null;
  }
};

/**
 * Get cars by location
 */
export const getCarsByLocation = async (location: string): Promise<Car[]> => {
  try {
    const searchParams: CarSearchParams = {
      pickup_location: location,
      per_page: 50
    };
    
    const result = await searchCars(searchParams);
    return result.data?.cars || [];
  } catch (error) {
    console.error('❌ Error getting cars by location:', error);
    return [];
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
 * Get car reviews by car ID
 */
export const getCarReviews = async (carId: number, page: number = 1): Promise<PaginatedResponse<CarReview>> => {
  try {
    const response = await api.get<PaginatedResponse<CarReview>>(`cars/${carId}/reviews`, { page });
    return response;
  } catch (error) {
    console.error('❌ Error fetching car reviews:', error);
    throw error;
  }
};

export const getCarSuggestions = async (field: string, query: string) => {
  const response = await api.get<{ success: boolean, suggestions: string[] }>(`cars/autocomplete`, { field, q: query });
  return response.suggestions;
};

export const getAllCarCategories = async () => getCarSuggestions('category', '');
export const getAllCarSeats = async () => getCarSuggestions('seats', '');
export const getAllCarRates = async () => getCarSuggestions('daily_rate', '');

export default {
  getCars,
  searchCars,
  getCarById,
  getCarsByLocation,
  createCarReservation,
  getCarReservations,
  createCarReview,
  getCarReviews,
  getCarSuggestions,
  getAllCarCategories,
  getAllCarSeats,
  getAllCarRates
};