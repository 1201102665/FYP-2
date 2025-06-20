import api from './api';

// Define types
export interface Flight {
  id: number | string;
  airline: string;
  flight_number: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  created_at?: string;
  updated_at?: string;
  airline_logo?: string;
  origin_airport?: string;
  destination_airport?: string;
  origin_code?: string;
  destination_code?: string;
  duration?: number;
  class?: string;
  status?: string;
  aircraft?: string;
}

export interface FlightSearchParams {
  origin?: string;
  destination?: string;
  departure_date?: string;
  return_date?: string;
  passengers?: number;
  class?: string;
  filters?: any;
  sort_by?: string;
  page?: number;
  per_page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  search_criteria?: any;
  total_results?: number;
  source?: string;
  timestamp?: string;
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
 * Browse all flights from popular routes via Amadeus API with pagination
 */
export const getAllFlights = async (page: number = 1, per_page: number = 8): Promise<{ flights: Flight[], pagination: any }> => {
  try {
    const response = await fetch(`/api/flights/browse?page=${page}&per_page=${per_page}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to browse flights');
    }
    
    return {
      flights: result.flights || [],
      pagination: result.pagination || {}
    };
  } catch (error) {
    console.error('Error browsing flights:', error);
    throw error;
  }
};

/**
 * Browse flights from popular routes (alias for getAllFlights)
 */
export const browseFlights = async (page: number = 1, per_page: number = 8): Promise<{ flights: Flight[], pagination: any }> => {
  return getAllFlights(page, per_page);
};

/**
 * Search for flights using Amadeus API via Node.js backend
 */
export const searchFlights = async (searchParams: FlightSearchParams): Promise<Flight[]> => {
  try {
    // If no search criteria provided, use browse mode
    const hasSearchCriteria = searchParams.origin && searchParams.destination;
    
    if (!hasSearchCriteria) {
      console.log('No search criteria provided, using browse mode');
      const browseResult = await browseFlights();
      return browseResult.flights;
    }
    
    // Add browse_mode flag if no specific search
    const requestBody = {
      ...searchParams,
      browse_mode: !hasSearchCriteria
    };
    
    const response = await fetch('/api/flights/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to search flights');
    }
    
    return result.flights || result.data || [];
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

/**
 * Get flights with specific route (using Aviationstack)
 */
export const getFlightsByRoute = async (origin: string, destination: string, date?: string): Promise<Flight[]> => {
  try {
    const searchParams = {
      origin: origin,
      destination: destination,
      departure_date: date,
      limit: 50
    };
    
    return await searchFlights(searchParams);
  } catch (error) {
    console.error('Error fetching flights by route:', error);
    throw error;
  }
};

/**
 * Get a single flight by ID (fallback to search)
 * Note: Aviationstack doesn't support getting single flight by ID,
 * so we'll search and filter
 */
export const getFlightById = async (id: string | number): Promise<Flight | null> => {
  try {
    const flights = await getAllFlights(100);
    return flights.find(flight => flight.id === id) || null;
  } catch (error) {
    console.error(`Error fetching flight with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new flight (not supported by Aviationstack - would need database)
 */
export const createFlight = async (flightData: Omit<Flight, 'id'>): Promise<Flight> => {
  throw new Error('Creating flights is not supported with Aviationstack API. Use database endpoint instead.');
};

/**
 * Update an existing flight (not supported by Aviationstack - would need database)
 */
export const updateFlight = async (id: number, flightData: Partial<Flight>): Promise<void> => {
  throw new Error('Updating flights is not supported with Aviationstack API. Use database endpoint instead.');
};

/**
 * Delete a flight (not supported by Aviationstack - would need database)
 */
export const deleteFlight = async (id: number): Promise<void> => {
  throw new Error('Deleting flights is not supported with Aviationstack API. Use database endpoint instead.');
};

export default {
  getAllFlights,
  browseFlights,
  searchFlights,
  getFlightsByRoute,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight
};