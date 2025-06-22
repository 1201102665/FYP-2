import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Minus, Users, MapPin, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getDestinations } from '@/services/destinationService';
import { getPackages } from '@/services/packageService';

// Sample analytics data - in a real app this would come from your analytics service
const analyticsData = [
  { month: 'Jan', bookings: 45, revenue: 12000, satisfaction: 4.2 },
  { month: 'Feb', bookings: 52, revenue: 15000, satisfaction: 4.3 },
  { month: 'Mar', bookings: 48, revenue: 13500, satisfaction: 4.1 },
  { month: 'Apr', bookings: 61, revenue: 18000, satisfaction: 4.4 },
  { month: 'May', bookings: 55, revenue: 16500, satisfaction: 4.2 },
  { month: 'Jun', bookings: 67, revenue: 21000, satisfaction: 4.5 },
];

const PerformanceInsights: React.FC = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destinationsData, packagesData] = await Promise.all([
          getDestinations(),
          getPackages()
        ]);
        setDestinations(destinationsData);
        setPackages(packagesData);
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setDestinations([]);
        setPackages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics
  const totalBookings = analyticsData.reduce((sum, month) => sum + month.bookings, 0);
  const totalRevenue = analyticsData.reduce((sum, month) => sum + month.revenue, 0);
  const avgSatisfaction = analyticsData.reduce((sum, month) => sum + month.satisfaction, 0) / analyticsData.length;
  const bookingTrend = analyticsData[analyticsData.length - 1].bookings - analyticsData[analyticsData.length - 2].bookings;

  // Calculate top destinations by rating
  const topDestinations = destinations
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  // Calculate popular packages
  const popularPackages = packages
    .sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0))
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {bookingTrend > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : bookingTrend < 0 ? (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              ) : (
                <Minus className="h-3 w-3 text-gray-500 mr-1" />
              )}
              {Math.abs(bookingTrend)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSatisfaction.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              ⭐ Customer rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destinations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{destinations.length}</div>
            <p className="text-xs text-muted-foreground">
              Available worldwide
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Destinations and Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topDestinations.length > 0 ? (
                topDestinations.map((destination, index) => (
                  <div key={destination.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{destination.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{destination.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No destination data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {popularPackages.length > 0 ? (
                popularPackages.map((pkg, index) => (
                  <div key={pkg.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{pkg.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${pkg.price}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No package data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceInsights;