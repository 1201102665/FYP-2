import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car } from "@/services/carService";
import { useUserActivityContext } from "@/contexts/UserActivityContext";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Users, Fuel, Settings, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useCartContext } from '@/contexts/CartContext';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { trackView } = useUserActivityContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCartContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Track when the car is viewed
  React.useEffect(() => {
    if (car?.id) {
      trackView(car.id.toString(), 'car');
    }
  }, [car?.id, trackView]);

  // Additional safety check
  if (!car) {
    console.error('CarCard: car prop is undefined');
    return <div>Error: Car data not available</div>;
  }

  // Safe defaults for car properties
  const safeImages = car?.images || [];
  const safeFeatures = car?.features || [];
  
  // Simplified fallback image
  const getFallbackImage = () => {
    return 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60';
  };

  // Simple image logic - always ensure we have an image
  const currentImage = safeImages.length > 0 ? safeImages[currentImageIndex] : getFallbackImage();
  console.log('🖼️ CarCard - Current image URL:', currentImage);

  const displayImages = safeImages.length > 0 && safeImages[0].startsWith('http') ? safeImages : [getFallbackImage()];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const maxIndex = Math.max(0, displayImages.length - 1);
    setCurrentImageIndex(prev => 
      prev >= maxIndex ? 0 : prev + 1
    );
    setImageError(false);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const maxIndex = Math.max(0, displayImages.length - 1);
    setCurrentImageIndex(prev => 
      prev <= 0 ? maxIndex : prev - 1
    );
    setImageError(false);
  };

  const handleViewDetails = () => {
    navigate(`/car-details/${car.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      addToCart({
        type: 'car',
        id: car.id,
        title: `${car.make} ${car.model}`,
        image: displayImages[0] || getFallbackImage(),
        price: car.daily_rate,
        quantity: 1,
        details: {
          category: car.category,
          transmission: car.transmission,
          seats: car.seats,
          luggage: car.luggage_capacity
        }
      });
      
      toast({
        title: "Added to cart",
        description: `${car.make} ${car.model} has been added to your cart.`,
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add car to cart. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex">
        {/* Image Section */}
        <div className="relative w-1/3 bg-gray-200 flex-shrink-0" style={{ minHeight: '250px' }}>
          <img
            src={currentImage}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
            style={{ 
              height: '250px', 
              width: '100%', 
              display: 'block',
              objectFit: 'cover'
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully:', currentImage);
            }}
            onError={(e) => {
              console.error('❌ Image failed to load:', currentImage);
              const target = e.target as HTMLImageElement;
              const fallbackUrl = 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60';
              console.log('🔄 Setting emergency fallback:', fallbackUrl);
              target.src = fallbackUrl;
            }}
          />
          {displayImages.length > 1 && !imageError && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Details Section */}
        <div className="w-2/3 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">{car.make} {car.model}</h3>
              <p className="text-gray-600">{car.year} • {car.category}</p>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-semibold">{car.rating}</span>
              <span className="text-gray-500 text-sm ml-1">({car.review_count})</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600">Transmission</p>
              <p className="font-medium capitalize">{car.transmission}</p>
            </div>
            <div>
              <p className="text-gray-600">Fuel Type</p>
              <p className="font-medium capitalize">{car.fuel_type}</p>
            </div>
            <div>
              <p className="text-gray-600">Seats</p>
              <p className="font-medium">{car.seats} People</p>
            </div>
            <div>
              <p className="text-gray-600">Luggage</p>
              <p className="font-medium">{car.luggage_capacity} Bags</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div>
              <p className="text-gray-600">Daily Rate</p>
              <p className="text-2xl font-bold">RM{car.daily_rate}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleViewDetails}>
                View Details
              </Button>
              <Button onClick={handleAddToCart} className="bg-aerotrav-yellow hover:bg-aerotrav-yellow/90 text-black">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;