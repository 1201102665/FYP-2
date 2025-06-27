import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCartContext } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Eye, Check } from 'lucide-react';

interface FlightCardProps {
  id: number;
  airline: string;
  logo?: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  departureAirport: string;
  arrivalAirport: string;
  direct: boolean;
  price: number;
  currency: string;
  travelClass?: string;
}

const FlightCard: React.FC<FlightCardProps> = ({
  id,
  airline,
  logo,
  departureTime,
  arrivalTime,
  duration,
  departureAirport,
  arrivalAirport,
  direct,
  price,
  currency,
  travelClass = 'Economy'
}) => {
  const navigate = useNavigate();
  const { addToCart, items } = useCartContext();

  const handleSelect = () => {
    navigate('/flight-booking', {
      state: {
        flightId: id,
        airline,
        logo,
        departureTime,
        arrivalTime,
        duration,
        departureAirport,
        arrivalAirport,
        direct,
        price,
        currency
      }
    });
  };

  const handleViewDetails = () => {
    navigate(`/flight-details/${id}`, {
      state: {
        flightId: id,
        airline,
        logo,
        departureTime,
        arrivalTime,
        duration,
        departureAirport,
        arrivalAirport,
        departureCity: departureAirport.split(' (')[0],
        arrivalCity: arrivalAirport.split(' (')[0],
        direct,
        stops: direct ? 0 : 1,
        price,
        currency,
        aircraft: "Airbus A320",
        carbonEmission: "Low",
        refundable: false
      }
    });
  };

  const cartItem = {
    id: id.toString(),
    type: 'flight' as const,
    name: `${departureAirport} to ${arrivalAirport}`,
    price: price,
    details: {
      airline,
      departureTime,
      arrivalTime,
      duration,
      departureAirport,
      arrivalAirport,
      direct
    },
    image: logo
  };

  const isInCart = items.some((item) => item.id === cartItem.id && item.type === cartItem.type);

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart(cartItem, navigate);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md" data-id="y385omtyj" data-path="src/components/FlightCard.tsx">
      <div className="flex flex-col md:flex-row items-center p-4 gap-4" data-id="8hnc9ioqt" data-path="src/components/FlightCard.tsx">
        <div className="flex items-center gap-4 w-full md:w-auto" data-id="nch10vyx5" data-path="src/components/FlightCard.tsx">
          <div className="flex-shrink-0 w-20 h-20 bg-white rounded-md overflow-hidden flex items-center justify-center" data-id="aqmfwlmxt" data-path="src/components/FlightCard.tsx">
            {logo ? (
              <img src={logo} alt={airline} className="w-16 h-16 object-contain" data-id="x9rbsxp2l" data-path="src/components/FlightCard.tsx" />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-xs font-medium text-center">
                {airline.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 flex-grow" data-id="x4m6exlrd" data-path="src/components/FlightCard.tsx">
            <div className="flex items-center gap-2" data-id="n1atzoxnh" data-path="src/components/FlightCard.tsx">
              <span className="text-xl font-bold" data-id="pz9mam6g1" data-path="src/components/FlightCard.tsx">{departureTime}</span>
              <div className="relative w-20 md:w-32 h-0.5 bg-green-500" data-id="6wu6rmknj" data-path="src/components/FlightCard.tsx">
                <div className="absolute w-2 h-2 bg-green-500 rounded-full -top-0.75 -left-1" data-id="64bfkk5cr" data-path="src/components/FlightCard.tsx"></div>
                <div className="absolute w-2 h-2 bg-green-500 rounded-full -top-0.75 -right-1" data-id="bxkpdt04r" data-path="src/components/FlightCard.tsx"></div>
              </div>
              <span className="text-xl font-bold" data-id="1ov2nlkk8" data-path="src/components/FlightCard.tsx">{arrivalTime}</span>
            </div>
            
            <div className="text-sm md:text-base text-center md:text-left" data-id="6lh4f0q90" data-path="src/components/FlightCard.tsx">
              <p data-id="2ugglvbu8" data-path="src/components/FlightCard.tsx">{departureAirport} - {arrivalAirport}</p>
              <p data-id="7wcd8h1p6" data-path="src/components/FlightCard.tsx">{airline} • {travelClass}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4" data-id="bstlvi0eg" data-path="src/components/FlightCard.tsx">
          <div className="flex items-center gap-2" data-id="k6luohu8m" data-path="src/components/FlightCard.tsx">
            <span className="text-base font-medium" data-id="we9gls00v" data-path="src/components/FlightCard.tsx">{duration}•</span>
            <span className="text-green-600 font-medium" data-id="9wa8mmcrf" data-path="src/components/FlightCard.tsx">{direct ? 'Direct' : 'Non-direct'}</span>
          </div>
          
          <div className="flex flex-col items-end" data-id="sqq0yvb4o" data-path="src/components/FlightCard.tsx">
            <span className="text-xl font-bold" data-id="bja7styvd" data-path="src/components/FlightCard.tsx">{currency}{price}</span>
            <span className="text-xs text-gray-500" data-id="i2wta2vag" data-path="src/components/FlightCard.tsx">Return per traveler</span>
          </div>
          
          <div className="flex flex-col gap-2" data-id="7frzzxzzo" data-path="src/components/FlightCard.tsx">
            <Button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`${
                isInCart 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-aerotrav-yellow hover:bg-aerotrav-yellow-500 text-black'
              } font-medium px-4 py-2 rounded-md transition-colors`}
            >
              {isInCart ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleViewDetails}
              className="text-aerotrav-blue border-aerotrav-blue hover:bg-aerotrav-blue hover:text-white px-4 py-2 rounded-md transition-colors"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>);

};

export default FlightCard;