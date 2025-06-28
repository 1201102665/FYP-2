import api from './api';

export interface ReviewData {
  item_type: 'flight' | 'hotel' | 'car' | 'package';
  item_id: number;
  booking_id?: number;
  overall_rating: number;
  cleanliness_rating?: number;
  service_rating?: number;
  location_rating?: number;
  value_rating?: number;
  title: string;
  comment: string;
  pros?: string;
  cons?: string;
}

export interface Review {
  id: number;
  user_id: number;
  item_type: 'flight' | 'hotel' | 'car' | 'package';
  item_id: number;
  booking_id?: number;
  overall_rating: number;
  cleanliness_rating?: number;
  service_rating?: number;
  location_rating?: number;
  value_rating?: number;
  title: string;
  comment: string;
  pros?: string;
  cons?: string;
  helpful_votes: number;
  verified_stay: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  created_at: string;
  user_name: string;
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

export const reviewService = {
  // Submit a new review
  submitReview: async (reviewData: ReviewData) => {
    return await api.post('reviews/submit', reviewData);
  },

  // Get reviews for a specific service
  getServiceReviews: async (
    serviceType: string,
    serviceId: number,
    page: number = 1,
    limit: number = 10
  ) => {
    return await api.get(`reviews/service/${serviceType}/${serviceId}`, { page, limit });
  },

  // Get user's reviews
  getUserReviews: async (page: number = 1, limit: number = 10) => {
    return await api.get('reviews/user', { page, limit });
  },

  // Vote on a review (helpful/not helpful)
  voteReview: async (reviewId: number, voteType: 'helpful' | 'not_helpful') => {
    return await api.post(`reviews/${reviewId}/vote`, {
      vote_type: voteType
    });
  },

  // Check if user can review a specific item
  canReviewItem: async (itemType: string, itemId: number) => {
    return await api.get(`reviews/can-review/${itemType}/${itemId}`);
  }
}; 