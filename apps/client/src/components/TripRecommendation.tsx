import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface TripDay {
  day: number;
  activities: string[];
}

interface TripAccommodation {
  name: string;
  rating: number;
  amenities: string[];
}

interface TripRecommendation {
  destination: string;
  budget: number;
  travelers: number;
  dateRange: string;
  itinerary: TripDay[];
  accommodation: TripAccommodation;
  totalPrice: number;
  inclusions: string[];
  recommendations: string[];
}

interface TripRecommendationProps {
  trip: TripRecommendation;
  onNewTrip: () => void;
}

const TripRecommendation: React.FC<TripRecommendationProps> = ({ trip, onNewTrip }) => {
  const navigate = useNavigate();
  const { addToCart } = useCartContext();

  const handleAddToCart = () => {
    addToCart({
      id: Date.now(),
      title: `${trip.destination} Trip Package`,
      image: `https://source.unsplash.com/featured/?${trip.destination}`,
      price: trip.totalPrice,
      type: 'package',
      quantity: 1,
      details: {
        destination: trip.destination,
        travelers: trip.travelers,
        dateRange: trip.dateRange,
        accommodation: trip.accommodation.name
      }
    });
  };

  const handleBookNow = () => {
    handleAddToCart();
    navigate('/payment');
  };

  return (
    <Card className="p-6 bg-white shadow-md rounded-lg" data-id="fyrw43g0z" data-path="src/components/TripRecommendation.tsx">
      <div className="space-y-6" data-id="tp28kbloh" data-path="src/components/TripRecommendation.tsx">
        <div className="flex justify-between items-start" data-id="rixvynypr" data-path="src/components/TripRecommendation.tsx">
          <div data-id="hvvqgtim9" data-path="src/components/TripRecommendation.tsx">
            <h2 className="text-2xl font-bold" data-id="h0umz54t9" data-path="src/components/TripRecommendation.tsx">{trip.destination} Adventure</h2>
            <p className="text-gray-600" data-id="qnbdelr7w" data-path="src/components/TripRecommendation.tsx">{trip.travelers} traveler(s) • {trip.dateRange}</p>
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100" data-id="xcwa0ly10" data-path="src/components/TripRecommendation.tsx">Recommended</Badge>
        </div>

        <div className="relative h-48 rounded-md overflow-hidden" data-id="anm7rk54o" data-path="src/components/TripRecommendation.tsx">
          <img
            src={`https://source.unsplash.com/featured/?${trip.destination}`}
            alt={trip.destination}
            className="w-full h-full object-cover" data-id="gsvp4ule3" data-path="src/components/TripRecommendation.tsx" />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4" data-id="gjot6y0g1" data-path="src/components/TripRecommendation.tsx">
            <p className="text-white font-bold text-xl" data-id="9j9o0l1gp" data-path="src/components/TripRecommendation.tsx">Total: ${trip.totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <div data-id="tng7attv3" data-path="src/components/TripRecommendation.tsx">
          <h3 className="font-bold text-lg mb-2" data-id="m57cazpyd" data-path="src/components/TripRecommendation.tsx">Your Itinerary</h3>
          <div className="space-y-3" data-id="sz0pwvjks" data-path="src/components/TripRecommendation.tsx">
            {trip.itinerary.map((day) =>
              <div key={day.day} className="bg-gray-50 p-3 rounded-md" data-id="u8v1bo3i4" data-path="src/components/TripRecommendation.tsx">
                <h4 className="font-bold" data-id="efqz15i2z" data-path="src/components/TripRecommendation.tsx">Day {day.day}</h4>
                <ul className="list-disc list-inside text-gray-700" data-id="yfv0lf5wn" data-path="src/components/TripRecommendation.tsx">
                  {day.activities.map((activity, index) =>
                    <li key={index} data-id="u6wzmozu6" data-path="src/components/TripRecommendation.tsx">{activity}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div data-id="pj2c53wnl" data-path="src/components/TripRecommendation.tsx">
          <h3 className="font-bold text-lg mb-2" data-id="kvv57s58g" data-path="src/components/TripRecommendation.tsx">Accommodation</h3>
          <div className="bg-gray-50 p-3 rounded-md" data-id="ek70vw8za" data-path="src/components/TripRecommendation.tsx">
            <div className="flex justify-between" data-id="oo14j6eka" data-path="src/components/TripRecommendation.tsx">
              <h4 className="font-bold" data-id="awhotipzi" data-path="src/components/TripRecommendation.tsx">{trip.accommodation.name}</h4>
              <div className="flex" data-id="o46xbhbie" data-path="src/components/TripRecommendation.tsx">
                {[...Array(trip.accommodation.rating)].map((_, i) =>
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" data-id="9ktnrkwvv" data-path="src/components/TripRecommendation.tsx">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-id="nm0qr7qd8" data-path="src/components/TripRecommendation.tsx" />
                  </svg>
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2" data-id="fs5ae3wst" data-path="src/components/TripRecommendation.tsx">
              {trip.accommodation.amenities.map((amenity, index) =>
                <Badge key={index} variant="outline" className="bg-white" data-id="blkd2l9ni" data-path="src/components/TripRecommendation.tsx">{amenity}</Badge>
              )}
            </div>
          </div>
        </div>

        <div data-id="195wnfms4" data-path="src/components/TripRecommendation.tsx">
          <h3 className="font-bold text-lg mb-2" data-id="f8h3bit7l" data-path="src/components/TripRecommendation.tsx">Package Inclusions</h3>
          <ul className="list-disc list-inside text-gray-700" data-id="8gxjbdb2p" data-path="src/components/TripRecommendation.tsx">
            {trip.inclusions.map((inclusion, index) =>
              <li key={index} data-id="ldtt1aofa" data-path="src/components/TripRecommendation.tsx">{inclusion}</li>
            )}
          </ul>
        </div>

        <div data-id="9u4i0ea7c" data-path="src/components/TripRecommendation.tsx">
          <h3 className="font-bold text-lg mb-2" data-id="danu6d3kh" data-path="src/components/TripRecommendation.tsx">Travel Tips</h3>
          <ul className="list-disc list-inside text-gray-700" data-id="0qa018yn1" data-path="src/components/TripRecommendation.tsx">
            {trip.recommendations.map((tip, index) =>
              <li key={index} data-id="z58tkkjpp" data-path="src/components/TripRecommendation.tsx">{tip}</li>
            )}
          </ul>
        </div>

        <Separator data-id="jfw9cmgze" data-path="src/components/TripRecommendation.tsx" />

        <div className="flex flex-col sm:flex-row gap-4" data-id="o6n4etefa" data-path="src/components/TripRecommendation.tsx">
          <Button
            onClick={onNewTrip}
            variant="outline"
            className="flex-1" data-id="har8667bw" data-path="src/components/TripRecommendation.tsx">

            Create New Trip
          </Button>
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="flex-1 border-yellow-400 text-yellow-700 hover:bg-yellow-50" data-id="ajv4dp6mz" data-path="src/components/TripRecommendation.tsx">

            Add to Cart
          </Button>
          <Button
            onClick={handleBookNow}
            className="flex-1 bg-aerotrav-blue hover:bg-aerotrav-blue/90 text-white" data-id="v55wf7rgr" data-path="src/components/TripRecommendation.tsx">

            Book Now
          </Button>
        </div>
      </div>
    </Card>);

};

export default TripRecommendation;