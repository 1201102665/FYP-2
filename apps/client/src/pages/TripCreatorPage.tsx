import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TripCreator from '@/components/TripCreator';
import TripRecommendation from '@/components/TripRecommendation';
import { useUserActivityContext } from '@/contexts/UserActivityContext';

const TripCreatorPage = () => {
  const [tripRecommendation, setTripRecommendation] = useState<any>(null);
  const { trackView } = useUserActivityContext();

  // Track page view
  React.useEffect(() => {
    trackView('trip-creator', 'package');
  }, [trackView]);

  const handleTripCreated = (trip: any) => {
    setTripRecommendation(trip);
    // Scroll to the top to show the recommendation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewTrip = () => {
    setTripRecommendation(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-id="22lv8pcvd" data-path="src/pages/TripCreatorPage.tsx">
      <Header data-id="5t5i4g4fr" data-path="src/pages/TripCreatorPage.tsx" />

      <main className="flex-grow container mx-auto py-8 px-4" data-id="2neb34dz2" data-path="src/pages/TripCreatorPage.tsx">
        {/* Hero section */}
        <div className="text-center mb-8" data-id="ew4x5f7ld" data-path="src/pages/TripCreatorPage.tsx">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-id="yzfan1pin" data-path="src/pages/TripCreatorPage.tsx">AI Trip Creator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-id="f770ujkvb" data-path="src/pages/TripCreatorPage.tsx">
            Tell us about your dream vacation, and our AI will create a personalized travel plan just for you.
          </p>
        </div>

        {/* Trip recommendation or creator form */}
        <div className="max-w-4xl mx-auto" data-id="ach2889jh" data-path="src/pages/TripCreatorPage.tsx">
          {tripRecommendation ?
          <TripRecommendation trip={tripRecommendation} onNewTrip={handleNewTrip} data-id="42cydso1u" data-path="src/pages/TripCreatorPage.tsx" /> :

          <TripCreator onTripCreated={handleTripCreated} data-id="pltsetrp8" data-path="src/pages/TripCreatorPage.tsx" />
          }
        </div>

        {/* How it works section */}
        {!tripRecommendation &&
        <div className="mt-16" data-id="yb8evy800" data-path="src/pages/TripCreatorPage.tsx">
            <h2 className="text-2xl font-bold text-center mb-8" data-id="nnlz7ixaq" data-path="src/pages/TripCreatorPage.tsx">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-id="pmqzzu2lw" data-path="src/pages/TripCreatorPage.tsx">
              <div className="bg-white p-6 rounded-lg shadow-md text-center" data-id="8f7qnaz4o" data-path="src/pages/TripCreatorPage.tsx">
                <div className="w-12 h-12 bg-blue-100 text-aerotrav-blue rounded-full flex items-center justify-center mx-auto mb-4" data-id="0db4kdi8y" data-path="src/pages/TripCreatorPage.tsx">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-id="lrzwx3jf1" data-path="src/pages/TripCreatorPage.tsx">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-id="5s7u3gqab" data-path="src/pages/TripCreatorPage.tsx" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" data-id="q9ezck5ue" data-path="src/pages/TripCreatorPage.tsx">1. Tell Us Your Preferences</h3>
                <p className="text-gray-600" data-id="yk7ssbo6h" data-path="src/pages/TripCreatorPage.tsx">Share your destination, budget, interests, and any special requirements.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center" data-id="53yosdwhp" data-path="src/pages/TripCreatorPage.tsx">
                <div className="w-12 h-12 bg-blue-100 text-aerotrav-blue rounded-full flex items-center justify-center mx-auto mb-4" data-id="hqcitthz2" data-path="src/pages/TripCreatorPage.tsx">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-id="dbdyjdz6a" data-path="src/pages/TripCreatorPage.tsx">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" data-id="cjuyzq1nj" data-path="src/pages/TripCreatorPage.tsx" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" data-id="mt2pbgh3h" data-path="src/pages/TripCreatorPage.tsx">2. Our AI Creates Your Trip</h3>
                <p className="text-gray-600" data-id="i9t214d41" data-path="src/pages/TripCreatorPage.tsx">Our advanced AI analyzes thousands of options to create your perfect itinerary.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center" data-id="p5xlqppch" data-path="src/pages/TripCreatorPage.tsx">
                <div className="w-12 h-12 bg-blue-100 text-aerotrav-blue rounded-full flex items-center justify-center mx-auto mb-4" data-id="1izu17cvg" data-path="src/pages/TripCreatorPage.tsx">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-id="8njcacb3z" data-path="src/pages/TripCreatorPage.tsx">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" data-id="c0hwo4zne" data-path="src/pages/TripCreatorPage.tsx" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" data-id="fm3yghva3" data-path="src/pages/TripCreatorPage.tsx">3. Book Your Dream Trip</h3>
                <p className="text-gray-600" data-id="ycjd8rwwn" data-path="src/pages/TripCreatorPage.tsx">Review your personalized plan and book with just a few clicks.</p>
              </div>
            </div>
          </div>
        }

        {/* Testimonials section */}
        {!tripRecommendation &&
        <div className="mt-16" data-id="5e6s756qh" data-path="src/pages/TripCreatorPage.tsx">
            <h2 className="text-2xl font-bold text-center mb-8" data-id="rhoqv8m7k" data-path="src/pages/TripCreatorPage.tsx">What Our Travelers Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-id="qskt0taf2" data-path="src/pages/TripCreatorPage.tsx">
              <div className="bg-white p-6 rounded-lg shadow-md" data-id="ukdbyyq2d" data-path="src/pages/TripCreatorPage.tsx">
                <div className="flex items-center mb-4" data-id="txji7oixo" data-path="src/pages/TripCreatorPage.tsx">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4" data-id="cefpu3g25" data-path="src/pages/TripCreatorPage.tsx">
                    <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-full h-full object-cover" data-id="0oow75dyu" data-path="src/pages/TripCreatorPage.tsx" />
                  </div>
                  <div data-id="ydqoz1vxd" data-path="src/pages/TripCreatorPage.tsx">
                    <h3 className="font-semibold" data-id="h447i3jwe" data-path="src/pages/TripCreatorPage.tsx">Sarah Johnson</h3>
                    <p className="text-gray-500 text-sm" data-id="m3wc77q98" data-path="src/pages/TripCreatorPage.tsx">Bali Trip, June 2023</p>
                  </div>
                </div>
                <p className="text-gray-600 italic" data-id="v9ufbqb04" data-path="src/pages/TripCreatorPage.tsx">
                  "The AI Trip Creator made planning my vacation so easy! It understood exactly what I was looking for and created the perfect itinerary that matched my interests and budget. Highly recommend!"
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md" data-id="dauhd7sc5" data-path="src/pages/TripCreatorPage.tsx">
                <div className="flex items-center mb-4" data-id="zptrfdj34" data-path="src/pages/TripCreatorPage.tsx">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4" data-id="3epf3xq2w" data-path="src/pages/TripCreatorPage.tsx">
                    <img src="https://i.pravatar.cc/100?img=5" alt="User" className="w-full h-full object-cover" data-id="pa12a71ps" data-path="src/pages/TripCreatorPage.tsx" />
                  </div>
                  <div data-id="zmyv7w1s3" data-path="src/pages/TripCreatorPage.tsx">
                    <h3 className="font-semibold" data-id="3f5foiwkp" data-path="src/pages/TripCreatorPage.tsx">Michael Chen</h3>
                    <p className="text-gray-500 text-sm" data-id="x1givmc77" data-path="src/pages/TripCreatorPage.tsx">Tokyo Exploration, May 2023</p>
                  </div>
                </div>
                <p className="text-gray-600 italic" data-id="y44z7dec5" data-path="src/pages/TripCreatorPage.tsx">
                  "As someone who hates planning trips, this tool was a game-changer. The AI suggested activities I wouldn't have thought of, and everything was perfectly organized. Best travel experience ever!"
                </p>
              </div>
            </div>
          </div>
        }
      </main>

      <Footer data-id="2tnxm6h60" data-path="src/pages/TripCreatorPage.tsx" />
    </div>);

};

export default TripCreatorPage;