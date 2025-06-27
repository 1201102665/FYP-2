import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewForm from '@/components/ReviewForm';
import ReviewsSection from '@/components/ReviewsSection';
import { useToast } from '@/hooks/use-toast';

interface ReviewData {
  id?: string;
  title: string;
  comment: string;
  overall_rating: number;
  user_name: string;
  created_at: string;
}

const TestReviewFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleReviewSubmitted = (review: ReviewData) => {
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback. Your review has been submitted successfully.",
      duration: 3000,
    });
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Review System Demo
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              This page demonstrates our review system functionality.
              You can submit reviews and view existing ones.
            </p>
          </div>

          {/* Demo Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Demo
                </Badge>
                Sample Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Flight: KL to Tokyo</h3>
                  <p className="text-gray-600 text-sm">
                    Malaysia Airlines • Economy Class<br />
                    Departure: 15 Mar 2024 • 10:30 AM<br />
                    Duration: 6h 45m
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-aerotrav-blue">RM 1,250</div>
                  <p className="text-sm text-gray-500">per person</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-aerotrav-blue hover:bg-aerotrav-blue/90"
            >
              Write a Review
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>

          {/* Review Form */}
          <ReviewForm
            itemId={123}
            itemType="flight"
            itemName="Malaysia Airlines - KL to Tokyo"
            itemImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop"
            onSuccess={() => {
              handleReviewSubmitted({
                id: "123",
                title: "Great flight experience",
                comment: "Excellent service and comfortable journey",
                overall_rating: 5,
                user_name: "Demo User",
                created_at: new Date().toISOString()
              });
            }}
            onCancel={() => setShowReviewForm(false)}
            isOpen={showReviewForm}
          />

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewsSection
                itemType="flight"
                itemId={123}
                itemName="Malaysia Airlines - KL to Tokyo"
                itemImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop"
                showReviewButton={false}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestReviewFlow; 