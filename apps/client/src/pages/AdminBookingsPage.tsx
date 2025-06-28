import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  BookOpen, 
  Search, 
  Check, 
  X, 
  Eye,
  RefreshCw,
  Calendar,
  DollarSign,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  id: number;
  customer_name: string;
  service_type: string;
  booking_status: string;
  total_amount: number;
  booking_date: string;
  created_at: string;
}

interface BookingsData {
  bookings: Booking[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_records: number;
    per_page: number;
  };
}

const API_BASE_URL = 'http://localhost:3001';

const AdminBookingsPage: React.FC = () => {
  const [data, setData] = useState<BookingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      if (data.success) {
        setData(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: number, newStatus: 'confirmed' | 'rejected') => {
    try {
      const token = getToken();
      if (!token) {
        toast('Please login to continue');
        navigate('/admin/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast('Session expired - please login again');
          navigate('/admin/login');
          return;
        }
        throw new Error(data.message || 'Failed to update booking status');
      }

      // Update the local state
      setData(prevData => ({
        ...prevData!,
        bookings: prevData!.bookings.map(booking => 
          booking.id === bookingId ? { ...booking, booking_status: newStatus } : booking
        )
      }));

      toast(data.message || `Booking has been ${newStatus}`);
      fetchBookings(); // Refresh the list
    } catch (error) {
      toast('Failed to update booking status');
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      pending: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      cancelled: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      rejected: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  const getPaymentBadge = (status: string) => {
    const statusConfig = {
      paid: { variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      unpaid: { variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' },
      refunded: { variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800' },
      processing: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unpaid;
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case 'flight':
        return '✈️';
      case 'hotel':
        return '🏨';
      case 'car':
        return '🚗';
      case 'package':
        return '📦';
      default:
        return '🎫';
    }
  };

  const getFormattedAmount = (amount: number | string | null | undefined): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    return isNaN(numAmount) ? '0.00' : numAmount.toFixed(2);
  };

  if (loading && !data) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Booking Management</h2>
            <p className="text-gray-600">View and manage customer bookings</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={fetchBookings} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{data?.pagination.total_records || 0}</p>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Check className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {data?.bookings.filter(b => b.booking_status === 'confirmed').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {data?.bookings.filter(b => b.booking_status === 'pending').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    ${data?.bookings
                      .filter(b => b.booking_status === 'paid')
                      .reduce((sum, b) => sum + b.total_amount, 0)
                      .toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by booking reference, user name, or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="w-full md:w-48">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                >
                  <option value="">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="processing">Processing</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Bookings ({data?.pagination.total_records || 0})</span>
            </CardTitle>
            <CardDescription>
              Review and manage customer bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.customer_name}</p>
                            <p className="text-sm text-gray-500">ID: {booking.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.customer_name}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getServiceIcon(booking.service_type)}</span>
                            <span className="capitalize">{booking.service_type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">${getFormattedAmount(booking.total_amount)}</span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(booking.booking_status)}
                        </TableCell>
                        <TableCell>
                          {getPaymentBadge(booking.booking_status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{new Date(booking.booking_date).toLocaleDateString()}</p>
                            <p className="text-gray-500">
                              Created: {new Date(booking.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {booking.booking_status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                      <X className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Reject Booking</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to reject booking {booking.customer_name}? 
                                        This action will notify the customer.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Reject Booking
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                navigate(`/admin/bookings/${booking.id}`);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {data && data.pagination.total_pages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-600">
                      Showing {((data.pagination.current_page - 1) * data.pagination.per_page) + 1} to{' '}
                      {Math.min(data.pagination.current_page * data.pagination.per_page, data.pagination.total_records)} of{' '}
                      {data.pagination.total_records} bookings
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={data.pagination.current_page <= 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, data.pagination.total_pages))}
                        disabled={data.pagination.current_page >= data.pagination.total_pages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookingsPage; 