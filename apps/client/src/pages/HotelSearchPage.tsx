import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { searchHotels, browseHotels, Hotel } from "@/services/hotelService";
import {
  Calendar,
  MapPin,
  Users,
  Hotel as HotelIcon,
  Star,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Coffee,
  Waves,
  Filter,
  SortAsc,
  Edit,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "@/services/api";
import { debounce } from "lodash";

interface SearchParams {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  rooms: number;
}

interface FilterState {
  priceRange: [number, number];
  starRating: number;
  amenities: string[];
  propertyType: string;
  distanceFromCenter: number;
  guestRating: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface HotelsResponse {
  hotels: Hotel[];
  pagination?: {
    current_page: number;
    per_page: number;
    total_results: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

const HotelSearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(5); // 5 hotels per page
  const [searchParams, setSearchParams] = useState<SearchParams>({
    destination: "",
    checkInDate: "",
    checkOutDate: "",
    guests: 2,
    rooms: 1,
  });

  // Add a local state for the search input to prevent UI jank
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Use a ref to store the latest search params to prevent stale closure issues
  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      try {
        setIsTransitioning(true);
        setError(null);
        
        const params = {
          ...searchParamsRef.current,
          destination: value
        };
        
        await loadHotels(params);
      } catch (error) {
        console.error('Search error:', error);
        setError('Failed to load hotels. Please try again.');
      } finally {
        setIsTransitioning(false);
      }
    }, 300),
    []
  );

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [100, 1000],
    starRating: 0,
    amenities: [],
    propertyType: 'all',
    distanceFromCenter: 20,
    guestRating: 0
  });

  const [sortBy, setSortBy] = useState("recommended");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);

  // Add transition state to prevent flashing
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Debounced setSearchParams to prevent rapid updates
  const debouncedSetSearchParams = React.useCallback(
    (params: Partial<SearchParams>) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      const timeout = setTimeout(() => {
        setSearchParams(prev => ({ ...prev, ...params }));
      }, 300);
      setSearchTimeout(timeout);
    },
    [searchTimeout]
  );

  useEffect(() => {
    // Get search parameters from location state or URL params
    const urlParams = new URLSearchParams(location.search);
    const stateParams = location.state as { 
      destination?: string;
      checkInDate?: string;
      checkOutDate?: string;
      guests?: number;
      rooms?: number;
    } | null;

    const params = {
      destination: stateParams?.destination || urlParams.get('destination') || "",
      checkInDate: stateParams?.checkInDate || urlParams.get('checkIn') || "",
      checkOutDate: stateParams?.checkOutDate || urlParams.get('checkOut') || "",
      guests: parseInt(stateParams?.guests?.toString() || urlParams.get('guests') || '2'),
      rooms: parseInt(stateParams?.rooms?.toString() || urlParams.get('rooms') || '1'),
    };

    // Use the debounced setter
    debouncedSetSearchParams(params);
    
    // Only load if we have actual search params
    if (params.destination || params.checkInDate || params.checkOutDate) {
      loadHotels(params).catch(error => {
        console.error('Failed to load initial hotels:', error);
        setLoading(false);
      });
    } else {
      // For initial load without params, use browseHotels
      loadHotels({
        destination: "",
        checkInDate: "",
        checkOutDate: "",
        guests: 2,
        rooms: 1
      }).catch(error => {
        console.error('Failed to load initial hotels:', error);
        setLoading(false);
      });
    }
  }, [location.search, location.state]);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('hotelSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search to history
  const saveToSearchHistory = (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) return;
    
    const updatedHistory = [
      searchTerm,
      ...searchHistory.filter(item => item !== searchTerm)
    ].slice(0, 5); // Keep only last 5 searches
    
    setSearchHistory(updatedHistory);
    localStorage.setItem('hotelSearchHistory', JSON.stringify(updatedHistory));
  };

  const loadHotels = async (params: SearchParams) => {
    setIsTransitioning(true);
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Loading hotels with params:', params);
      
      let hotelData: Hotel[] = [];
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          // Always use search endpoint with proper params
          const searchRequest = {
            destination: params.destination || '',
            adults: params.guests,
            rooms: params.rooms,
            ...(params.checkInDate && params.checkInDate.match(/^\d{4}-\d{2}-\d{2}$/) ? { check_in: params.checkInDate } : {}),
            ...(params.checkOutDate && params.checkOutDate.match(/^\d{4}-\d{2}-\d{2}$/) ? { check_out: params.checkOutDate } : {})
          };

          const result = await searchHotels(searchRequest);
          hotelData = result.hotels;
          break; // Success, exit retry loop
          
        } catch (error) {
          console.warn(`Attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          
          if (retryCount <= maxRetries) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            continue;
          }
          
          // If all retries failed, try fallback to simple hotels endpoint
          try {
            console.log('🔄 Falling back to simple hotels endpoint');
            const response = await api.get('search/hotels-simple') as ApiResponse<HotelsResponse>;
            if (response?.success && Array.isArray(response?.data?.hotels)) {
              hotelData = response.data.hotels;
              break;
            }
          } catch (fallbackError) {
            console.error('Fallback failed:', fallbackError);
            throw error; // Throw original error if fallback fails
          }
        }
      }

      console.log('📋 Loaded hotels:', hotelData.length);
      setHotels(hotelData);
      setCurrentPage(1);
      
    } catch (error) {
      console.error('❌ Error loading hotels:', error);
      setHotels([]);
      // Show a more user-friendly error message
      setError('We encountered a temporary issue. Showing available hotels instead.');
      
      // Try one final fallback to show any available hotels
      try {
        const response = await api.get('hotels?limit=10') as ApiResponse<HotelsResponse>;
        if (response?.success && Array.isArray(response?.data?.hotels)) {
          setHotels(response.data.hotels);
          setError(null);
        }
      } catch (fallbackError) {
        console.error('Final fallback failed:', fallbackError);
      }
    } finally {
      setLoading(false);
      setIsTransitioning(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [100, 1000],
      starRating: 0,
      amenities: [],
      propertyType: 'all',
      distanceFromCenter: 20,
      guestRating: 0
    });
    setCurrentPage(1);
  };

  const handleSearchUpdate = async () => {
    setError(null); // Clear any previous errors
    try {
      saveToSearchHistory(searchParams.destination);
      await loadHotels(searchParams);
    } catch (error) {
      setError('Failed to load hotels. Please try again.');
    }
  };

  // Filter and sort hotels
  const filteredAndSortedHotels = React.useMemo(() => {
    const filtered = hotels.filter(hotel => {
      // Price filter
      if (hotel.price_per_night < filters.priceRange[0] || hotel.price_per_night > filters.priceRange[1]) {
        return false;
      }

      // Star rating filter (using rating field)
      if (filters.starRating > 0 && hotel.rating < filters.starRating) {
        return false;
      }

      // Guest rating filter
      if (filters.guestRating > 0 && hotel.user_rating < filters.guestRating) {
        return false;
      }

      // Property type filter
      if (filters.propertyType !== 'all' && hotel.hotel_type !== filters.propertyType) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity =>
          hotel.amenities.some(hotelAmenity => 
            hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      return true;
    });

    // Sort hotels
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price_per_night - b.price_per_night;
        case 'price_high':
          return b.price_per_night - a.price_per_night;
        case 'rating_high':
          return b.rating - a.rating;
        case 'rating_low':
          return a.rating - b.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default: // recommended
          return b.rating - a.rating;
      }
    });
  }, [hotels, filters, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedHotels.length / hotelsPerPage);
  const startIndex = (currentPage - 1) * hotelsPerPage;
  const endIndex = startIndex + hotelsPerPage;
  const currentHotels = filteredAndSortedHotels.slice(startIndex, endIndex);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Hotels", href: "/hotels" },
    ...(searchParams.destination ? [{ label: searchParams.destination }] : [])
  ];

  const amenityOptions = [
    { id: 'wifi', label: 'Free WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'restaurant', label: 'Restaurant', icon: Utensils },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'spa', label: 'Spa', icon: Coffee },
    { id: 'pool', label: 'Pool', icon: Waves },
  ];

  // Get search suggestions
  const getSearchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      interface SuggestionsResponse {
        success: boolean;
        data: {
          suggestions: string[];
        };
      }
      
      const response = await api.get(`hotels/suggestions?q=${encodeURIComponent(query)}`) as SuggestionsResponse;
      if (response && response.success) {
        setSearchSuggestions(response.data.suggestions || []);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSearchSuggestions([]);
    }
  };

  // Handle search input with smooth updates
  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    setSearchParams(prev => ({ ...prev, destination: value }));
    debouncedSearch(value);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setSearchParams(prev => ({ ...prev, destination: suggestion }));
    setShowSuggestions(false);
    setSearchSuggestions([]);
    saveToSearchHistory(suggestion);
    
    // Load hotels with the selected suggestion
    loadHotels({
      ...searchParams,
      destination: suggestion
    });
  };

  // Add CSS classes for smooth transitions
  const pageClasses = `min-h-screen bg-gray-50 flex flex-col transition-all duration-300 ${
    isTransitioning ? 'opacity-50' : 'opacity-100'
  }`;

  // Modify error display to be less intrusive
  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {message}
          </p>
        </div>
      </div>
    </div>
  );

  if (loading && !isTransitioning) {
    return (
      <div className={pageClasses}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={pageClasses}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <ErrorDisplay message={error} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={pageClasses}>
      <Header />
      
      <div className="flex-grow">
        {/* Enhanced Interactive Hotel Search Bar */}
        <div className="bg-gradient-to-r from-aerotrav-blue via-aerotrav-blue-700 to-aerotrav-blue-800 py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              {error && <ErrorDisplay message={error} />}
              <div className="flex flex-col lg:flex-row items-center gap-4">
                {/* Destination */}
                <div className="flex-1 min-w-0 group relative">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <MapPin className="h-5 w-5 text-aerotrav-yellow" />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Enter destination or hotel name"
                      value={searchInput}
                      onChange={(e) => handleSearchInputChange(e.target.value)}
                      className="w-full pl-12 pr-4 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/30 focus:bg-white/30 text-lg"
                    />
                  </div>
                </div>

                {/* Check-in Date */}
                <div className="flex-1 min-w-0 group">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <Calendar className="h-5 w-5 text-aerotrav-yellow" />
                    </div>
                    <input
                      type="date"
                      placeholder="Check-in Date"
                      value={searchParams.checkInDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, checkInDate: e.target.value }))}
                      className="w-full pl-12 pr-4 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/30 focus:bg-white/30 text-lg [color-scheme:dark]"
                    />
                    <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Check-in</div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Edit className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Check-out Date */}
                <div className="flex-1 min-w-0 group">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <Calendar className="h-5 w-5 text-aerotrav-yellow" />
                    </div>
                    <input
                      type="date"
                      placeholder="Check-out Date"
                      value={searchParams.checkOutDate}
                      min={searchParams.checkInDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, checkOutDate: e.target.value }))}
                      className="w-full pl-12 pr-4 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/30 focus:bg-white/30 text-lg [color-scheme:dark]"
                    />
                    <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Check-out</div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Edit className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Guests & Rooms */}
                <div className="flex-1 min-w-0 group">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <Users className="h-5 w-5 text-aerotrav-yellow" />
                    </div>
                    <select
                      value={`${searchParams.guests}-${searchParams.rooms}`}
                      onChange={(e) => {
                        const [guests, rooms] = e.target.value.split('-');
                        setSearchParams(prev => ({ 
                          ...prev, 
                          guests: parseInt(guests),
                          rooms: parseInt(rooms)
                        }));
                      }}
                      className="w-full pl-12 pr-4 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/30 focus:bg-white/30 text-lg"
                    >
                      {[1,2,3,4,5,6].map(guests => 
                        [1,2,3].map(rooms => (
                          <option key={`${guests}-${rooms}`} value={`${guests}-${rooms}`} className="bg-aerotrav-blue text-white">
                            {guests} Guest{guests > 1 ? 's' : ''}, {rooms} Room{rooms > 1 ? 's' : ''}
                          </option>
                        ))
                      ).flat()}
                    </select>
                    <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Guests & Rooms</div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Edit className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Enhanced Search Button */}
                <div className="flex-shrink-0">
                  <Button 
                    onClick={handleSearchUpdate}
                    disabled={loading}
                    className="bg-gradient-to-r from-aerotrav-yellow to-yellow-400 hover:from-aerotrav-yellow-500 hover:to-yellow-500 text-aerotrav-blue font-bold px-10 py-5 rounded-2xl h-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-aerotrav-blue rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        {loading ? (
                          <RefreshCw className="w-4 h-4 text-white animate-spin" />
                        ) : (
                          <Search className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-lg">{loading ? 'Searching...' : 'Search'}</span>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Enhanced Quick Actions */}
              <div className="flex flex-col lg:flex-row items-center justify-between mt-6 pt-6 border-t border-white/20 gap-4">
                <div className="flex items-center gap-6 text-sm text-white/90">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Found {filteredAndSortedHotels.length} hotels</span>
                  </div>
                  <span className="text-white/60">•</span>
                  <span className="font-medium">{searchParams.destination || 'All Destinations'}</span>
                  <span className="text-white/60">•</span>
                  <span className="text-aerotrav-yellow font-medium">Best prices guaranteed</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" onClick={handleSearchUpdate} size="sm" className="text-white hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-300">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Search Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{searchParams.destination || 'All Destinations'}</span>
              </div>
              {searchParams.checkInDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{searchParams.checkInDate} - {searchParams.checkOutDate}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{searchParams.guests} guests, {searchParams.rooms} room{searchParams.rooms > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <HotelIcon className="w-4 h-4" />
                <span>{filteredAndSortedHotels.length} hotels found</span>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <div className="w-80 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      <h3 className="font-semibold">Filters</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-aerotrav-blue hover:bg-aerotrav-blue/10"
                    >
                      Reset
                    </Button>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Price per night</h4>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => handleFilterChange({ priceRange: value as [number, number] })}
                      max={1000}
                      min={50}
                      step={10}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Star Rating</h4>
                    <div className="space-y-2">
                      {[0, 3, 4, 5].map((rating) => (
                        <label key={rating} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="starRating"
                            checked={filters.starRating === rating}
                            onChange={() => handleFilterChange({ starRating: rating })}
                            className="text-aerotrav-blue"
                          />
                          <div className="flex items-center gap-1">
                            {rating === 0 ? (
                              <span className="text-sm">Any rating</span>
                            ) : (
                              <>
                                {[...Array(rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="text-sm">& up</span>
                              </>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Property Type</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'All Types' },
                        { value: 'luxury', label: 'Luxury' },
                        { value: 'resort', label: 'Resort' },
                        { value: 'business', label: 'Business' },
                        { value: 'boutique', label: 'Boutique' },
                      ].map((type) => (
                        <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="propertyType"
                            checked={filters.propertyType === type.value}
                            onChange={() => handleFilterChange({ propertyType: type.value })}
                            className="text-aerotrav-blue"
                          />
                          <span className="text-sm">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Amenities</h4>
                    <div className="space-y-2">
                      {amenityOptions.map((amenity) => (
                        <label key={amenity.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity.id)}
                            onChange={(e) => {
                              const newAmenities = e.target.checked
                                ? [...filters.amenities, amenity.id]
                                : filters.amenities.filter(a => a !== amenity.id);
                              handleFilterChange({ amenities: newAmenities });
                            }}
                            className="text-aerotrav-blue"
                          />
                          <amenity.icon className="w-4 h-4" />
                          <span className="text-sm">{amenity.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Guest Rating */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Guest Rating</h4>
                    <div className="space-y-2">
                      {[0, 3.5, 4.0, 4.5].map((rating) => (
                        <label key={rating} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="guestRating"
                            checked={filters.guestRating === rating}
                            onChange={() => handleFilterChange({ guestRating: rating })}
                            className="text-aerotrav-blue"
                          />
                          <span className="text-sm">
                            {rating === 0 ? 'Any rating' : `${rating}+ stars`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Quick Filter Buttons */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Quick Filters</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={filters.propertyType === 'luxury' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange({ propertyType: filters.propertyType === 'luxury' ? 'all' : 'luxury' })}
                        className="text-xs"
                      >
                        🏆 Luxury
                      </Button>
                      <Button
                        variant={filters.starRating === 5 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange({ starRating: filters.starRating === 5 ? 0 : 5 })}
                        className="text-xs"
                      >
                        ⭐ 5 Star
                      </Button>
                      <Button
                        variant={filters.amenities.includes('wifi') ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const newAmenities = filters.amenities.includes('wifi')
                            ? filters.amenities.filter(a => a !== 'wifi')
                            : [...filters.amenities, 'wifi'];
                          handleFilterChange({ amenities: newAmenities });
                        }}
                        className="text-xs"
                      >
                        📶 Free WiFi
                      </Button>
                      <Button
                        variant={filters.amenities.includes('pool') ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const newAmenities = filters.amenities.includes('pool')
                            ? filters.amenities.filter(a => a !== 'pool')
                            : [...filters.amenities, 'pool'];
                          handleFilterChange({ amenities: newAmenities });
                        }}
                        className="text-xs"
                      >
                        🏊 Pool
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Sort Options */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedHotels.length)} of {filteredAndSortedHotels.length} hotels
                  </span>
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-4 h-4" />
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating_high">Rating: High to Low</option>
                      <option value="rating_low">Rating: Low to High</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Hotel Results */}
              <div className="space-y-4">
                {currentHotels.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <HotelIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
                      <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                      <Button onClick={resetFilters}>
                        Reset Filters
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  currentHotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={{
                        id: hotel.id,
                        name: hotel.name,
                        location: hotel.location,
                        stars: Math.round(hotel.rating),
                        rating: hotel.user_rating,
                        reviewCount: Math.floor(Math.random() * 500) + 100, // Mock review count
                        price: hotel.price_per_night,
                        images: hotel.images,
                        perks: hotel.amenities,
                        nights: searchParams.checkInDate && searchParams.checkOutDate 
                          ? Math.ceil((new Date(searchParams.checkOutDate).getTime() - new Date(searchParams.checkInDate).getTime()) / (1000 * 60 * 60 * 24))
                          : 1,
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={page === currentPage ? "bg-aerotrav-blue text-white" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Pagination Info */}
              {totalPages > 1 && (
                <div className="text-center text-sm text-gray-600 mt-4">
                  Page {currentPage} of {totalPages}
                </div>
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