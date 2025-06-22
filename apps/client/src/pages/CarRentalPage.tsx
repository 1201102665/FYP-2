import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import DestinationCard from "@/components/DestinationCard";
import CarCategoryCard from "@/components/CarCategoryCard";
import CarFilters from "@/components/CarFilters";
import CartModal from "@/components/CartModal";
import CarReservationSection from "@/components/CarReservationSection";
import CarReviews from "@/components/CarReviews";
import LoadingSpinner from "@/components/LoadingSpinner";
import Breadcrumb from "@/components/Breadcrumb";
import {
  CarSearchParams } from
"@/services/carService";
import { getCars, searchCars, getCarReservations, getCarReviews } from "@/services/carService";
import { useUserActivityContext } from "@/contexts/UserActivityContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Car,
  Star,
  Fuel,
  Settings,
  Shield,
  Search,
  Filter,
  SortAsc,
  RefreshCw,
  Heart,
  Eye,
  Clock,
  UserCheck,
  CheckCircle,
  Edit
} from "lucide-react";

const CarRentalPage = () => {
  const { trackSearch, trackBooking } = useUserActivityContext();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('price');

  // Get search parameters from location state or set defaults
  const locationState = location.state;
  const [searchParams, setSearchParams] = useState({
    pickupLocation: locationState?.pickupLocation || "Kuala Lumpur, Malaysia",
    dropoffLocation: locationState?.pickupLocation || "Kuala Lumpur, Malaysia",
    pickupDate: locationState?.pickupDate || "2024-02-15",
    pickupTime: "10:00",
    dropoffDate: locationState?.dropoffDate || "2024-02-20",
    dropoffTime: "10:00"
  });

  const [filters, setFilters] = useState({
    priceRange: [50, 500],
    carTypes: [] as string[],
    fuelType: 'all',
    transmission: 'all',
    features: [] as string[],
    supplier: 'all'
  });

  const [showCartModal, setShowCartModal] = useState(false);
  const [cars, setCars] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Enhanced car data with more realistic information
  const enhancedCars = [
    {
      id: 1,
      name: "Toyota Vios",
      category: "Economy",
      image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400",
      price: 85,
      originalPrice: 100,
      location: "Kuala Lumpur",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      doors: 4,
      luggage: 2,
      rating: 4.2,
      reviewCount: 156,
      supplier: "Budget",
      features: ["AC", "GPS", "Bluetooth"],
      fuelEfficiency: "15 km/L",
      availability: "Available",
      featured: false,
      deals: ["Free Cancellation", "Unlimited Mileage"]
    },
    {
      id: 2,
      name: "Honda CR-V",
      category: "SUV",
      image: "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=400",
      price: 180,
      originalPrice: 220,
      location: "Kuala Lumpur",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 7,
      doors: 5,
      luggage: 4,
      rating: 4.6,
      reviewCount: 89,
      supplier: "Hertz",
      features: ["AC", "GPS", "Bluetooth", "Parking Sensors", "Backup Camera"],
      fuelEfficiency: "12 km/L",
      availability: "Available",
      featured: true,
      deals: ["GPS Included", "Child Seat Available"]
    },
    {
      id: 3,
      name: "BMW 3 Series",
      category: "Luxury",
      image: "https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?w=400",
      price: 320,
      originalPrice: 380,
      location: "Kuala Lumpur",
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      doors: 4,
      luggage: 3,
      rating: 4.8,
      reviewCount: 67,
      supplier: "Avis",
      features: ["AC", "GPS", "Bluetooth", "Leather Seats", "Premium Sound", "Sunroof"],
      fuelEfficiency: "10 km/L",
      availability: "Available",
      featured: true,
      deals: ["Premium Insurance", "VIP Service"]
    },
    {
      id: 4,
      name: "Perodua Myvi",
      category: "Compact",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
      price: 65,
      originalPrice: 75,
      location: "Kuala Lumpur",
      transmission: "Manual",
      fuelType: "Petrol",
      seats: 5,
      doors: 5,
      luggage: 2,
      rating: 4.1,
      reviewCount: 203,
      supplier: "Mayflower",
      features: ["AC", "Radio"],
      fuelEfficiency: "18 km/L",
      availability: "Available",
      featured: false,
      deals: ["Budget Friendly", "City Perfect"]
    },
    {
      id: 5,
      name: "Mercedes-Benz E-Class",
      category: "Luxury",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      price: 450,
      originalPrice: 520,
      location: "Kuala Lumpur",
      transmission: "Automatic",
      fuelType: "Hybrid",
      seats: 5,
      doors: 4,
      luggage: 3,
      rating: 4.9,
      reviewCount: 34,
      supplier: "Enterprise",
      features: ["AC", "GPS", "Bluetooth", "Leather Seats", "Premium Sound", "Adaptive Cruise"],
      fuelEfficiency: "8.5 km/L",
      availability: "Available",
      featured: true,
      deals: ["Chauffeur Available", "Premium Package"]
    },
    {
      id: 6,
      name: "Ford Ranger",
      category: "Pickup",
      image: "https://images.unsplash.com/photo-1544965503-7ad534bf1a3e?w=400",
      price: 220,
      originalPrice: 260,
      location: "Kuala Lumpur",
      transmission: "Automatic",
      fuelType: "Diesel",
      seats: 5,
      doors: 4,
      luggage: 5,
      rating: 4.4,
      reviewCount: 78,
      supplier: "Thrifty",
      features: ["AC", "GPS", "Bluetooth", "4WD", "Tow Hitch"],
      fuelEfficiency: "11 km/L",
      availability: "Available",
      featured: false,
      deals: ["Adventure Ready", "Heavy Duty"]
    }
  ];

  // Apply filters and sorting
  const filteredAndSortedCars = React.useMemo(() => {
    let filtered = enhancedCars.filter((car) => {
      if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) return false;
      if (filters.carTypes.length > 0 && !filters.carTypes.includes(car.category)) return false;
      if (filters.fuelType !== 'all' && car.fuelType !== filters.fuelType) return false;
      if (filters.transmission !== 'all' && car.transmission !== filters.transmission) return false;
      if (filters.supplier !== 'all' && car.supplier !== filters.supplier) return false;
      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every(feature => 
          car.features.includes(feature)
        );
        if (!hasAllFeatures) return false;
      }
      return true;
    });

    // Sort cars
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters, sortBy]);

  // Load cars on component mount
  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        setCars(enhancedCars);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Load user reservations if authenticated
  useEffect(() => {
    if (isAuthenticated) {
              const fetchReservations = async () => {
          try {
            const reservations = await getCarReservations();
            setReservations(reservations);
          } catch (error) {
            console.error('Error fetching reservations:', error);
            setReservations([]);
          }
      };

      fetchReservations();
    }
  }, [isAuthenticated]);

  // Load car reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getCarReviews();
        setReviews(reviewsData);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        setReviews([]); // Set empty array as fallback
      }
    };

    fetchReviews();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Track the search in user activity
    trackSearch(searchParams.pickupLocation, searchParams.pickupDate, 'car');

    try {
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error searching for cars:', error);
      setIsLoading(false);
    }
  };

  const handleBookCar = (carId: number) => {
    const selectedCar = enhancedCars.find((car) => car.id === carId);

    if (selectedCar) {
      trackBooking(carId.toString(), 'car', selectedCar.location);
    }

    if (isAuthenticated) {
      setShowCartModal(true);
    } else {
      navigate('/login', { state: { from: `/car-payment/${carId}` } });
    }
  };

  const handleViewCarDetails = (carId: number) => {
    const selectedCar = enhancedCars.find((car) => car.id === carId);
    if (selectedCar) {
      navigate(`/car-details/${carId}`, {
        state: selectedCar
      });
    }
  };

  const handleCarTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      carTypes: prev.carTypes.includes(type)
        ? prev.carTypes.filter(t => t !== type)
        : [...prev.carTypes, type]
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleRefreshSearch = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const breadcrumbItems = [
    { label: 'Car Rental', href: '/cars' },
    { label: 'Search Results', active: true }
  ];

  const carTypeOptions = ['Economy', 'Compact', 'SUV', 'Luxury', 'Pickup'];
  const featureOptions = ['AC', 'GPS', 'Bluetooth', 'Leather Seats', 'Backup Camera', 'Parking Sensors'];
  const supplierOptions = ['all', 'Budget', 'Hertz', 'Avis', 'Enterprise', 'Thrifty', 'Mayflower'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <LoadingSpinner size="lg" text="Finding the perfect car for your journey..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Enhanced Interactive Car Rental Search Bar */}
      <div className="bg-gradient-to-r from-aerotrav-blue via-aerotrav-blue-700 to-aerotrav-blue-800 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            {/* Car Type Selector */}
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 rounded-full p-1 flex flex-wrap gap-1">
                {['Economy', 'Compact', 'SUV', 'Luxury', 'Van'].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      type === 'Economy' 
                        ? 'bg-aerotrav-yellow text-aerotrav-blue shadow-lg' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4">
              {/* Pick Up Point */}
              <div className="flex-1 min-w-0 group">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-3 h-3 bg-aerotrav-yellow rounded-full animate-pulse"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Pick Up Point"
                    value={searchParams.pickupLocation}
                    onChange={(e) => setSearchParams(prev => ({...prev, pickupLocation: e.target.value}))}
                    className="w-full pl-12 pr-4 py-5 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/20 text-lg"
                  />
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Pick Up Point</div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <MapPin className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Drop Off Point */}
              <div className="flex-1 min-w-0 group">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-3 h-3 bg-aerotrav-yellow rounded-full animate-pulse"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Drop Off Point"
                    value={searchParams.dropoffLocation}
                    onChange={(e) => setSearchParams(prev => ({...prev, dropoffLocation: e.target.value}))}
                    className="w-full pl-12 pr-4 py-5 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/20 text-lg"
                  />
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Drop Off Point</div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <MapPin className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Enhanced Date */}
              <div className="flex-1 min-w-0 group">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Calendar className="h-5 w-5 text-aerotrav-yellow" />
                  </div>
                  <input
                    type="text"
                    placeholder="Date"
                    value={`${new Date(searchParams.pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${new Date(searchParams.dropoffDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`}
                    className="w-full pl-12 pr-4 py-5 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/20 text-lg"
                    readOnly
                  />
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Date</div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Edit className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Enhanced Pick Up Time */}
              <div className="flex-1 min-w-0 group">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Clock className="h-5 w-5 text-aerotrav-yellow" />
                  </div>
                  <input
                    type="text"
                    placeholder="Pick Up Time"
                    value={`${searchParams.pickupTime} - ${searchParams.dropoffTime}`}
                    className="w-full pl-12 pr-4 py-5 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/20 text-lg"
                    readOnly
                  />
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Pick Up Time</div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Edit className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Enhanced Search Button */}
              <div className="flex-shrink-0">
                <Button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-aerotrav-yellow to-yellow-400 hover:from-aerotrav-yellow-500 hover:to-yellow-500 text-aerotrav-blue font-bold px-10 py-5 rounded-2xl h-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-aerotrav-blue rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg">Search</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="flex flex-col lg:flex-row items-center justify-between mt-6 pt-6 border-t border-white/20 gap-4">
              <div className="flex items-center gap-6 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Found {filteredAndSortedCars.length} cars available</span>
                </div>
                <span className="text-white/60">•</span>
                <span className="font-medium">{searchParams.pickupLocation}</span>
                <span className="text-white/60">•</span>
                <span className="text-aerotrav-yellow font-medium">Free cancellation up to 24h</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={handleRefreshSearch} size="sm" className="text-white hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-300">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-300">
                  <Filter className="h-4 w-4 mr-1" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-white/70 mr-2">Popular features:</span>
              {['GPS Navigation', 'Automatic', 'Air Conditioning', 'Bluetooth', 'Backup Camera'].map((feature) => (
                <button
                  key={feature}
                  className="px-3 py-1 text-sm bg-white/10 hover:bg-aerotrav-yellow hover:text-aerotrav-blue rounded-full transition-all duration-300 text-white border border-white/20 hover:border-aerotrav-yellow"
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Summary */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Cars in {searchParams.pickupLocation}
              </h2>
              <p className="text-sm text-gray-600">
                {new Date(searchParams.pickupDate).toLocaleDateString()} - {new Date(searchParams.dropoffDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefreshSearch} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setFilters({
                      priceRange: [50, 500],
                      carTypes: [],
                      fuelType: 'all',
                      transmission: 'all',
                      features: [],
                      supplier: 'all'
                    })}
                  >
                    Reset
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Price Range: RM{filters.priceRange[0]} - RM{filters.priceRange[1]}
                    </label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                      max={500}
                      min={50}
                      step={25}
                      className="w-full"
                    />
                  </div>

                  {/* Car Types */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Car Type</label>
                    <div className="space-y-2">
                      {carTypeOptions.map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.carTypes.includes(type)}
                            onChange={() => handleCarTypeToggle(type)}
                            className="mr-2 rounded"
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Transmission */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Transmission</label>
                    <select 
                      value={filters.transmission} 
                      onChange={(e) => setFilters(prev => ({ ...prev, transmission: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aerotrav-blue focus:border-transparent"
                    >
                      <option value="all">All Transmissions</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Fuel Type</label>
                    <select 
                      value={filters.fuelType} 
                      onChange={(e) => setFilters(prev => ({ ...prev, fuelType: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aerotrav-blue focus:border-transparent"
                    >
                      <option value="all">All Fuel Types</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>

                  {/* Supplier */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Supplier</label>
                    <select 
                      value={filters.supplier} 
                      onChange={(e) => setFilters(prev => ({ ...prev, supplier: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aerotrav-blue focus:border-transparent"
                    >
                      {supplierOptions.map(supplier => (
                        <option key={supplier} value={supplier}>
                          {supplier === 'all' ? 'All Suppliers' : supplier}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Features</label>
                    <div className="space-y-2">
                      {featureOptions.map((feature) => (
                        <label key={feature} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.features.includes(feature)}
                            onChange={() => handleFeatureToggle(feature)}
                            className="mr-2 rounded"
                          />
                          <span className="text-sm">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {filteredAndSortedCars.length} cars found
                </span>
                <Badge variant="outline" className="text-xs">
                  Best deals available
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-aerotrav-blue focus:border-transparent"
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>

            {/* Car Cards */}
            <div className="space-y-6">
              {filteredAndSortedCars.length === 0 ? (
                <Card className="p-8 text-center">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No cars found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                  <Button onClick={() => setFilters({
                    priceRange: [50, 500],
                    carTypes: [],
                    fuelType: 'all',
                    transmission: 'all',
                    features: [],
                    supplier: 'all'
                  })}>
                    Reset Filters
                  </Button>
                </Card>
              ) : (
                filteredAndSortedCars.map((car) => (
                  <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        {/* Car Image */}
                        <div className="lg:w-80 relative">
                          <img 
                            src={car.image} 
                            alt={car.name}
                            className="w-full h-48 lg:h-64 object-cover"
                          />
                          {car.featured && (
                            <Badge className="absolute top-3 left-3 bg-aerotrav-yellow text-black">
                              Featured
                            </Badge>
                          )}
                          <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                            <Heart className="h-4 w-4 text-gray-600" />
                          </button>
                          {car.originalPrice > car.price && (
                            <Badge className="absolute bottom-3 left-3 bg-red-500 text-white">
                              {Math.round((1 - car.price / car.originalPrice) * 100)}% Off
                            </Badge>
                          )}
                        </div>

                        {/* Car Details */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold text-gray-900">{car.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {car.category}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-2 flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {car.location} • {car.supplier}
                              </p>
                              
                              {/* Car Specifications */}
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                                <div className="flex items-center text-gray-600">
                                  <Users className="h-4 w-4 mr-1" />
                                  {car.seats} seats
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Settings className="h-4 w-4 mr-1" />
                                  {car.transmission}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Fuel className="h-4 w-4 mr-1" />
                                  {car.fuelType}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Shield className="h-4 w-4 mr-1" />
                                  {car.fuelEfficiency}
                                </div>
                              </div>

                              {/* Features */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {car.features.slice(0, 4).map((feature) => (
                                  <Badge key={feature} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                                {car.features.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{car.features.length - 4} more
                                  </Badge>
                                )}
                              </div>

                              {/* Deals */}
                              {car.deals.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {car.deals.map((deal) => (
                                    <Badge key={deal} className="bg-green-100 text-green-800 text-xs">
                                      {deal}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* Rating */}
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <div className="bg-aerotrav-blue text-white px-2 py-1 rounded font-semibold text-sm">
                                    {car.rating}
                                  </div>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`h-3 w-3 ${i < Math.floor(car.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    ({car.reviewCount} reviews)
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Pricing and Actions */}
                            <div className="lg:w-48 text-center lg:text-right">
                              <div className="mb-4">
                                {car.originalPrice > car.price && (
                                  <div className="text-sm text-gray-500 line-through">
                                    RM{car.originalPrice}
                                  </div>
                                )}
                                <div className="text-2xl font-bold text-aerotrav-blue">
                                  RM{car.price}
                                </div>
                                <div className="text-sm text-gray-600">
                                  per day
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Button 
                                  className="w-full bg-aerotrav-blue hover:bg-aerotrav-blue-700"
                                  onClick={() => handleBookCar(car.id)}
                                >
                                  Book Now
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => handleViewCarDetails(car.id)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {showCartModal && (
        <CartModal 
          isOpen={showCartModal} 
          onClose={() => setShowCartModal(false)} 
        />
      )}

      <Footer />
    </div>
  );
};

export default CarRentalPage;