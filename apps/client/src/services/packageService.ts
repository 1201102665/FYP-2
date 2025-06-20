import api from './api';
import { mockPackages } from './mockData';
import { Flight } from './flightService';
import { Hotel } from './hotelService';

// Define types
export interface Package {
  id: number;
  name: string;
  destination: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  included_items: string[] | null;
  start_date: string | null;
  end_date: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PackageActivity {
  id: number;
  package_id: number;
  name: string;
  description: string;
  duration: string;
}

export interface PackageDetails extends Package {
  flights: Flight[];
  hotels: Hotel[];
  activities: PackageActivity[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Get all packages
 */
export const getAllPackages = async (): Promise<Package[]> => {
  try {
    const response = await api.get<ApiResponse<Package[]>>('packages');

    // Parse included_items from JSON string if needed
    const packages = response.data.map((pkg) => {
      if (typeof pkg.included_items === 'string') {
        return {
          ...pkg,
          included_items: JSON.parse(pkg.included_items)
        };
      }
      return pkg;
    });

    return packages;
  } catch (error) {
    console.error('Error fetching packages:', error);
    // Return mock data if the API call fails
    console.info('Using mock package data');
    return mockPackages;
  }
};

/**
 * Get a single package by ID
 */
export const getPackageById = async (id: number): Promise<Package> => {
  try {
    const response = await api.get<ApiResponse<Package>>(`packages/${id}`);

    // Parse included_items from JSON string if needed
    const pkg = response.data;
    if (typeof pkg.included_items === 'string') {
      pkg.included_items = JSON.parse(pkg.included_items);
    }

    return pkg;
  } catch (error) {
    console.error(`Error fetching package with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get detailed package information (including flights, hotels, activities)
 */
export const getPackageDetails = async (id: number): Promise<PackageDetails> => {
  try {
    const response = await api.get<ApiResponse<PackageDetails>>(`packages/${id}/details`);

    // Parse included_items from JSON string if needed
    const pkg = response.data;
    if (typeof pkg.included_items === 'string') {
      pkg.included_items = JSON.parse(pkg.included_items);
    }

    // Parse hotel amenities if needed
    pkg.hotels = pkg.hotels.map((hotel) => {
      if (typeof hotel.amenities === 'string') {
        return {
          ...hotel,
          amenities: JSON.parse(hotel.amenities)
        };
      }
      return hotel;
    });

    return pkg;
  } catch (error) {
    console.error(`Error fetching package details with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new package
 */
export const createPackage = async (packageData: Omit<Package, 'id'>): Promise<Package> => {
  try {
    const response = await api.post<ApiResponse<Package>>('packages', packageData);
    return response.data;
  } catch (error) {
    console.error('Error creating package:', error);
    throw error;
  }
};

/**
 * Update an existing package
 */
export const updatePackage = async (id: number, packageData: Partial<Package>): Promise<void> => {
  try {
    await api.put<ApiResponse<void>>(`packages/${id}`, packageData);
  } catch (error) {
    console.error(`Error updating package with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a package
 */
export const deletePackage = async (id: number): Promise<void> => {
  try {
    await api.delete<ApiResponse<void>>(`packages/${id}`);
  } catch (error) {
    console.error(`Error deleting package with ID ${id}:`, error);
    throw error;
  }
};

export default {
  getAllPackages,
  getPackageById,
  getPackageDetails,
  createPackage,
  updatePackage,
  deletePackage
};