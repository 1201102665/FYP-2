import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { reviewService, Review, ReviewStats } from '@/services/reviewService';
import ReviewForm from './ReviewForm';

interface ReviewsSectionProps {
  itemType: 'flight' | 'hotel' | 'car' | 'package';
  itemId: number;
  itemName: string;
  itemImage?: string;
  showReviewButton?: boolean;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  itemType,
  itemId,
  itemName,
  itemImage,
  showReviewButton = true
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [itemType, itemId, page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getServiceReviews(itemType, itemId, page, 5);
      
      if (response.success) {
        if (page === 1) {
          setReviews(response.data.reviews);
          setStats(response.data.stats);
        } else {
          setReviews(prev => [...prev, ...response.data.reviews]);
        }
        setHasMore(response.data.reviews.length === 5);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setPage(1);
    loadReviews();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingPercentage = (count: number) => {
    if (!stats?.total_reviews) return 0;
    return Math.round((count / stats.total_reviews) * 100);
  };

  if (loading && page === 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer Reviews</CardTitle>
            {showReviewButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReviewForm(true)}
              >
                <Star className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Review Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {stats.average_rating.toFixed(1)}
                </div>
                <div className="flex justify-center my-2">
                  {renderStars(stats.average_rating)}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {stats.total_reviews} reviews
                </p>
              </div>
              
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats[`${star === 5 ? 'five' : star === 4 ? 'four' : star === 3 ? 'three' : star === 2 ? 'two' : 'one'}_star` as keyof ReviewStats] as number;
                  const percentage = getRatingPercentage(count);
                  
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm w-8">{star}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${review.user_name}&background=random`} />
                        <AvatarFallback>{review.user_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.user_name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {renderStars(review.overall_rating)}
                          </div>
                          <span className="text-sm text-gray-600">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.verified_stay && (
                      <Badge variant="secondary" className="text-xs">
                        Verified Stay
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">{review.title}</h4>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    
                    {(review.pros || review.cons) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {review.pros && (
                          <div className="bg-green-50 p-3 rounded">
                            <p className="font-medium text-green-800 mb-1">Pros</p>
                            <p className="text-green-700">{review.pros}</p>
                          </div>
                        )}
                        {review.cons && (
                          <div className="bg-red-50 p-3 rounded">
                            <p className="font-medium text-red-800 mb-1">Cons</p>
                            <p className="text-red-700">{review.cons}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <button className="flex items-center gap-1 hover:text-blue-600">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpful_votes})
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More Button */}
          {hasMore && reviews.length > 0 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setPage(prev => prev + 1)}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Reviews'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Form Modal */}
      <ReviewForm
        itemId={itemId}
        itemType={itemType}
        itemName={itemName}
        itemImage={itemImage}
        onSuccess={handleReviewSuccess}
        onCancel={() => setShowReviewForm(false)}
        isOpen={showReviewForm}
      />
    </>
  );
};

export default ReviewsSection; 