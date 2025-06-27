import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PackageCard from '@/components/PackageCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Breadcrumb from '@/components/Breadcrumb';
import { getPackages } from '@/services/packageService';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Plane, 
  Hotel, 
  Car,
  Package,
  Star,
  Heart,
  Eye,
  RefreshCw,
  Filter,
  TrendingUp,
  Award,
  Clock,
  DollarSign
} from 'lucide-react';

// Interface for package data from database
interface DatabasePackage {
  id: number;
  name: string;
  description: string;
  destination: string;
  destination_city: string;
  destination_country: string;
  duration_days: number;
  base_price: number;
  category: string;
  images: string[];
  featured: boolean;
  difficulty_level: string;
  highlights?: string[];
  includes?: string[];
  excludes?: string[];
}

// Interface for transformed package data
interface TransformedPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  destination: string;
  imageUrl: string;
  flightIncluded: boolean;
  hotelIncluded: boolean;
  carIncluded: boolean;
  rating: number;
  reviewCount: number;
  discount: number;
  featured: boolean;
  category: string;
  highlights: string[];
  originalPrice: number;
  detailedDescription: string;
  gallery: string[];
  itinerary: unknown[];
  meals: string;
  groupSize: string;
  bestTime: string;
  difficulty: string;
}

// Transform database package to component format
const transformPackageData = (pkg: DatabasePackage): TransformedPackage => {
  return {
    id: pkg.id.toString(),
    title: pkg.name || 'Untitled Package',
    description: pkg.description || 'No description available',
    price: pkg.base_price || 0,
    duration: `${pkg.duration_days || 1} days`,
    destination: pkg.destination || `${pkg.destination_city || 'Unknown'}, ${pkg.destination_country || 'Unknown'}`,
    imageUrl: pkg.images && pkg.images.length > 0 ? pkg.images[0] : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    flightIncluded: pkg.includes ? pkg.includes.some(item => item.toLowerCase().includes('flight')) : true,
    hotelIncluded: pkg.includes ? pkg.includes.some(item => item.toLowerCase().includes('accommodation') || item.toLowerCase().includes('hotel')) : true,
    carIncluded: pkg.includes ? pkg.includes.some(item => item.toLowerCase().includes('car') || item.toLowerCase().includes('transfer')) : false,
    rating: 4.5 + Math.random() * 0.5, // Generate rating between 4.5-5.0
    reviewCount: Math.floor(Math.random() * 300) + 50,
    discount: pkg.featured ? Math.floor(Math.random() * 20) + 10 : 0,
    featured: pkg.featured || false,
    category: pkg.category || 'adventure',
    highlights: pkg.highlights || [],
    originalPrice: pkg.base_price * 1.2,
    detailedDescription: pkg.description || 'No description available',
    gallery: pkg.images || [],
    itinerary: [],
    meals: 'Breakfast Included',
    groupSize: '2-8 people',
    bestTime: 'Year Round',
    difficulty: pkg.difficulty_level || 'Easy'
  };
};

const PackagePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state;
  
  const [packages, setPackages] = useState<TransformedPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  
  const [searchQuery, setSearchQuery] = useState(locationState?.destination || '');
  const [filters, setFilters] = useState({
    destination: 'all',
    duration: 'all',
    priceRange: [500, 3000],
    category: 'all',
    rating: 0,
    included: {
      flight: false,
      hotel: false,
      car: false
    }
  });

  // Fetch packages from database
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('🔍 Frontend: Fetching packages from database...');
        
        const data = await getPackages();
        console.log('📦 Frontend: Raw packages data:', data);
        
        const transformedPackages = (data as unknown as DatabasePackage[]).map(transformPackageData);
        console.log('✅ Frontend: Transformed packages:', transformedPackages);
        
        setPackages(transformedPackages);
      } catch (err) {
        console.error('❌ Frontend: Error fetching packages:', err);
        setError('Failed to load packages. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Apply filters and sorting
  const filteredAndSortedPackages = React.useMemo(() => {
    const filtered = packages.filter((pkg) => {
      // Search query filter
      const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase());

      // Other filters
      const matchesDestination = filters.destination === 'all' || pkg.destination.includes(filters.destination);
      const matchesDuration = filters.duration === 'all' || pkg.duration.includes(filters.duration);
      const matchesPrice = pkg.price >= filters.priceRange[0] && pkg.price <= filters.priceRange[1];
      const matchesCategory = filters.category === 'all' || pkg.category === filters.category;
      const matchesRating = filters.rating === 0 || pkg.rating >= filters.rating;
      
      // Inclusion filters
      const matchesInclusions =
        (!filters.included.flight || pkg.flightIncluded) &&
        (!filters.included.hotel || pkg.hotelIncluded) &&
        (!filters.included.car || pkg.carIncluded);

      return matchesSearch && matchesDestination && matchesDuration && 
             matchesPrice && matchesCategory && matchesRating && matchesInclusions;
    });

    // Sort packages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        case 'discount':
          return b.discount - a.discount;
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [packages, searchQuery, filters, sortBy]);

  const handleIncludeFilterChange = (filterType: keyof typeof filters.included) => {
    setFilters(prev => ({
      ...prev,
      included: {
        ...prev.included,
        [filterType]: !prev.included[filterType]
      }
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filteredAndSortedPackages useMemo
  };

  const handleRefreshSearch = () => {
    setIsLoading(true);
    // Refetch packages
    const fetchPackages = async () => {
      try {
        const data = await getPackages();
        const transformedPackages = (data as unknown as DatabasePackage[]).map(transformPackageData);
        setPackages(transformedPackages);
      } catch (err) {
        setError('Failed to refresh packages.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  };

  const breadcrumbItems = [
    { label: 'Travel Packages', href: '/packages' },
    { label: 'Search Results', active: true }
  ];

  // Dynamic categories and destinations from loaded packages
  const categories = ['all', ...Array.from(new Set(packages.map(pkg => pkg.category).filter(cat => cat && cat.trim() !== '')))];
  const destinations = ['all', ...Array.from(new Set(packages.map(pkg => pkg.destination.split(',')[0]).filter(dest => dest && dest.trim() !== '')))];
  const durations = ['all', '5-7 days', '8-10 days', '10+ days'];

  if (isLoading) {
    return (
      <div className="page-layout bg-gray-50">
        <Header />
        <div className="page-content">
          <div className="container mx-auto px-4 py-16">
            <LoadingSpinner size="lg" text="Loading amazing travel packages..." />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-layout bg-gray-50">
        <Header />
        <div className="page-content">
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Packages</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRefreshSearch} className="bg-aerotrav-blue hover:bg-aerotrav-blue-600">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-layout bg-gray-50">
      <Header />
      
      <div className="page-content">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-r from-aerotrav-blue to-blue-800 text-white py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="container mx-auto text-center relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            All-Inclusive Travel Packages
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-aerotrav-blue-100">
            Discover our carefully crafted travel packages combining flights, accommodations, 
            and experiences for unforgettable journeys around the world.
          </p>
          
          {/* Enhanced Interactive Package Search Bar */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl max-w-6xl mx-auto">
            <form onSubmit={handleSearch} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Enhanced Search Input */}
              <div className="lg:col-span-2 group">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Search className="h-5 w-5 text-aerotrav-yellow" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search destinations, experiences, or package names..."
                    className="w-full pl-12 pr-4 py-5 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/20 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Search packages</div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Destination Selector */}
              <div className="group">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <MapPin className="h-5 w-5 text-aerotrav-yellow" />
                  </div>
                  <select 
                    value={filters.destination} 
                    onChange={(e) => setFilters(prev => ({...prev, destination: e.target.value}))}
                    className="w-full pl-12 pr-10 py-5 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/20 text-lg appearance-none cursor-pointer"
                  >
                    {destinations.filter(dest => dest && dest.trim() !== '').map(dest => (
                      <option key={dest} value={dest} className="bg-aerotrav-blue text-white py-2">
                        {dest === 'all' ? 'All Destinations' : dest}
                      </option>
                    ))}
                  </select>
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Destination</div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Enhanced Duration & Search Combined */}
              <div className="flex gap-3">
                {/* Duration Selector */}
                <div className="flex-1 group">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <Calendar className="h-5 w-5 text-aerotrav-yellow" />
                    </div>
                    <select 
                      value={filters.duration} 
                      onChange={(e) => setFilters(prev => ({...prev, duration: e.target.value}))}
                      className="w-full pl-12 pr-10 py-5 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/20 text-lg appearance-none cursor-pointer"
                    >
                      {durations.filter(duration => duration && duration.trim() !== '').map(duration => (
                        <option key={duration} value={duration} className="bg-aerotrav-blue text-white py-2">
                          {duration === 'all' ? 'Any Duration' : duration}
                        </option>
                      ))}
                    </select>
                    <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Duration</div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Enhanced Search Button - Icon Only */}
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-aerotrav-yellow to-yellow-400 hover:from-aerotrav-yellow-500 hover:to-yellow-500 text-aerotrav-blue font-bold p-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group flex-shrink-0 aspect-square"
                >
                  <div className="flex items-center justify-center">
                    <Search className="w-6 h-6 text-aerotrav-blue group-hover:scale-110 transition-transform" />
                  </div>
                </Button>
              </div>
            </form>

            {/* Enhanced Quick Actions */}
            <div className="flex flex-col lg:flex-row items-center justify-between mt-6 pt-6 border-t border-white/20 gap-4">
              <div className="flex items-center gap-6 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Found {filteredAndSortedPackages.length} packages</span>
                </div>
                <span className="text-white/60">•</span>
                <span className="text-aerotrav-yellow font-medium">All-inclusive deals</span>
                <span className="text-white/60">•</span>
                <span className="text-aerotrav-yellow font-medium">Best price guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Refresh and Filters buttons removed as requested */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Summary */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {searchQuery ? `Packages matching "${searchQuery}"` : 'All Travel Packages'}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredAndSortedPackages.length} packages found
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
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:w-80">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filter Packages
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setFilters({
                      destination: 'all',
                      duration: 'all',
                      priceRange: [500, 3000],
                      category: 'all',
                      rating: 0,
                      included: { flight: false, hotel: false, car: false }
                    })}
                  >
                    Reset
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                      max={5000}
                      min={500}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Category</label>
                    <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({...prev, category: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(category => category && category.trim() !== '').map(category => (
                          <SelectItem key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Minimum Rating */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Minimum Rating</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[0, 3, 3.5, 4, 4.5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setFilters(prev => ({ ...prev, rating: rating === prev.rating ? 0 : rating }))}
                          className={`p-2 rounded-lg border-2 transition-colors text-xs ${
                            filters.rating === rating 
                              ? 'border-aerotrav-blue bg-aerotrav-blue text-white' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {rating === 0 ? 'Any' : `${rating}+★`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* What's Included */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">What's Included</label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.included.flight}
                          onChange={() => handleIncludeFilterChange('flight')}
                          className="mr-3 rounded"
                        />
                        <Plane className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">Flights</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.included.hotel}
                          onChange={() => handleIncludeFilterChange('hotel')}
                          className="mr-3 rounded"
                        />
                        <Hotel className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">Hotels</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.included.car}
                          onChange={() => handleIncludeFilterChange('car')}
                          className="mr-3 rounded"
                        />
                        <Car className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">Car Rental</span>
                      </label>
                    </div>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Duration</label>
                    <Select value={filters.duration} onValueChange={(value) => setFilters(prev => ({...prev, duration: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durations.filter(duration => duration && duration.trim() !== '').map(duration => (
                          <SelectItem key={duration} value={duration}>
                            {duration === 'all' ? 'Any Duration' : duration}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {filteredAndSortedPackages.length} packages found
                </span>
                <Badge variant="outline" className="text-xs">
                  Best deals highlighted
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-aerotrav-blue focus:border-transparent"
                >
                  <option value="featured">Featured First</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="duration">Duration</option>
                  <option value="discount">Best Discount</option>
                </select>
              </div>
            </div>

            {/* Package Cards */}
            <div className="space-y-6">
              {filteredAndSortedPackages.length === 0 ? (
                <Card className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      destination: 'all',
                      duration: 'all',
                      priceRange: [500, 3000],
                      category: 'all',
                      rating: 0,
                      included: { flight: false, hotel: false, car: false }
                    });
                  }}>
                    Clear All Filters
                  </Button>
                </Card>
              ) : (
                filteredAndSortedPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    id={pkg.id}
                    title={pkg.title}
                    description={pkg.description}
                    price={pkg.price}
                    duration={pkg.duration}
                    destination={pkg.destination}
                    imageUrl={pkg.imageUrl}
                    flightIncluded={pkg.flightIncluded}
                    hotelIncluded={pkg.hotelIncluded}
                    carIncluded={pkg.carIncluded}
                    rating={pkg.rating}
                    discount={pkg.discount}
                    featured={pkg.featured}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      </div>

      <Footer />
    </div>
  );
};

export default PackagePage;