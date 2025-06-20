import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import { useCart } from "@/contexts/CartContext";

const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState<string>("May 15, 2024");
  const [guests, setGuests] = React.useState<number>(2);
  const [nights, setNights] = React.useState<number>(3);

  // Mock hotel data (in a real app, this would be fetched based on the id)
  const hotel = {
    id: Number(id) || 1,
    name: "Kuta Seaview Boutique Resort",
    location: "Bali",
    stars: 4.8,
    reviewCount: 34,
    rating: 9.2,
    images: [
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1587985064135-0366536eab42?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"],

    description: "Located close to Beachwalk Shopping Center and Poppies Lane II, Kuta Seaview Boutique Resort provides a poolside bar, a terrace and a garden. Take some time to relax at the on-site spa. Be sure to enjoy a meal at Rosso Vivo Dine & Lounge, the on-site restaurant. In addition to laundry facilities and car hire on-site, guests can connect to free in-room WiFi.",
    perks: [
    "An outdoor pool with sun loungers and pool umbrellas.",
    "Free self-parking.",
    "Buffet breakfast (surcharge), a round-trip airport shuttle (surcharge) and luggage storage.",
    "A lift and a 24-hour front desk.",
    "Guest reviews speak highly of the breakfast, helpful staff and location."],

    roomFeatures: [
    "All 91 rooms offer comforts such as air conditioning and bathrobes, as well as perks such as free WiFi and safes.",
    "Extra conveniences in all rooms include:",
    [
    "Free tea bags/instant coffee and electric kettles",
    "Bathrooms with rainfall showers and free toiletries",
    "42-inch LED TVs with premium channels",
    "Balconies or patios, free infant beds and daily housekeeping"]],

    roomTypes: [
    {
      id: 1,
      name: "Superior King Room",
      price: 567,
      priceWithTax: 632,
      capacity: 2,
      size: "35 m²",
      bedType: "1 King Bed",
      amenities: ["Free WiFi", "Breakfast included", "Air conditioning", "Flat-screen TV", "Private bathroom"],
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      name: "Deluxe Ocean View Suite",
      price: 892,
      priceWithTax: 965,
      capacity: 3,
      size: "48 m²",
      bedType: "1 King Bed and 1 Sofa Bed",
      amenities: ["Free WiFi", "Breakfast included", "Ocean view", "Air conditioning", "Minibar", "Flat-screen TV", "Balcony", "Private bathroom"],
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      name: "Family Room",
      price: 780,
      priceWithTax: 842,
      capacity: 4,
      size: "52 m²",
      bedType: "2 Queen Beds",
      amenities: ["Free WiFi", "Breakfast included", "Air conditioning", "Flat-screen TV", "Private bathroom", "Kitchenette"],
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }],


    languages: ["English", "Indonesian"],
    price: 567,
    amenities: ["1 King Bed", "Free Breakfast", "Wi-fi"],
    reviews: [
    {
      id: 1,
      author: "Michael R.",
      rating: 5,
      date: "March 2024",
      comment: "This hotel exceeded all our expectations. The room was spacious and clean, the staff was incredibly friendly, and the location was perfect - just a short walk to the beach. The breakfast buffet had so many options and everything tasted great!"
    },
    {
      id: 2,
      author: "Sarah L.",
      rating: 4,
      date: "February 2024",
      comment: "Beautiful resort with excellent amenities. The pool area is stunning and we loved the restaurant. Only minor issue was the WiFi being a bit spotty at times, but overall a wonderful stay."
    },
    {
      id: 3,
      author: "David T.",
      rating: 5,
      date: "January 2024",
      comment: "Perfect location, incredible staff, and wonderful rooms. The spa services were top-notch and reasonably priced. We've already booked our return visit for next year!"
    }]

  };

  const handleBooking = (roomTypeId: number) => {
    navigate(`/hotel-booking/${id}?roomType=${roomTypeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-id="aa8zesoxy" data-path="src/pages/HotelDetailsPage.tsx">
      <Header data-id="y9uc0n1pp" data-path="src/pages/HotelDetailsPage.tsx" />
      
      <main className="flex-grow" data-id="mb1g96nv1" data-path="src/pages/HotelDetailsPage.tsx">
        <div className="bg-aerotrav-blue py-8 px-4" data-id="zoxvqxj5t" data-path="src/pages/HotelDetailsPage.tsx">
          <div className="container mx-auto" data-id="t45n96xzv" data-path="src/pages/HotelDetailsPage.tsx">
            <h1 className="text-2xl md:text-3xl font-bold text-white" data-id="egqrg8kyj" data-path="src/pages/HotelDetailsPage.tsx">Hotel Details</h1>
          </div>
        </div>
        
        <div className="container mx-auto py-8 px-4" data-id="1uuk1kikg" data-path="src/pages/HotelDetailsPage.tsx">
          {/* Hotel Overview */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8" data-id="6fs1931z8" data-path="src/pages/HotelDetailsPage.tsx">
            <div className="mb-6" data-id="j6dzhpwz0" data-path="src/pages/HotelDetailsPage.tsx">
              <h2 className="text-3xl font-bold mb-2" data-id="fjnmf9j7o" data-path="src/pages/HotelDetailsPage.tsx">{hotel.name}</h2>
              <div className="flex flex-wrap items-center mb-2 gap-2" data-id="iklbrzvmr" data-path="src/pages/HotelDetailsPage.tsx">
                <div className="flex items-center" data-id="mekhodkc3" data-path="src/pages/HotelDetailsPage.tsx">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-id="7my04nr8q" data-path="src/pages/HotelDetailsPage.tsx">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-id="m3jvx7cx9" data-path="src/pages/HotelDetailsPage.tsx"></path>
                  </svg>
                  <span className="ml-1 text-gray-700" data-id="1m7w85l7f" data-path="src/pages/HotelDetailsPage.tsx">{hotel.stars}</span>
                </div>
                <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-medium text-sm" data-id="q1cjdvwny" data-path="src/pages/HotelDetailsPage.tsx">
                  {hotel.rating}/10 Excellent
                </div>
                <span className="text-gray-600" data-id="a60lm2g4p" data-path="src/pages/HotelDetailsPage.tsx">({hotel.reviewCount} Reviews)</span>
                <div className="flex items-center text-gray-700" data-id="4hw0tp2da" data-path="src/pages/HotelDetailsPage.tsx">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-id="44ey78y30" data-path="src/pages/HotelDetailsPage.tsx">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" data-id="df6gr0ucj" data-path="src/pages/HotelDetailsPage.tsx"></path>
                  </svg>
                  <span className="ml-1" data-id="1waa9z791" data-path="src/pages/HotelDetailsPage.tsx">{hotel.location}</span>
                </div>
              </div>
            </div>
            
            {/* Image gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" data-id="b51dmqy4k" data-path="src/pages/HotelDetailsPage.tsx">
              <div className="md:col-span-2" data-id="7vf96hxro" data-path="src/pages/HotelDetailsPage.tsx">
                <img src={hotel.images[0]} alt={hotel.name} className="w-full h-80 object-cover rounded-lg" data-id="hkhqjacyc" data-path="src/pages/HotelDetailsPage.tsx" />
              </div>
              <div className="grid grid-cols-2 gap-4" data-id="x5yzzld6g" data-path="src/pages/HotelDetailsPage.tsx">
                {hotel.images.slice(1, 5).map((image, idx) =>
                <div key={idx} className="h-36 overflow-hidden" data-id="0ip4g3n07" data-path="src/pages/HotelDetailsPage.tsx">
                    <img src={image} alt={`${hotel.name} view ${idx + 1}`} className="w-full h-full object-cover rounded-lg transition-transform hover:scale-105" data-id="kzl4rdy8h" data-path="src/pages/HotelDetailsPage.tsx" />
                  </div>
                )}
              </div>
            </div>
            
            {/* About this hotel section */}
            <div className="mb-8" data-id="ld2wsdhqv" data-path="src/pages/HotelDetailsPage.tsx">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2" data-id="65lyrl111" data-path="src/pages/HotelDetailsPage.tsx">About this hotel</h3>
              <p className="text-gray-700 mb-6 leading-relaxed" data-id="hca2a6ql0" data-path="src/pages/HotelDetailsPage.tsx">{hotel.description}</p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-bold mb-3 text-gray-800 flex items-center" data-id="ow6ac8ucr" data-path="src/pages/HotelDetailsPage.tsx">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Other perks include
                  </h4>
                  <ul className="space-y-2 text-gray-700" data-id="fvszdawsu" data-path="src/pages/HotelDetailsPage.tsx">
                    {hotel.perks.map((perk, idx) =>
                    <li key={idx} className="flex items-start" data-id="d5e0w0faz" data-path="src/pages/HotelDetailsPage.tsx">
                        <svg className="w-4 h-4 mt-1 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {perk}
                      </li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold mb-3 text-gray-800 flex items-center" data-id="psp5tqeoq" data-path="src/pages/HotelDetailsPage.tsx">
                    <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Room features
                  </h4>
                  <p className="text-gray-700 mb-2" data-id="jltx0cbpl" data-path="src/pages/HotelDetailsPage.tsx">{hotel.roomFeatures[0]}</p>
                  <p className="text-gray-700 mb-3" data-id="wb5ne1316" data-path="src/pages/HotelDetailsPage.tsx">{hotel.roomFeatures[1]}</p>
                  <ul className="space-y-1 text-gray-700" data-id="8qcuyugd3" data-path="src/pages/HotelDetailsPage.tsx">
                    {Array.isArray(hotel.roomFeatures[2]) && hotel.roomFeatures[2].map((feature, idx) =>
                    <li key={idx} className="flex items-start" data-id="xiiyutyi6" data-path="src/pages/HotelDetailsPage.tsx">
                        <svg className="w-4 h-4 mt-1 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <h4 className="text-lg font-bold mb-3 text-gray-800 flex items-center" data-id="o5p85uxq1" data-path="src/pages/HotelDetailsPage.tsx">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                  </svg>
                  Languages used in the hotel
                </h4>
                <div className="flex flex-wrap gap-2">
                  {hotel.languages.map((language, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Room details and booking section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8" data-id="mbi1yw22m" data-path="src/pages/HotelDetailsPage.tsx">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center" data-id="20d7yycue" data-path="src/pages/HotelDetailsPage.tsx">
              <svg className="w-6 h-6 mr-2 text-aerotrav-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Available Room Types & Images
            </h3>
            
            <div className="space-y-6" data-id="ami4acgfd" data-path="src/pages/HotelDetailsPage.tsx">
              {hotel.roomTypes.map((room) =>
              <div key={room.id} className="border rounded-lg overflow-hidden" data-id="qxtdeianq" data-path="src/pages/HotelDetailsPage.tsx">
                  <div className="flex flex-col md:flex-row" data-id="qpkstn1ac" data-path="src/pages/HotelDetailsPage.tsx">
                    <div className="md:w-1/3 h-48" data-id="g2cjvjvxa" data-path="src/pages/HotelDetailsPage.tsx">
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover" data-id="3ujx3d0zy" data-path="src/pages/HotelDetailsPage.tsx" />
                    </div>
                    <div className="p-4 md:p-6 flex flex-col justify-between flex-grow" data-id="ss2ugvd0c" data-path="src/pages/HotelDetailsPage.tsx">
                      <div data-id="h89i6ny9r" data-path="src/pages/HotelDetailsPage.tsx">
                        <h4 className="text-lg font-bold text-gray-800" data-id="cdjcua56g" data-path="src/pages/HotelDetailsPage.tsx">{room.name}</h4>
                        <div className="flex items-center mt-2 text-sm text-gray-600" data-id="zvzap49vo" data-path="src/pages/HotelDetailsPage.tsx">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-id="4xihzahb3" data-path="src/pages/HotelDetailsPage.tsx">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" data-id="zx9af3se2" data-path="src/pages/HotelDetailsPage.tsx"></path>
                          </svg>
                          {room.size}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600" data-id="l6qdyt4l1" data-path="src/pages/HotelDetailsPage.tsx">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-id="16dxu1voe" data-path="src/pages/HotelDetailsPage.tsx">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-id="lxuwk6ulr" data-path="src/pages/HotelDetailsPage.tsx"></path>
                          </svg>
                          Up to {room.capacity} guests
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600" data-id="bpe94eca5" data-path="src/pages/HotelDetailsPage.tsx">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-id="8urb4l3gp" data-path="src/pages/HotelDetailsPage.tsx">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-id="mpjadi9e7" data-path="src/pages/HotelDetailsPage.tsx"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" data-id="v5r7jxzov" data-path="src/pages/HotelDetailsPage.tsx"></path>
                          </svg>
                          {room.bedType}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-3" data-id="e2c7cl1rh" data-path="src/pages/HotelDetailsPage.tsx">
                          {room.amenities.map((amenity, idx) =>
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-id="60tynxtoz" data-path="src/pages/HotelDetailsPage.tsx">
                              {amenity}
                            </span>
                        )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-4 gap-4" data-id="sfyf8za0q" data-path="src/pages/HotelDetailsPage.tsx">
                        <div data-id="46x2lln8j" data-path="src/pages/HotelDetailsPage.tsx">
                          <div className="font-bold text-2xl text-gray-900" data-id="aovbwayqp" data-path="src/pages/HotelDetailsPage.tsx">MYR {room.price}</div>
                          <div className="text-sm text-gray-500" data-id="ium4iod28" data-path="src/pages/HotelDetailsPage.tsx">MYR {room.priceWithTax} incl. taxes & fees</div>
                          <div className="text-xs text-gray-500" data-id="iip5l8s5z" data-path="src/pages/HotelDetailsPage.tsx">per night</div>
                        </div>
                        <div className="flex gap-2" data-id="1n6jbgljm" data-path="src/pages/HotelDetailsPage.tsx">
                          <Button
                          onClick={() => handleBooking(room.id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium" data-id="298r9vliq" data-path="src/pages/HotelDetailsPage.tsx">
                            Book Now
                          </Button>
                          <AddToCartButton
                          item={{
                            id: `hotel-${hotel.id}-room-${room.id}`,
                            type: 'hotel',
                            name: `${room.name} at ${hotel.name}`,
                            image: room.image,
                            price: room.priceWithTax,
                            details: {
                              hotelId: hotel.id,
                              hotelName: hotel.name,
                              roomId: room.id,
                              roomType: room.name,
                              location: hotel.location,
                              dates: {
                                start: selectedDate,
                                nights: nights
                              },
                              guests: guests,
                              amenities: room.amenities
                            }
                          }} data-id="aubt7yw5k" data-path="src/pages/HotelDetailsPage.tsx" />

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Reviews section */}
          <div className="bg-white rounded-lg shadow-md p-6" data-id="mzbkinb30" data-path="src/pages/HotelDetailsPage.tsx">
            <div className="flex items-center justify-between mb-4" data-id="u21ip5awr" data-path="src/pages/HotelDetailsPage.tsx">
              <h3 className="text-xl font-bold text-gray-800" data-id="es7iki9mh" data-path="src/pages/HotelDetailsPage.tsx">Guest Reviews</h3>
              <div className="flex items-center" data-id="qr8adsmyu" data-path="src/pages/HotelDetailsPage.tsx">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md font-medium text-lg mr-2" data-id="007tvwke3" data-path="src/pages/HotelDetailsPage.tsx">
                  {hotel.rating}/10
                </div>
                <div data-id="is7ww9uq7" data-path="src/pages/HotelDetailsPage.tsx">
                  <div className="font-medium" data-id="q65r14j06" data-path="src/pages/HotelDetailsPage.tsx">Excellent</div>
                  <div className="text-sm text-gray-600" data-id="yry3kafvd" data-path="src/pages/HotelDetailsPage.tsx">{hotel.reviewCount} reviews</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4" data-id="16jxnm9ty" data-path="src/pages/HotelDetailsPage.tsx">
              {hotel.reviews.map((review) =>
              <div key={review.id} className="border-b pb-4 last:border-0" data-id="ba67umv2j" data-path="src/pages/HotelDetailsPage.tsx">
                  <div className="flex items-center justify-between mb-2" data-id="np1zq1il7" data-path="src/pages/HotelDetailsPage.tsx">
                    <div className="font-medium" data-id="3t3m6j7w4" data-path="src/pages/HotelDetailsPage.tsx">{review.author}</div>
                    <div className="text-sm text-gray-600" data-id="ivgu8m2ab" data-path="src/pages/HotelDetailsPage.tsx">{review.date}</div>
                  </div>
                  <div className="flex items-center mb-2" data-id="zuf6bnlik" data-path="src/pages/HotelDetailsPage.tsx">
                    {[...Array(5)].map((_, idx) =>
                  <svg key={idx} className={`w-5 h-5 ${idx < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-id="w1nq22buv" data-path="src/pages/HotelDetailsPage.tsx">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-id="8os9mrx6k" data-path="src/pages/HotelDetailsPage.tsx"></path>
                      </svg>
                  )}
                  </div>
                  <p className="text-gray-700" data-id="gt0uigdnq" data-path="src/pages/HotelDetailsPage.tsx">{review.comment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer data-id="byx7psc2z" data-path="src/pages/HotelDetailsPage.tsx" />
    </div>);

};

export default HotelDetailsPage;