import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  Clock,
  RefreshCw,
  Search,
  Star,
  AlertCircle,
  Plane,
  Building2 as Building,
  Car
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';
import LoadingSpinner from '@/components/LoadingSpinner';

interface DashboardData {
  user_statistics: {
    total: number;
    active: number;
    pending: number;
    new_30d: number;
  };
  booking_statistics: {
    total: number;
    confirmed: number;
    pending: number;
    new_30d: number;
    total_revenue: number;
  };
  search_statistics: {
    total: number;
    recent_7d: number;
  };
  recent_bookings: Array<{
    id: number;
    booking_reference: string;
    service_type: string;
    total_amount: number;
    booking_status: string;
    payment_status: string;
    created_at: string;
    user_name: string;
    user_email: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const adminName = localStorage.getItem('adminName') || 'Admin';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string, bgColor: string }> = {
      confirmed: { color: 'text-green-700', bgColor: 'bg-green-100' },
      pending: { color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
      cancelled: { color: 'text-red-700', bgColor: 'bg-red-100' },
      paid: { color: 'text-green-700', bgColor: 'bg-green-100' },
      unpaid: { color: 'text-red-700', bgColor: 'bg-red-100' }
    };

    const config = statusConfig[status.toLowerCase()] || { color: 'text-gray-700', bgColor: 'bg-gray-100' };
    return (
      <Badge className={`${config.color} ${config.bgColor}`}>
        {status}
      </Badge>
    );
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

  if (!data) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load dashboard data</p>
          <Button onClick={loadDashboardData} className="mt-4">
            Try Again
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h2 className="text-2xl font-bold">Welcome back, {adminName}</h2>
                <p className="text-blue-100 mt-1">
                  Here's what's happening with your platform today
                </p>
              </div>
              <Button 
                variant="secondary" 
                className="bg-white/10 text-white hover:bg-white/20"
                onClick={loadDashboardData}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="secondary">Last 30 days</Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold">{data.user_statistics.total}</h3>
                <p className="text-gray-600 text-sm">Total Users</p>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">
                  {data.user_statistics.new_30d} new
                </span>
                <span className="text-gray-600 ml-1">this month</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Bookings */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="secondary">Last 30 days</Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold">{data.booking_statistics.total}</h3>
                <p className="text-gray-600 text-sm">Total Bookings</p>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">
                  {data.booking_statistics.new_30d} new
                </span>
                <span className="text-gray-600 ml-1">this month</span>
              </div>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <Badge variant="secondary">Last 30 days</Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold">
                  {formatCurrency(data.booking_statistics.total_revenue)}
                </h3>
                <p className="text-gray-600 text-sm">Total Revenue</p>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">12.5%</span>
                <span className="text-gray-600 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Search Activity */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-orange-600" />
                </div>
                <Badge variant="secondary">Last 7 days</Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold">{data.search_statistics.recent_7d}</h3>
                <p className="text-gray-600 text-sm">Search Queries</p>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <Activity className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-gray-600">Active searches</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest travel bookings across your platform</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/bookings">View All</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recent_bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {booking.service_type === 'flight' && <Plane className="w-5 h-5 text-blue-600" />}
                      {booking.service_type === 'hotel' && <Building className="w-5 h-5 text-green-600" />}
                      {booking.service_type === 'car' && <Car className="w-5 h-5 text-orange-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.booking_reference}</p>
                      <p className="text-sm text-gray-500">{booking.user_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(booking.total_amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {getStatusBadge(booking.booking_status)}
                      {getStatusBadge(booking.payment_status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-gray-900">API Server</p>
                <p className="text-sm text-gray-500">Operational</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-gray-900">Database</p>
                <p className="text-sm text-gray-500">Connected</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-gray-900">Cache</p>
                <p className="text-sm text-gray-500">75% Utilized</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-gray-900">Storage</p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 