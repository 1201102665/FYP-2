import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceNavigation from "@/components/ServiceNavigation";
import AdventureCard from "@/components/AdventureCard";
import DestinationCard from "@/components/DestinationCard";
import ReviewCard from "@/components/ReviewCard";
import AIRecommendationsSection from "@/components/AIRecommendationsSection";
import { useEffect, useState } from "react";
import { useUserActivityContext } from "@/contexts/UserActivityContext";
import { useAuth } from "@/contexts/AuthContext";
import { Destination } from "@/services/destinationService";
import destinationService from "@/services/destinationService";
import { useToast } from "@/hooks/use-toast";
import { mockDestinations } from "@/services/mockData";
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
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Globe,
  Phone,
  Mail
} from "lucide-react";

const HomePage = () => {
  const { trackView } = useUserActivityContext();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [apiDestinations, setApiDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '1 Guest'
  });

  // Use mock destinations directly for testing
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setApiDestinations(mockDestinations);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    trackView('homepage', 'destination');
  }, [trackView]);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    if (tab !== 'All') {
      const paths = {
        'Flights': '/flights',
        'Hotels': '/hotels',
        'Cars': '/car-rentals',
        'Packages': '/packages'
      };
      navigate(paths[tab as keyof typeof paths]);
    }
  };

  const handleSearch = () => {
    const searchData = {
      destination: searchParams.destination,
      checkInDate: searchParams.checkIn,
      checkOutDate: searchParams.checkOut,
      guests: searchParams.guests
    };

    switch (selectedTab) {
      case 'Flights':
        navigate('/flights', { state: { 
          origin: 'Kuala Lumpur (KUL)', 
          destination: searchParams.destination || 'Da Nang (DAD)',
          departDate: searchParams.checkIn,
          returnDate: searchParams.checkOut,
          passengers: parseInt(searchParams.guests.split(' ')[0])
        }});
        break;
      case 'Hotels':
        navigate('/hotels', { state: searchData });
        break;
      case 'Cars':
        navigate('/car-rentals', { state: {
          pickupLocation: searchParams.destination || 'Kuala Lumpur, Malaysia',
          pickupDate: searchParams.checkIn,
          dropoffDate: searchParams.checkOut
        }});
        break;
      case 'Packages':
        navigate('/packages', { state: { destination: searchParams.destination }});
        break;
      default:
        // For 'All' tab, go to the most relevant page based on destination
        if (searchParams.destination) {
          navigate('/hotels', { state: searchData });
        } else {
          navigate('/packages');
        }
    }
  };

  const handleQuickDestination = (city: string) => {
    setSearchParams(prev => ({ ...prev, destination: city }));
    // Auto-search when clicking quick destination
    setTimeout(() => {
      const searchData = {
        destination: city,
        checkInDate: searchParams.checkIn,
        checkOutDate: searchParams.checkOut,
        guests: searchParams.guests
      };
      navigate('/hotels', { state: searchData });
    }, 100);
  };

  const quickActions = [
    { name: "Flights", icon: Plane, path: "/flights", color: "bg-blue-500", count: "2.5M+ flights" },
    { name: "Hotels", icon: Hotel, path: "/hotels", color: "bg-green-500", count: "1.8M+ hotels" },
    { name: "Cars", icon: Car, path: "/car-rentals", color: "bg-purple-500", count: "50K+ cars" },
    { name: "Packages", icon: Package, path: "/packages", color: "bg-orange-500", count: "15K+ packages" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Your payments and data are protected with bank-level security"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer service for all your travel needs"
    },
    {
      icon: TrendingUp,
      title: "Best Prices",
      description: "We guarantee the best prices with our price match promise"
    },
    {
      icon: CheckCircle,
      title: "Instant Confirmation",
      description: "Get instant booking confirmations and digital tickets"
    }
  ];

  const trendingDestinations = [
    {
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400",
      price: "From $899",
      rating: 4.8,
      badge: "Popular"
    },
    {
      name: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400",
      price: "From $1,299",
      rating: 4.9,
      badge: "Trending"
    },
    {
      name: "Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
      price: "From $1,099",
      rating: 4.7,
      badge: "Hot Deal"
    },
    {
      name: "Dubai, UAE",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400",
      price: "From $799",
      rating: 4.6,
      badge: "New"
    }
  ];

  const stats = [
    { number: "2.5M+", label: "Happy Travelers" },
    { number: "180+", label: "Countries" },
    { number: "15K+", label: "Travel Packages" },
    { number: "4.8★", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section with Enhanced Search */}
        <section className="relative bg-gradient-to-br from-aerotrav-blue via-aerotrav-blue-700 to-aerotrav-blue-800 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative container mx-auto px-4 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Your Next Adventure
                <span className="block text-aerotrav-yellow">Awaits</span>
              </h1>
              <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                Discover amazing destinations, book seamlessly, and create unforgettable memories with AeroTrav's premium travel services.
              </p>

              {/* Enhanced Interactive Search Bar */}
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-6xl mx-auto border border-white/20">
                {/* Search Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {['All', 'Flights', 'Hotels', 'Cars', 'Packages'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabClick(tab)}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        tab === selectedTab 
                          ? 'bg-aerotrav-blue text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {/* Destination Field */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <MapPin className="h-5 w-5 text-aerotrav-blue group-focus-within:text-aerotrav-blue-700 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Where to?"
                      value={searchParams.destination}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-aerotrav-blue focus:ring-4 focus:ring-aerotrav-blue/20 transition-all duration-300 bg-white hover:border-gray-300 text-gray-800 placeholder-gray-500"
                    />
                    <div className="absolute top-1 left-12 text-xs text-gray-400 opacity-0 group-focus-within:opacity-100 transition-opacity">
                      Destination
                    </div>
                  </div>

                  {/* Check-in Date */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <Calendar className="h-5 w-5 text-aerotrav-blue group-focus-within:text-aerotrav-blue-700 transition-colors" />
                    </div>
                    <input
                      type="date"
                      value={searchParams.checkIn}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, checkIn: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-aerotrav-blue focus:ring-4 focus:ring-aerotrav-blue/20 transition-all duration-300 bg-white hover:border-gray-300 text-gray-800"
                    />
                    <div className="absolute top-1 left-12 text-xs text-gray-400 opacity-0 group-focus-within:opacity-100 transition-opacity">
                      Check-in
                    </div>
                  </div>

                  {/* Check-out Date */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <Calendar className="h-5 w-5 text-aerotrav-blue group-focus-within:text-aerotrav-blue-700 transition-colors" />
                    </div>
                    <input
                      type="date"
                      value={searchParams.checkOut}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, checkOut: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-aerotrav-blue focus:ring-4 focus:ring-aerotrav-blue/20 transition-all duration-300 bg-white hover:border-gray-300 text-gray-800"
                    />
                    <div className="absolute top-1 left-12 text-xs text-gray-400 opacity-0 group-focus-within:opacity-100 transition-opacity">
                      Check-out
                    </div>
                  </div>

                  {/* Guests Selector */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <Users className="h-5 w-5 text-aerotrav-blue group-focus-within:text-aerotrav-blue-700 transition-colors" />
                    </div>
                    <select 
                      value={searchParams.guests}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, guests: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-aerotrav-blue focus:ring-4 focus:ring-aerotrav-blue/20 transition-all duration-300 bg-white hover:border-gray-300 text-gray-800 appearance-none cursor-pointer"
                    >
                      <option>1 Guest</option>
                      <option>2 Guests</option>
                      <option>3 Guests</option>
                      <option>4+ Guests</option>
                    </select>
                    <div className="absolute top-1 left-12 text-xs text-gray-400 opacity-0 group-focus-within:opacity-100 transition-opacity">
                      Travelers
                    </div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Advanced Options Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <button className="text-sm text-aerotrav-blue hover:text-aerotrav-blue-700 font-medium flex items-center transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    Advanced Options
                  </button>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>💡 Pro tip: Book 2 months ahead for best deals</span>
                  </div>
                </div>

                {/* Enhanced Search Button */}
                <Button 
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-aerotrav-blue to-aerotrav-blue-700 hover:from-aerotrav-blue-700 hover:to-aerotrav-blue-800 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center">
                    <Search className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    <span>Search {selectedTab === 'All' ? 'All Travel Options' : selectedTab}</span>
                    <div className="ml-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </Button>

                {/* Quick Suggestions */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <span className="text-sm text-gray-500 mr-2">Popular:</span>
                  {['Bali', 'Tokyo', 'Paris', 'New York', 'Dubai'].map((city) => (
                    <button
                      key={city}
                      onClick={() => handleQuickDestination(city)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-aerotrav-blue hover:text-white rounded-full transition-all duration-300 text-gray-600"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What are you looking for?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Choose from our wide range of travel services to create your perfect trip</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.path}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className={`${action.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{action.name}</h3>
                      <p className="text-gray-600 text-sm">{action.count}</p>
                      <ArrowRight className="h-5 w-5 text-gray-400 mx-auto mt-3 group-hover:text-aerotrav-blue transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Destinations */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Destinations</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Discover the hottest travel destinations loved by millions of travelers</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingDestinations.map((destination, index) => (
                <Card 
                  key={index} 
                  onClick={() => navigate('/packages', { state: { destination: destination.name } })}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="relative">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-aerotrav-yellow text-black">
                      {destination.badge}
                    </Badge>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{destination.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{destination.name}</h3>
                    <p className="text-aerotrav-blue font-bold">{destination.price}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Package className="h-4 w-4 mr-1" />
                      <span>View Packages</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose AeroTrav?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">We make travel planning easy, secure, and enjoyable with our premium services</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-aerotrav-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-aerotrav-blue group-hover:text-white transition-all">
                    <feature.icon className="h-8 w-8 text-aerotrav-blue group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-aerotrav-blue">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Recommendations */}
        {isAuthenticated && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <AIRecommendationsSection />
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-aerotrav-blue to-aerotrav-blue-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join millions of travelers who trust AeroTrav for their perfect trips
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-aerotrav-yellow hover:bg-aerotrav-yellow-500 text-black font-semibold px-8 py-3">
                <Link to="/signup">Get Started Today</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-aerotrav-blue px-8 py-3">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;