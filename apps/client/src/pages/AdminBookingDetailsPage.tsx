import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';
import LoadingSpinner from '@/components/LoadingSpinner';
import BookingStatusUpdater from '@/components/BookingStatusUpdater';

interface BookingDetails {
  id: number;
  booking_reference: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  total_amount: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
  payment_status: string;
  booking_date: string;
  details: Array<{
    service_id: number;
    service_type: string;
    service_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    details: {
      destination?: string;
      duration?: number;
      checkIn?: string;
      checkOut?: string;
      origin?: string;
    };
  }>;
}

const AdminBookingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await adminService.getBookingDetails(id!);
        
        // Validate and transform the data
        if (!response.data || typeof response.data !== 'object') {
          throw new Error('Invalid response format');
        }

        const bookingData = response.data;
        
        // Validate required fields
        if (!bookingData.id || !bookingData.booking_reference || !bookingData.status) {
          throw new Error('Missing required booking data');
        }

        // Ensure details is an array
        const details = Array.isArray(bookingData.details) ? bookingData.details : [];

        // Transform the data to match our interface
        const transformedBooking: BookingDetails = {
          id: Number(bookingData.id),
          booking_reference: bookingData.booking_reference,
          user_name: bookingData.user_name || 'N/A',
          user_email: bookingData.user_email || 'N/A',
          user_phone: bookingData.user_phone || 'N/A',
          total_amount: Number(bookingData.total_amount) || 0,
          status: bookingData.status.toUpperCase() as BookingDetails['status'],
          payment_status: bookingData.payment_status || 'N/A',
          booking_date: bookingData.booking_date || new Date().toISOString(),
          details: details.map(item => ({
            service_id: Number(item.service_id) || 0,
            service_type: item.service_type || 'unknown',
            service_name: item.service_name || 'Unknown Service',
            quantity: Number(item.quantity) || 1,
            unit_price: Number(item.unit_price) || 0,
            total_price: Number(item.total_price) || 0,
            details: {
              destination: item.details?.destination,
              duration: item.details?.duration ? Number(item.details.duration) : undefined,
              checkIn: item.details?.checkIn,
              checkOut: item.details?.checkOut,
              origin: item.details?.origin
            }
          }))
        };

        setBooking(transformedBooking);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast({
          title: "Failed to load booking",
          description: error instanceof Error ? error.message : "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id, toast]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  if (!booking) {
    return (
      <AdminLayout>
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">The booking you are looking for does not exist.</p>
            <Button onClick={() => navigate('/admin/bookings')} variant="outline">
              Back to Bookings
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Booking Details</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/bookings')}
          >
            Back to Bookings
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Booking #{booking.booking_reference}</CardTitle>
              <div className="flex items-center gap-4">
                <Badge className={getStatusBadgeVariant(booking.status)}>
                  {booking.status}
                </Badge>
                <BookingStatusUpdater
                  bookingId={booking.id}
                  initialStatus={booking.status}
                  onStatusChange={(newStatus) => setBooking(prev => prev ? { ...prev, status: newStatus } : null)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{booking.user_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{booking.user_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{booking.user_phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Booking Date</p>
                      <p className="font-medium">{new Date(booking.booking_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Booking Items</h3>
                <div className="space-y-4">
                  {booking.details.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium capitalize">{item.service_name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{item.service_type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.total_price.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} x ${item.unit_price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.details.destination && (
                          <p>Destination: {item.details.destination}</p>
                        )}
                        {item.details.duration && (
                          <p>Duration: {item.details.duration} days</p>
                        )}
                        {item.details.checkIn && item.details.checkOut && (
                          <p>Stay: {item.details.checkIn} to {item.details.checkOut}</p>
                        )}
                        {item.details.origin && item.details.destination && (
                          <p>Route: {item.details.origin} to {item.details.destination}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Payment Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <Badge variant="outline" className="mt-1">
                        {booking.payment_status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium">${booking.total_amount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookingDetailsPage; 