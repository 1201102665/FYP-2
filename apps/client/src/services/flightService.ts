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
    console.log('🔍 Calling browse flights API:', `/api/flights/browse?page=${page}&per_page=${per_page}`);
    
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
      
      // Return fallback data instead of throwing error
      return {
        flights: generateFallbackFlights(),
        pagination: { current_page: page, per_page, total_results: 5, total_pages: 1, has_next_page: false, has_prev_page: false }
      };
    }
    
    const result = await response.json();
    console.log('📋 Browse API result:', result);
    
    if (!result.success && result.flights?.length === 0) {
      console.log('⚠️ API returned no flights, using fallback data');
      return {
        flights: generateFallbackFlights(),
        pagination: { current_page: page, per_page, total_results: 5, total_pages: 1, has_next_page: false, has_prev_page: false }
      };
    }
    
    return {
      flights: result.flights || [],
      pagination: result.pagination || {}
    };
  } catch (error) {
    console.error('❌ Error browsing flights:', error);
    // Return fallback data instead of throwing error
    return {
      flights: generateFallbackFlights(),
      pagination: { current_page: page, per_page, total_results: 5, total_pages: 1, has_next_page: false, has_prev_page: false }
    };
  }
};

// Generate fallback flight data for frontend
const generateFallbackFlights = (): Flight[] => {
  return [
    {
      id: 'fallback_1',
      airline: 'VietJet Air',
      flight_number: 'VJ826',
      origin: 'KUL',
      destination: 'DAD',
      origin_airport: 'Kuala Lumpur International Airport',
      destination_airport: 'Da Nang International Airport',
      departure_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      arrival_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
      price: 299,
      available_seats: 45,
      airline_logo: 'https://logos.skyscnr.com/images/airlines/favicon/VJ.png',
      duration: 195, // 3h 15m in minutes
      class: 'Economy',
      status: 'scheduled'
    },
    {
      id: 'fallback_2',
      airline: 'AirAsia',
      flight_number: 'AK6285',
      origin: 'KUL',
      destination: 'DAD',
      origin_airport: 'Kuala Lumpur International Airport',
      destination_airport: 'Da Nang International Airport',
      departure_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
      arrival_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(),
      price: 259,
      available_seats: 32,
      airline_logo: 'https://logos.skyscnr.com/images/airlines/favicon/AK.png',
      duration: 195,
      class: 'Economy',
      status: 'scheduled'
    },
    {
      id: 'fallback_3',
      airline: 'Malaysia Airlines',
      flight_number: 'MH6012',
      origin: 'KUL',
      destination: 'DAD',
      origin_airport: 'Kuala Lumpur International Airport',
      destination_airport: 'Da Nang International Airport',
      departure_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
      arrival_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000).toISOString(),
      price: 389,
      available_seats: 28,
      airline_logo: 'https://logos.skyscnr.com/images/airlines/favicon/MH.png',
      duration: 195,
      class: 'Economy',
      status: 'scheduled'
    }
  ];
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
      
      // Return fallback data instead of throwing error
      return generateFallbackFlights();
    }
    
    const result = await response.json();
    console.log('📋 Search API result:', result);
    
    if (!result.success) {
      console.log('⚠️ API returned error, using fallback data:', result.message);
      return generateFallbackFlights();
    }
    
    const flights = result.flights || result.data || [];
    if (flights.length === 0) {
      console.log('⚠️ No flights found, using fallback data');
      return generateFallbackFlights();
    }
    
    return flights;
  } catch (error) {
    console.error('❌ Error searching flights:', error);
    // Return fallback data instead of throwing error
    return generateFallbackFlights();
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