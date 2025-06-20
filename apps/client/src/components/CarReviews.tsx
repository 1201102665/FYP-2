import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
}

interface CarReviewsProps {
  reviews: Review[];
  onAddReview?: () => void;
}

const CarReviews = ({ reviews, onAddReview }: CarReviewsProps) => {
  return (
    <div className="w-full" data-id="69dohiujo" data-path="src/components/CarReviews.tsx">
      <div className="flex justify-between items-center mb-6" data-id="w3n05lytr" data-path="src/components/CarReviews.tsx">
        <h2 className="text-2xl font-bold" data-id="98al1429o" data-path="src/components/CarReviews.tsx">Customer Reviews</h2>
        {onAddReview &&
        <Button
          onClick={onAddReview}
          className="bg-aerotrav-blue hover:bg-blue-700" data-id="0csvn6r56" data-path="src/components/CarReviews.tsx">

            Write a Review
          </Button>
        }
      </div>
      
      {reviews.length === 0 ?
      <Card data-id="nzv5x3law" data-path="src/components/CarReviews.tsx">
          <CardContent className="py-10 text-center" data-id="bvnsirioz" data-path="src/components/CarReviews.tsx">
            <p className="text-gray-500" data-id="3kyzi3l2v" data-path="src/components/CarReviews.tsx">No reviews yet. Be the first to leave a review!</p>
            {onAddReview &&
          <Button
            onClick={onAddReview}
            className="mt-4 bg-aerotrav-blue hover:bg-blue-700" data-id="lzebklkgo" data-path="src/components/CarReviews.tsx">

                Write a Review
              </Button>
          }
          </CardContent>
        </Card> :

      <div className="space-y-4" data-id="wbak3ehtb" data-path="src/components/CarReviews.tsx">
          {reviews.map((review) =>
        <Card key={review.id} className="overflow-hidden" data-id="3i3gztdfl" data-path="src/components/CarReviews.tsx">
              <CardContent className="p-4" data-id="a9cdmeopt" data-path="src/components/CarReviews.tsx">
                <div className="flex items-start" data-id="fbekuo4d1" data-path="src/components/CarReviews.tsx">
                  <Avatar className="h-10 w-10 mr-4" data-id="6h006vb0n" data-path="src/components/CarReviews.tsx">
                    <AvatarImage src={review.userAvatar} alt={review.userName} data-id="zr7gp0ljh" data-path="src/components/CarReviews.tsx" />
                    <AvatarFallback data-id="idqqoqq0e" data-path="src/components/CarReviews.tsx">
                      {review.userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1" data-id="hfmkzy8ud" data-path="src/components/CarReviews.tsx">
                    <div className="flex justify-between items-center" data-id="l4t3zd2xp" data-path="src/components/CarReviews.tsx">
                      <h3 className="font-medium" data-id="4a6byc0wz" data-path="src/components/CarReviews.tsx">{review.userName}</h3>
                      <span className="text-sm text-gray-500" data-id="o967rpf59" data-path="src/components/CarReviews.tsx">{review.date}</span>
                    </div>
                    <div className="flex items-center my-1" data-id="1ecdqhw4b" data-path="src/components/CarReviews.tsx">
                      {[...Array(5)].map((_, i) =>
                  <span key={i} className="text-yellow-400 mr-0.5" data-id="kd3v8u9u9" data-path="src/components/CarReviews.tsx">
                          {i < review.rating ? "★" : "☆"}
                        </span>
                  )}
                    </div>
                    <p className="text-gray-700 mt-2" data-id="ydgrbnrmq" data-path="src/components/CarReviews.tsx">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
        )}
        </div>
      }
    </div>);

};

export default CarReviews;