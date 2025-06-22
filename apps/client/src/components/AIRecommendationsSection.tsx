import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heart, MapPin, Clock, Star, TrendingUp } from 'lucide-react';
import { getDestinations } from '@/services/destinationService';
import { getPackages } from '@/services/packageService';

interface RecommendationCardProps {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  rating: number;
  price: number;
  tags: string[];
  type: 'destination' | 'hotel' | 'package';
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  id, title, subtitle, image, rating, price, tags, type 
}) => {
  const [liked, setLiked] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-40 object-cover"
        />
        <button
          onClick={() => setLiked(!liked)}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-colors ${
            liked ? 'bg-red-100 text-red-500' : 'bg-white/80 text-gray-600 hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-xs text-gray-600 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {subtitle}
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span>{rating}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-aerotrav-blue">
            ${price}
          </div>
          <Button size="sm" className="text-xs">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AIRecommendationsSection: React.FC = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destinationsData, packagesData] = await Promise.all([
          getDestinations(),
          getPackages()
        ]);
        setDestinations(destinationsData);
        setPackages(packagesData);
      } catch (error) {
        console.error('Error fetching recommendations data:', error);
        setDestinations([]);
        setPackages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform data for recommendations
  const recommendations: RecommendationCardProps[] = [
    ...destinations.slice(0, 4).map((dest, index) => ({
      id: dest.id,
      title: dest.name,
      subtitle: dest.description?.substring(0, 50) + '...' || 'Amazing destination',
      image: dest.image || `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=200&fit=crop`,
      rating: dest.rating || 4.5,
      price: dest.price || 899,
      tags: ['Popular', 'Trending'],
      type: 'destination' as const
    })),
    ...packages.slice(0, 2).map((pkg, index) => ({
      id: pkg.id,
      title: pkg.name,
      subtitle: pkg.destinations?.join(', ') || pkg.description?.substring(0, 50) + '...' || 'Travel package',
      image: pkg.image || `https://images.unsplash.com/photo-${1600000000000 + index}?w=400&h=200&fit=crop`,
      rating: pkg.rating || 4.3,
      price: pkg.price || 1299,
      tags: pkg.included_services?.slice(0, 2) || ['All-inclusive', 'Premium'],
      type: 'package' as const
    }))
  ];

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-40 rounded-t-lg"></div>
                <div className="bg-white p-4 rounded-b-lg border border-t-0">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="flex gap-2 mb-3">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          AI-Powered Recommendations
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Personalized suggestions based on your preferences and trending destinations
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <RecommendationCard key={`${rec.type}-${rec.id}`} {...rec} />
          ))}
        </div>
        
        {recommendations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recommendations available at the moment.</p>
            <p className="text-sm">Check back later for personalized travel suggestions!</p>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Button variant="outline" className="bg-white hover:bg-gray-50">
            <Clock className="h-4 w-4 mr-2" />
            Refresh Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationsSection;