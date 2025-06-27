import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCarById } from '@/services/carService';
import { Car } from '@/services/carService';
import { useToast } from '@/hooks/use-toast';
import { useCartContext } from '@/contexts/CartContext';
import { 
  ArrowLeft, 
  Car as CarIcon, 
  Users, 
  Luggage, 
  Fuel, 
  Settings, 
  Shield, 
  Star,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  CreditCard,
  Key,
  Phone,
  ShoppingCart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCartContext();

  const [carData, setCarData] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Load car data from API
  useEffect(() => {
    const loadCarData = async () => {
      if (!id) {
        setError('Car ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const car = await getCarById(parseInt(id));
        setCarData(car);
        setError(null);
      } catch (error) {
        console.error('Error loading car details:', error);
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    loadCarData();
  }, [id]);

  const handleBackToCars = () => {
    navigate('/car-rentals');
  };

  const handleAddToCart = () => {
    if (!carData) return;

    try {
      addToCart({
        type: 'car',
        id: carData.id,
        title: `${carData.make} ${carData.model}`,
        image: carImages[0] || getFallbackImage(carData.category),
        price: carData.daily_rate,
        quantity: 1,
        details: {
          category: carData.category,
          transmission: carData.transmission,
          seats: carData.seats,
          luggage: carData.luggage_capacity
        }
      });
      
      toast({
        title: "Added to cart",
        description: `${carData.make} ${carData.model} has been added to your cart.`,
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

  const getFallbackImage = (category: string) => {
    const fallbacks = {
      economy: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop&q=60',
      compact: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60',
      intermediate: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=60',
      standard: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60',
      'full-size': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=60',
      premium: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=60',
      luxury: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=60',
      suv: 'https://images.unsplash.com/photo-1566473179817-0a9e8b10e43e?w=800&auto=format&fit=crop&q=60',
      van: 'https://images.unsplash.com/photo-1558383331-f520f2888351?w=800&auto=format&fit=crop&q=60'
    };
    return fallbacks[category as keyof typeof fallbacks] || fallbacks.standard;
  };

  if (loading) {
    return (
      <div className="page-layout bg-gray-50">
        <Header />
        <div className="page-content flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !carData) {
    return (
      <div className="page-layout bg-gray-50">
        <Header />
        <div className="page-content">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
              <p className="text-gray-600 mb-4">{error || 'The requested car could not be found.'}</p>
              <Button onClick={handleBackToCars}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Car Rentals
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Use car images or fallback to placeholder
  const carImages = carData.images && carData.images.length > 0 
    ? carData.images 
    : [getFallbackImage(carData.category)];

  const currentImage = imageError ? getFallbackImage(carData.category) : carImages[selectedImageIndex];

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? carImages.length - 1 : prev - 1
    );
    setImageError(false);
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => 
      prev === carImages.length - 1 ? 0 : prev + 1
    );
    setImageError(false);
  };

  return (
    <div className="page-layout bg-gray-50">
      <Header />
      <div className="page-content">
        {/* Header with back button */}
        <div className="bg-aerotrav-blue text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBackToCars}
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Car Rental Details</h1>
                <p className="text-blue-100">
                  {carData.make} {carData.model} • {carData.category} • {carData.rental_company}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Car Overview Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Image Gallery */}
                <div className="relative h-[400px]">
                  <img 
                    src={currentImage}
                    alt={`${carData.make} ${carData.model}`}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                  {carImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-2">
                          {carImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-colors ${
                                index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{carData.make} {carData.model}</h2>
                      <p className="text-gray-600">{carData.category} • {carData.year}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{carData.rating || 4.0}</span>
                        <span className="text-gray-500">({carData.review_count || 0} reviews)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-aerotrav-blue">MYR {carData.daily_rate}</div>
                      <p className="text-sm text-gray-500">per day</p>
                    </div>
                  </div>

                  {/* Car specifications */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-gray-600">Seats</div>
                        <div className="font-medium">{carData.seats}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Luggage className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-gray-600">Luggage</div>
                        <div className="font-medium">{carData.luggage_capacity} Bags</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Settings className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-gray-600">Transmission</div>
                        <div className="font-medium capitalize">{carData.transmission}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Fuel className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-gray-600">Fuel Type</div>
                        <div className="font-medium capitalize">{carData.fuel_type}</div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {carData.features?.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 sticky top-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-aerotrav-blue mb-1">
                    MYR {carData.daily_rate}
                  </div>
                  <p className="text-gray-600">per day</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Insurance</span>
                    <span className="font-medium text-green-600">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & fees</span>
                    <span className="font-medium">MYR {Math.round(carData.daily_rate * 0.1)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Button 
                    className="w-full bg-primary text-white hover:bg-primary/90"
                    onClick={() => navigate(`/car-booking/${carData.id}`)}
                  >
                    Book this Car
                  </Button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Free cancellation up to 24 hours before pickup</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>No credit card fees</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Key className="w-4 h-4" />
                    <span>24/7 pickup available</span>
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Need help?</div>
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CarDetailsPage; 