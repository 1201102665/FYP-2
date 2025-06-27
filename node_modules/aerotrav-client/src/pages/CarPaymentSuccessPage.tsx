import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Car, MapPin, Calendar, CreditCard, Download } from "lucide-react";

const CarPaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get booking data from navigation state
  const bookingData = location.state || {
    bookingReference: 'CAR-' + Date.now(),
    car: null,
    driverDetails: null,
    pricing: { total: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your car rental booking has been successfully completed</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Details */}
            <div className="space-y-6">
              {/* Booking Reference */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Booking Reference
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-aerotrav-blue">
                    {bookingData.bookingReference}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Please save this reference for your records
                  </p>
                </CardContent>
              </Card>

              {/* Car Details */}
              {bookingData.car && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="w-5 h-5" />
                      Car Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={bookingData.car.images?.[0] || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60'}
                        alt={`${bookingData.car.make} ${bookingData.car.model}`}
                        className="w-20 h-16 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60';
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {bookingData.car.make} {bookingData.car.model}
                        </h3>
                        <p className="text-gray-600">{bookingData.car.category}</p>
                        <Badge className="bg-yellow-400 text-black">Top Pick</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pickup & Drop-off */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Pickup & Drop-off
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Mon 10 Feb - 10:00AM</div>
                      <div className="text-gray-600 text-sm">
                        Kuala Lumpur Downtown - Jalan Pinang
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Mon 13 Feb - 10:00AM</div>
                      <div className="text-gray-600 text-sm">
                        Kuala Lumpur Downtown - Jalan Pinang
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Details */}
              {bookingData.driverDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle>Driver Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{bookingData.driverDetails.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{bookingData.driverDetails.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">
                        {bookingData.driverDetails.countryCode} {bookingData.driverDetails.phoneNumber}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Payment Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Car hire charge</span>
                      <span>MYR{bookingData.pricing?.carHire || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deposit</span>
                      <span>MYR{bookingData.pricing?.deposit || 0}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Subtotal</span>
                      <span>MYR{bookingData.pricing?.subtotal || 0}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Paid</span>
                      <span className="text-green-600">MYR{bookingData.pricing?.total || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2"
                      onClick={() => window.print()}
                    >
                      <Download className="w-4 h-4" />
                      Download Booking Confirmation
                    </Button>
                    
                    <Button
                      className="w-full bg-aerotrav-blue hover:bg-aerotrav-blue/90"
                      onClick={() => navigate("/profile")}
                    >
                      View My Bookings
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/car-rentals")}
                    >
                      Book Another Car
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Important Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p>• Please bring a valid driver's license and credit card for pickup</p>
                  <p>• Arrive at the pickup location 15 minutes before your scheduled time</p>
                  <p>• Cancellation is free up to 24 hours before pickup</p>
                  <p>• Contact us if you need to modify your booking</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );

};

export default CarPaymentSuccessPage;