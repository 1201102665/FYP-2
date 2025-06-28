import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import type { CarFiltersProps } from "@/components/CarFilters";
import CartModal from "@/components/CartModal";
import CarReservationSection from "@/components/CarReservationSection";
import CarReviews from "@/components/CarReviews";
import LoadingSpinner from "@/components/LoadingSpinner";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Car,
  CarReview,
  CarReservation,
  CarSearchParams
} from "@/services/carService";
import { getCars, searchCars as searchCarsService, getCarReservations, getCarReviews, getCarSuggestions, getAllCarCategories, getAllCarSeats, getAllCarRates } from "@/services/carService";
import { useUserActivityContext } from "@/contexts/UserActivityContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  MapPin,
  Users,
  Car as CarIcon,
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
  Edit,
  Info,
  DollarSign,
  Globe
} from "lucide-react";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

const CarRentalPage = () => {
  const { trackSearch, trackBooking } = useUserActivityContext();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for search and filters
  const [searchParams, setSearchParams] = useState({
    pickup_location: '',
    dropoff_location: '',
    pickup_date: '',
    dropoff_date: ''
  });

  const [filters, setFilters] = useState<CarFiltersProps['filters']>({
    priceRange: [50, 500],
    category: '',
    transmission: '',
    features: [],
    supplier: ''
  });

  const [showCartModal, setShowCartModal] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState<CarReview[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_results: 0,
    total_pages: 1,
    has_next_page: false,
    has_prev_page: false
  });

  const [brandInput, setBrandInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [seatsInput, setSeatsInput] = useState('');
  const [rateInput, setRateInput] = useState('');
  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [seatsOptions, setSeatsOptions] = useState<string[]>([]);
  const [rateOptions, setRateOptions] = useState<string[]>([]);

  // Load initial cars
  useEffect(() => {
    const loadInitialCars = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getCars(1, 10);
        if (result.success && result.data) {
          setCars(result.data.cars);
          setPagination(result.data.pagination);
        } else {
          setError('Failed to load cars');
        }
      } catch (err) {
        console.error('Failed to load initial cars:', err);
        setError('Failed to load cars');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialCars();
  }, []);

  // Add useEffect to fetch cars when currentPage, filters, searchParams, or sortBy changes
  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let result;
        // If there is a search or filters, use searchCarsService
        if (
          searchParams.pickup_location ||
          filters.category ||
          filters.transmission ||
          (filters.features && filters.features.length > 0)
        ) {
          result = await searchCarsService({
            pickup_location: searchParams.pickup_location,
            sort_by: sortBy,
            category: filters.category === 'all' ? '' : filters.category,
            transmission: filters.transmission === 'all' ? '' : filters.transmission,
            min_price: filters.priceRange[0],
            max_price: filters.priceRange[1],
            features: filters.features,
            page: currentPage,
            per_page: pagination.per_page
          });
        } else {
          result = await getCars(currentPage, pagination.per_page);
        }
        if (result.success && result.data) {
          setCars(result.data.cars);
          setPagination(result.data.pagination);
        } else {
          setError('Failed to load cars');
        }
      } catch (err) {
        setError('Failed to load cars');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters, searchParams.pickup_location, sortBy]);

  // Handle filter change
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilters({
      priceRange: [50, 500],
      category: '',
      transmission: '',
      features: [],
      supplier: ''
    });
    setCurrentPage(1);
    handleMultiFieldSearch();
  };

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchTerm: string) => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await searchCarsService({
            pickup_location: searchTerm,
            sort_by: sortBy,
            category: filters.category === 'all' ? '' : filters.category,
            transmission: filters.transmission === 'all' ? '' : filters.transmission,
            min_price: filters.priceRange[0],
            max_price: filters.priceRange[1],
            features: filters.features,
            page: 1,
            per_page: 10
          });

          if (result.success && result.data) {
            setCars(result.data.cars);
            setPagination(result.data.pagination);
          } else {
            setError('Failed to search cars');
          }
        } catch (err) {
          console.error('Search error:', err);
          setError('Failed to search cars');
        } finally {
          setIsLoading(false);
        }
      }, 300),
    [sortBy, filters]
  );

  useEffect(() => {
    // Fetch all dropdown options on mount
    getCarSuggestions('make', '').then(setBrandOptions);
    getAllCarCategories().then(setCategoryOptions);
    getAllCarSeats().then(setSeatsOptions);
    getAllCarRates().then(setRateOptions);
  }, []);

  // Load initial state from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const initialSearchParams = {
      pickup_location: queryParams.get('pickup_location') || '',
      dropoff_location: queryParams.get('dropoff_location') || '',
      pickup_date: queryParams.get('pickup_date') || '',
      dropoff_date: queryParams.get('dropoff_date') || ''
    };

    const initialFilters = {
      ...filters,
      category: queryParams.get('category') || 'all',
      transmission: queryParams.get('transmission') || 'all'
    };

    const initialSort = queryParams.get('sort') || 'recommended';
    const initialPage = parseInt(queryParams.get('page') || '1');

    setSearchParams(initialSearchParams);
    setFilters(initialFilters);
    setSortBy(initialSort);
    setCurrentPage(initialPage);
  }, []);

  // Enhanced search with Enter key support
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMultiFieldSearch();
    }
  };

  // Handle car booking
  const handleBookCar = async (carId: number) => {
    const selectedCar = cars.find((car) => car.id === carId);

    if (selectedCar) {
      trackBooking(carId.toString(), 'car', selectedCar.location_city);
    }

    if (isAuthenticated) {
      navigate(`/car-booking/${carId}`, {
        state: {
          car: selectedCar,
          searchParams
        }
      });
    } else {
      navigate('/login', {
        state: {
          from: `/car-booking/${carId}`,
          searchParams
        }
      });
    }
  };

  // Handle view car details
  const handleViewCarDetails = (carId: number) => {
    const selectedCar = cars.find((car) => car.id === carId);
    if (selectedCar) {
      navigate(`/car-details/${carId}`, {
        state: {
          car: selectedCar,
          searchParams
        }
      });
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Car Rental', href: '/cars' },
    ...(searchParams.pickup_location ? [{ label: searchParams.pickup_location }] : [])
  ];

  const carTypeOptions = ['Economy', 'Compact', 'SUV', 'Luxury', 'Van'];
  const featureOptions = ['AC', 'GPS', 'Bluetooth', 'Leather Seats', 'Backup Camera', 'Parking Sensors'];
  const supplierOptions = ['all', 'Budget', 'Hertz', 'Avis', 'Enterprise', 'Thrifty', 'Mayflower'];

  const handleMultiFieldSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await searchCarsService({
        make: brandInput,
        category: categoryInput,
        seats: seatsInput,
        max_price: rateInput ? Number(rateInput) : undefined,
        page: 1,
        per_page: pagination.per_page
      });
      if (result.success && result.data) {
        setCars(result.data.cars);
        setPagination(result.data.pagination);
        setCurrentPage(1);
      } else {
        setError('Failed to search cars');
      }
    } catch (err) {
      setError('Failed to search cars');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && cars.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="lg" text="Finding the perfect car for your journey..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Car Search Bar - Hotel Style UI */}
      <div className="bg-gradient-to-r from-aerotrav-blue via-aerotrav-blue-700 to-aerotrav-blue-800 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <form onSubmit={handleMultiFieldSearch}>
              <div className="flex flex-col lg:flex-row items-center gap-4">
                {/* Car brand name */}
                <div className="flex-1 min-w-0 group relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                    <CarIcon className="h-5 w-5 text-aerotrav-yellow" />
                  </div>
                  <select
                    aria-label="Car brand name"
                    value={brandInput}
                    onChange={e => setBrandInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 bg-white/80 border-2 border-white/40 rounded-2xl text-blue-900 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 text-lg appearance-none"
                  >
                    <option value="">Car brand name</option>
                    {brandOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                {/* Category */}
                <div className="flex-1 min-w-0 group relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                    <Globe className="h-5 w-5 text-aerotrav-yellow" />
                  </div>
                  <select
                    aria-label="Category"
                    value={categoryInput}
                    onChange={e => setCategoryInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 bg-white/80 border-2 border-white/40 rounded-2xl text-blue-900 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 text-lg appearance-none"
                  >
                    <option value="">Category</option>
                    {categoryOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                {/* Seats */}
                <div className="flex-1 min-w-0 group relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                    <MapPin className="h-5 w-5 text-aerotrav-yellow" />
                  </div>
                  <select
                    aria-label="Seats"
                    value={seatsInput}
                    onChange={e => setSeatsInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 bg-white/80 border-2 border-white/40 rounded-2xl text-blue-900 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 text-lg appearance-none"
                  >
                    <option value="">Seats</option>
                    {seatsOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                {/* Max Daily Rate */}
                <div className="flex-1 min-w-0 group relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                    <DollarSign className="h-5 w-5 text-aerotrav-yellow" />
                  </div>
                  <select
                    aria-label="Max Daily Rate"
                    value={rateInput}
                    onChange={e => setRateInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 bg-white/80 border-2 border-white/40 rounded-2xl text-blue-900 focus:outline-none focus:ring-4 focus:ring-aerotrav-yellow/50 focus:border-aerotrav-yellow transition-all duration-300 text-lg appearance-none"
                  >
                    <option value="">Max Daily Rate</option>
                    {rateOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                {/* Search Button */}
                <div className="flex-shrink-0">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-aerotrav-yellow to-yellow-400 hover:from-aerotrav-yellow-500 hover:to-yellow-500 text-aerotrav-blue font-bold px-10 py-5 rounded-2xl h-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-aerotrav-blue rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <Search className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-lg">Search</span>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <CarFilters
              onFilterChange={handleFilterChange}
              filters={filters}
            />
          </div>

          {/* Cars List Section */}
          <div className="lg:col-span-3">
            {/* Sort and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-600">
                  {pagination.total_results} cars found
                  {searchParams.pickup_location && (
                    <span className="ml-2 text-aerotrav-blue font-medium">
                      for "{searchParams.pickup_location}"
                    </span>
                  )}
                </p>
                {searchParams.pickup_location && (
                  <button
                    onClick={() => {
                      setSearchParams(prev => ({ ...prev, pickup_location: '' }));
                      setCurrentPage(1);
                    }}
                    className="text-sm text-gray-500 hover:text-aerotrav-blue mt-1"
                  >
                    Clear search
                  </button>
                )}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-aerotrav-blue focus:outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Cars List */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg">
                No cars found matching your criteria. Try adjusting your filters.
              </div>
            ) : (
              <div className="space-y-6">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {cars.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
                    disabled={currentPage === pagination.total_pages}
                  >
                    Next
                  </Button>
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

export default CarRentalPage;