import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:3001';

interface Booking {
  id: number;
  booking_reference: string;
  service_type: string;
  booking_status: string;
  total_amount: number;
  booking_date: string;
  created_at: string;
}

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`);
        if (!response.ok) throw new Error('Failed to fetch booking');
        const data = await response.json();
        if (data.success) {
          setBooking(data.data.booking);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) return <LoadingSpinner />;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Booking Confirmation</h1>
        
        <Alert className="mb-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-700 font-medium">Payment Successful!</span>
          </div>
        </Alert>

        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <div className="text-center text-yellow-700">
            <p className="font-medium mb-2">Booking Status: {booking.booking_status}</p>
            <p className="text-sm">
              {booking.booking_status === 'pending' ? (
                <>
                  Your booking is currently pending approval from our team. We will notify you once it's confirmed.
                  This usually takes 1-2 business days.
                </>
              ) : booking.booking_status === 'confirmed' ? (
                'Your booking has been confirmed! You can proceed with your travel plans.'
              ) : (
                'Your booking could not be confirmed at this time. Please contact our support team for assistance.'
              )}
            </p>
          </div>
        </Alert>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="font-semibold mb-2">Booking Details</h2>
            <p>Booking ID: {booking.id}</p>
            <p>Booking Reference: {booking.booking_reference}</p>
            <p>Service: {booking.service_type}</p>
            <p>Status: <span className={`px-2 py-1 rounded-full text-xs ${
              booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' :
              booking.booking_status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>{booking.booking_status}</span></p>
          </div>

          <div className="border-b pb-4">
            <h2 className="font-semibold mb-2">Payment Information</h2>
            <p>Total Amount: ${booking.total_amount.toFixed(2)}</p>
            <p>Payment Status: <span className="text-green-600">Paid</span></p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">What's Next?</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {booking.booking_status === 'pending' && (
                <>
                  <li>Our team will review your booking</li>
                  <li>You'll receive an email notification once your booking is confirmed</li>
                  <li>You can check your booking status anytime in your account dashboard</li>
                </>
              )}
              {booking.booking_status === 'confirmed' && (
                <>
                  <li>Your booking is confirmed and ready</li>
                  <li>Save your booking confirmation for reference</li>
                  <li>Contact us if you need to make any changes</li>
                </>
              )}
              {booking.booking_status === 'rejected' && (
                <>
                  <li>Please contact our support team for assistance</li>
                  <li>We'll help you understand why the booking couldn't be confirmed</li>
                  <li>We can help you make alternative arrangements</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingConfirmationPage; 