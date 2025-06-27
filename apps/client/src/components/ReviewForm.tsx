import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { reviewService, ReviewData } from '@/services/reviewService';

interface ReviewFormProps {
  itemId: number;
  itemType: 'flight' | 'hotel' | 'car' | 'package';
  itemName: string;
  itemImage?: string;
  bookingId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  isOpen: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  itemId,
  itemType,
  itemName,
  itemImage,
  bookingId,
  onSuccess,
  onCancel,
  isOpen
}) => {
  const [overallRating, setOverallRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [locationRating, setLocationRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your review",
        variant: "destructive"
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please provide a comment for your review",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData: ReviewData = {
        item_type: itemType,
        item_id: itemId,
        booking_id: bookingId,
        overall_rating: overallRating,
        cleanliness_rating: cleanlinessRating,
        service_rating: serviceRating,
        location_rating: locationRating,
        value_rating: valueRating,
        title: title.trim(),
        comment: comment.trim(),
        pros: pros.trim() || undefined,
        cons: cons.trim() || undefined
      };

      const result = await reviewService.submitReview(reviewData);

      if (result.success) {
        toast({
          title: "Review Submitted",
          description: "Thank you for your review!",
          variant: "default"
        });
        onSuccess?.();
      } else {
        throw new Error(result.message || 'Failed to submit review');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to submit review',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (
    rating: number,
    setRating: (rating: number) => void,
    label: string
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none transition-colors"
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Write a Review</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {/* Item Info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {itemImage && (
              <img
                src={itemImage}
                alt={itemName}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="font-medium">{itemName}</h3>
              <p className="text-sm text-gray-600 capitalize">{itemType}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            {renderStarRating(overallRating, setOverallRating, "Overall Rating *")}

            {/* Detailed Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderStarRating(cleanlinessRating, setCleanlinessRating, "Cleanliness")}
              {renderStarRating(serviceRating, setServiceRating, "Service")}
              {renderStarRating(locationRating, setLocationRating, "Location")}
              {renderStarRating(valueRating, setValueRating, "Value for Money")}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Review Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                maxLength={200}
                required
              />
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment" className="text-sm font-medium">
                Your Review *
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this service..."
                rows={4}
                maxLength={2000}
                required
              />
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pros" className="text-sm font-medium">
                  What you liked
                </Label>
                <Textarea
                  id="pros"
                  value={pros}
                  onChange={(e) => setPros(e.target.value)}
                  placeholder="What did you enjoy most?"
                  rows={3}
                  maxLength={500}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cons" className="text-sm font-medium">
                  What could be improved
                </Label>
                <Textarea
                  id="cons"
                  value={cons}
                  onChange={(e) => setCons(e.target.value)}
                  placeholder="What could be better?"
                  rows={3}
                  maxLength={500}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewForm; 