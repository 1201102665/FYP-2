import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewForm from '@/components/ReviewForm';
import {
  CheckCircle,
  Download,
  Mail,
  Calendar,
  MapPin,
  Users,
  Phone,
  Plane,
  Hotel,
  Car,
  Package,
  Home,
  FileText,
  Star
} from 'lucide-react';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [reviewedItems, setReviewedItems] = useState<Set<string>>(new Set());

  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find your booking details.</p>
            <Button onClick={() => navigate('/')} className="bg-aerotrav-blue hover:bg-aerotrav-blue-700">
              Go Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { bookingReference, checkoutData, cartItems, paymentAmount, bookingDate } = bookingData;

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'hotel': return <Hotel className="h-4 w-4" />;
      case 'car': return <Car className="h-4 w-4" />;
      case 'package': return <Package className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadItinerary = () => {
    console.log('🟢 bookingReference:', bookingReference);
    // In a real application, this would generate and download a PDF
    alert('Itinerary download will be available soon!');
  };

  const sendConfirmationEmail = () => {
    // In a real application, this would send a confirmation email
    alert('Confirmation email sent to ' + checkoutData.contactInfo.email);
  };

  const handleReviewItem = (item: any) => {
    setSelectedItem(item);
    setShowReviewForm(true);
  };

  const handleReviewSuccess = () => {
    if (selectedItem) {
      const itemKey = `${selectedItem.type}-${selectedItem.id}`;
      setReviewedItems(prev => new Set([...prev, itemKey]));
    }
    setShowReviewForm(false);
    setSelectedItem(null);
  };

  const handleReviewCancel = () => {
    setShowReviewForm(false);
    setSelectedItem(null);
  };

  const isItemReviewed = (item: any) => {
    const itemKey = `${item.type}-${item.id}`;
    return reviewedItems.has(itemKey);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">

          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 text-lg">Your trip has been successfully booked</p>
            <div className="mt-4 p-4 bg-green-50 rounded-lg inline-block">
              <p className="text-sm text-gray-600">Booking Reference</p>
              <p className="text-2xl font-bold text-green-700">{bookingReference}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Booking Details */}
            <div className="lg:col-span-2 space-y-6">

              {/* Booking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Booking Date</p>
                      <p className="font-medium">{formatDate(bookingDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium text-green-600">${paymentAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <p className="font-medium text-green-600">✓ Confirmed</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Travelers</p>
                      <p className="font-medium">{checkoutData.travelers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booked Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Booked Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            getItemIcon(item.type)
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.price * item.quantity}</p>
                        <p className="text-sm text-green-600">✓ Confirmed</p>
                        {isItemReviewed(item) ? (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm text-gray-600">Reviewed</span>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReviewItem(item)}
                            className="mt-2"
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Rate & Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Review Prompt */}
              {cartItems.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Star className="h-5 w-5" />
                      Share Your Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 mb-4">
                      Help other travelers by sharing your experience with the services you just booked.
                      Your reviews help us improve and assist future travelers in making informed decisions.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cartItems.map((item: any) => (
                        !isItemReviewed(item) && (
                          <Button
                            key={item.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleReviewItem(item)}
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Review {item.name}
                          </Button>
                        )
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Traveler Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Traveler Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {checkoutData.travelers.map((traveler: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Traveler {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Name</p>
                          <p>{traveler.firstName} {traveler.lastName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Email</p>
                          <p>{traveler.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Phone</p>
                          <p>{traveler.phone}</p>
                        </div>
                        {traveler.passportNumber && (
                          <div>
                            <p className="text-gray-600">Passport</p>
                            <p>{traveler.passportNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p>{checkoutData.contactInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p>{checkoutData.contactInfo.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Address</p>
                      <p>{checkoutData.contactInfo.address}</p>
                      <p>{checkoutData.contactInfo.city}, {checkoutData.contactInfo.state} {checkoutData.contactInfo.zipCode}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Requests */}
              {checkoutData.specialRequests && (
                <Card>
                  <CardHeader>
                    <CardTitle>Special Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{checkoutData.specialRequests}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Actions Sidebar */}
            <div className="lg:col-span-1 space-y-6">

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={downloadItinerary}
                    className="w-full bg-aerotrav-blue hover:bg-aerotrav-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Itinerary
                  </Button>

                  <Button
                    onClick={sendConfirmationEmail}
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Confirmation Email
                  </Button>

                  <Button
                    onClick={() => navigate('/profile')}
                    variant="outline"
                    className="w-full"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View My Bookings
                  </Button>

                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="w-full"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>$25</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & Fees</span>
                    <span>${paymentAmount - cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) - 25}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Paid</span>
                    <span className="text-green-600">${paymentAmount}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Important Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p>Confirmation email sent to {checkoutData.contactInfo.email}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p>Please check your itinerary for check-in times and requirements</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-orange-600 mt-0.5" />
                    <p>Keep your booking reference {bookingReference} for future reference</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Review Form Modal */}
      {selectedItem && typeof bookingReference === 'string' && (
        <ReviewForm
          itemId={selectedItem.id}
          itemType={selectedItem.type}
          itemName={selectedItem.name}
          itemImage={selectedItem.image}
          bookingId={parseInt(bookingReference.replace('AT', ''))}
          onSuccess={handleReviewSuccess}
          onCancel={handleReviewCancel}
          isOpen={showReviewForm}
        />
      )}

      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;