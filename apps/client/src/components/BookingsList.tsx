import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBookings, Booking } from '@/services/bookingService';

const BookingsList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getUserBookings(user.id);
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Failed to load bookings",
          description: error instanceof Error ? error.message : "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, toast]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
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
      <Card data-id="vqb32iwcd" data-path="src/components/BookingsList.tsx">
        <CardHeader data-id="qj7fda6vr" data-path="src/components/BookingsList.tsx">
          <CardTitle data-id="bqvdxnzpu" data-path="src/components/BookingsList.tsx">My Bookings</CardTitle>
          <CardDescription data-id="6n8puv6th" data-path="src/components/BookingsList.tsx">Loading your booking history...</CardDescription>
        </CardHeader>
        <CardContent data-id="b0m5zfacy" data-path="src/components/BookingsList.tsx">
          <div className="flex items-center justify-center h-40" data-id="q9mwu2noc" data-path="src/components/BookingsList.tsx">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aerotrav-blue" data-id="pe5ghotfh" data-path="src/components/BookingsList.tsx"></div>
          </div>
        </CardContent>
      </Card>);

  }

  return (
    <Card data-id="l9hgg8d6w" data-path="src/components/BookingsList.tsx">
      <CardHeader data-id="xdpbq4np8" data-path="src/components/BookingsList.tsx">
        <CardTitle data-id="11x04dre7" data-path="src/components/BookingsList.tsx">My Bookings</CardTitle>
        <CardDescription data-id="kvdk7govs" data-path="src/components/BookingsList.tsx">
          View and manage your travel bookings
        </CardDescription>
      </CardHeader>
      <CardContent data-id="47qawf888" data-path="src/components/BookingsList.tsx">
        <div className="space-y-4" data-id="r5t9cq4zs" data-path="src/components/BookingsList.tsx">
          {bookings.length > 0 ?
          bookings.map((booking) =>
          <div key={booking.id} className="p-4 border rounded-lg" data-id="yfa8q8ckc" data-path="src/components/BookingsList.tsx">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" data-id="hdjgtya5p" data-path="src/components/BookingsList.tsx">
                  <div data-id="pizl5oaoy" data-path="src/components/BookingsList.tsx">
                    <div className="flex items-center gap-2" data-id="76z4jss7g" data-path="src/components/BookingsList.tsx">
                      <h4 className="font-medium" data-id="mron6q7co" data-path="src/components/BookingsList.tsx">{booking.booking_reference}</h4>
                      <Badge className={getStatusBadgeVariant(booking.status)} data-id="sg39p59cq" data-path="src/components/BookingsList.tsx">
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500" data-id="9o7ap8gza" data-path="src/components/BookingsList.tsx">
                      {new Date(booking.created_at).toLocaleDateString()} • {booking.item_count || booking.items?.length || 0} item(s)
                    </p>
                    <p className="font-medium mt-1" data-id="oibbj2h8c" data-path="src/components/BookingsList.tsx">${booking.total_amount.toFixed(2)}</p>
                  </div>
                  <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/bookings/${booking.booking_reference}`)} data-id="aln8l6t96" data-path="src/components/BookingsList.tsx">
                    View Details
                  </Button>
                </div>
                
                {booking.items &&
            <>
                    <Separator className="my-3" data-id="ree5gx6xt" data-path="src/components/BookingsList.tsx" />
                    <div className="text-sm text-gray-600" data-id="nz1zdolbm" data-path="src/components/BookingsList.tsx">
                      <p className="font-medium mb-1" data-id="squ0dh8nu" data-path="src/components/BookingsList.tsx">Items:</p>
                      <ul className="list-disc list-inside" data-id="hyifufja8" data-path="src/components/BookingsList.tsx">
                        {booking.items.map((item) =>
                  <li key={item.id} data-id="bfwl2j8tt" data-path="src/components/BookingsList.tsx">
                            {item.item_name} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                          </li>
                  )}
                      </ul>
                    </div>
                  </>
            }
              </div>
          ) :

          <div className="text-center py-12" data-id="r7p0fneqb" data-path="src/components/BookingsList.tsx">
              <p className="text-gray-500" data-id="zm4fefz20" data-path="src/components/BookingsList.tsx">You haven't made any bookings yet.</p>
              <Button className="mt-4 bg-aerotrav-blue hover:bg-aerotrav-blue-700" onClick={() => navigate('/')} data-id="2ti2stecb" data-path="src/components/BookingsList.tsx">
                Explore Destinations
              </Button>
            </div>
          }
        </div>
      </CardContent>
    </Card>);

};

export default BookingsList;