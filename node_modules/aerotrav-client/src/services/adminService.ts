const API_BASE_URL = 'http://localhost:3001/api';

class AdminService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getHeaders(),
        ...options
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/admin/login';
          throw new Error('Session expired. Please login again.');
        }

        if (response.status === 403) {
          throw new Error('You do not have permission to access this resource');
        }

        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Dashboard Statistics
  async getDashboard() {
    return this.request('/admin/dashboard');
  }

  // User Management
  async getUsers(page = 1, limit = 20, search = '', status = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      status
    });
    return this.request(`/admin/users?${params}`);
  }

  async removeUser(userId: string) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE'
    });
  }

  async updateUserStatus(userId: string, status: string) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Booking Management
  async getBookings(page = 1, limit = 20, status = '', payment_status = '', search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
      payment_status,
      search
    });
    return this.request(`/admin/bookings?${params}`);
  }

  async updateBookingStatus(bookingId: string, status: string) {
    return this.request(`/admin/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async getBookingDetails(bookingId: string) {
    return this.request(`/admin/bookings/${bookingId}`);
  }

  // Content Management
  async getContentOverview() {
    return this.request('/admin/content');
  }

  // Flight Management
  async getFlights(page = 1, limit = 20, status = '', airline = '', search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
      airline,
      search
    });
    return this.request(`/admin/flights?${params}`);
  }

  async createFlight(flightData: Record<string, unknown>) {
    return this.request('/admin/flights', {
      method: 'POST',
      body: JSON.stringify(flightData)
    });
  }

  async updateFlight(flightId: string, flightData: Record<string, unknown>) {
    return this.request(`/admin/flights/${flightId}`, {
      method: 'PUT',
      body: JSON.stringify(flightData)
    });
  }

  async deleteFlight(flightId: string) {
    return this.request(`/admin/content/flights/${flightId}`, {
      method: 'DELETE'
    });
  }

  // Hotel Management
  async getHotels(page = 1, limit = 20, status = '', destination = '', search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
      destination,
      search
    });
    return this.request(`/admin/hotels?${params}`);
  }

  async createHotel(hotelData: Record<string, unknown>) {
    return this.request('/admin/hotels', {
      method: 'POST',
      body: JSON.stringify(hotelData)
    });
  }

  async updateHotel(hotelId: string, hotelData: Record<string, unknown>) {
    return this.request(`/admin/hotels/${hotelId}`, {
      method: 'PUT',
      body: JSON.stringify(hotelData)
    });
  }

  async deleteHotel(hotelId: string) {
    return this.request(`/admin/content/hotels/${hotelId}`, {
      method: 'DELETE'
    });
  }

  // Car Management
  async getCars(page = 1, limit = 20, status = '', brand = '', search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
      brand,
      search
    });
    return this.request(`/admin/cars?${params}`);
  }

  async createCar(carData: Record<string, unknown>) {
    return this.request('/admin/cars', {
      method: 'POST',
      body: JSON.stringify(carData)
    });
  }

  async updateCar(carId: string, carData: Record<string, unknown>) {
    return this.request(`/admin/cars/${carId}`, {
      method: 'PUT',
      body: JSON.stringify(carData)
    });
  }

  async deleteCar(carId: string) {
    return this.request(`/admin/content/cars/${carId}`, {
      method: 'DELETE'
    });
  }

  // Package Management
  async getPackages(page = 1, limit = 20, status = '', destination = '', search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
      destination,
      search
    });
    return this.request(`/admin/packages?${params}`);
  }

  async createPackage(packageData: Record<string, unknown>) {
    return this.request('/admin/packages', {
      method: 'POST',
      body: JSON.stringify(packageData)
    });
  }

  async updatePackage(packageId: string, packageData: Record<string, unknown>) {
    return this.request(`/admin/packages/${packageId}`, {
      method: 'PUT',
      body: JSON.stringify(packageData)
    });
  }

  async deletePackage(packageId: string) {
    return this.request(`/admin/content/packages/${packageId}`, {
      method: 'DELETE'
    });
  }

  // Content Status Updates
  async updateContentStatus(type: string, id: string, status: string) {
    return this.request(`/admin/content/${type}/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Reviews/Ratings Management
  async getReviews(page = 1, limit = 20, status = '', search = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
      search
    });
    return this.request(`/admin/reviews?${params}`);
  }

  async updateReviewStatus(reviewId: string, status: string) {
    return this.request(`/admin/reviews/${reviewId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async deleteReview(reviewId: string) {
    return this.request(`/admin/reviews/${reviewId}`, {
      method: 'DELETE'
    });
  }

  // Analytics
  async getAnalytics(period = '30d') {
    return this.request(`/admin/analytics?period=${period}`);
  }

  // System Information
  async getSystemInfo() {
    return this.request('/admin/system-info');
  }
}

export const adminService = new AdminService();
export default adminService; 