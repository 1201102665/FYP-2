import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export interface Recommendation {
  destination: string;
  activities: string[];
  reason: string;
  imageUrl?: string;
}

interface AIRecommendationCardProps {
  recommendation: Recommendation;
  onViewDetails?: () => void;
}

const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
  onViewDetails
}) => {
  const { destination, activities, reason, imageUrl } = recommendation;

  // Default image if none provided
  const defaultImage = "https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg" data-id="1vt05iixc" data-path="src/components/AIRecommendationCard.tsx">
      <div className="relative h-48 overflow-hidden" data-id="d7c36mzks" data-path="src/components/AIRecommendationCard.tsx">
        <img
          src={imageUrl || defaultImage}
          alt={destination}
          className="w-full h-full object-cover transition-transform hover:scale-105" data-id="vyli01ejt" data-path="src/components/AIRecommendationCard.tsx" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" data-id="m52cbjits" data-path="src/components/AIRecommendationCard.tsx" />
        <div className="absolute bottom-0 left-0 p-4" data-id="zm4q8aq76" data-path="src/components/AIRecommendationCard.tsx">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-aerotrav-yellow text-gray-900 mb-2" data-id="9hwbe0qfe" data-path="src/components/AIRecommendationCard.tsx">
            Recommended
          </span>
        </div>
      </div>

      <CardHeader data-id="x6tuzb6dr" data-path="src/components/AIRecommendationCard.tsx">
        <CardTitle className="text-xl font-bold" data-id="coa8yf98l" data-path="src/components/AIRecommendationCard.tsx">{destination}</CardTitle>
        <CardDescription className="text-sm italic" data-id="9yaq4epe6" data-path="src/components/AIRecommendationCard.tsx">
          Personalized for you
        </CardDescription>
      </CardHeader>

      <CardContent data-id="f8rzg8xko" data-path="src/components/AIRecommendationCard.tsx">
        <div className="mb-4" data-id="nj7jatx07" data-path="src/components/AIRecommendationCard.tsx">
          <h4 className="text-sm font-medium mb-2" data-id="0git3vxx5" data-path="src/components/AIRecommendationCard.tsx">Suggested Activities:</h4>
          <ul className="space-y-1" data-id="ekm5sqqp7" data-path="src/components/AIRecommendationCard.tsx">
            {activities.slice(0, 3).map((activity, index) =>
              <li key={index} className="flex items-start text-sm" data-id="kgad8tffr" data-path="src/components/AIRecommendationCard.tsx">
                <span className="mr-2" data-id="psvmf3ckk" data-path="src/components/AIRecommendationCard.tsx">•</span>
                <span data-id="zxgan9ox9" data-path="src/components/AIRecommendationCard.tsx">{activity}</span>
              </li>
            )}
          </ul>
        </div>

        <div data-id="lc0qt8vq6" data-path="src/components/AIRecommendationCard.tsx">
          <h4 className="text-sm font-medium mb-1" data-id="ctktxyd5d" data-path="src/components/AIRecommendationCard.tsx">Why we recommended this:</h4>
          <p className="text-sm text-gray-600" data-id="26otrwrr9" data-path="src/components/AIRecommendationCard.tsx">{reason}</p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between" data-id="0hns30bda" data-path="src/components/AIRecommendationCard.tsx">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails} data-id="jc9pglzc3" data-path="src/components/AIRecommendationCard.tsx">

          View Details
        </Button>
        <Button
          asChild
          className="bg-aerotrav-blue hover:bg-aerotrav-blue-700"
          size="sm" data-id="pxpsh94ze" data-path="src/components/AIRecommendationCard.tsx">

          <Link to={`/packages?destination=${encodeURIComponent(destination)}`} data-id="h8bh72rj9" data-path="src/components/AIRecommendationCard.tsx">
            Find Packages
          </Link>
        </Button>
      </CardFooter>
    </Card>);

};

export default AIRecommendationCard;