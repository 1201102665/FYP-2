import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Users, 
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';
import LoadingSpinner from '@/components/LoadingSpinner';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface UsersData {
  users: User[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_records: number;
    per_page: number;
  };
}

const AdminUsersPage: React.FC = () => {
  const [data, setData] = useState<UsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers(currentPage, 20);
      setData(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId: number) => {
    try {
      await adminService.removeUser(userId.toString());
      toast({
        title: "Success",
        description: "User removed successfully.",
      });
      loadUsers(); // Reload the list
    } catch (error) {
      console.error('Failed to remove user:', error);
      toast({
        title: "Error",
        description: "Failed to remove user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { variant: 'default' as const, className: 'bg-purple-100 text-purple-800' },
      user: { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    return <Badge variant={config.variant} className={config.className}>{role}</Badge>;
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
            <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage user accounts and permissions</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={loadUsers} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Users ({data?.pagination.total_records || 0})</span>
            </CardTitle>
            <CardDescription>
              Manage user accounts and their access levels
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
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={`https://i.pravatar.cc/40?u=${user.email}`} />
                              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.phone || 'No phone'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove {user.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRemoveUser(user.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Remove User
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
                      {data.pagination.total_records} users
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

export default AdminUsersPage; 