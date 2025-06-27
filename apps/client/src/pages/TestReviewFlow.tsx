import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReviewForm from '@/components/ReviewForm';
import ReviewsSection from '@/components/ReviewsSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TestReviewFlow: React.FC = () => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const testPackage = {
    id: 1,
    name: "Test Bali Adventure Package",
    type: "package" as const,
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop"
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle>Review Flow Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This page tests the complete review and rating functionality.
              </p>
              <Button onClick={() => setShowReviewForm(true)}>
                Test Review Form
              </Button>
            </CardContent>
          </Card>

          <ReviewsSection
            itemType="package"
            itemId={1}
            itemName={testPackage.name}
            itemImage={testPackage.image}
            showReviewButton={true}
          />

          {/* Test Review Form Modal */}
          <ReviewForm
            itemId={testPackage.id}
            itemType={testPackage.type}
            itemName={testPackage.name}
            itemImage={testPackage.image}
            onSuccess={() => {
              setShowReviewForm(false);
              alert('Review submitted successfully!');
            }}
            onCancel={() => setShowReviewForm(false)}
            isOpen={showReviewForm}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestReviewFlow; 