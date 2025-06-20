import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  ArrowLeft, 
  Car, 
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
  Phone
} from 'lucide-react';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get car data from location state or use mock data
  const carData = location.state || {
    id: parseInt(id || '1'),
    name: "Toyota Vios",
    category: "Economy",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400",
    price: 85,
    originalPrice: 100,
    location: "Kuala Lumpur",
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    doors: 4,
    luggage: 2,
    rating: 4.2,
    reviewCount: 156,
    supplier: "Budget",
    features: ["AC", "GPS", "Bluetooth"],
    fuelEfficiency: "15 km/L",
    availability: "Available",
    featured: false,
    deals: ["Free Cancellation", "Unlimited Mileage"]
  };

  const handleBackToCars = () => {
    navigate('/car-rentals');
  };

  const handleBookCar = () => {
    navigate(`/car-payment/${carData.id}`, { 
      state: carData 
    });
  };

  const carImages = [
    carData.image,
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400",
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400"
  ];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
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
                {carData.name} • {carData.category} • {carData.supplier}
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
              <div className="relative h-64 md:h-80">
                <img 
                  src={carImages[selectedImageIndex]}
                  alt={carData.name}
                  className="w-full h-full object-cover"
                />
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
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{carData.name}</h2>
                    <p className="text-gray-600">{carData.category} • 2022</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{carData.rating}</span>
                      <span className="text-gray-500">({carData.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-aerotrav-blue">MYR{carData.price}</div>
                    <p className="text-sm text-gray-500">per day</p>
                    {carData.originalPrice && (
                      <p className="text-sm text-gray-400 line-through">MYR{carData.originalPrice}</p>
                    )}
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
                    <Car className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-sm text-gray-600">Doors</div>
                      <div className="font-medium">{carData.doors}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Luggage className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm text-gray-600">Luggage</div>
                      <div className="font-medium">{carData.luggage}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Settings className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="text-sm text-gray-600">Transmission</div>
                      <div className="font-medium">{carData.transmission}</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Included Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {carData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                    {carData.deals.map((deal, index) => (
                      <Badge key={index} variant="outline" className="border-blue-500 text-blue-600">
                        {deal}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Supplier info */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Provided by {carData.supplier}</p>
                      <p className="text-sm text-gray-600">Professional car rental service</p>
                    </div>
                    <Badge className="bg-green-500">
                      {carData.availability}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Information Tabs */}
            <div className="bg-white rounded-xl shadow-lg">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-100 rounded-t-xl">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="terms">Terms</TabsTrigger>
                  <TabsTrigger value="extras">Extras</TabsTrigger>
                </TabsList>
                
                <div className="p-6">
                  <TabsContent value="details" className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Make & Model:</span>
                          <span className="font-medium">{carData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year:</span>
                          <span className="font-medium">2022</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Color:</span>
                          <span className="font-medium">White</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Engine:</span>
                          <span className="font-medium">1.5L</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fuel Type:</span>
                          <span className="font-medium">{carData.fuelType}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fuel Efficiency:</span>
                          <span className="font-medium">{carData.fuelEfficiency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Supplier:</span>
                          <span className="font-medium">{carData.supplier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{carData.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mileage:</span>
                          <span className="font-medium text-green-600">Unlimited</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Insurance:</span>
                          <span className="font-medium">Basic insurance included</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="terms" className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Rental Terms & Conditions</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Fuel Policy</h4>
                        <p className="text-gray-600 text-sm">Full to Full - Receive the car with a full tank and return it with a full tank.</p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Security Deposit</h4>
                        <p className="text-gray-600 text-sm">MYR 500 (hold on credit card). The deposit will be released upon return of the vehicle in good condition.</p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Cancellation Policy</h4>
                        <p className="text-gray-600 text-sm">Free cancellation up to 48 hours before pickup. Cancellation fees may apply for late cancellations.</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="extras" className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Optional Extras</h3>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">GPS Navigation System</div>
                          <div className="font-bold text-aerotrav-blue">MYR 15/day</div>
                        </div>
                        <p className="text-sm text-gray-600">Satellite navigation system with maps of Malaysia.</p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">Child Safety Seat</div>
                          <div className="font-bold text-aerotrav-blue">MYR 20/day</div>
                        </div>
                        <p className="text-sm text-gray-600">Safety-approved child seat for ages 1-12 years.</p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">Additional Driver</div>
                          <div className="font-bold text-aerotrav-blue">MYR 25/day</div>
                        </div>
                        <p className="text-sm text-gray-600">Add another qualified driver to the rental agreement.</p>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-aerotrav-blue mb-2">
                  MYR{carData.price}
                </div>
                <p className="text-gray-600">per day</p>
                {carData.originalPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    MYR{carData.originalPrice}
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Daily rate (3 days):</span>
                  <span>MYR{carData.price * 3}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Insurance:</span>
                  <span className="text-green-600">Included</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes & fees:</span>
                  <span>MYR25</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total (3 days):</span>
                  <span>MYR{(carData.price * 3) + 25}</span>
                </div>
              </div>

              <Button 
                onClick={handleBookCar}
                className="w-full bg-aerotrav-blue hover:bg-aerotrav-blue-700 text-white py-3 text-lg font-semibold mb-4"
              >
                Book This Car
              </Button>

              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Free cancellation</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
                  <Shield className="w-4 h-4" />
                  <span>Insurance included</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-purple-600">
                  <Star className="w-4 h-4" />
                  <span>Highly rated supplier</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Need help?</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
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