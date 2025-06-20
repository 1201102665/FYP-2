import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Plane, 
  Hotel, 
  Car, 
  Package, 
  User, 
  Menu,
  ShoppingCart,
  MessageCircle
} from 'lucide-react';
import Logo from './Logo';
import CartDropdown from './CartDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();

  const navigationItems = [
    { name: "Flights", icon: Plane, path: "/flights" },
    { name: "Hotels", icon: Hotel, path: "/hotels" },
    { name: "Cars", icon: Car, path: "/car-rentals" },
    { name: "Packages", icon: Package, path: "/packages" },
    { name: "AI Assistant", icon: MessageCircle, path: "/ai-assistant" },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Centered Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath(item.path)
                    ? "bg-aerotrav-blue text-white"
                    : "text-gray-700 hover:text-aerotrav-blue hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-aerotrav-blue hover:bg-aerotrav-blue-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Cart */}
                <CartDropdown />

                {/* User Profile */}
                <div className="relative group">
                  <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-aerotrav-blue to-aerotrav-blue-700 flex items-center justify-center text-white text-sm font-medium">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <span className="hidden md:block font-medium text-sm">{user?.name}</span>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="h-4 w-4 mr-2" />
                      Your Profile
                    </Link>
                    <Link to="/profile?tab=bookings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Package className="h-4 w-4 mr-2" />
                      My Bookings
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <h3 className="font-semibold text-lg">Navigation</h3>
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                        isActivePath(item.path)
                          ? "bg-aerotrav-blue text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  
                  {isAuthenticated && (
                    <>
                      <div className="border-t border-gray-200 my-2"></div>
                      <h3 className="font-semibold text-lg">Account</h3>
                      <Link to="/profile" className="flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                      <Link to="/cart" className="flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                        <ShoppingCart className="h-5 w-5" />
                        <span>Cart ({getItemCount()})</span>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;