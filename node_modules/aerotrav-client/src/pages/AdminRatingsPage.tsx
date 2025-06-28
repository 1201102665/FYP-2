import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Star, 
  Search, 
  Check, 
  X,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Review {
  id: number;
  user_name: string;
  user_email: string;
  service_type: string;
  service_id: number;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ReviewsData {
  reviews: Review[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_records: number;
    per_page: number;
  };
}

const AdminRatingsPage: React.FC = () => {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, [currentPage, search, statusFilter]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await adminService.getReviews(currentPage, 20, statusFilter, search);
      setData(response.data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReviewStatus = async (reviewId: number, newStatus: string) => {
    try {
      await adminService.updateReviewStatus(reviewId.toString(), newStatus);
      toast({
        title: "Success",
        description: `Review ${newStatus} successfully.`,
      });
      loadReviews();
    } catch (error) {
      console.error('Failed to update review status:', error);
      toast({
        title: "Error",
        description: "Failed to update review status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await adminService.deleteReview(reviewId.toString());
      toast({
        title: "Success",
        description: "Review deleted successfully.",
      });
      loadReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      pending: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      rejected: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
        return '⭐';
    }
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
            <h2 className="text-3xl font-bold text-gray-900">Ratings Management</h2>
            <p className="text-gray-600">Review and moderate customer ratings</p>
          </div>
          <Button onClick={loadReviews} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{data?.pagination.total_records || 0}</p>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ThumbsUp className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {data?.reviews.filter(r => r.status === 'approved').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {data?.reviews.filter(r => r.status === 'pending').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ThumbsDown className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {data?.reviews.filter(r => r.status === 'rejected').length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Rejected</p>
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
                    placeholder="Search reviews by user name or service..."
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
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Reviews ({data?.pagination.total_records || 0})</span>
            </CardTitle>
            <CardDescription>
              Review customer feedback and ratings
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
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.reviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${review.user_email}`} />
                              <AvatarFallback>{review.user_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.user_name}</p>
                              <p className="text-sm text-gray-500">{review.user_email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getServiceIcon(review.service_type)}</span>
                            <div>
                              <p className="capitalize">{review.service_type}</p>
                              <p className="text-sm text-gray-500">ID: {review.service_id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm font-medium">({review.rating}/5)</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm truncate" title={review.comment}>
                            {review.comment}
                          </p>
                        </TableCell>
                        <TableCell>{getStatusBadge(review.status)}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {review.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateReviewStatus(review.id, 'approved')}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateReviewStatus(review.id, 'rejected')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                  <X className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Review</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this review? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete Review
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
                      {data.pagination.total_records} reviews
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

export default AdminRatingsPage; 