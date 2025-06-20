import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HotelSearchForm = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("12/02/2025");
  const [checkOutDate, setCheckOutDate] = useState("12/02/2025");
  const [guests, setGuests] = useState("2 Adults, 1 Room");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would pass these as query params
    navigate("/hotels");
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md" data-id="2m2kc5p2r" data-path="src/components/HotelSearchForm.tsx">
      <div className="flex flex-col md:flex-row gap-2" data-id="jp7yitn7l" data-path="src/components/HotelSearchForm.tsx">
        <div className="flex-1" data-id="wuad9yyjc" data-path="src/components/HotelSearchForm.tsx">
          <label htmlFor="destination" className="sr-only" data-id="7lwqn9tpn" data-path="src/components/HotelSearchForm.tsx">Where do you want to stay?</label>
          <input
            type="text"
            id="destination"
            placeholder="Enter destination or hotel name"
            className="w-full p-2 border rounded-md"
            value={destination}
            onChange={(e) => setDestination(e.target.value)} data-id="gc7ixp0kt" data-path="src/components/HotelSearchForm.tsx" />

        </div>
        
        <div className="grid grid-cols-2 md:w-1/4 gap-2" data-id="t0cs9u4on" data-path="src/components/HotelSearchForm.tsx">
          <div data-id="8bgnu1dmi" data-path="src/components/HotelSearchForm.tsx">
            <label htmlFor="check-in" className="sr-only" data-id="f0i3lcics" data-path="src/components/HotelSearchForm.tsx">Check-in</label>
            <input
              type="text"
              id="check-in"
              placeholder="Check-in"
              className="w-full p-2 border rounded-md"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)} data-id="hnw9qqdp7" data-path="src/components/HotelSearchForm.tsx" />

          </div>
          <div data-id="7op02u2bz" data-path="src/components/HotelSearchForm.tsx">
            <label htmlFor="check-out" className="sr-only" data-id="br5lraad7" data-path="src/components/HotelSearchForm.tsx">Check-out</label>
            <input
              type="text"
              id="check-out"
              placeholder="Check-out"
              className="w-full p-2 border rounded-md"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)} data-id="uh235cx9y" data-path="src/components/HotelSearchForm.tsx" />

          </div>
        </div>
        
        <div className="md:w-1/5" data-id="i5j5hskqt" data-path="src/components/HotelSearchForm.tsx">
          <label htmlFor="guests" className="sr-only" data-id="f1ef0qn2j" data-path="src/components/HotelSearchForm.tsx">Guests & Rooms</label>
          <input
            type="text"
            id="guests"
            placeholder="Guests & Rooms"
            className="w-full p-2 border rounded-md"
            value={guests}
            onChange={(e) => setGuests(e.target.value)} data-id="0s6z74mn6" data-path="src/components/HotelSearchForm.tsx" />

        </div>
        
        <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium" data-id="vvqteh67d" data-path="src/components/HotelSearchForm.tsx">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-id="q5yz6gk56" data-path="src/components/HotelSearchForm.tsx">
            <circle cx="11" cy="11" r="8" data-id="8k5hihmx7" data-path="src/components/HotelSearchForm.tsx"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65" data-id="ryp7z0w9r" data-path="src/components/HotelSearchForm.tsx"></line>
          </svg>
        </Button>
      </div>
    </form>);

};

export default HotelSearchForm;