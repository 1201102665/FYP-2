import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PackageDetails from '@/components/PackageDetails';
import PackageBookingForm from '@/components/PackageBookingForm';
import AddToCartButton from '@/components/AddToCartButton';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const MOCK_PACKAGES = {
  '1': {
    id: '1',
    title: 'Bali Paradise Escape',
    description: 'Immerse yourself in the beauty of Bali with this all-inclusive package featuring luxury accommodations, cultural experiences, and breathtaking beaches. Discover the island\'s rich culture, visit ancient temples, relax on pristine beaches, and indulge in delicious Balinese cuisine.',
    price: 1299,
    duration: '7 nights',
    destination: 'Bali, Indonesia',
    startDate: '2023-06-15',
    endDate: '2023-06-22',
    imageUrls: [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
    'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b',
    'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8'],

    flightIncluded: true,
    hotelIncluded: true,
    carIncluded: true,
    rating: 4.8,
    discount: 15,
    featured: true,
    flightDetails: {
      departure: 'New York (JFK)',
      arrival: 'Denpasar (DPS)',
      airline: 'Singapore Airlines',
      flightNumber: 'SQ23',
      departureTime: '10:30 PM',
      arrivalTime: '9:15 AM (+2)',
      class: 'Economy'
    },
    hotelDetails: {
      name: 'Ubud Paradise Resort & Spa',
      rating: 5,
      location: 'Ubud, Bali',
      roomType: 'Deluxe Villa with Pool',
      boardType: 'All-inclusive',
      amenities: [
      'Private Pool', 'Free Wi-Fi', 'Spa Access', 'Daily Breakfast',
      'Airport Transfer', 'Beach Access', 'Room Service', 'Fitness Center']

    },
    carDetails: {
      type: 'SUV',
      brand: 'Toyota',
      model: 'RAV4',
      pickupLocation: 'Denpasar Airport',
      dropoffLocation: 'Denpasar Airport'
    },
    itinerary: [
    {
      day: 1,
      title: 'Arrival in Bali',
      description: 'Arrive at Denpasar International Airport and transfer to your luxury resort in Ubud.',
      activities: ['Airport pickup', 'Resort check-in', 'Welcome dinner']
    },
    {
      day: 2,
      title: 'Ubud Cultural Tour',
      description: 'Explore the cultural heart of Bali with visits to ancient temples and artisan workshops.',
      activities: ['Ubud Palace', 'Sacred Monkey Forest', 'Lunch at local restaurant', 'Art galleries tour']
    },
    {
      day: 3,
      title: 'Mount Batur Sunrise Trek',
      description: 'Early morning trek up Mount Batur to witness a spectacular sunrise over the island.',
      activities: ['Pre-dawn pickup', 'Guided trek', 'Breakfast at summit', 'Hot springs visit']
    },
    {
      day: 4,
      title: 'Beach Day at Nusa Dua',
      description: 'Relax at one of Bali\'s most beautiful beaches with optional water activities.',
      activities: ['Beach transfer', 'Snorkeling', 'Beachside lunch', 'Sunset cocktails']
    },
    {
      day: 5,
      title: 'Temples and Rice Terraces',
      description: 'Visit Bali\'s most iconic temples and the stunning Tegallalang Rice Terraces.',
      activities: ['Tanah Lot Temple', 'Tegallalang Rice Terraces', 'Traditional dance performance']
    },
    {
      day: 6,
      title: 'Spa Day and Shopping',
      description: 'Indulge in a traditional Balinese spa treatment and browse local markets.',
      activities: ['Full body massage', 'Flower bath', 'Ubud Market shopping', 'Farewell dinner']
    },
    {
      day: 7,
      title: 'Departure Day',
      description: 'Final day to enjoy resort amenities before departure.',
      activities: ['Late checkout', 'Airport transfer']
    }],

    includedServices: [
    'Round-trip international flights',
    'Luxury villa accommodation',
    'All-inclusive meal plan',
    'Private car rental',
    'Airport transfers',
    'Daily guided activities',
    'All entrance fees to attractions',
    'Welcome and farewell dinners',
    '24/7 customer support',
    'Travel insurance'],

    excludedServices: [
    'Personal expenses',
    'Additional activities not in itinerary',
    'Alcoholic beverages outside of included meals',
    'Spa treatments (except included session)',
    'Gratuities for guides and drivers',
    'Visa fees (if applicable)']

  }
  // More packages would be defined here in a real app
};

const PackageDetailsPage: React.FC = () => {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get package data from location state or fallback to mock data
  const locationPackageData = location.state?.packageData;
  let packageData = null;

  if (locationPackageData) {
    // Use data passed from PackageCard
    packageData = {
      ...locationPackageData,
      imageUrls: [locationPackageData.imageUrl], // Convert single image to array
      flightDetails: {
        departure: 'Kuala Lumpur (KUL)',
        arrival: locationPackageData.destination,
        airline: 'Malaysia Airlines',
        flightNumber: 'MH123',
        departureTime: '09:00 AM',
        arrivalTime: '12:30 PM',
        class: 'Economy'
      },
      hotelDetails: {
        name: `Premium Hotel in ${locationPackageData.destination.split(',')[0]}`,
        rating: locationPackageData.rating || 4.5,
        location: locationPackageData.destination,
        roomType: 'Deluxe Room with City View',
        boardType: 'Breakfast Included',
        amenities: [
          'Free Wi-Fi', 'Air Conditioning', 'Room Service', 'Daily Housekeeping',
          'Concierge Service', 'Fitness Center', 'Swimming Pool', 'Restaurant'
        ]
      },
      carDetails: {
        type: 'Sedan',
        brand: 'Toyota',
        model: 'Camry',
        pickupLocation: 'Airport',
        dropoffLocation: 'Hotel'
      },
      itinerary: [
        {
          day: 1,
          title: 'Arrival Day',
          description: `Arrive at ${locationPackageData.destination} and check into your hotel.`,
          activities: ['Airport pickup', 'Hotel check-in', 'Welcome orientation']
        },
        {
          day: 2,
          title: 'City Exploration',
          description: 'Explore the main attractions and cultural sites.',
          activities: ['Guided city tour', 'Local restaurant lunch', 'Cultural sites visit']
        },
        {
          day: 3,
          title: 'Adventure Day',
          description: 'Enjoy outdoor activities and local experiences.',
          activities: ['Adventure activities', 'Local market visit', 'Traditional dinner']
        }
      ],
      includedServices: [
        locationPackageData.flightIncluded ? 'Round-trip flights' : null,
        locationPackageData.hotelIncluded ? 'Hotel accommodation' : null,
        locationPackageData.carIncluded ? 'Car rental' : null,
        'Airport transfers',
        'Daily breakfast',
        'Guided tours',
        'Travel insurance'
      ].filter(Boolean),
      excludedServices: [
        'Personal expenses',
        'Additional meals not mentioned',
        'Optional activities',
        'Gratuities',
        'Visa fees (if applicable)'
      ]
    };
  } else if (id && MOCK_PACKAGES[id]) {
    // Fallback to mock data
    packageData = MOCK_PACKAGES[id];
  }

  // If no package data found, show error state
  if (!packageData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Package Not Found</h2>
            <p className="mb-6">The package you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/packages')}>Browse All Packages</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
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

  return (
    <div className="flex flex-col min-h-screen" data-id="xmq7kalu4" data-path="src/pages/PackageDetailsPage.tsx">
      <Header data-id="65zy7awzz" data-path="src/pages/PackageDetailsPage.tsx" />
      
      <main className="flex-grow" data-id="ffx4jb9wx" data-path="src/pages/PackageDetailsPage.tsx">
        {/* Image Gallery */}
        <section className="relative" data-id="v05r1jsl3" data-path="src/pages/PackageDetailsPage.tsx">
          <div className="h-[300px] md:h-[500px] overflow-hidden" data-id="734m8bnps" data-path="src/pages/PackageDetailsPage.tsx">
            <img
              src={packageData.imageUrls[currentImageIndex]}
              alt={packageData.title}
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
              {packageData.imageUrls.map((_, index) =>
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`
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
                  <h1 className="text-3xl font-bold mb-2" data-id="rpec1knq5" data-path="src/pages/PackageDetailsPage.tsx">{packageData.title}</h1>
                  <div className="flex items-center space-x-2 mb-2" data-id="2io4kbw60" data-path="src/pages/PackageDetailsPage.tsx">
                    <div className="flex" data-id="9fpl0a3hu" data-path="src/pages/PackageDetailsPage.tsx">
                      {Array.from({ length: 5 }).map((_, i) =>
                      <span key={i} className={i < Math.floor(packageData.rating) ? "text-yellow-500" : "text-gray-300"} data-id="cxqumri24" data-path="src/pages/PackageDetailsPage.tsx">
                          ★
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground" data-id="gdgnbh4zb" data-path="src/pages/PackageDetailsPage.tsx">{packageData.rating} out of 5</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end mt-4 md:mt-0" data-id="2bl287dtp" data-path="src/pages/PackageDetailsPage.tsx">
                  <div className="mb-2" data-id="xgogtkqqx" data-path="src/pages/PackageDetailsPage.tsx">
                    {packageData.discount ?
                    <div className="space-y-1" data-id="6ye4kcc66" data-path="src/pages/PackageDetailsPage.tsx">
                        <div className="flex items-baseline space-x-2" data-id="j7wc16pk8" data-path="src/pages/PackageDetailsPage.tsx">
                          <span className="text-2xl font-bold text-primary" data-id="jfsy5wphk" data-path="src/pages/PackageDetailsPage.tsx">
                            ${(packageData.price - packageData.price * packageData.discount / 100).toFixed(2)}
                          </span>
                          <span className="text-lg line-through text-muted-foreground" data-id="j9ndu3uxg" data-path="src/pages/PackageDetailsPage.tsx">
                            ${packageData.price.toFixed(2)}
                          </span>
                        </div>
                        <Badge className="bg-red-500 text-white" data-id="5pfrq8hak" data-path="src/pages/PackageDetailsPage.tsx">{packageData.discount}% OFF</Badge>
                      </div> :

                    <span className="text-2xl font-bold text-primary" data-id="2cvrm378h" data-path="src/pages/PackageDetailsPage.tsx">${packageData.price.toFixed(2)}</span>
                    }
                    <span className="text-sm text-muted-foreground" data-id="jobnptvzx" data-path="src/pages/PackageDetailsPage.tsx">per person</span>
                  </div>
                  <AddToCartButton
                    item={{
                      id: id,
                      type: 'package',
                      name: packageData.title,
                      price: packageData.discount ?
                      parseFloat((packageData.price - packageData.price * packageData.discount / 100).toFixed(2)) :
                      packageData.price,
                      details: {
                        destination: packageData.destination,
                        duration: packageData.duration,
                        startDate: packageData.startDate,
                        endDate: packageData.endDate,
                        flightIncluded: packageData.flightIncluded,
                        hotelIncluded: packageData.hotelIncluded,
                        carIncluded: packageData.carIncluded
                      },
                      image: packageData.imageUrls[0]
                    }} data-id="7xtjbi2z3" data-path="src/pages/PackageDetailsPage.tsx" />

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
                  <p className="text-muted-foreground" data-id="pgnx6ffaj" data-path="src/pages/PackageDetailsPage.tsx">{packageData.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6" data-id="hoe1op77o" data-path="src/pages/PackageDetailsPage.tsx">
                    <div className="bg-blue-50 p-4 rounded-lg" data-id="vwbdyjue4" data-path="src/pages/PackageDetailsPage.tsx">
                      <div className="flex items-center mb-2" data-id="2mcfm91fq" data-path="src/pages/PackageDetailsPage.tsx">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="jnlh0dl1o" data-path="src/pages/PackageDetailsPage.tsx">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" data-id="tf6xb3ajo" data-path="src/pages/PackageDetailsPage.tsx"></path>
                        </svg>
                        <h3 className="font-bold" data-id="epy6hbzcv" data-path="src/pages/PackageDetailsPage.tsx">Flight</h3>
                      </div>
                      <p className="text-sm" data-id="noltoxvut" data-path="src/pages/PackageDetailsPage.tsx">{packageData.flightDetails.airline}</p>
                      <p className="text-sm" data-id="mvkkiivml" data-path="src/pages/PackageDetailsPage.tsx">{packageData.flightDetails.departure} to {packageData.flightDetails.arrival}</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg" data-id="ewx5wpkio" data-path="src/pages/PackageDetailsPage.tsx">
                      <div className="flex items-center mb-2" data-id="e9l1nnhdo" data-path="src/pages/PackageDetailsPage.tsx">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="tv4bayhja" data-path="src/pages/PackageDetailsPage.tsx">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" data-id="vf75si64c" data-path="src/pages/PackageDetailsPage.tsx"></path>
                          <polyline points="9 22 9 12 15 12 15 22" data-id="5etastc95" data-path="src/pages/PackageDetailsPage.tsx"></polyline>
                        </svg>
                        <h3 className="font-bold" data-id="v9rzt891h" data-path="src/pages/PackageDetailsPage.tsx">Hotel</h3>
                      </div>
                      <p className="text-sm" data-id="69n5zu9ng" data-path="src/pages/PackageDetailsPage.tsx">{packageData.hotelDetails.name}</p>
                      <p className="text-sm" data-id="zt1x97b5h" data-path="src/pages/PackageDetailsPage.tsx">{packageData.hotelDetails.roomType}</p>
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
                      <p className="text-sm" data-id="n8l14hs5l" data-path="src/pages/PackageDetailsPage.tsx">{packageData.carDetails.brand} {packageData.carDetails.model}</p>
                      <p className="text-sm" data-id="sh064t6eb" data-path="src/pages/PackageDetailsPage.tsx">{packageData.carDetails.type}</p>
                    </div>
                  </div>
                  
                  <PackageDetails
                    title={packageData.title}
                    description={packageData.description}
                    destination={packageData.destination}
                    duration={packageData.duration}
                    itinerary={packageData.itinerary}
                    flightDetails={packageData.flightDetails}
                    hotelDetails={packageData.hotelDetails}
                    carDetails={packageData.carDetails}
                    includedServices={packageData.includedServices}
                    excludedServices={packageData.excludedServices} data-id="b1sv3rdr2" data-path="src/pages/PackageDetailsPage.tsx" />

                </TabsContent>
                
                <TabsContent value="itinerary" className="space-y-4 pt-4" data-id="xlb15rwvg" data-path="src/pages/PackageDetailsPage.tsx">
                  <h2 className="text-xl font-bold" data-id="iygwey5j1" data-path="src/pages/PackageDetailsPage.tsx">Your Journey</h2>
                  <p className="text-muted-foreground mb-6" data-id="916ay5x1n" data-path="src/pages/PackageDetailsPage.tsx">Day-by-day breakdown of your {packageData.duration} in {packageData.destination}.</p>
                  
                  <div className="space-y-6" data-id="90gw6vzi4" data-path="src/pages/PackageDetailsPage.tsx">
                    {packageData.itinerary.map((day) =>
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
                        alt={packageData.hotelDetails.name}
                        className="w-full h-full object-cover" data-id="7kbbuuvyv" data-path="src/pages/PackageDetailsPage.tsx" />

                    </div>
                    
                    <div className="p-6" data-id="298hh3c7e" data-path="src/pages/PackageDetailsPage.tsx">
                      <div className="flex justify-between items-start mb-3" data-id="7gfyejt5u" data-path="src/pages/PackageDetailsPage.tsx">
                        <h3 className="text-xl font-bold" data-id="gvwuh4blv" data-path="src/pages/PackageDetailsPage.tsx">{packageData.hotelDetails.name}</h3>
                        <div className="flex text-yellow-500" data-id="2qtfpv6zv" data-path="src/pages/PackageDetailsPage.tsx">
                          {Array.from({ length: packageData.hotelDetails.rating }).map((_, i) =>
                          <span key={i} data-id="2nrd2iwmd" data-path="src/pages/PackageDetailsPage.tsx">★</span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4" data-id="207wdkn96" data-path="src/pages/PackageDetailsPage.tsx">{packageData.hotelDetails.location}</p>
                      
                      <h4 className="font-medium mb-2" data-id="2sjlkwmcc" data-path="src/pages/PackageDetailsPage.tsx">Room Information</h4>
                      <p className="mb-4" data-id="18hn1rh1f" data-path="src/pages/PackageDetailsPage.tsx">{packageData.hotelDetails.roomType} - {packageData.hotelDetails.boardType}</p>
                      
                      <h4 className="font-medium mb-2" data-id="75tip1gwc" data-path="src/pages/PackageDetailsPage.tsx">Amenities</h4>
                      <div className="grid grid-cols-2 gap-2 mb-4" data-id="cxtweb7dj" data-path="src/pages/PackageDetailsPage.tsx">
                        {packageData.hotelDetails.amenities.map((amenity, index) =>
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
                  <h2 className="text-xl font-bold" data-id="1r6sz32ul" data-path="src/pages/PackageDetailsPage.tsx">Customer Reviews</h2>
                  <div className="bg-gray-50 p-6 rounded-lg" data-id="yucn7upv6" data-path="src/pages/PackageDetailsPage.tsx">
                    <div className="flex items-center justify-between mb-4" data-id="bsl6rj1a9" data-path="src/pages/PackageDetailsPage.tsx">
                      <div data-id="4dquxexft" data-path="src/pages/PackageDetailsPage.tsx">
                        <h3 className="text-2xl font-bold" data-id="c01scxmky" data-path="src/pages/PackageDetailsPage.tsx">{packageData.rating}</h3>
                        <div className="flex" data-id="c6aui03b6" data-path="src/pages/PackageDetailsPage.tsx">
                          {Array.from({ length: 5 }).map((_, i) =>
                          <span key={i} className={i < Math.floor(packageData.rating) ? "text-yellow-500" : "text-gray-300"} data-id="w5ivytsux" data-path="src/pages/PackageDetailsPage.tsx">
                              ★
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground" data-id="79booq7j7" data-path="src/pages/PackageDetailsPage.tsx">Based on 24 reviews</p>
                      </div>
                      <Button data-id="4mgjb8c1p" data-path="src/pages/PackageDetailsPage.tsx">Write a Review</Button>
                    </div>
                    
                    <div className="space-y-4" data-id="kvaratb7u" data-path="src/pages/PackageDetailsPage.tsx">
                      {/* Mock reviews - in a real app these would come from the backend */}
                      <div className="bg-white p-4 rounded-lg" data-id="stsjnyjs0" data-path="src/pages/PackageDetailsPage.tsx">
                        <div className="flex justify-between mb-2" data-id="klpyjwapv" data-path="src/pages/PackageDetailsPage.tsx">
                          <div className="flex items-center" data-id="vza37fyhm" data-path="src/pages/PackageDetailsPage.tsx">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold mr-3" data-id="odxua5npo" data-path="src/pages/PackageDetailsPage.tsx">JD</div>
                            <div data-id="iv4b8tl05" data-path="src/pages/PackageDetailsPage.tsx">
                              <h4 className="font-medium" data-id="fiw4swybr" data-path="src/pages/PackageDetailsPage.tsx">John Doe</h4>
                              <div className="flex text-yellow-500 text-sm" data-id="pawors56q" data-path="src/pages/PackageDetailsPage.tsx">★★★★★</div>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground" data-id="35ykxrqmx" data-path="src/pages/PackageDetailsPage.tsx">2 weeks ago</span>
                        </div>
                        <p data-id="njxwv1vb0" data-path="src/pages/PackageDetailsPage.tsx">Absolutely incredible experience! The resort was luxurious, and every detail of the trip was perfectly planned. Our guide was knowledgeable and friendly. Would highly recommend!</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg" data-id="mitflxbdg" data-path="src/pages/PackageDetailsPage.tsx">
                        <div className="flex justify-between mb-2" data-id="mkdi02vop" data-path="src/pages/PackageDetailsPage.tsx">
                          <div className="flex items-center" data-id="avk00ageu" data-path="src/pages/PackageDetailsPage.tsx">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold mr-3" data-id="eeoih9f22" data-path="src/pages/PackageDetailsPage.tsx">AS</div>
                            <div data-id="6lna6gqbe" data-path="src/pages/PackageDetailsPage.tsx">
                              <h4 className="font-medium" data-id="jq6y9h2sr" data-path="src/pages/PackageDetailsPage.tsx">Amanda Smith</h4>
                              <div className="flex text-yellow-500 text-sm" data-id="l5m241f50" data-path="src/pages/PackageDetailsPage.tsx">★★★★<span className="text-gray-300" data-id="zf9l2hw0t" data-path="src/pages/PackageDetailsPage.tsx">★</span></div>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground" data-id="f0kmz68mc" data-path="src/pages/PackageDetailsPage.tsx">1 month ago</span>
                        </div>
                        <p data-id="e4xxizvbc" data-path="src/pages/PackageDetailsPage.tsx">Great package overall! The accommodations were excellent and the activities well-planned. Only giving 4 stars because some of the transfers were delayed, but the company was responsive in helping us resolve issues.</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg" data-id="i5li3dfpp" data-path="src/pages/PackageDetailsPage.tsx">
                        <div className="flex justify-between mb-2" data-id="fak0gxrum" data-path="src/pages/PackageDetailsPage.tsx">
                          <div className="flex items-center" data-id="y7r1b4vhh" data-path="src/pages/PackageDetailsPage.tsx">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold mr-3" data-id="jn7orpush" data-path="src/pages/PackageDetailsPage.tsx">RM</div>
                            <div data-id="icqhm14kf" data-path="src/pages/PackageDetailsPage.tsx">
                              <h4 className="font-medium" data-id="n531h8q14" data-path="src/pages/PackageDetailsPage.tsx">Robert Miller</h4>
                              <div className="flex text-yellow-500 text-sm" data-id="2maqa1yni" data-path="src/pages/PackageDetailsPage.tsx">★★★★★</div>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground" data-id="6cdeqmrvj" data-path="src/pages/PackageDetailsPage.tsx">2 months ago</span>
                        </div>
                        <p data-id="cobtb26ef" data-path="src/pages/PackageDetailsPage.tsx">My wife and I had the time of our lives! The sunrise trek was magical, and we loved every minute of our stay. Worth every penny - we'll definitely book with this company again!</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Booking Form */}
            <div className="lg:col-span-1" data-id="k3b19tpbj" data-path="src/pages/PackageDetailsPage.tsx">
              <div className="sticky top-24" data-id="og53f7ix8" data-path="src/pages/PackageDetailsPage.tsx">
                <PackageBookingForm
                  packageId={id}
                  packageName={packageData.title}
                  basePrice={packageData.discount ?
                  packageData.price - packageData.price * packageData.discount / 100 :
                  packageData.price
                  }
                  destination={packageData.destination}
                  startDate={packageData.startDate}
                  endDate={packageData.endDate} data-id="09s0iq8y3" data-path="src/pages/PackageDetailsPage.tsx" />

              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer data-id="kq25l40o4" data-path="src/pages/PackageDetailsPage.tsx" />
    </div>);

};

export default PackageDetailsPage;