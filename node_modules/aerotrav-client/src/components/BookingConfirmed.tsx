import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface BookingConfirmedProps {
  bookingReference: string;
}

const BookingConfirmed: React.FC<BookingConfirmedProps> = ({ bookingReference }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Card className="border-0 shadow-lg overflow-hidden" data-id="o4vvhbqkb" data-path="src/components/BookingConfirmed.tsx">
      <div className="bg-green-500 h-2" data-id="61zlm6yna" data-path="src/components/BookingConfirmed.tsx"></div>
      <CardContent className="p-8" data-id="41vdqw8fo" data-path="src/components/BookingConfirmed.tsx">
        <div className="flex flex-col items-center text-center" data-id="wymfhs1ah" data-path="src/components/BookingConfirmed.tsx">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6" data-id="vloiebczu" data-path="src/components/BookingConfirmed.tsx">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" data-id="vpdndc25x" data-path="src/components/BookingConfirmed.tsx">
              <polyline points="20 6 9 17 4 12" data-id="6t0ikzuo0" data-path="src/components/BookingConfirmed.tsx"></polyline>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-2" data-id="ocl613ngu" data-path="src/components/BookingConfirmed.tsx">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8" data-id="llc99iod9" data-path="src/components/BookingConfirmed.tsx">
            Thank you for your booking. Your transaction has been completed successfully.
          </p>
          
          <div className="bg-gray-50 w-full p-6 rounded-lg mb-8" data-id="h6suzbutw" data-path="src/components/BookingConfirmed.tsx">
            <div className="flex justify-between mb-4" data-id="hy8kjo8a5" data-path="src/components/BookingConfirmed.tsx">
              <span className="text-gray-600" data-id="hhjox6r4s" data-path="src/components/BookingConfirmed.tsx">Booking Reference:</span>
              <span className="font-bold" data-id="cpzqxj0aw" data-path="src/components/BookingConfirmed.tsx">{bookingReference}</span>
            </div>
            
            <div className="flex justify-between mb-4" data-id="yl77id18h" data-path="src/components/BookingConfirmed.tsx">
              <span className="text-gray-600" data-id="ad793kcsk" data-path="src/components/BookingConfirmed.tsx">Date:</span>
              <span data-id="jskdtdt2v" data-path="src/components/BookingConfirmed.tsx">{new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between" data-id="7icy6hcnt" data-path="src/components/BookingConfirmed.tsx">
              <span className="text-gray-600" data-id="rjutipn08" data-path="src/components/BookingConfirmed.tsx">Name:</span>
              <span data-id="07d2ygb5v" data-path="src/components/BookingConfirmed.tsx">{user?.name || 'Guest'}</span>
            </div>
          </div>
          
          <div className="w-full mb-8" data-id="i5rhvlwt2" data-path="src/components/BookingConfirmed.tsx">
            <h3 className="font-bold text-left mb-3" data-id="leyzrqno8" data-path="src/components/BookingConfirmed.tsx">What's Next?</h3>
            <ol className="list-decimal list-inside space-y-2 text-left" data-id="g391zpnqc" data-path="src/components/BookingConfirmed.tsx">
              <li className="text-gray-600" data-id="20pfgeaie" data-path="src/components/BookingConfirmed.tsx">Check your email for your booking confirmation.</li>
              <li className="text-gray-600" data-id="yeuid5bu7" data-path="src/components/BookingConfirmed.tsx">Review your itinerary details in your profile.</li>
              <li className="text-gray-600" data-id="ksm8cvgby" data-path="src/components/BookingConfirmed.tsx">Download the Aerotrav app to access your booking on the go.</li>
              <li className="text-gray-600" data-id="0uyi4myby" data-path="src/components/BookingConfirmed.tsx">Prepare for your trip! Don't forget to pack essentials.</li>
            </ol>
          </div>
          
          <p className="text-gray-600 text-sm mb-8" data-id="yeabpqr7q" data-path="src/components/BookingConfirmed.tsx">
            A confirmation email has been sent to {user?.email || 'your email address'}.
            You can also find your booking details in your account.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4" data-id="z0smqz6j3" data-path="src/components/BookingConfirmed.tsx">
            <Button
              onClick={() => navigate('/profile')}
              className="bg-aerotrav-blue hover:bg-blue-700" data-id="j7pqeilse" data-path="src/components/BookingConfirmed.tsx">
              View My Bookings
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-aerotrav-blue text-aerotrav-blue hover:bg-aerotrav-blue/10" data-id="s78pr3obc" data-path="src/components/BookingConfirmed.tsx">
              Return to Home
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>);

};

export default BookingConfirmed;