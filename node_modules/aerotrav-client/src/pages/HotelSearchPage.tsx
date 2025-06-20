import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HotelCard from "@/components/HotelCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Breadcrumb from "@/components/Breadcrumb";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Hotel,
  Star,
  Wifi,
  Car,
  Utensils,
  Waves,
  Dumbbell,
  Coffee,
  Search,
  Filter,
  SortAsc,
  RefreshCw,
  Heart,
  Eye,
  Edit
} from "lucide-react";

const HotelSearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  
  // Get search parameters from location state or set defaults
  const locationState = location.state;
  const [searchParams, setSearchParams] = useState({
    destination: locationState?.destination || "Bali, Indonesia",
    checkInDate: locationState?.checkInDate || "2024-02-15",
    checkOutDate: locationState?.checkOutDate || "2024-02-20",
    guests: locationState?.guests || "2 Adults, 1 Room",
    rooms: 1
  });

  const [filters, setFilters] = useState({
    priceRange: [100, 1000],
    starRating: 0,
    amenities: [] as string[],
    propertyType: 'all',
    distanceFromCenter: 20,
    guestRating: 0
  });

  // Enhanced hotel data with more realistic information
  const allHotels = [
    {
      id: 1,
      name: "The Mulia Bali",
      location: "Nusa Dua, Bali",
      stars: 5,
      rating: 9.2,
      reviewCount: 1842,
      price: 450,
      originalPrice: 520,
      images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400"],
      amenities: ["Pool", "Spa", "Beach Access", "WiFi", "Restaurant", "Gym", "Parking"],
      description: "Luxury beachfront resort with world-class amenities and stunning ocean views",
      distanceFromCenter: 15,
      nights: 5,
      propertyType: "Resort",
      featured: true,
      deals: ["Free Cancellation", "Breakfast Included"]
    },
    {
      id: 2,
      name: "COMO Uma Ubud",
      location: "Ubud, Bali",
      stars: 5,
      rating: 9.0,
      reviewCount: 967,
      price: 380,
      originalPrice: 450,
      images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"],
      amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Yoga Studio", "Nature Tours"],
      description: "Boutique resort nestled in lush tropical gardens with infinity pool",
      distanceFromCenter: 8,
      nights: 5,
      propertyType: "Boutique Hotel",
      featured: true,
      deals: ["Early Check-in", "Spa Credit"]
    },
    {
      id: 3,
      name: "W Bali Seminyak",
      location: "Seminyak, Bali",
      stars: 5,
      rating: 8.8,
      reviewCount: 2341,
      price: 320,
      originalPrice: 380,
      images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400"],
      amenities: ["Pool", "Beach Access", "WiFi", "Restaurant", "Bar", "Nightclub", "Parking"],
      description: "Trendy beachfront hotel in the heart of Seminyak's vibrant scene",
      distanceFromCenter: 12,
      nights: 5,
      propertyType: "Hotel",
      featured: false,
      deals: ["Free WiFi", "Late Checkout"]
    },
    {
      id: 4,
      name: "Alaya Resort Ubud",
      location: "Ubud, Bali",
      stars: 4,
      rating: 8.6,
      reviewCount: 1205,
      price: 180,
      originalPrice: 220,
      images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400"],
      amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Yoga Studio", "Parking"],
      description: "Charming resort with traditional Balinese architecture and modern comfort",
      distanceFromCenter: 5,
      nights: 5,
      propertyType: "Resort",
      featured: false,
      deals: ["Breakfast Included"]
    },
    {
      id: 5,
      name: "The Kayon Jungle Resort",
      location: "Ubud, Bali",
      stars: 4,
      rating: 9.1,
      reviewCount: 876,
      price: 280,
      originalPrice: 340,
      images: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400"],
      amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Nature Tours", "Yoga Studio"],
      description: "Luxury jungle retreat with breathtaking valley views and eco-friendly design",
      distanceFromCenter: 10,
      nights: 5,
      propertyType: "Eco Lodge",
      featured: true,
      deals: ["Free Cancellation", "Nature Tour Included"]
    },
    {
      id: 6,
      name: "Potato Head Suites & Studios",
      location: "Seminyak, Bali",
      stars: 4,
      rating: 8.4,
      reviewCount: 1543,
      price: 250,
      originalPrice: 300,
      images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400"],
      amenities: ["Pool", "Beach Access", "WiFi", "Restaurant", "Bar", "Parking"],
      description: "Stylish beachfront accommodations with contemporary design and sustainability focus",
      distanceFromCenter: 11,
      nights: 5,
      propertyType: "Hotel",
      featured: false,
      deals: ["Beach Club Access", "Eco-Friendly"]
    }
  ];

  // Apply filters and sorting
  const filteredAndSortedHotels = React.useMemo(() => {
    let filtered = allHotels.filter((hotel) => {
      if (hotel.price < filters.priceRange[0] || hotel.price > filters.priceRange[1]) return false;
      if (filters.starRating > 0 && hotel.stars < filters.starRating) return false;
      if (filters.guestRating > 0 && hotel.rating < filters.guestRating) return false;
      if (filters.distanceFromCenter < hotel.distanceFromCenter) return false;
      if (filters.propertyType !== 'all' && hotel.propertyType !== filters.propertyType) return false;
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          hotel.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      return true;
    });

    // Sort hotels
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'stars':
          return b.stars - a.stars;
        case 'distance':
          return a.distanceFromCenter - b.distanceFromCenter;
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleRefreshSearch = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const breadcrumbItems = [
    { label: 'Hotels', href: '/hotels' },
    { label: 'Search Results', active: true }
  ];

  const amenityOptions = ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking', 'Beach Access', 'Bar'];
  const propertyTypes = ['all', 'Hotel', 'Resort', 'Boutique Hotel', 'Eco Lodge'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <LoadingSpinner size="lg" text="Finding the perfect hotels for you..." />
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

      {/* Enhanced Interactive Hotel Search Bar */}
      <div className="bg-gradient-to-r from-aerotrav-blue via-aerotrav-blue-700 to-aerotrav-blue-800 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            {/* Hotel Type Selector */}
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 rounded-full p-1 flex flex-wrap gap-1">
                {['Hotels', 'Resorts', 'Apartments', 'Villas', 'Hostels'].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      type === 'Hotels' 
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
              {/* Where do you want to stay? */}
              <div className="flex-1 min-w-0 group">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <MapPin className="h-5 w-5 text-aerotrav-yellow" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter destination or hotel name"
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams(prev => ({...prev, destination: e.target.value}))}
                    className="w-full pl-12 pr-4 py-5 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/20 text-lg"
                  />
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Where do you want to stay?</div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Search className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Check-in */}
              <div className="flex-1 min-w-0 group">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Calendar className="h-5 w-5 text-aerotrav-yellow" />
                  </div>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={new Date(searchParams.checkInDate).toLocaleDateString('en-GB')}
                    className="w-full pl-12 pr-4 py-5 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/20 text-lg"
                    readOnly
                  />
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Check-in</div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Edit className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Check-out */}
              <div className="flex-1 min-w-0 group">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Calendar className="h-5 w-5 text-aerotrav-yellow" />
                  </div>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={new Date(searchParams.checkOutDate).toLocaleDateString('en-GB')}
                    className="w-full pl-12 pr-4 py-5 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/20 text-lg"
                    readOnly
                  />
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Check-out</div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Edit className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Guests&Rooms */}
              <div className="flex-1 min-w-0 group">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Users className="h-5 w-5 text-aerotrav-yellow" />
                  </div>
                  <input
                    type="text"
                    placeholder="2 Adults, 1 Room"
                    value={searchParams.guests}
                    onChange={(e) => setSearchParams(prev => ({...prev, guests: e.target.value}))}
                    className="w-full pl-12 pr-4 py-5 bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/20 text-lg"
                  />
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Guests&Rooms</div>
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
                  <span className="font-medium">Found {filteredAndSortedHotels.length} hotels available</span>
                </div>
                <span className="text-white/60">•</span>
                <span className="font-medium">{searchParams.destination}</span>
                <span className="text-white/60">•</span>
                <span className="text-aerotrav-yellow font-medium">Free cancellation available</span>
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
              <span className="text-sm text-white/70 mr-2">Quick filters:</span>
              {['Free WiFi', 'Pool', 'Spa', 'Pet Friendly', 'Business Center'].map((filter) => (
                <button
                  key={filter}
                  className="px-3 py-1 text-sm bg-white/10 hover:bg-aerotrav-yellow hover:text-aerotrav-blue rounded-full transition-all duration-300 text-white border border-white/20 hover:border-aerotrav-yellow"
                >
                  {filter}
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
                Hotels in {searchParams.destination}
              </h2>
              <p className="text-sm text-gray-600">
                {new Date(searchParams.checkInDate).toLocaleDateString()} - {new Date(searchParams.checkOutDate).toLocaleDateString()} • {searchParams.guests}
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
                      priceRange: [100, 1000],
                      starRating: 0,
                      amenities: [],
                      propertyType: 'all',
                      distanceFromCenter: 20,
                      guestRating: 0
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
                      max={1000}
                      min={50}
                      step={25}
                      className="w-full"
                    />
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Minimum Star Rating</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          onClick={() => setFilters(prev => ({ ...prev, starRating: stars === prev.starRating ? 0 : stars }))}
                          className={`p-2 rounded-lg border-2 transition-colors ${
                            filters.starRating === stars 
                              ? 'border-aerotrav-blue bg-aerotrav-blue text-white' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {stars}★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guest Rating */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Minimum Guest Rating</label>
                    <select 
                      value={filters.guestRating} 
                      onChange={(e) => setFilters(prev => ({ ...prev, guestRating: parseFloat(e.target.value) }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aerotrav-blue focus:border-transparent"
                    >
                      <option value={0}>Any rating</option>
                      <option value={7}>7.0+ Good</option>
                      <option value={8}>8.0+ Very Good</option>
                      <option value={8.5}>8.5+ Excellent</option>
                      <option value={9}>9.0+ Exceptional</option>
                    </select>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Property Type</label>
                    <select 
                      value={filters.propertyType} 
                      onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aerotrav-blue focus:border-transparent"
                    >
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>
                          {type === 'all' ? 'All Properties' : type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Amenities</label>
                    <div className="space-y-2">
                      {amenityOptions.map((amenity) => (
                        <label key={amenity} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                            className="mr-2 rounded"
                          />
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Distance from Center */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Distance from Center: {filters.distanceFromCenter}km
                    </label>
                    <Slider
                      value={[filters.distanceFromCenter]}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, distanceFromCenter: value[0] }))}
                      max={50}
                      min={1}
                      step={1}
                      className="w-full"
                    />
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
                  {filteredAndSortedHotels.length} hotels found
                </span>
                <Badge variant="outline" className="text-xs">
                  Best value highlighted
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
                  <option value="rating">Guest Rating (High to Low)</option>
                  <option value="stars">Star Rating (High to Low)</option>
                  <option value="distance">Distance from Center</option>
                </select>
              </div>
            </div>

            {/* Hotel Cards */}
            <div className="space-y-6">
              {filteredAndSortedHotels.length === 0 ? (
                <Card className="p-8 text-center">
                  <Hotel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hotels found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                  <Button onClick={() => setFilters({
                    priceRange: [100, 1000],
                    starRating: 0,
                    amenities: [],
                    propertyType: 'all',
                    distanceFromCenter: 20,
                    guestRating: 0
                  })}>
                    Reset Filters
                  </Button>
                </Card>
              ) : (
                filteredAndSortedHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={{
                      id: hotel.id,
                      name: hotel.name,
                      location: hotel.location,
                      stars: hotel.stars,
                      rating: hotel.rating,
                      reviewCount: hotel.reviewCount,
                      price: hotel.price,
                      images: hotel.images,
                      perks: hotel.amenities,
                      nights: hotel.nights,
                      startDate: searchParams.checkInDate,
                      endDate: searchParams.checkOutDate
                    }}
                    onBookNow={() => {
                      navigate('/hotel-booking', {
                        state: { hotel }
                      });
                    }}
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

export default HotelSearchPage;