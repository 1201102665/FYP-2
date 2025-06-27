import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PackageDetails from '@/components/PackageDetails';
import AddToCartButton from '@/components/AddToCartButton';
import { useToast } from '@/hooks/use-toast';
import { getPackageById } from '@/services/packageService';
import ReviewsSection from '@/components/ReviewsSection';

const PackageDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string; }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [packageData, setPackageData] = useState<{
    id: number;
    name: string;
    description?: string;
    destination?: string;
    destination_city?: string;
    duration_days?: number;
    base_price?: number;
    price?: number;
    featured?: boolean;
    images?: string[];
    imageUrls?: string[];
    includes?: string[];
    excludes?: string[];
    highlights?: string[];
    itinerary?: Array<{
      day?: number;
      title?: string;
      description?: string;
      activities?: string[];
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getPackageById(id)
      .then(data => {
        setPackageData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Package not found');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><span>Loading...</span></div>;
  }
  if (error || !packageData) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error || 'Package not found'}</div>;
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === packageData.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? packageData.imageUrls.length - 1 : prev - 1
    );
  };

  // Map backend fields to component expectations with fallbacks
  const displayData = {
    id: packageData.id,
    title: packageData.name || 'Package Name',
    description: packageData.description || 'No description available',
    destination: packageData.destination || 'Unknown destination',
    duration: `${packageData.duration_days || 0} days`,
    price: packageData.base_price || packageData.price || 0,
    rating: 4.5 + Math.random() * 0.5, // Generate random rating for now
    discount: packageData.featured ? 15 : 0, // Add discount for featured packages
    imageUrls: packageData.images && packageData.images.length > 0
      ? packageData.images
      : ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'],
    flightIncluded: packageData.includes ? packageData.includes.some(item => item.toLowerCase().includes('flight')) : true,
    hotelIncluded: packageData.includes ? packageData.includes.some(item => item.toLowerCase().includes('accommodation') || item.toLowerCase().includes('hotel')) : true,
    carIncluded: packageData.includes ? packageData.includes.some(item => item.toLowerCase().includes('car') || item.toLowerCase().includes('transfer')) : false,
    // Ensure itinerary is in the correct format
    itinerary: packageData.itinerary && Array.isArray(packageData.itinerary) && packageData.itinerary.length > 0
      ? packageData.itinerary.map((day, index) => ({
        day: day.day || index + 1,
        title: day.title || `Day ${index + 1}`,
        description: day.description || 'Explore and enjoy the destination',
        activities: Array.isArray(day.activities) ? day.activities : ['Sightseeing', 'Local experiences']
      }))
      : [
        {
          day: 1,
          title: 'Arrival Day',
          description: 'Arrive at your destination and settle in',
          activities: ['Airport pickup', 'Hotel check-in', 'Welcome orientation']
        },
        {
          day: 2,
          title: 'Exploration Day',
          description: 'Discover the highlights of your destination',
          activities: ['City tour', 'Local attractions', 'Cultural experiences']
        }
      ],
    highlights: packageData.highlights || [],
    includes: packageData.includes && Array.isArray(packageData.includes)
      ? packageData.includes
      : ['Accommodation', 'Airport transfers', 'Tour guide'],
    excludes: packageData.excludes && Array.isArray(packageData.excludes)
      ? packageData.excludes
      : ['International flights', 'Travel insurance', 'Personal expenses'],
    // Mock data for components that expect specific structures
    flightDetails: {
      airline: 'Premium Airlines',
      departure: 'Your City',
      arrival: packageData.destination_city || 'Destination'
    },
    hotelDetails: {
      name: 'Premium Hotel',
      roomType: 'Deluxe Room',
      location: packageData.destination || 'Prime Location',
      boardType: 'Half Board',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service']
    },
    carDetails: {
      brand: 'Premium',
      model: 'Sedan',
      type: 'Economy'
    },
    // Add dates for booking form
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + (packageData.duration_days || 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };

  // Map backend fields to PackageDetails props
  const mappedPackageDetails = {
    title: displayData.title,
    description: displayData.description,
    destination: displayData.destination,
    duration: displayData.duration,
    itinerary: displayData.itinerary,
    flightDetails: {
      ...displayData.flightDetails,
      flightNumber: 'PR001',
      departureTime: '08:00',
      arrivalTime: '12:00',
      class: 'Economy'
    },
    hotelDetails: {
      ...displayData.hotelDetails,
      rating: 5
    },
    carDetails: {
      ...displayData.carDetails,
      pickupLocation: 'Airport',
      dropoffLocation: 'Hotel'
    },
    includedServices: displayData.includes,
    excludedServices: displayData.excludes
  };

  return (
    <div className="flex flex-col min-h-screen" data-id="xmq7kalu4" data-path="src/pages/PackageDetailsPage.tsx">
      <Header data-id="65zy7awzz" data-path="src/pages/PackageDetailsPage.tsx" />

      <main className="flex-grow" data-id="ffx4jb9wx" data-path="src/pages/PackageDetailsPage.tsx">
        {/* Image Gallery */}
        <section className="relative" data-id="v05r1jsl3" data-path="src/pages/PackageDetailsPage.tsx">
          <div className="h-[300px] md:h-[500px] overflow-hidden" data-id="734m8bnps" data-path="src/pages/PackageDetailsPage.tsx">
            <img
              src={displayData.imageUrls[currentImageIndex]}
              alt={displayData.title}
              className="w-full h-full object-cover" data-id="eqntl6uqb" data-path="src/pages/PackageDetailsPage.tsx" />


            <div className="absolute inset-0 bg-black/30 flex items-center justify-between px-4" data-id="emdtvmmpy" data-path="src/pages/PackageDetailsPage.tsx">
              <Button
                variant="ghost"
                className="text-white rounded-full p-2 hover:bg-black/20"
                onClick={handlePrevImage} data-id="wt9c9doyq" data-path="src/pages/PackageDetailsPage.tsx">

                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-id="djc9jo4pn" data-path="src/pages/PackageDetailsPage.tsx">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" data-id="6p567szix" data-path="src/pages/PackageDetailsPage.tsx" />
                </svg>
              </Button>

              <Button
                variant="ghost"
                className="text-white rounded-full p-2 hover:bg-black/20"
                onClick={handleNextImage} data-id="znmxo1yt9" data-path="src/pages/PackageDetailsPage.tsx">

                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-id="ys7n0uc2k" data-path="src/pages/PackageDetailsPage.tsx">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" data-id="h852yrwuc" data-path="src/pages/PackageDetailsPage.tsx" />
                </svg>
              </Button>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2" data-id="fxli1gm0v" data-path="src/pages/PackageDetailsPage.tsx">
              {displayData.imageUrls.map((_, index) =>
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`
                  }
                  onClick={() => setCurrentImageIndex(index)} data-id="sd2s381p7" data-path="src/pages/PackageDetailsPage.tsx" />

              )}
            </div>
          </div>
        </section>

        <section className="container mx-auto py-8 px-4" data-id="anef0ml0j" data-path="src/pages/PackageDetailsPage.tsx">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-id="t0mhm7wyw" data-path="src/pages/PackageDetailsPage.tsx">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8" data-id="ek4bhxbfp" data-path="src/pages/PackageDetailsPage.tsx">
              <div className="flex flex-col md:flex-row md:items-center justify-between" data-id="n0a0bpw2u" data-path="src/pages/PackageDetailsPage.tsx">
                <div data-id="xxab8aup6" data-path="src/pages/PackageDetailsPage.tsx">
                  <h1 className="text-3xl font-bold mb-2" data-id="rpec1knq5" data-path="src/pages/PackageDetailsPage.tsx">{displayData.title}</h1>
                  <div className="flex items-center space-x-2 mb-2" data-id="2io4kbw60" data-path="src/pages/PackageDetailsPage.tsx">
                    <div className="flex" data-id="9fpl0a3hu" data-path="src/pages/PackageDetailsPage.tsx">
                      {Array.from({ length: 5 }).map((_, i) =>
                        <span key={i} className={i < Math.floor(displayData.rating) ? "text-yellow-500" : "text-gray-300"} data-id="cxqumri24" data-path="src/pages/PackageDetailsPage.tsx">
                          ★
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground" data-id="gdgnbh4zb" data-path="src/pages/PackageDetailsPage.tsx">{displayData.rating.toFixed(1)} out of 5</span>
                  </div>
                </div>

                <div className="flex flex-col items-end mt-4 md:mt-0" data-id="2bl287dtp" data-path="src/pages/PackageDetailsPage.tsx">
                  <div className="mb-2" data-id="xgogtkqqx" data-path="src/pages/PackageDetailsPage.tsx">
                    {displayData.discount ?
                      <div className="space-y-1" data-id="6ye4kcc66" data-path="src/pages/PackageDetailsPage.tsx">
                        <div className="flex items-baseline space-x-2" data-id="j7wc16pk8" data-path="src/pages/PackageDetailsPage.tsx">
                          <span className="text-2xl font-bold text-primary" data-id="jfsy5wphk" data-path="src/pages/PackageDetailsPage.tsx">
                            ${(displayData.price - displayData.price * displayData.discount / 100).toFixed(2)}
                          </span>
                          <span className="text-lg line-through text-muted-foreground" data-id="j9ndu3uxg" data-path="src/pages/PackageDetailsPage.tsx">
                            ${displayData.price.toFixed(2)}
                          </span>
                        </div>
                        <Badge className="bg-red-500 text-white" data-id="5pfrq8hak" data-path="src/pages/PackageDetailsPage.tsx">{displayData.discount}% OFF</Badge>
                      </div> :

                      <span className="text-2xl font-bold text-primary" data-id="2cvrm378h" data-path="src/pages/PackageDetailsPage.tsx">${displayData.price.toFixed(2)}</span>
                    }
                    <span className="text-sm text-muted-foreground" data-path="src/pages/PackageDetailsPage.tsx">per person</span>
                  </div>
                  <AddToCartButton
                    item={{
                      id: Number(id),
                      type: 'package',
                      title: displayData.title,
                      price: displayData.discount ?
                        parseFloat((displayData.price - displayData.price * displayData.discount / 100).toFixed(2)) :
                        displayData.price,
                      quantity: 1,
                      details: {
                        destination: displayData.destination,
                        duration: displayData.duration,
                        flightIncluded: displayData.flightIncluded,
                        hotelIncluded: displayData.hotelIncluded,
                        carIncluded: displayData.carIncluded
                      },
                      image: displayData.imageUrls[0]
                    }}
                  />

                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" data-id="hzm3sn1ia" data-path="src/pages/PackageDetailsPage.tsx">
                <TabsList className="grid w-full grid-cols-4" data-id="lnvxk0oqu" data-path="src/pages/PackageDetailsPage.tsx">
                  <TabsTrigger value="overview" data-id="q1k9xo5k1" data-path="src/pages/PackageDetailsPage.tsx">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary" data-id="t4sffhepd" data-path="src/pages/PackageDetailsPage.tsx">Itinerary</TabsTrigger>
                  <TabsTrigger value="accommodations" data-id="e4zmthxvb" data-path="src/pages/PackageDetailsPage.tsx">Accommodations</TabsTrigger>
                  <TabsTrigger value="reviews" data-id="dupsjmj3z" data-path="src/pages/PackageDetailsPage.tsx">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 pt-4" data-id="e2scv1x7z" data-path="src/pages/PackageDetailsPage.tsx">
                  <h2 className="text-xl font-bold" data-id="i4vz1t1c3" data-path="src/pages/PackageDetailsPage.tsx">Package Overview</h2>
                  <p className="text-muted-foreground" data-id="pgnx6ffaj" data-path="src/pages/PackageDetailsPage.tsx">{displayData.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6" data-id="hoe1op77o" data-path="src/pages/PackageDetailsPage.tsx">
                    <div className="bg-blue-50 p-4 rounded-lg" data-id="vwbdyjue4" data-path="src/pages/PackageDetailsPage.tsx">
                      <div className="flex items-center mb-2" data-id="2mcfm91fq" data-path="src/pages/PackageDetailsPage.tsx">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="jnlh0dl1o" data-path="src/pages/PackageDetailsPage.tsx">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" data-id="tf6xb3ajo" data-path="src/pages/PackageDetailsPage.tsx"></path>
                        </svg>
                        <h3 className="font-bold" data-id="epy6hbzcv" data-path="src/pages/PackageDetailsPage.tsx">Flight</h3>
                      </div>
                      <p className="text-sm" data-id="noltoxvut" data-path="src/pages/PackageDetailsPage.tsx">{displayData.flightDetails.airline}</p>
                      <p className="text-sm" data-id="mvkkiivml" data-path="src/pages/PackageDetailsPage.tsx">{displayData.flightDetails.departure} to {displayData.flightDetails.arrival}</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg" data-id="ewx5wpkio" data-path="src/pages/PackageDetailsPage.tsx">
                      <div className="flex items-center mb-2" data-id="e9l1nnhdo" data-path="src/pages/PackageDetailsPage.tsx">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="tv4bayhja" data-path="src/pages/PackageDetailsPage.tsx">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" data-id="vf75si64c" data-path="src/pages/PackageDetailsPage.tsx"></path>
                          <polyline points="9 22 9 12 15 12 15 22" data-id="5etastc95" data-path="src/pages/PackageDetailsPage.tsx"></polyline>
                        </svg>
                        <h3 className="font-bold" data-id="v9rzt891h" data-path="src/pages/PackageDetailsPage.tsx">Hotel</h3>
                      </div>
                      <p className="text-sm" data-id="69n5zu9ng" data-path="src/pages/PackageDetailsPage.tsx">{displayData.hotelDetails.name}</p>
                      <p className="text-sm" data-id="zt1x97b5h" data-path="src/pages/PackageDetailsPage.tsx">{displayData.hotelDetails.roomType}</p>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg" data-id="c7p4mfa44" data-path="src/pages/PackageDetailsPage.tsx">
                      <div className="flex items-center mb-2" data-id="75bb1l6m8" data-path="src/pages/PackageDetailsPage.tsx">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="ghg59v2f4" data-path="src/pages/PackageDetailsPage.tsx">
                          <rect x="1" y="3" width="15" height="13" data-id="xu3xos2jy" data-path="src/pages/PackageDetailsPage.tsx"></rect>
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" data-id="gci6f8ezn" data-path="src/pages/PackageDetailsPage.tsx"></polygon>
                          <circle cx="5.5" cy="18.5" r="2.5" data-id="eoau7ubst" data-path="src/pages/PackageDetailsPage.tsx"></circle>
                          <circle cx="18.5" cy="18.5" r="2.5" data-id="ugg7gs9uf" data-path="src/pages/PackageDetailsPage.tsx"></circle>
                        </svg>
                        <h3 className="font-bold" data-id="5vcnghx3t" data-path="src/pages/PackageDetailsPage.tsx">Car Rental</h3>
                      </div>
                      <p className="text-sm" data-id="n8l14hs5l" data-path="src/pages/PackageDetailsPage.tsx">{displayData.carDetails.brand} {displayData.carDetails.model}</p>
                      <p className="text-sm" data-id="sh064t6eb" data-path="src/pages/PackageDetailsPage.tsx">{displayData.carDetails.type}</p>
                    </div>
                  </div>

                  <PackageDetails {...mappedPackageDetails} />

                </TabsContent>

                <TabsContent value="itinerary" className="space-y-4 pt-4" data-id="xlb15rwvg" data-path="src/pages/PackageDetailsPage.tsx">
                  <h2 className="text-xl font-bold" data-id="iygwey5j1" data-path="src/pages/PackageDetailsPage.tsx">Your Journey</h2>
                  <p className="text-muted-foreground mb-6" data-id="916ay5x1n" data-path="src/pages/PackageDetailsPage.tsx">Day-by-day breakdown of your {displayData.duration} in {displayData.destination}.</p>

                  <div className="space-y-6" data-id="90gw6vzi4" data-path="src/pages/PackageDetailsPage.tsx">
                    {displayData.itinerary.map((day) =>
                      <div key={day.day} className="border-l-4 border-primary pl-4 pb-6 relative" data-id="6qxpy0guq" data-path="src/pages/PackageDetailsPage.tsx">
                        <div className="absolute -left-3 top-0 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center" data-id="rlvyj0fin" data-path="src/pages/PackageDetailsPage.tsx">
                          {day.day}
                        </div>
                        <h3 className="font-bold text-lg" data-id="5op15tutz" data-path="src/pages/PackageDetailsPage.tsx">{day.title}</h3>
                        <p className="text-muted-foreground mb-2" data-id="gx1qz9kfj" data-path="src/pages/PackageDetailsPage.tsx">{day.description}</p>
                        <div className="ml-4 mt-2" data-id="j4jm8fymr" data-path="src/pages/PackageDetailsPage.tsx">
                          <h4 className="font-medium text-sm text-muted-foreground mb-1" data-id="17qn4p8i5" data-path="src/pages/PackageDetailsPage.tsx">Daily Activities:</h4>
                          <ul className="list-disc ml-5 space-y-1" data-id="mzbqycwa0" data-path="src/pages/PackageDetailsPage.tsx">
                            {day.activities.map((activity, index) =>
                              <li key={index} className="text-sm" data-id="newxitl94" data-path="src/pages/PackageDetailsPage.tsx">{activity}</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="accommodations" className="space-y-4 pt-4" data-id="xibppclv4" data-path="src/pages/PackageDetailsPage.tsx">
                  <h2 className="text-xl font-bold" data-id="8up1jeb96" data-path="src/pages/PackageDetailsPage.tsx">Your Stay</h2>
                  <div className="border rounded-lg overflow-hidden" data-id="04fvnk5ss" data-path="src/pages/PackageDetailsPage.tsx">
                    <div className="aspect-w-16 aspect-h-9 h-64" data-id="ihlls4dj1" data-path="src/pages/PackageDetailsPage.tsx">
                      <img
                        src="https://images.unsplash.com/photo-1582719471384-894fbb16e074"
                        alt={displayData.hotelDetails.name}
                        className="w-full h-full object-cover" data-id="7kbbuuvyv" data-path="src/pages/PackageDetailsPage.tsx" />

                    </div>

                    <div className="p-6" data-id="298hh3c7e" data-path="src/pages/PackageDetailsPage.tsx">
                      <div className="flex justify-between items-start mb-3" data-id="7gfyejt5u" data-path="src/pages/PackageDetailsPage.tsx">
                        <h3 className="text-xl font-bold" data-id="gvwuh4blv" data-path="src/pages/PackageDetailsPage.tsx">{displayData.hotelDetails.name}</h3>
                        <div className="flex text-yellow-500" data-id="2qtfpv6zv" data-path="src/pages/PackageDetailsPage.tsx">
                          {Array.from({ length: 5 }).map((_, i) =>
                            <span key={i} data-id="2nrd2iwmd" data-path="src/pages/PackageDetailsPage.tsx">★</span>
                          )}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4" data-id="207wdkn96" data-path="src/pages/PackageDetailsPage.tsx">{displayData.hotelDetails.location}</p>

                      <h4 className="font-medium mb-2" data-id="2sjlkwmcc" data-path="src/pages/PackageDetailsPage.tsx">Room Information</h4>
                      <p className="mb-4" data-id="18hn1rh1f" data-path="src/pages/PackageDetailsPage.tsx">{displayData.hotelDetails.roomType} - {displayData.hotelDetails.boardType}</p>

                      <h4 className="font-medium mb-2" data-id="75tip1gwc" data-path="src/pages/PackageDetailsPage.tsx">Amenities</h4>
                      <div className="grid grid-cols-2 gap-2 mb-4" data-id="cxtweb7dj" data-path="src/pages/PackageDetailsPage.tsx">
                        {displayData.hotelDetails.amenities.map((amenity, index) =>
                          <div key={index} className="flex items-center" data-id="41d76bzc2" data-path="src/pages/PackageDetailsPage.tsx">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="uv5abecfy" data-path="src/pages/PackageDetailsPage.tsx">
                              <polyline points="20 6 9 17 4 12" data-id="5ycy4d4ll" data-path="src/pages/PackageDetailsPage.tsx"></polyline>
                            </svg>
                            <span className="text-sm" data-id="j0q3z3hft" data-path="src/pages/PackageDetailsPage.tsx">{amenity}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4 pt-4" data-id="j0ecu65j8" data-path="src/pages/PackageDetailsPage.tsx">
                  <ReviewsSection
                    itemType="package"
                    itemId={displayData.id}
                    itemName={displayData.title}
                    // itemImage={displayData.image}
                    showReviewButton={true}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <Footer data-id="kq25l40o4" data-path="src/pages/PackageDetailsPage.tsx" />
    </div>);

};

export default PackageDetailsPage;