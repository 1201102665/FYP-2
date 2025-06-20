import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FlightCard from '@/components/FlightCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Breadcrumb from '@/components/Breadcrumb';
import { getAllFlights, searchFlights, browseFlights } from '@/services/flightService';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plane, 
  Filter, 
  SortAsc, 
  Clock,
  Fuel,
  Wifi,
  Coffee,
  Shield,
  RefreshCw,
  Edit,
  ArrowUpDown,
  Search
} from 'lucide-react';

const FlightResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [filters, setFilters] = useState({
    directOnly: false,
    maxPrice: 1000,
    airline: 'all',
    departureTime: 'all',
    duration: 'all',
    stops: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 8,
    total_results: 0,
    total_pages: 0,
    has_more: false
  });

  // Get search parameters from location state or set defaults (empty for browse mode)
  const initialSearchParams = location.state || {
    origin: '',
    destination: '',
    departDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    passengers: 1,
    class: 'Economy'
  };

  // Create editable search parameters state
  const [searchParams, setSearchParams] = useState(initialSearchParams);

  // Fetch flights from Amadeus API
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    const fetchFlights = async () => {
      try {
        if (!isMounted) return;
        setIsLoading(true);
        setError(null);
        
        // Reset to page 1 if search parameters changed (not just page change)
        // Check if we have specific search criteria
        const hasSearchCriteria = searchParams.origin && searchParams.destination;
        if (hasSearchCriteria && currentPage === 1) {
          // Search mode, ensure we start from page 1
        }
        
        console.log('Flight search mode:', { 
          hasSearchCriteria, 
          origin: searchParams.origin, 
          destination: searchParams.destination 
        });
        
        let flightResults = [];
        
        if (!hasSearchCriteria) {
          // Browse mode - show all available flights from popular routes
          console.log('Browse mode: Loading flights from popular routes...');
          try {
            const browseResult = await browseFlights(currentPage, 8);
            flightResults = browseResult.flights;
            setPagination(browseResult.pagination);
            console.log('Browse mode: Loaded', flightResults.length, 'flights, Page:', currentPage);
          } catch (error) {
            console.error('Browse mode failed:', error);
            setError('Failed to load available flights. Please try searching for a specific route.');
            return;
          }
        } else {
          // Search mode - specific route search
          const extractAirportCode = (input) => {
            if (!input) return '';
            // First try to extract code from parentheses like "Singapore (SIN)"
            const match = input.match(/\(([^)]+)\)/);
            if (match) return match[1];
            
            // If no parentheses, try to match common airport codes
            const upperInput = input.toUpperCase();
            if (upperInput.includes('SINGAPORE') || upperInput.includes('SIN')) return 'SIN';
            if (upperInput.includes('KUALA LUMPUR') || upperInput.includes('KUL')) return 'KUL';
            if (upperInput.includes('DA NANG') || upperInput.includes('DAD')) return 'DAD';
            if (upperInput.includes('BANGKOK') || upperInput.includes('BKK')) return 'BKK';
            if (upperInput.includes('HANOI') || upperInput.includes('HAN')) return 'HAN';
            if (upperInput.includes('HO CHI MINH') || upperInput.includes('SGN')) return 'SGN';
            
            // If it's already a 3-letter code, use it
            if (/^[A-Z]{3}$/.test(upperInput)) return upperInput;
            
            return upperInput;
          };
          
          const originCode = extractAirportCode(searchParams.origin);
          const destinationCode = extractAirportCode(searchParams.destination);
          
          console.log('Search mode: Extracted codes:', { originCode, destinationCode });
          
          const searchQuery = {
            origin: originCode,
            destination: destinationCode,
            departure_date: searchParams.departDate || new Date().toISOString().split('T')[0],
            passengers: searchParams.passengers || 1,
            limit: 20
          };
          
          console.log('Search mode: Searching flights with params:', searchQuery);
          
          try {
            flightResults = await searchFlights(searchQuery);
            console.log('Search mode: Found', flightResults.length, 'flights');
          } catch (error) {
            console.error('Search failed:', error);
            setError(error.message || 'Failed to search flights. Please try again.');
            return;
          }
                }
        
        if (!isMounted) return; // Check again before setting state
        
        // Transform Amadeus data to match our component's expected format
        const transformedFlights = flightResults.map((flight, index) => ({
          id: flight.id || index,
          airline: flight.airline,
          logo: flight.airline_logo || `https://images.kiwi.com/airlines/32/${flight.airline_code}.png`,
          flightNumber: flight.flight_number,
          departureTime: new Date(flight.departure_time).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          }),
          arrivalTime: new Date(flight.arrival_time).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          }),
          duration: flight.duration || 'N/A',
          departureAirport: flight.origin_airport || `${flight.origin} (${flight.origin_code || flight.origin})`,
          arrivalAirport: flight.destination_airport || `${flight.destination} (${flight.destination_code || flight.destination})`,
          departureCity: flight.origin,
          arrivalCity: flight.destination,
          direct: flight.stops === 0,
          stops: flight.stops || 0,
          price: flight.price || Math.floor(Math.random() * 500) + 200,
          currency: flight.currency || 'EUR',
          baggage: '7kg carry-on',
          amenities: flight.amenities || ['Entertainment'],
          aircraft: flight.aircraft_type || 'N/A',
          carbonEmission: 'Low',
          refundable: false,
          timeCategory: getTimeCategory(flight.departure_time),
          status: flight.status || 'scheduled'
        }));
        
        console.log('Transformed flights:', transformedFlights.length);
        
        if (isMounted) {
          setFlights(transformedFlights);
          console.log('Flights set to state:', transformedFlights.length);
          // Clear error if flights were successfully loaded
          if (transformedFlights.length > 0) {
            setError(null);
          }
        }
      } catch (err) {
        console.error('Error fetching flights:', err);
        if (isMounted) {
          setError(err.message || 'Failed to fetch flights');
          setFlights([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Fetch flights when search parameters change
    fetchFlights();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [currentPage]); // Only re-run when page changes, not when search params change

  // Helper function to categorize time
  const getTimeCategory = (timeString) => {
    if (!timeString) return 'morning';
    const hour = new Date(timeString).getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  // Apply filters and sorting to real flight data
  const filteredAndSortedFlights = React.useMemo(() => {
    let filtered = flights.filter((flight) => {
      if (filters.directOnly && !flight.direct) return false;
      if (flight.price > filters.maxPrice) return false;
      if (filters.airline !== 'all' && flight.airline !== filters.airline) return false;
      if (filters.departureTime !== 'all' && flight.timeCategory !== filters.departureTime) return false;
      if (filters.stops !== 'all') {
        if (filters.stops === 'direct' && flight.stops > 0) return false;
        if (filters.stops === '1+' && flight.stops === 0) return false;
      }
      return true;
    });

    // Sort flights
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        case 'arrival':
          return a.arrivalTime.localeCompare(b.arrivalTime);
        default:
          return 0;
      }
    });

    return filtered;
  }, [flights, filters, sortBy]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSearch = () => {
    navigate('/', { state: { searchParams } });
  };

  // Removed auto-reset of page when search criteria changes to prevent automatic API calls

  const handleRefreshSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentPage(1); // Reset to page 1 when doing a new search
      
      // Extract airport codes from search params using the same logic
      const extractAirportCode = (input) => {
        const match = input.match(/\(([^)]+)\)/);
        if (match) return match[1];
        
        const upperInput = input.toUpperCase();
        if (upperInput.includes('SINGAPORE') || upperInput.includes('SIN')) return 'SIN';
        if (upperInput.includes('KUALA LUMPUR') || upperInput.includes('KUL')) return 'KUL';
        if (upperInput.includes('DA NANG') || upperInput.includes('DAD')) return 'DAD';
        if (upperInput.includes('BANGKOK') || upperInput.includes('BKK')) return 'BKK';
        if (upperInput.includes('HANOI') || upperInput.includes('HAN')) return 'HAN';
        if (upperInput.includes('HO CHI MINH') || upperInput.includes('SGN')) return 'SGN';
        
        if (/^[A-Z]{3}$/.test(upperInput)) return upperInput;
        return 'KUL';
      };
      
      const originCode = extractAirportCode(searchParams.origin);
      const destinationCode = extractAirportCode(searchParams.destination);
      
      const searchQuery = {
        origin: originCode,
        destination: destinationCode,
        departure_date: searchParams.departDate,
        passengers: searchParams.passengers,
        limit: 10
      };
      
      console.log('Refreshing flights with params:', searchQuery);
      
      // Use the same direct API call as in useEffect
      console.log('Making refresh API request to: /api/flights/search');
      
      const directResponse = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          origin: searchQuery.origin,
          destination: searchQuery.destination,
          departure_date: searchQuery.departure_date,
          passengers: searchQuery.passengers || 1,
          limit: searchQuery.limit
        })
      });
      console.log('Refresh API response status:', directResponse.status, directResponse.statusText);
      
      if (!directResponse.ok) {
        const errorText = await directResponse.text();
        console.error('Refresh API error response:', errorText);
        throw new Error(`API returned ${directResponse.status}: ${directResponse.statusText}`);
      }
      
      const responseText = await directResponse.text();
      console.log('Raw refresh API response:', responseText);
      
      let apiData;
      try {
        apiData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse refresh JSON response:', parseError);
        throw new Error('Invalid JSON response from API');
      }
      
      console.log('Parsed refresh API response:', apiData);
      
      if (!apiData.success) {
        throw new Error(apiData.message || 'API returned error');
      }
      
      const flightResults = apiData.flights || apiData.data || [];
      console.log('Refresh flight results received:', flightResults?.length || 0, 'flights');
      
      // Transform data same as in useEffect
      const transformedFlights = flightResults.map((flight, index) => ({
        id: flight.id || index,
        airline: flight.airline,
        logo: flight.airline_logo || '/placeholder.svg',
        flightNumber: flight.flight_number,
        departureTime: new Date(flight.departure_time).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        }),
        arrivalTime: new Date(flight.arrival_time).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        }),
        duration: flight.duration ? `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m` : 'N/A',
        departureAirport: `${flight.origin} (${flight.origin_code})`,
        arrivalAirport: `${flight.destination} (${flight.destination_code})`,
        departureCity: flight.origin,
        arrivalCity: flight.destination,
        direct: true,
        stops: 0,
        price: flight.price || Math.floor(Math.random() * 500) + 200,
        currency: 'MYR',
        baggage: '7kg carry-on',
        amenities: ['Entertainment'],
        aircraft: flight.aircraft || 'N/A',
        carbonEmission: 'Low',
        refundable: false,
        timeCategory: getTimeCategory(flight.departure_time),
        status: flight.status
      }));
      
      setFlights(transformedFlights);
      // Clear error if flights were successfully loaded
      if (transformedFlights.length > 0) {
        setError(null);
      }
    } catch (err) {
      console.error('Error refreshing flights:', err);
      setError(err.message || 'Failed to refresh flights');
    } finally {
      setIsLoading(false);
    }
  };

  const airlines = [...new Set(flights.map(flight => flight.airline))];

  const breadcrumbItems = [
    { label: 'Flights', href: '/flights' },
    { label: 'Search Results', active: true }
  ];

  // Format dates for display
  const formattedDepartDate = new Date(searchParams.departDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const formattedReturnDate = searchParams.returnDate ? 
    new Date(searchParams.returnDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <LoadingSpinner size="lg" text="Searching for the best flights..." />
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

      {/* Enhanced Interactive Flight Search Bar */}
      <div className="bg-gradient-to-r from-aerotrav-blue via-aerotrav-blue-700 to-aerotrav-blue-800 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            {/* Trip Type Selector */}
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 rounded-full p-1 flex">
                {['Round Trip', 'One Way', 'Multi City'].map((type) => (
                  <button
                    key={type}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      type === 'Round Trip' 
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
              {/* Leaving From */}
              <div className="flex-1 min-w-0 group">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-3 h-3 bg-aerotrav-yellow rounded-full animate-pulse"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Leaving from (e.g., Kuala Lumpur (KUL))"
                    value={searchParams.origin}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, origin: e.target.value }))}
                    className="w-full pl-12 pr-4 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/30 focus:bg-white/30 text-lg"
                  />
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Leaving from</div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Edit className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Enhanced Swap Button */}
              <div className="flex-shrink-0">
                <button className="p-3 bg-aerotrav-yellow rounded-full hover:bg-aerotrav-yellow-500 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                  <ArrowUpDown className="h-5 w-5 text-aerotrav-blue" />
                </button>
              </div>

              {/* Going To */}
              <div className="flex-1 min-w-0 group">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-3 h-3 bg-aerotrav-yellow rounded-full animate-pulse"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Going to (e.g., Da Nang (DAD))"
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
                    className="w-full pl-12 pr-4 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/30 focus:bg-white/30 text-lg"
                  />
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Going to</div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Edit className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
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
                    type="date"
                    placeholder="Date"
                    value={searchParams.departDate}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, departDate: e.target.value }))}
                    className="w-full pl-12 pr-4 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/30 focus:bg-white/30 text-lg [color-scheme:dark]"
                  />
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Date</div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Edit className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Enhanced Travellers */}
              <div className="flex-1 min-w-0 group">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Users className="h-5 w-5 text-aerotrav-yellow" />
                  </div>
                  <select
                    value={searchParams.passengers || 1}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                    className="w-full pl-12 pr-4 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 hover:bg-white/30 focus:bg-white/30 text-lg"
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num} className="bg-aerotrav-blue text-white">
                        {num} Adult{num > 1 ? 's' : ''} - Economy
                      </option>
                    ))}
                  </select>
                  <div className="absolute top-2 left-12 text-xs text-white/60 font-medium">Travellers</div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Edit className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>

              {/* Enhanced Search Button */}
              <div className="flex-shrink-0">
                <Button 
                  onClick={handleRefreshSearch}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-aerotrav-yellow to-yellow-400 hover:from-aerotrav-yellow-500 hover:to-yellow-500 text-aerotrav-blue font-bold px-10 py-5 rounded-2xl h-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-aerotrav-blue rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Search className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-lg">{isLoading ? 'Searching...' : 'Search'}</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="flex flex-col lg:flex-row items-center justify-between mt-6 pt-6 border-t border-white/20 gap-4">
              <div className="flex items-center gap-6 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Found {filteredAndSortedFlights.length} flights</span>
                </div>
                <span className="text-white/60">•</span>
                <span className="font-medium">{searchParams.origin.split('(')[0].trim()} → {searchParams.destination.split('(')[0].trim()}</span>
                <span className="text-white/60">•</span>
                <span className="text-aerotrav-yellow font-medium">Best prices guaranteed</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={handleRefreshSearch} size="sm" className="text-white hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-300">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
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
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setFilters({
                      directOnly: false,
                      maxPrice: 1000,
                      airline: 'all',
                      departureTime: 'all',
                      duration: 'all',
                      stops: 'all'
                    })}
                  >
                    Reset
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Price Range: MYR {filters.maxPrice}
                    </label>
                    <Slider
                      value={[filters.maxPrice]}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value[0] }))}
                      max={2000}
                      min={200}
                      step={50}
                      className="w-full"
                    />
                  </div>

                  {/* Stops */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Stops</label>
                    <select 
                      name="stops" 
                      value={filters.stops} 
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aerotrav-blue focus:border-transparent"
                    >
                      <option value="all">All flights</option>
                      <option value="direct">Direct flights only</option>
                      <option value="1+">1+ stops</option>
                    </select>
                  </div>

                  {/* Airline */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Airline</label>
                    <select 
                      name="airline" 
                      value={filters.airline} 
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aerotrav-blue focus:border-transparent"
                    >
                      <option value="all">All airlines</option>
                      {airlines.map(airline => (
                        <option key={airline} value={airline}>{airline}</option>
                      ))}
                    </select>
                  </div>

                  {/* Departure Time */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Departure Time</label>
                    <select 
                      name="departureTime" 
                      value={filters.departureTime} 
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-aerotrav-blue focus:border-transparent"
                    >
                      <option value="all">Any time</option>
                      <option value="morning">Morning (6AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 6PM)</option>
                      <option value="evening">Evening (6PM - 12AM)</option>
                    </select>
                  </div>

                  {/* Direct Only Checkbox */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="directOnly"
                        checked={filters.directOnly}
                        onChange={handleFilterChange}
                        className="mr-2 rounded"
                      />
                      <span className="text-sm">Direct flights only</span>
                    </label>
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
                  {filteredAndSortedFlights.length} flights found
                  {pagination.total_results > 0 && ` (${pagination.total_results} total)`}
                </span>
                <Badge variant="outline" className="text-xs">
                  {!searchParams.origin && !searchParams.destination ? 'Browse all flights' : 'Best deals highlighted'}
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
                  <option value="duration">Duration (Shortest)</option>
                  <option value="departure">Departure Time</option>
                  <option value="arrival">Arrival Time</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Card className="p-6 bg-red-50 border-red-200 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Plane className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error loading flights</h3>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefreshSearch}
                    className="ml-auto border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Try Again
                  </Button>
                </div>
              </Card>
            )}

            {/* Flight Cards */}
            <div className="space-y-4">
              {!error && filteredAndSortedFlights.length === 0 ? (
                <Card className="p-8 text-center">
                  <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No flights found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                  <Button onClick={() => setFilters({
                    directOnly: false,
                    maxPrice: 1000,
                    airline: 'all',
                    departureTime: 'all',
                    duration: 'all',
                    stops: 'all'
                  })}>
                    Reset Filters
                  </Button>
                </Card>
              ) : (
                filteredAndSortedFlights.map((flight, index) => (
                  <FlightCard
                    key={flight.id}
                    id={flight.id}
                    airline={flight.airline}
                    logo={flight.logo}
                    departureTime={flight.departureTime}
                    arrivalTime={flight.arrivalTime}
                    duration={flight.duration}
                    departureAirport={flight.departureAirport}
                    arrivalAirport={flight.arrivalAirport}
                    direct={flight.direct}
                    price={flight.price}
                    currency={flight.currency}
                  />
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {pagination.total_pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
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
                  onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
                  disabled={currentPage === pagination.total_pages}
                >
                  Next
                </Button>
                
                <div className="ml-4 text-sm text-gray-600">
                  Page {pagination.current_page} of {pagination.total_pages} 
                  ({pagination.total_results} total flights)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FlightResultsPage;