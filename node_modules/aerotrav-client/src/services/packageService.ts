import api from './api';

// Define types
export interface Package {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  included_services: string[];
  rating: number;
  reviews_count: number;
  category: string;
  destinations: string[];
}

/**
 * Get all packages from the database
 */
export const getPackages = async (): Promise<Package[]> => {
  try {
    const response = await api.get<Package[]>('/packages');
    return response || [];
  } catch (error) {
    console.error('❌ Error fetching packages:', error);
    throw error;
  }
};

/**
 * Get a specific package by ID
 */
export const getPackageById = async (id: number): Promise<Package | null> => {
  try {
    const response = await api.get<Package>(`/packages/${id}`);
    return response || null;
  } catch (error) {
    console.error(`❌ Error fetching package ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search packages with filters
 */
export const searchPackages = async (searchParams: any): Promise<Package[]> => {
  try {
    const response = await api.post<Package[]>('/packages/search', searchParams);
    return response || [];
  } catch (error) {
    console.error('❌ Error searching packages:', error);
    throw error;
  }
};

/**
 * Create a new package
 */
export const createPackage = async (packageData: Omit<Package, 'id'>): Promise<Package> => {
  const response = await api.post<Package>('/packages', packageData);
  return response;
};

/**
 * Update a package
 */
export const updatePackage = async (id: number, packageData: Partial<Package>): Promise<void> => {
  await api.put(`/packages/${id}`, packageData);
};

/**
 * Delete a package
 */
export const deletePackage = async (id: number): Promise<void> => {
  await api.delete(`/packages/${id}`);
};

export default {
  getPackages,
  getPackageById,
  searchPackages,
  createPackage,
  updatePackage,
  deletePackage
};