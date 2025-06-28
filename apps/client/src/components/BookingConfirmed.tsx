import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getBooking } from '@/services/bookingService';
import LoadingSpinner from '@/components/LoadingSpinner';

interface BookingConfirmedProps {
  bookingReference: string;
}

const BookingConfirmed: React.FC<BookingConfirmedProps> = ({ bookingReference }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookingStatus, setBookingStatus] = useState<string>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingStatus = async () => {
      try {
        const booking = await getBooking(bookingReference);
        setBookingStatus(booking.booking_status.toLowerCase());
      } catch (error) {
        console.error('Error fetching booking status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingStatus();
  }, [bookingReference]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Confirmed
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending Admin Approval
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="p-8 flex justify-center">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className={`h-2 ${getStatusColor(bookingStatus)}`}></div>
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center">
          <div className={`w-20 h-20 ${bookingStatus === 'rejected' ? 'bg-red-100' : 'bg-green-100'} rounded-full flex items-center justify-center mb-6`}>
            {bookingStatus === 'rejected' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Booking {bookingStatus === 'rejected' ? 'Update' : 'Submitted'}!</h1>
          <div className="mb-4">
            {getStatusBadge(bookingStatus)}
          </div>
          <p className="text-gray-600 mb-8">
            {bookingStatus === 'confirmed' && 'Your booking has been confirmed. Thank you for choosing our service!'}
            {bookingStatus === 'rejected' && 'Unfortunately, your booking could not be confirmed at this time.'}
            {bookingStatus === 'pending' && 'Your booking is being reviewed by our team. We will notify you once it\'s confirmed.'}
          </p>
          
          <div className="bg-gray-50 w-full p-6 rounded-lg mb-8">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Booking Reference:</span>
              <span className="font-bold">{bookingReference}</span>
            </div>
            
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span>{user?.name || 'Guest'}</span>
            </div>
          </div>
          
          <div className="w-full mb-8">
            <h3 className="font-bold text-left mb-3">What's Next?</h3>
            <ol className="list-decimal list-inside space-y-2 text-left">
              {bookingStatus === 'pending' && (
                <>
                  <li className="text-gray-600">Our team is reviewing your booking request.</li>
                  <li className="text-gray-600">You will receive an email notification once the status is updated.</li>
                  <li className="text-gray-600">You can check the booking status anytime in your profile.</li>
                </>
              )}
              {bookingStatus === 'confirmed' && (
                <>
                  <li className="text-gray-600">Check your email for your booking confirmation.</li>
                  <li className="text-gray-600">Review your itinerary details in your profile.</li>
                  <li className="text-gray-600">Download the Aerotrav app to access your booking on the go.</li>
                  <li className="text-gray-600">Prepare for your trip! Don't forget to pack essentials.</li>
                </>
              )}
              {bookingStatus === 'rejected' && (
                <>
                  <li className="text-gray-600">Check your email for more details about the rejection.</li>
                  <li className="text-gray-600">Contact our support team for assistance.</li>
                  <li className="text-gray-600">You can try booking again with different options.</li>
                </>
              )}
            </ol>
          </div>
          
          <p className="text-gray-600 text-sm mb-8">
            A notification email has been sent to {user?.email || 'your email address'}.
            You can also find your booking details in your account.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/profile')}
              className="bg-aerotrav-blue hover:bg-blue-700">
              View My Bookings
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-aerotrav-blue text-aerotrav-blue hover:bg-aerotrav-blue/10">
              Return to Home
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingConfirmed;