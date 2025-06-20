/**
 * Base API service for making HTTP requests to the backend
 */

// API base URL - configured to work with Vite proxy
const API_BASE_URL = '/api';

// Common request options for fetch
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

/**
 * Generic function to handle API responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // Check if the request was successful
  if (!response.ok) {
    let errorMessage = `Error: ${response.status} ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // If response is not JSON, use the default error message
      console.warn('Non-JSON error response:', e);
    }
    
    throw new Error(errorMessage);
  }

  // Parse JSON response
  try {
    return await response.json();
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    throw new Error('Invalid JSON response from server');
  }
}

/**
 * Generic GET request
 */
export async function get<T>(endpoint: string, queryParams?: Record<string, string | number | boolean>): Promise<T> {
  try {
    // Build URL with query parameters if provided
    let url = `${API_BASE_URL}/${endpoint}`;

    if (queryParams) {
      const params = new URLSearchParams();

      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Make the request
    const response = await fetch(url, {
      ...defaultOptions,
      method: 'GET'
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error(`GET request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Generic POST request
 */
export async function post<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify(data)
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error(`POST request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Generic PUT request
 */
export async function put<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...defaultOptions,
      method: 'PUT',
      body: JSON.stringify(data)
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error(`PUT request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Generic DELETE request
 */
export async function del<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...defaultOptions,
      method: 'DELETE'
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error(`DELETE request failed for ${endpoint}:`, error);
    throw error;
  }
}

export default {
  get,
  post,
  put,
  delete: del
};