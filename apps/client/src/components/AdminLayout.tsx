import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  Star, 
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  Search
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    const redirectPath = logout();
    navigate(redirectPath);
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'Bookings',
      href: '/admin/bookings',
      icon: BookOpen,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'Content',
      href: '/admin/content',
      icon: FileText,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      name: 'Ratings',
      href: '/admin/ratings',
      icon: Star,
      color: 'bg-yellow-100 text-yellow-800'
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">AT</span>
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">AeroTrav</span>
                <span className="text-sm text-gray-500 block">Admin Portal</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Admin Profile */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">A</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
                <Badge variant="secondary" className="mt-1 text-[10px]">
                  Administrator
                </Badge>
              </div>
            </div>
          </div>

          {/* Global Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150",
                      active 
                        ? "bg-blue-50 text-blue-700 shadow-sm" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150",
                      active ? item.color : "bg-gray-100 text-gray-600"
                    )}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span>{item.name}</span>
                    {item.name === 'Bookings' && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        New
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {navigationItems.find(item => isActive(item.href))?.name || 'Admin Dashboard'}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              <div className="hidden md:block">
                <div className="text-sm">
                  <span className="text-gray-500">Welcome back,</span>{' '}
                  <span className="font-medium text-gray-900">{user?.name}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Last login: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 