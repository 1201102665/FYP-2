import React, { useState } from 'react';
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

// Enhanced mock data with more realistic information
const ENHANCED_PACKAGES = [
  {
    id: '1',
    title: 'Bali Paradise Escape',
    description: 'Immerse yourself in the beauty of Bali with this all-inclusive package featuring luxury accommodations, cultural experiences, and breathtaking beaches.',
    detailedDescription: 'Experience the best of Bali with 7 nights in premium beachfront resorts, daily breakfast, spa treatments, cultural tours to ancient temples, and traditional Balinese cooking classes.',
    price: 1299,
    originalPrice: 1529,
    duration: '7 nights',
    destination: 'Bali, Indonesia',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400'
    ],
    flightIncluded: true,
    hotelIncluded: true,
    carIncluded: true,
    rating: 4.8,
    reviewCount: 342,
    discount: 15,
    featured: true,
    category: 'Beach & Resort',
    highlights: ['Private Beach Access', 'Spa Treatments', 'Cultural Tours', 'Airport Transfers'],
    itinerary: ['Arrival & Welcome Dinner', 'Temple Tours', 'Beach Activities', 'Spa Day', 'Cultural Workshop', 'Adventure Excursion', 'Departure'],
    meals: 'Breakfast Included',
    groupSize: '2-8 people',
    bestTime: 'Apr-Oct',
    difficulty: 'Easy'
  },
  {
    id: '2',
    title: 'Tokyo Urban Adventure',
    description: 'Experience the perfect blend of modern technology and ancient traditions in the vibrant city of Tokyo. Includes guided tours and culinary experiences.',
    detailedDescription: 'Discover Tokyo through 6 action-packed days including visits to iconic landmarks, traditional temples, modern districts, authentic food experiences, and cultural workshops.',
    price: 1899,
    originalPrice: 2199,
    duration: '6 nights',
    destination: 'Tokyo, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
    gallery: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
      'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400'
    ],
    flightIncluded: true,
    hotelIncluded: true,
    carIncluded: false,
    rating: 4.6,
    reviewCount: 287,
    discount: 14,
    featured: false,
    category: 'City & Culture',
    highlights: ['Shibuya Crossing', 'Traditional Tea Ceremony', 'Sushi Making Class', 'Mt. Fuji Day Trip'],
    itinerary: ['Arrival & City Tour', 'Traditional Tokyo', 'Modern Districts', 'Mt. Fuji Excursion', 'Food & Culture', 'Shopping & Departure'],
    meals: 'Breakfast & 2 Dinners',
    groupSize: '2-12 people',
    bestTime: 'Mar-May, Sep-Nov',
    difficulty: 'Moderate'
  },
  {
    id: '3',
    title: 'Greek Island Hopping',
    description: 'Discover the magic of Greece with this island hopping adventure. Visit Santorini, Mykonos, and Crete with all transportation and accommodations included.',
    detailedDescription: 'Explore three stunning Greek islands over 10 unforgettable days. Experience white-washed villages, crystal-clear waters, ancient ruins, and Mediterranean cuisine.',
    price: 2299,
    originalPrice: 2699,
    duration: '10 nights',
    destination: 'Greece',
    imageUrl: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=600',
    gallery: [
      'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=400',
      'https://images.unsplash.com/photo-1504640834693-3a2893de9134?w=400',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400'
    ],
    flightIncluded: true,
    hotelIncluded: true,
    carIncluded: false,
    rating: 4.9,
    reviewCount: 456,
    discount: 15,
    featured: true,
    category: 'Island Adventure',
    highlights: ['Santorini Sunset', 'Mykonos Nightlife', 'Ancient Ruins', 'Private Yacht Trip'],
    itinerary: ['Athens Arrival', 'Santorini (3 nights)', 'Mykonos (3 nights)', 'Crete (3 nights)', 'Return to Athens'],
    meals: 'Breakfast Included',
    groupSize: '2-16 people',
    bestTime: 'May-Oct',
    difficulty: 'Easy'
  },
  {
    id: '4',
    title: 'Costa Rican Rainforest Experience',
    description: 'Explore the biodiversity of Costa Rica\'s rainforests with guided tours, zip-lining adventures, and beach relaxation at a sustainable eco-lodge.',
    detailedDescription: 'Adventure through lush rainforests, spot exotic wildlife, experience thrilling zip-lines, relax on pristine beaches, and stay in eco-friendly accommodations.',
    price: 1599,
    originalPrice: 1899,
    duration: '8 nights',
    destination: 'Costa Rica',
    imageUrl: 'https://images.unsplash.com/photo-1577451581377-523b0a03bb6b?w=600',
    gallery: [
      'https://images.unsplash.com/photo-1577451581377-523b0a03bb6b?w=400',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400'
    ],
    flightIncluded: true,
    hotelIncluded: true,
    carIncluded: true,
    rating: 4.7,
    reviewCount: 198,
    discount: 16,
    featured: false,
    category: 'Adventure & Nature',
    highlights: ['Zip-line Canopy Tour', 'Wildlife Spotting', 'Beach Relaxation', 'Sustainable Tourism'],
    itinerary: ['San José Arrival', 'Rainforest Lodge', 'Adventure Activities', 'Wildlife Tours', 'Beach Transfer', 'Coast Relaxation', 'Nature Walks', 'Departure'],
    meals: 'All Meals Included',
    groupSize: '2-10 people',
    bestTime: 'Dec-Apr',
    difficulty: 'Moderate'
  },
  {
    id: '5',
    title: 'Moroccan Desert Safari',
    description: 'Journey through the vibrant markets of Marrakech and into the Sahara Desert for a once-in-a-lifetime camping experience under the stars.',
    detailedDescription: 'Immerse yourself in Moroccan culture with medina tours, Atlas Mountains excursions, camel trekking, and unforgettable desert camping.',
    price: 1499,
    originalPrice: 1749,
    duration: '7 nights',
    destination: 'Morocco',
    imageUrl: 'https://images.unsplash.com/photo-1604856420566-576ba98b53cd?w=600',
    gallery: [
      'https://images.unsplash.com/photo-1604856420566-576ba98b53cd?w=400',
      'https://images.unsplash.com/photo-1539650116574-75c0c6d32795?w=400',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'
    ],
    flightIncluded: true,
    hotelIncluded: true,
    carIncluded: true,
    rating: 4.5,
    reviewCount: 234,
    discount: 14,
    featured: false,
    category: 'Desert Adventure',
    highlights: ['Camel Trekking', 'Desert Camping', 'Berber Culture', 'Atlas Mountains'],
    itinerary: ['Marrakech Arrival', 'City Tours', 'Atlas Mountains', 'Desert Journey', 'Camel Trek & Camping', 'Desert Sunrise', 'Return Journey'],
    meals: 'Breakfast & 3 Dinners',
    groupSize: '2-12 people',
    bestTime: 'Oct-Apr',
    difficulty: 'Moderate'
  },
  {
    id: '6',
    title: 'New Zealand Adventure Tour',
    description: 'Experience the stunning landscapes of New Zealand with this adventure package including hiking, bungee jumping, and exploring filming locations from Lord of the Rings.',
    detailedDescription: 'Discover both North and South Islands with thrilling adventures, breathtaking scenery, movie locations, and unique wildlife encounters.',
    price: 2599,
    originalPrice: 2999,
    duration: '12 nights',
    destination: 'New Zealand',
    imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600',
    gallery: [
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'
    ],
    flightIncluded: true,
    hotelIncluded: true,
    carIncluded: true,
    rating: 4.9,
    reviewCount: 387,
    discount: 13,
    featured: true,
    category: 'Adventure & Nature',
    highlights: ['Bungee Jumping', 'LOTR Locations', 'Milford Sound', 'Glacier Hiking'],
    itinerary: ['Auckland Arrival', 'North Island Tours', 'Wellington', 'South Island Ferry', 'Adventure Capital', 'Milford Sound', 'Glaciers & Mountains', 'Departure'],
    meals: 'Breakfast Included',
    groupSize: '2-14 people',
    bestTime: 'Nov-Mar',
    difficulty: 'Challenging'
  }
];

const PackagePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state;
  
  const [isLoading, setIsLoading] = useState(false);
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

  // Apply filters and sorting
  const filteredAndSortedPackages = React.useMemo(() => {
    let filtered = ENHANCED_PACKAGES.filter((pkg) => {
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
  }, [searchQuery, filters, sortBy]);

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
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleRefreshSearch = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const breadcrumbItems = [
    { label: 'Travel Packages', href: '/packages' },
    { label: 'Search Results', active: true }
  ];

  const categories = ['all', 'Beach & Resort', 'City & Culture', 'Adventure & Nature', 'Island Adventure', 'Desert Adventure'];
  const destinations = ['all', 'Bali', 'Japan', 'Greece', 'Costa Rica', 'Morocco', 'New Zealand'];
  const durations = ['all', '5-7 days', '8-10 days', '10+ days'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <LoadingSpinner size="lg" text="Finding amazing travel packages for you..." />
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
            {/* Package Type Selector */}
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 rounded-full p-1 flex flex-wrap gap-1">
                {['All Packages', 'Beach & Resort', 'Adventure', 'City Tours', 'Cultural'].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      type === 'All Packages' 
                        ? 'bg-aerotrav-yellow text-aerotrav-blue shadow-lg' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

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
                    {destinations.map(dest => (
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
                      {durations.map(duration => (
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
              <span className="text-sm text-white/70 mr-2">Popular inclusions:</span>
              {['Flight Included', 'Hotel Included', 'Meals Included', 'Tours Included', 'Transport Included'].map((inclusion) => (
                <button
                  key={inclusion}
                  className="px-3 py-1 text-sm bg-white/10 hover:bg-aerotrav-yellow hover:text-aerotrav-blue rounded-full transition-all duration-300 text-white border border-white/20 hover:border-aerotrav-yellow"
                >
                  {inclusion}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-aerotrav-yellow">{ENHANCED_PACKAGES.length}+</div>
              <div className="text-sm text-aerotrav-blue-100">Packages Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-aerotrav-yellow">50+</div>
              <div className="text-sm text-aerotrav-blue-100">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-aerotrav-yellow">15%</div>
              <div className="text-sm text-aerotrav-blue-100">Average Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-aerotrav-yellow">24/7</div>
              <div className="text-sm text-aerotrav-blue-100">Travel Support</div>
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
                        {categories.map(category => (
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
                        {durations.map(duration => (
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

      <Footer />
    </div>
  );
};

export default PackagePage;