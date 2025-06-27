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
  Plane, 
  Clock, 
  MapPin, 
  Users, 
  Wifi, 
  Coffee, 
  Tv, 
  Utensils,
  CheckCircle,
  XCircle,
  Info,
  Star,
  Calendar,
  Shield
} from 'lucide-react';

const FlightDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  // Get flight data from location state or use mock data
  const flightData = location.state || {
    flightId: parseInt(id || '1'),
    airline: 'AirAsia',
    logo: '/airasia-logo.png',
    flightNumber: 'AK520',
    departureTime: '06:30',
    arrivalTime: '09:10',
    duration: '2h 40m',
    departureAirport: 'Kuala Lumpur (KUL)',
    arrivalAirport: 'Da Nang (DAD)',
    departureCity: 'Kuala Lumpur',
    arrivalCity: 'Da Nang',
    direct: true,
    stops: 0,
    price: 567,
    currency: 'MYR',
    baggage: '7kg carry-on',
    amenities: ['Wifi', 'Entertainment'],
    aircraft: 'Airbus A320',
    carbonEmission: 'Low',
    refundable: false
  };

  const handleBackToFlights = () => {
    navigate('/flights');
  };

  const handleBookFlight = () => {
    navigate('/flight-booking', { 
      state: flightData 
    });
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
                onClick={handleBackToFlights}
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Flight Details</h1>
                <p className="text-blue-100">
                  {flightData.airline} {flightData.flightNumber} • {flightData.departureCity} to {flightData.arrivalCity}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Flight Overview Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg border-2 border-gray-100 flex items-center justify-center">
                      {flightData.logo ? (
                        <img 
                          src={flightData.logo} 
                          alt={flightData.airline}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm font-medium">
                          {flightData.airline.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{flightData.airline}</h3>
                      <p className="text-gray-600">{flightData.flightNumber} • {flightData.aircraft}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-aerotrav-blue">{flightData.currency}{flightData.price}</div>
                    <p className="text-sm text-gray-500">per passenger</p>
                  </div>
                </div>

                {/* Flight timeline */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{flightData.departureTime}</div>
                    <div className="text-gray-600">{flightData.departureAirport}</div>
                    <div className="text-sm text-gray-500">2024-03-15</div>
                    <div className="text-sm text-gray-500">Terminal 1</div>
                  </div>
                  
                  <div className="flex-1 mx-8">
                    <div className="relative">
                      <div className="flex items-center justify-center">
                        <div className="h-px bg-aerotrav-blue flex-1"></div>
                        <div className="mx-4 p-2 bg-aerotrav-blue rounded-full">
                          <Plane className="w-4 h-4 text-white" />
                        </div>
                        <div className="h-px bg-aerotrav-blue flex-1"></div>
                      </div>
                      <div className="text-center mt-2">
                        <div className="text-sm font-medium">{flightData.duration}</div>
                        <div className="text-xs text-gray-500">
                          {flightData.direct ? 'Direct flight' : `${flightData.stops} stop(s)`}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">{flightData.arrivalTime}</div>
                    <div className="text-gray-600">{flightData.arrivalAirport}</div>
                    <div className="text-sm text-gray-500">2024-03-15</div>
                    <div className="text-sm text-gray-500">Gate G12</div>
                  </div>
                </div>

                {/* Amenities and features */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Flight Features</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-5 h-5 text-blue-500" />
                      <span className="text-sm">Wi-Fi Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tv className="w-5 h-5 text-purple-500" />
                      <span className="text-sm">Entertainment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-orange-500" />
                      <span className="text-sm">Meals Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm">7kg Baggage</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Tabs */}
              <div className="bg-white rounded-xl shadow-lg">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-100 rounded-t-xl">
                    <TabsTrigger value="details">Flight Details</TabsTrigger>
                    <TabsTrigger value="baggage">Baggage</TabsTrigger>
                    <TabsTrigger value="policies">Policies</TabsTrigger>
                  </TabsList>
                  
                  <div className="p-6">
                    <TabsContent value="details" className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Aircraft & Service Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Aircraft:</span>
                            <span className="font-medium">{flightData.aircraft}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Operated by:</span>
                            <span className="font-medium">{flightData.airline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Class:</span>
                            <span className="font-medium">Economy</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Seat Configuration:</span>
                            <span className="font-medium">3-3-3</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Check-in:</span>
                            <span className="font-medium">Online 48hrs before</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">On-time Performance:</span>
                            <span className="font-medium text-green-600">85%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Carbon Footprint:</span>
                            <span className="font-medium text-green-600">{flightData.carbonEmission}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Refundable:</span>
                            <span className="font-medium">{flightData.refundable ? 'Yes' : 'With fee'}</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="baggage" className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Baggage Allowance</h3>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-green-50">
                          <h4 className="font-medium mb-2 text-green-600">✓ Included in your fare</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Carry-on baggage:</span>
                              <span className="font-medium">7kg cabin bag</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Personal item:</span>
                              <span className="font-medium">Small bag (under seat)</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2 text-blue-600">Additional Baggage</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>First checked bag (20kg):</span>
                              <span className="font-medium">MYR 120</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Extra weight (per kg):</span>
                              <span className="font-medium">MYR 15</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="policies" className="space-y-4">
                      <h3 className="text-lg font-semibold mb-4">Booking Policies</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Cancellation Policy</h4>
                          <p className="text-gray-600 text-sm">Free cancellation up to 24 hours before departure. After that, cancellation fees apply starting from MYR 200.</p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Change Policy</h4>
                          <p className="text-gray-600 text-sm">Changes allowed with fee starting from MYR 150. Fare difference may apply.</p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Special Requirements</h4>
                          <p className="text-gray-600 text-sm">Special meals, wheelchair assistance, and other services can be added during booking or up to 48 hours before departure.</p>
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
                    {flightData.currency}{flightData.price}
                  </div>
                  <p className="text-gray-600">per passenger</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base fare:</span>
                    <span>{flightData.currency}{flightData.price - 50}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & fees:</span>
                    <span>{flightData.currency}50</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{flightData.currency}{flightData.price}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleBookFlight}
                  className="w-full bg-aerotrav-blue hover:bg-aerotrav-blue-700 text-white py-3 text-lg font-semibold mb-4"
                >
                  Book This Flight
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">Price includes taxes and fees</p>
                  <div className="flex items-center justify-center gap-2 text-xs text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Free cancellation within 24 hours</span>
                  </div>
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

export default FlightDetailsPage; 