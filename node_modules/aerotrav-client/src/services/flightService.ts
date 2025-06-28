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



/**
 * Browse all flights from database with pagination
 */
export const getAllFlights = async (page: number = 1, per_page: number = 8): Promise<{ flights: Flight[], pagination: any }> => {
  try {
    console.log('🔍 Calling browse flights API:', `flights/browse?page=${page}&per_page=${per_page}`);

    const response = await fetch(`/api/flights/browse?page=${page}&per_page=${per_page}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Browse API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Browse API error response:', errorText);
      throw new Error(`Failed to fetch flights: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('📋 Browse API result:', result);

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch flights');
    }

    return {
      flights: result.flights || [],
      pagination: result.pagination || {}
    };
  } catch (error) {
    console.error('❌ Error browsing flights:', error);
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
 * Search for flights using database via Node.js backend
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

    console.log('🔍 Searching flights with params:', searchParams);

    const response = await fetch('/api/flights/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(searchParams)
    });

    console.log('📡 Search API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Search API error response:', errorText);
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('📋 Search API result:', result);

    if (!result.success) {
      throw new Error(result.message || 'Search failed');
    }

    return result.flights || [];
  } catch (error) {
    console.error('❌ Error searching flights:', error);
    throw error;
  }
};

/**
 * Get flights by route
 */
export const getFlightsByRoute = async (origin: string, destination: string, date?: string): Promise<Flight[]> => {
  try {
    const searchParams: FlightSearchParams = {
      origin,
      destination,
      departure_date: date,
      limit: 50
    };

    return await searchFlights(searchParams);
  } catch (error) {
    console.error('❌ Error getting flights by route:', error);
    throw error;
  }
};

/**
 * Get a single flight by ID
 */
export const getFlightById = async (id: string | number): Promise<Flight | null> => {
  try {
    const response = await api.get<Flight>(`/flights/${id}`);
    return response;
  } catch (error) {
    console.error('❌ Error getting flight by ID:', error);
    throw error;
  }
};

/**
 * Create a new flight
 */
export const createFlight = async (flightData: Omit<Flight, 'id'>): Promise<Flight> => {
  const response = await api.post<Flight>('/flights', flightData);
  return response;
};

/**
 * Update a flight
 */
export const updateFlight = async (id: number, flightData: Partial<Flight>): Promise<void> => {
  await api.put(`/flights/${id}`, flightData);
};

/**
 * Delete a flight
 */
export const deleteFlight = async (id: number): Promise<void> => {
  await api.delete(`/flights/${id}`);
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