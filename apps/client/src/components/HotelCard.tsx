import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/AddToCartButton";
import { useToast } from "@/hooks/use-toast";

interface HotelProps {
  id: number;
  name: string;
  location: string;
  stars: number;
  rating: number;
  reviewCount: number;
  price: number;
  images: string[];
  perks: string[];
  nights: number;
  startDate: string;
  endDate: string;
}

interface HotelCardProps {
  hotel: HotelProps;
  onBookNow: () => void;
}

const HotelCard = ({ hotel, onBookNow }: HotelCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleHotelClick = () => {
    navigate(`/hotel-details/${hotel.id}`, {
      state: { hotel }
    });
  };

  const handleBookingClick = () => {
    navigate('/hotel-booking', {
      state: { hotel }
    });
  };

  // Prepare hotel data for cart
  const cartItem = {
    id: hotel.id,
    type: 'hotel' as const,
    title: hotel.name,
    price: hotel.price,
    image: hotel.images[0],
    quantity: 1,
    details: {
      location: hotel.location,
      stars: hotel.stars,
      rating: hotel.rating,
      reviewCount: hotel.reviewCount,
      nights: hotel.nights,
      startDate: hotel.startDate,
      endDate: hotel.endDate,
      perks: hotel.perks
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100" data-id="z7otots36" data-path="src/components/HotelCard.tsx">
      <div className="flex flex-col md:flex-row" data-id="9eue5dvum" data-path="src/components/HotelCard.tsx">
        <div
          className="md:w-1/3 h-48 md:h-auto cursor-pointer"
          onClick={handleHotelClick}
          data-id="6wybeqtof"
          data-path="src/components/HotelCard.tsx"
        >
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" data-id="pr1b11o5n" data-path="src/components/HotelCard.tsx" />

        </div>

        <div className="p-4 flex flex-col justify-between flex-grow" data-id="qhs9f4nn9" data-path="src/components/HotelCard.tsx">
          <div data-id="ek132p28s" data-path="src/components/HotelCard.tsx">
            <h3
              className="text-lg font-bold cursor-pointer hover:text-aerotrav-blue transition-colors"
              onClick={handleHotelClick}
              data-id="oghfbjooo"
              data-path="src/components/HotelCard.tsx"
            >
              {hotel.name}
            </h3>
            <p className="text-sm text-gray-600" data-id="ckit6h50n" data-path="src/components/HotelCard.tsx">{hotel.location}</p>

            <div className="flex items-center mt-2" data-id="9umoifv56" data-path="src/components/HotelCard.tsx">
              <div className="flex items-center" data-id="foisnzfv3" data-path="src/components/HotelCard.tsx">
                <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-id="byz3grhis" data-path="src/components/HotelCard.tsx">
                  <path d="M7 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm8 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" data-id="odmfrk7be" data-path="src/components/HotelCard.tsx"></path>
                </svg>
                <span className="ml-1 text-sm text-gray-700" data-id="yjo1ijy2k" data-path="src/components/HotelCard.tsx">{hotel.stars} stars - {hotel.rating}/10 Excellent ({hotel.reviewCount})</span>
              </div>
            </div>

            <div className="flex items-center mt-2" data-id="y9silp800" data-path="src/components/HotelCard.tsx">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-id="gcytlkxpw" data-path="src/components/HotelCard.tsx">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-id="gfo38zkm7" data-path="src/components/HotelCard.tsx"></path>
              </svg>
              <span className="ml-1 text-sm text-gray-700" data-id="52785lrut" data-path="src/components/HotelCard.tsx">KUL - DPS</span>
            </div>

            {hotel.perks.map((perk, index) =>
              <div key={index} className="flex items-center mt-1" data-id="44n14ndym" data-path="src/components/HotelCard.tsx">
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-id="z9feifs6b" data-path="src/components/HotelCard.tsx">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" data-id="65gkpmkab" data-path="src/components/HotelCard.tsx"></path>
                </svg>
                <span className="ml-1 text-sm text-gray-700" data-id="cb9n1ek0s" data-path="src/components/HotelCard.tsx">{perk}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-end justify-between" data-id="t4sj6u0ky" data-path="src/components/HotelCard.tsx">
            <div data-id="cmpxffhzg" data-path="src/components/HotelCard.tsx">
              <p className="font-bold text-xl text-gray-900" data-id="e2bsawmqz" data-path="src/components/HotelCard.tsx">RM {hotel.price}</p>
              <p className="text-xs text-gray-600" data-id="rbhje2hz4" data-path="src/components/HotelCard.tsx">per traveller</p>
              <p className="text-xs text-gray-500" data-id="i0pua1vro" data-path="src/components/HotelCard.tsx">{hotel.startDate} - {hotel.endDate} ({hotel.nights} nights)</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <AddToCartButton
                item={cartItem}
                variant="outline"
                size="sm"
                className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
              />
              <Button
                onClick={handleHotelClick}
                variant="outline"
                size="sm"
                className="border-aerotrav-blue text-aerotrav-blue hover:bg-aerotrav-blue hover:text-white"
                data-id="view-details-btn"
                data-path="src/components/HotelCard.tsx"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default HotelCard;