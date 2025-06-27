import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceNavigation from '@/components/ServiceNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getBooking, Booking } from '@/services/bookingService';
import BookingStatusUpdater from '@/components/BookingStatusUpdater';

const BookingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string; }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getBooking(id);
        console.log('🔍 Booking data from backend:', data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items = (data.details || []).map((item: any) => ({
          id: item.service_id,
          booking_id: data.id,
          item_id: String(item.service_id),
          item_type: item.service_type,
          item_name: item.service_type.charAt(0).toUpperCase() + item.service_type.slice(1),
          quantity: item.quantity,
          price: item.unit_price ?? item.total_price ?? 0,
          details: item.details || {},
        }));
        setBooking({
          ...data,
          items,
          status: data.booking_status || data.status,
          payment_method: data.payment_status || data.payment_method,
          created_at: data.booking_date || data.created_at,
          user_name: data.special_requests?.match(/User: ([^,]+)/)?.[1] || '',
          user_email: data.special_requests?.match(/Email: ([^,]+)/)?.[1] || '',
        });
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

    if (isAuthenticated) {
      fetchBookingDetails();
    } else {
      navigate('/login');
    }
  }, [id, isAuthenticated, navigate, toast]);

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
      <div className="min-h-screen bg-gray-50 flex flex-col" data-id="hrssbz9zc" data-path="src/pages/BookingDetailsPage.tsx">
        <Header data-id="vx6vb8oj4" data-path="src/pages/BookingDetailsPage.tsx" />
        <main className="flex-grow container mx-auto px-4 py-8" data-id="okwlxka7i" data-path="src/pages/BookingDetailsPage.tsx">
          <div className="mb-6" data-id="9fdxpbhtw" data-path="src/pages/BookingDetailsPage.tsx">
            <ServiceNavigation data-id="rr9vwe66f" data-path="src/pages/BookingDetailsPage.tsx" />
          </div>
          <div className="flex items-center justify-center h-64" data-id="8k6vu5jib" data-path="src/pages/BookingDetailsPage.tsx">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aerotrav-blue" data-id="gybhf66b1" data-path="src/pages/BookingDetailsPage.tsx"></div>
          </div>
        </main>
        <Footer data-id="3dhcn02b5" data-path="src/pages/BookingDetailsPage.tsx" />
      </div>);

  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col" data-id="0jtuo41e5" data-path="src/pages/BookingDetailsPage.tsx">
        <Header data-id="7w2vvrmsq" data-path="src/pages/BookingDetailsPage.tsx" />
        <main className="flex-grow container mx-auto px-4 py-8" data-id="1d9h1r1rw" data-path="src/pages/BookingDetailsPage.tsx">
          <div className="mb-6" data-id="9q8812pch" data-path="src/pages/BookingDetailsPage.tsx">
            <ServiceNavigation data-id="fj6mswdqz" data-path="src/pages/BookingDetailsPage.tsx" />
          </div>
          <Card data-id="s5xra1ima" data-path="src/pages/BookingDetailsPage.tsx">
            <CardContent className="py-12 text-center" data-id="36r7vopr5" data-path="src/pages/BookingDetailsPage.tsx">
              <h2 className="text-xl font-bold mb-2" data-id="d9ycc7qpr" data-path="src/pages/BookingDetailsPage.tsx">Booking Not Found</h2>
              <p className="text-gray-600 mb-6" data-id="34fs88cew" data-path="src/pages/BookingDetailsPage.tsx">The booking you are looking for does not exist or you don't have permission to view it.</p>
              <Button onClick={() => navigate('/profile')} className="bg-aerotrav-blue hover:bg-blue-700" data-id="7n6qchulf" data-path="src/pages/BookingDetailsPage.tsx">
                Back to Profile
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer data-id="lw628gf10" data-path="src/pages/BookingDetailsPage.tsx" />
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-id="g00fceydv" data-path="src/pages/BookingDetailsPage.tsx">
      <Header data-id="qlhg1to1r" data-path="src/pages/BookingDetailsPage.tsx" />

      <main className="flex-grow container mx-auto px-4 py-8" data-id="589eywzqh" data-path="src/pages/BookingDetailsPage.tsx">
        <div className="mb-6" data-id="jlp3273q5" data-path="src/pages/BookingDetailsPage.tsx">
          <ServiceNavigation data-id="x9rzw6n94" data-path="src/pages/BookingDetailsPage.tsx" />
        </div>

        <div className="flex justify-between items-center mb-6" data-id="3lj6u9tg7" data-path="src/pages/BookingDetailsPage.tsx">
          <h1 className="text-2xl font-bold" data-id="l8daktjxd" data-path="src/pages/BookingDetailsPage.tsx">Booking Details</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/profile')}
            className="border-aerotrav-blue text-aerotrav-blue hover:bg-aerotrav-blue/10" data-id="ptljnxvq0" data-path="src/pages/BookingDetailsPage.tsx">

            Back to Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-id="44hm3j1ra" data-path="src/pages/BookingDetailsPage.tsx">
          <div className="lg:col-span-2" data-id="2m01cj0z0" data-path="src/pages/BookingDetailsPage.tsx">
            <Card data-id="ht5dh377o" data-path="src/pages/BookingDetailsPage.tsx">
              <CardHeader data-id="ggdr4d9ie" data-path="src/pages/BookingDetailsPage.tsx">
                <div className="flex items-center justify-between" data-id="t8b5qtdmk" data-path="src/pages/BookingDetailsPage.tsx">
                  <CardTitle data-id="5tia5q16y" data-path="src/pages/BookingDetailsPage.tsx">Booking #{booking.booking_reference}</CardTitle>
                  <Badge className={getStatusBadgeVariant(booking.status)} data-id="1nwt5qx2s" data-path="src/pages/BookingDetailsPage.tsx">
                    {booking.status}
                  </Badge>
                  {/* Add the real-time status updater */}
                  <BookingStatusUpdater
                    bookingId={booking.id}
                    initialStatus={booking.status}
                    onStatusChange={(newStatus) => setBooking((prev) => prev ? { ...prev, status: newStatus } : null)} data-id="x1z8zf5ln" data-path="src/pages/BookingDetailsPage.tsx" />

                </div>
              </CardHeader>
              <CardContent data-id="rkxs19clm" data-path="src/pages/BookingDetailsPage.tsx">
                <div className="space-y-6" data-id="g2zadurpq" data-path="src/pages/BookingDetailsPage.tsx">
                  <div data-id="3k0c92if9" data-path="src/pages/BookingDetailsPage.tsx">
                    <h3 className="font-medium mb-2" data-id="ul2f783y0" data-path="src/pages/BookingDetailsPage.tsx">Booking Information</h3>
                    <div className="bg-gray-50 p-4 rounded-md" data-id="hqwonp57z" data-path="src/pages/BookingDetailsPage.tsx">
                      <div className="grid grid-cols-2 gap-4" data-id="plc4cws07" data-path="src/pages/BookingDetailsPage.tsx">
                        <div data-id="tj3vlfdx1" data-path="src/pages/BookingDetailsPage.tsx">
                          <p className="text-sm text-gray-600" data-id="csuo383q3" data-path="src/pages/BookingDetailsPage.tsx">Booking Date</p>
                          <p className="font-medium" data-id="it3yrgvx9" data-path="src/pages/BookingDetailsPage.tsx">{new Date(booking.created_at).toLocaleDateString()}</p>
                        </div>
                        <div data-id="zr2frov09" data-path="src/pages/BookingDetailsPage.tsx">
                          <p className="text-sm text-gray-600" data-id="cknrajmjd" data-path="src/pages/BookingDetailsPage.tsx">Payment Method</p>
                          <p className="font-medium capitalize" data-id="2nc33hdgi" data-path="src/pages/BookingDetailsPage.tsx">{booking.payment_method}</p>
                        </div>
                        <div data-id="v4224xjsv" data-path="src/pages/BookingDetailsPage.tsx">
                          <p className="text-sm text-gray-600" data-id="2x9e8fh16" data-path="src/pages/BookingDetailsPage.tsx">Customer</p>
                          <p className="font-medium" data-id="qyytdrtx3" data-path="src/pages/BookingDetailsPage.tsx">{booking.user_name}</p>
                        </div>
                        <div data-id="fpvjplqi2" data-path="src/pages/BookingDetailsPage.tsx">
                          <p className="text-sm text-gray-600" data-id="9x27fzr2l" data-path="src/pages/BookingDetailsPage.tsx">Email</p>
                          <p className="font-medium" data-id="f97x9j2uy" data-path="src/pages/BookingDetailsPage.tsx">{booking.user_email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator data-id="lsq26x6qy" data-path="src/pages/BookingDetailsPage.tsx" />

                  <div data-id="3rqtt3lh9" data-path="src/pages/BookingDetailsPage.tsx">
                    <h3 className="font-medium mb-2" data-id="xb0qbs2ja" data-path="src/pages/BookingDetailsPage.tsx">Booked Items</h3>
                    <div className="space-y-4" data-id="9pphpurqr" data-path="src/pages/BookingDetailsPage.tsx">
                      {booking.items.map((item: import('@/services/bookingService').BookingItem) =>
                        <div key={item.id} className="border rounded-md p-4" data-id="elu871qjl" data-path="src/pages/BookingDetailsPage.tsx">
                          <div className="flex justify-between mb-2" data-id="aftmmslng" data-path="src/pages/BookingDetailsPage.tsx">
                            <h4 className="font-medium" data-id="qsgl3et6x" data-path="src/pages/BookingDetailsPage.tsx">
                              {item.item_name}
                              {item.quantity > 1 && ` (x${item.quantity})`}
                            </h4>
                            <span className="font-bold" data-id="83y1azict" data-path="src/pages/BookingDetailsPage.tsx">${(item.price || 0).toFixed(2)}</span>
                          </div>

                          <div className="text-sm text-gray-600" data-id="jzsici6n1" data-path="src/pages/BookingDetailsPage.tsx">
                            <p data-id="tkhf2d87p" data-path="src/pages/BookingDetailsPage.tsx">Type: <span className="capitalize" data-id="lf1qezfhh" data-path="src/pages/BookingDetailsPage.tsx">{item.item_type}</span></p>

                            {item.details.destination &&
                              <p data-id="1tvo5jbk9" data-path="src/pages/BookingDetailsPage.tsx">Destination: {item.details.destination}</p>
                            }

                            {item.details.duration &&
                              <p data-id="ivlbzthfp" data-path="src/pages/BookingDetailsPage.tsx">Duration: {item.details.duration} days</p>
                            }

                            {item.details.checkIn && item.details.checkOut &&
                              <p data-id="bopapzo8s" data-path="src/pages/BookingDetailsPage.tsx">Stay: {item.details.checkIn} to {item.details.checkOut}</p>
                            }

                            {item.details.origin && item.details.destination &&
                              <p data-id="5bwrb3ndo" data-path="src/pages/BookingDetailsPage.tsx">Route: {item.details.origin} to {item.details.destination}</p>
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1" data-id="9beeayz4e" data-path="src/pages/BookingDetailsPage.tsx">
            <Card data-id="kyvltdpu3" data-path="src/pages/BookingDetailsPage.tsx">
              <CardHeader data-id="8czcjdm5r" data-path="src/pages/BookingDetailsPage.tsx">
                <CardTitle data-id="qfk5jefic" data-path="src/pages/BookingDetailsPage.tsx">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent data-id="it5nmgk5a" data-path="src/pages/BookingDetailsPage.tsx">
                <div className="space-y-4" data-id="35t7sjuk1" data-path="src/pages/BookingDetailsPage.tsx">
                  <div className="bg-gray-50 p-4 rounded-md" data-id="7wt5ukq46" data-path="src/pages/BookingDetailsPage.tsx">
                    <div className="flex justify-between mb-2" data-id="mil8rum0w" data-path="src/pages/BookingDetailsPage.tsx">
                      <span className="text-gray-600" data-id="o8loy5e53" data-path="src/pages/BookingDetailsPage.tsx">Subtotal</span>
                      <span data-id="6mwc8cvic" data-path="src/pages/BookingDetailsPage.tsx">${(booking.total_amount / 1.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2" data-id="tm5wi8099" data-path="src/pages/BookingDetailsPage.tsx">
                      <span className="text-gray-600" data-id="kb7lbfgow" data-path="src/pages/BookingDetailsPage.tsx">Taxes & Fees</span>
                      <span data-id="01zukhv7l" data-path="src/pages/BookingDetailsPage.tsx">${(booking.total_amount - booking.total_amount / 1.1).toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" data-id="o1yk1lf2r" data-path="src/pages/BookingDetailsPage.tsx" />
                    <div className="flex justify-between font-bold" data-id="3b0qq1jmo" data-path="src/pages/BookingDetailsPage.tsx">
                      <span data-id="9vhr1350v" data-path="src/pages/BookingDetailsPage.tsx">Total</span>
                      <span data-id="qpf6bl1wt" data-path="src/pages/BookingDetailsPage.tsx">${booking.total_amount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div data-id="slrxovdjz" data-path="src/pages/BookingDetailsPage.tsx">
                    <h3 className="font-medium mb-2" data-id="8jgdrzvtb" data-path="src/pages/BookingDetailsPage.tsx">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-4" data-id="rlh86odof" data-path="src/pages/BookingDetailsPage.tsx">
                      If you need to modify or cancel your booking, please contact our customer support team.
                    </p>
                    <Button className="w-full bg-aerotrav-blue hover:bg-blue-700" data-id="z83im7aaj" data-path="src/pages/BookingDetailsPage.tsx">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer data-id="jn1rgejoh" data-path="src/pages/BookingDetailsPage.tsx" />
    </div>);

};

export default BookingDetailsPage;