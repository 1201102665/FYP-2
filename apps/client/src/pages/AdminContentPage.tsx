import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plane, 
  Building, 
  Car, 
  Package,
  Plus,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ContentItem {
  id: number;
  name?: string;
  flight_number?: string;
  brand?: string;
  model?: string;
  created_at: string;
}

interface ContentOverview {
  content_counts: {
    flights: number;
    hotels: number;
    cars: number;
    packages: number;
  };
  recent_additions: {
    flights: ContentItem[];
    hotels: ContentItem[];
    cars: ContentItem[];
    packages: ContentItem[];
  };
}

const AdminContentPage: React.FC = () => {
  const [data, setData] = useState<ContentOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadContentData();
  }, []);

  const loadContentData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getContentOverview();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load content data:', error);
      toast({
        title: "Error",
        description: "Failed to load content data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const contentSections = [
    {
      name: 'Manage Flight',
      type: 'flights',
      icon: Plane,
      color: 'bg-blue-500',
      description: 'Manage flight schedules and routes',
      count: data?.content_counts.flights || 0
    },
    {
      name: 'Manage Hotel',
      type: 'hotels', 
      icon: Building,
      color: 'bg-green-500',
      description: 'Manage hotel listings and amenities',
      count: data?.content_counts.hotels || 0
    },
    {
      name: 'Manage Car Rental',
      type: 'cars',
      icon: Car,
      color: 'bg-red-500',
      description: 'Manage car rental fleet and availability',
      count: data?.content_counts.cars || 0
    },
    {
      name: 'Manage Packages',
      type: 'packages',
      icon: Package,
      color: 'bg-purple-500',
      description: 'Manage travel packages and deals',
      count: data?.content_counts.packages || 0
    }
  ];

  if (loading) {
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
            <h2 className="text-3xl font-bold text-gray-900">Manage Content</h2>
            <p className="text-gray-600">Manage your travel services and content</p>
          </div>
          <Button onClick={loadContentData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Content Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contentSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Card key={section.type} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${section.color}`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{section.name}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{section.count}</p>
                      <p className="text-sm text-gray-500">Total Items</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => {
                        // Navigate to management page
                        window.location.href = `/admin/content/${section.type}`;
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Manage {section.type}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Add New",
                          description: `Add new ${section.type.slice(0, -1)} functionality coming soon`,
                        });
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Content Updates</CardTitle>
            <CardDescription>Latest changes to your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {contentSections.map((section) => (
                <div key={section.type} className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700 flex items-center">
                    <section.icon className="w-4 h-4 mr-1" />
                    Recent {section.name.split(' ')[1]}
                  </h4>
                  <div className="space-y-1">
                    {data?.recent_additions[section.type as keyof typeof data.recent_additions]?.slice(0, 3).map((item: ContentItem, index: number) => (
                      <div key={index} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                        <p className="font-medium truncate">
                          {item.name || item.flight_number || item.brand || 'Item'}
                        </p>
                        <p className="text-gray-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    )) || <p className="text-xs text-gray-400">No recent items</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminContentPage; 