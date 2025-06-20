import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SearchBanner = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1');

  const handleSearch = () => {
    navigate('/flights', {
      state: {
        origin,
        destination,
        departDate,
        returnDate,
        passengers: parseInt(passengers) || 1
      }
    });
  };

  return (
    <div className="bg-aerotrav-blue rounded-lg p-8 relative overflow-hidden" data-id="7rizoz9su" data-path="src/components/SearchBanner.tsx">
      <div className="relative z-10" data-id="2k4gt24uc" data-path="src/components/SearchBanner.tsx">
        <h2 className="text-4xl font-bold text-white mb-2" data-id="p6o5f996i" data-path="src/components/SearchBanner.tsx">Your Next Trip?</h2>
        <p className="text-white text-sm mb-6" data-id="j3zy3i3me" data-path="src/components/SearchBanner.tsx">Search low prices on hotels, homes and much more</p>
        <div className="flex flex-col gap-4" data-id="oyz0yi9xp" data-path="src/components/SearchBanner.tsx">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-id="qulh0an4i" data-path="src/components/SearchBanner.tsx">
            <input
              type="text"
              placeholder="From (City or Airport)"
              className="w-full px-4 py-2 rounded-md"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)} data-id="7k5t2l35t" data-path="src/components/SearchBanner.tsx" />

            <input
              type="text"
              placeholder="To (City or Airport)"
              className="w-full px-4 py-2 rounded-md"
              value={destination}
              onChange={(e) => setDestination(e.target.value)} data-id="aaj0rhh75" data-path="src/components/SearchBanner.tsx" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-id="igkcqnjbm" data-path="src/components/SearchBanner.tsx">
            <input
              type="date"
              placeholder="Depart Date"
              className="w-full px-4 py-2 rounded-md"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)} data-id="gxuh8rb04" data-path="src/components/SearchBanner.tsx" />
              
            <input
              type="date"
              placeholder="Return Date"
              className="w-full px-4 py-2 rounded-md"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)} data-id="mpkdj2urm" data-path="src/components/SearchBanner.tsx" />
              
            <select
              className="w-full px-4 py-2 rounded-md"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)} data-id="fc7u4sd2k" data-path="src/components/SearchBanner.tsx">
              <option value="1" data-id="7qiqimxqb" data-path="src/components/SearchBanner.tsx">1 Passenger</option>
              <option value="2" data-id="94paw8erd" data-path="src/components/SearchBanner.tsx">2 Passengers</option>
              <option value="3" data-id="aox63i2p8" data-path="src/components/SearchBanner.tsx">3 Passengers</option>
              <option value="4" data-id="7ivw0870d" data-path="src/components/SearchBanner.tsx">4 Passengers</option>
              <option value="5" data-id="qs8p7riw5" data-path="src/components/SearchBanner.tsx">5 Passengers</option>
            </select>
          </div>
          
          <Button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-aerotrav-yellow hover:bg-aerotrav-yellow-500 text-black font-medium py-2" data-id="s0qik463l" data-path="src/components/SearchBanner.tsx">
            Search Flights
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 opacity-20" data-id="v3tmszum8" data-path="src/components/SearchBanner.tsx">
        <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" data-id="1qhlrc08j" data-path="src/components/SearchBanner.tsx">
          <path d="M50 10L150 90M150 90L120 30M150 90L60 70" stroke="white" strokeWidth="2" data-id="ldl4l19hf" data-path="src/components/SearchBanner.tsx" />
        </svg>
      </div>
      
      <div className="absolute top-0 right-0 opacity-20" data-id="g6o2305y1" data-path="src/components/SearchBanner.tsx">
        <svg width="100" height="200" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" data-id="qc5nt798x" data-path="src/components/SearchBanner.tsx">
          <path d="M90 40V160M90 160L40 140M90 160L60 100" stroke="white" strokeWidth="2" data-id="w6pok4prc" data-path="src/components/SearchBanner.tsx" />
          <rect x="60" y="40" width="10" height="20" stroke="white" strokeWidth="2" data-id="m30j8x780" data-path="src/components/SearchBanner.tsx" />
          <rect x="80" y="50" width="10" height="30" stroke="white" strokeWidth="2" data-id="97jsohfu5" data-path="src/components/SearchBanner.tsx" />
          <rect x="70" y="60" width="10" height="40" stroke="white" strokeWidth="2" data-id="qj2uqpv6m" data-path="src/components/SearchBanner.tsx" />
        </svg>
      </div>
    </div>);

};

export default SearchBanner;