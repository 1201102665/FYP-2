import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HotelBookingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = window.location;
  const queryParams = new URLSearchParams(location.search);
  const roomTypeId = queryParams.get('roomType') || '1';

  // Mock hotel package data - in a real app, we would fetch this based on the ID and roomTypeId
  const roomTypes = [
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
  }];


  const selectedRoomType = roomTypes.find((room) => room.id === Number(roomTypeId)) || roomTypes[0];

  const hotelPackage = {
    id: Number(id) || 1,
    name: "Kuta Seaview Boutique Resort",
    location: "Bali",
    stars: 4.8,
    rating: 8.8,
    reviewCount: 34,
    roomType: selectedRoomType.name,
    price: selectedRoomType.price,
    priceWithTax: selectedRoomType.priceWithTax,
    nights: 3,
    startDate: "Wed, 15 May",
    endDate: "Sat, 18 May",
    breakdown: {
      roomCharge: selectedRoomType.price * 3, // 3 nights
      taxes: Math.round((selectedRoomType.priceWithTax - selectedRoomType.price) * 3), // tax difference for 3 nights
      total: selectedRoomType.priceWithTax * 3 // total with tax for 3 nights
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/booking-confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-id="udx0el6y2" data-path="src/pages/HotelBookingPage.tsx">
      <Header data-id="jiefiwt5y" data-path="src/pages/HotelBookingPage.tsx" />
      
      <main className="flex-grow" data-id="wqadvsire" data-path="src/pages/HotelBookingPage.tsx">
        <div className="bg-aerotrav-blue py-6 px-4" data-id="1fnkzjart" data-path="src/pages/HotelBookingPage.tsx">
          <div className="container mx-auto" data-id="6b9jym70l" data-path="src/pages/HotelBookingPage.tsx">
            <h1 className="text-2xl font-bold text-white" data-id="f400fw24b" data-path="src/pages/HotelBookingPage.tsx">Complete your booking</h1>
            <p className="text-white text-sm mt-1" data-id="4k31xfk86" data-path="src/pages/HotelBookingPage.tsx">Just a few more details to confirm your reservation</p>
          </div>
        </div>
        
        <div className="container mx-auto py-6 px-4" data-id="glrc0c6bl" data-path="src/pages/HotelBookingPage.tsx">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-id="1yc02vjr2" data-path="src/pages/HotelBookingPage.tsx">
            <div className="lg:col-span-2 space-y-6" data-id="ug50l323r" data-path="src/pages/HotelBookingPage.tsx">
              {/* Hotel Package Info */}
              <div className="bg-white rounded-lg shadow-md p-4" data-id="byyk8vt4a" data-path="src/pages/HotelBookingPage.tsx">
                <div className="flex flex-col md:flex-row gap-4" data-id="0avdeikpk" data-path="src/pages/HotelBookingPage.tsx">
                  <div className="md:w-1/3 w-full h-48" data-id="6nahh0pyp" data-path="src/pages/HotelBookingPage.tsx">
                    <img src={selectedRoomType.image} alt={hotelPackage.name} className="w-full h-full object-cover rounded-md" data-id="5e9ydz0ep" data-path="src/pages/HotelBookingPage.tsx" />
                  </div>
                  <div className="flex-1" data-id="12o9cbaus" data-path="src/pages/HotelBookingPage.tsx">
                    <h2 className="text-lg font-bold" data-id="4or6vhuc2" data-path="src/pages/HotelBookingPage.tsx">{hotelPackage.name}</h2>
                    <p className="text-blue-600 font-medium" data-id="lgbev70xw" data-path="src/pages/HotelBookingPage.tsx">{selectedRoomType.name}</p>
                    <p className="text-sm text-gray-600 mt-1" data-id="xe3iltz9l" data-path="src/pages/HotelBookingPage.tsx">{hotelPackage.location}</p>
                    
                    <div className="flex items-center mt-2" data-id="knl43o9g4" data-path="src/pages/HotelBookingPage.tsx">
                      <div className="flex" data-id="8q0x2kcg6" data-path="src/pages/HotelBookingPage.tsx">
                        {[...Array(5)].map((_, idx) =>
                        <svg key={idx} className={`w-4 h-4 ${idx < Math.floor(hotelPackage.stars) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-id="mln04n0t9" data-path="src/pages/HotelBookingPage.tsx">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-id="774fi431q" data-path="src/pages/HotelBookingPage.tsx"></path>
                          </svg>
                        )}
                      </div>
                      <span className="ml-2 text-sm text-gray-700" data-id="fz0iw3nch" data-path="src/pages/HotelBookingPage.tsx">{hotelPackage.rating}/10 ({hotelPackage.reviewCount} reviews)</span>
                    </div>
                    
                    <div className="flex items-center mt-2" data-id="b07x2jaf9" data-path="src/pages/HotelBookingPage.tsx">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-id="hjivfentg" data-path="src/pages/HotelBookingPage.tsx">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-id="winhxylaw" data-path="src/pages/HotelBookingPage.tsx"></path>
                      </svg>
                      <span className="ml-1 text-sm text-gray-700" data-id="fsoa8cofl" data-path="src/pages/HotelBookingPage.tsx">{hotelPackage.startDate} - {hotelPackage.endDate} ({hotelPackage.nights} nights)</span>
                    </div>
                    
                    <div className="flex items-center mt-2" data-id="42qfztor0" data-path="src/pages/HotelBookingPage.tsx">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-id="j4guqjkec" data-path="src/pages/HotelBookingPage.tsx">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" data-id="yysfab1yu" data-path="src/pages/HotelBookingPage.tsx"></path>
                      </svg>
                      <span className="ml-1 text-sm text-gray-700" data-id="q91ecetjb" data-path="src/pages/HotelBookingPage.tsx">{selectedRoomType.size}, {selectedRoomType.bedType}</span>
                    </div>
                    
                    <div className="mt-3" data-id="tn8lq5sv2" data-path="src/pages/HotelBookingPage.tsx">
                      <p className="font-bold text-2xl" data-id="lllj85aeh" data-path="src/pages/HotelBookingPage.tsx">MYR {hotelPackage.price}<span className="text-sm font-normal text-gray-600" data-id="xhmqfnu22" data-path="src/pages/HotelBookingPage.tsx"> per night</span></p>
                      <p className="text-sm font-medium text-gray-700" data-id="sukj1x87n" data-path="src/pages/HotelBookingPage.tsx">MYR {hotelPackage.breakdown.total} total for {hotelPackage.nights} nights</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200" data-id="hy085ovzq" data-path="src/pages/HotelBookingPage.tsx">
                  <h3 className="font-medium mb-2" data-id="7sgn9iow7" data-path="src/pages/HotelBookingPage.tsx">Room amenities:</h3>
                  <div className="flex flex-wrap gap-2" data-id="m1uwdcu2i" data-path="src/pages/HotelBookingPage.tsx">
                    {selectedRoomType.amenities.map((amenity, idx) =>
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-id="1gz7rl0xt" data-path="src/pages/HotelBookingPage.tsx">
                        {amenity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Price Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-4" data-id="8l3n5mdm6" data-path="src/pages/HotelBookingPage.tsx">
                <h2 className="text-lg font-bold mb-4" data-id="zjy13akix" data-path="src/pages/HotelBookingPage.tsx">Package Price Breakdown</h2>
                
                <div className="space-y-3" data-id="ph3fmvz1y" data-path="src/pages/HotelBookingPage.tsx">
                  <div className="flex justify-between items-center" data-id="tsajx6pdo" data-path="src/pages/HotelBookingPage.tsx">
                    <span className="text-sm text-gray-600" data-id="e41wmy9gh" data-path="src/pages/HotelBookingPage.tsx">1 room charge</span>
                    <span className="font-medium" data-id="agmiq0kp8" data-path="src/pages/HotelBookingPage.tsx">MYR{hotelPackage.breakdown.roomCharge}</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between items-center" data-id="eywzehm8h" data-path="src/pages/HotelBookingPage.tsx">
                    <span className="text-sm text-gray-600" data-id="q63ft3axb" data-path="src/pages/HotelBookingPage.tsx">Subtotal</span>
                    <span className="font-medium" data-id="mqycz768x" data-path="src/pages/HotelBookingPage.tsx">MYR{hotelPackage.breakdown.roomCharge}</span>
                  </div>
                  
                  <div className="flex justify-between items-center" data-id="muszv2agu" data-path="src/pages/HotelBookingPage.tsx">
                    <span className="text-sm text-gray-600" data-id="ppk2nlres" data-path="src/pages/HotelBookingPage.tsx">Taxes</span>
                    <span className="font-medium" data-id="r87ek7pej" data-path="src/pages/HotelBookingPage.tsx">MYR{hotelPackage.breakdown.taxes}</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between items-center" data-id="f2ns1lqw5" data-path="src/pages/HotelBookingPage.tsx">
                    <span className="font-medium" data-id="5fjzcvpsm" data-path="src/pages/HotelBookingPage.tsx">Total</span>
                    <span className="font-bold" data-id="6a5vv5qt2" data-path="src/pages/HotelBookingPage.tsx">MYR{hotelPackage.breakdown.total}</span>
                  </div>
                </div>
              </div>
              
              {/* Traveller Details */}
              <form onSubmit={handleSubmit} data-id="7a0a11zgx" data-path="src/pages/HotelBookingPage.tsx">
                <div className="bg-white rounded-lg shadow-md p-4" data-id="s4bc3jucd" data-path="src/pages/HotelBookingPage.tsx">
                  <h2 className="text-xl font-bold mb-6" data-id="4npqpxkev" data-path="src/pages/HotelBookingPage.tsx">Traveller Details</h2>
                  
                  {/* Traveller 1 */}
                  <div className="mb-8" data-id="twcqz5tj3" data-path="src/pages/HotelBookingPage.tsx">
                    <h3 className="text-lg font-medium mb-4" data-id="z75gn6s5l" data-path="src/pages/HotelBookingPage.tsx">Traveler 1</h3>
                    
                    <div className="grid grid-cols-1 gap-4 mb-4" data-id="ao39ijp5s" data-path="src/pages/HotelBookingPage.tsx">
                      <div data-id="jdspmu9p5" data-path="src/pages/HotelBookingPage.tsx">
                        <label htmlFor="name1" className="block text-sm font-medium text-gray-700 mb-1" data-id="u3bsqziz1" data-path="src/pages/HotelBookingPage.tsx">Name</label>
                        <input
                          type="text"
                          id="name1"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Full Name"
                          required data-id="qp8h1hv6v" data-path="src/pages/HotelBookingPage.tsx" />

                      </div>
                      
                      <div data-id="pfgoj4qo1" data-path="src/pages/HotelBookingPage.tsx">
                        <label htmlFor="email1" className="block text-sm font-medium text-gray-700 mb-1" data-id="8k5roshpj" data-path="src/pages/HotelBookingPage.tsx">Email Address</label>
                        <input
                          type="email"
                          id="email1"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Email Address"
                          required data-id="95modwxsp" data-path="src/pages/HotelBookingPage.tsx" />

                      </div>
                      
                      <div data-id="lm7migll6" data-path="src/pages/HotelBookingPage.tsx">
                        <label htmlFor="password1" className="block text-sm font-medium text-gray-700 mb-1" data-id="rtl5vepdt" data-path="src/pages/HotelBookingPage.tsx">Password</label>
                        <input
                          type="password"
                          id="password1"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Password"
                          required data-id="jgfbedb1c" data-path="src/pages/HotelBookingPage.tsx" />

                      </div>
                      
                      <div className="grid grid-cols-2 gap-4" data-id="chx09vsc0" data-path="src/pages/HotelBookingPage.tsx">
                        <div data-id="rsnwptlng" data-path="src/pages/HotelBookingPage.tsx">
                          <label htmlFor="country1" className="block text-sm font-medium text-gray-700 mb-1" data-id="40euskhk9" data-path="src/pages/HotelBookingPage.tsx">Country Code</label>
                          <input
                            type="text"
                            id="country1"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Country Code"
                            required data-id="a0y8c3b2r" data-path="src/pages/HotelBookingPage.tsx" />

                        </div>
                        
                        <div data-id="7vaedj8il" data-path="src/pages/HotelBookingPage.tsx">
                          <label htmlFor="phone1" className="block text-sm font-medium text-gray-700 mb-1" data-id="yy70g1aws" data-path="src/pages/HotelBookingPage.tsx">Phone Number</label>
                          <input
                            type="tel"
                            id="phone1"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Phone Number"
                            required data-id="g0rf0mwed" data-path="src/pages/HotelBookingPage.tsx" />

                        </div>
                      </div>
                      
                      <div data-id="nuv18yab6" data-path="src/pages/HotelBookingPage.tsx">
                        <label className="block text-sm font-medium text-gray-700 mb-1" data-id="c03k4db66" data-path="src/pages/HotelBookingPage.tsx">Date of Birth</label>
                        <div className="grid grid-cols-3 gap-4" data-id="g06dbojtj" data-path="src/pages/HotelBookingPage.tsx">
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Day"
                            required data-id="v30t3nylg" data-path="src/pages/HotelBookingPage.tsx" />

                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Month"
                            required data-id="iqk597cje" data-path="src/pages/HotelBookingPage.tsx" />

                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Year"
                            required data-id="dehdnxbsr" data-path="src/pages/HotelBookingPage.tsx" />

                        </div>
                      </div>
                      
                      <div data-id="tfff06lzv" data-path="src/pages/HotelBookingPage.tsx">
                        <label className="block text-sm font-medium text-gray-700 mb-1" data-id="aysjfl0m5" data-path="src/pages/HotelBookingPage.tsx">Gender</label>
                        <div className="flex gap-4" data-id="cjtr02ad3" data-path="src/pages/HotelBookingPage.tsx">
                          <label className="flex items-center" data-id="ush5gainr" data-path="src/pages/HotelBookingPage.tsx">
                            <input type="radio" name="gender1" value="female" className="mr-2" data-id="30pofdg2u" data-path="src/pages/HotelBookingPage.tsx" /> Female
                          </label>
                          <label className="flex items-center" data-id="jyaz5s1oe" data-path="src/pages/HotelBookingPage.tsx">
                            <input type="radio" name="gender1" value="male" className="mr-2" data-id="fs584sd56" data-path="src/pages/HotelBookingPage.tsx" /> Male
                          </label>
                        </div>
                      </div>
                      
                      <div data-id="hj8ispw1x" data-path="src/pages/HotelBookingPage.tsx">
                        <label htmlFor="country-residence1" className="block text-sm font-medium text-gray-700 mb-1" data-id="r2ykoq1z6" data-path="src/pages/HotelBookingPage.tsx">Country of Residence</label>
                        <input
                          type="text"
                          id="country-residence1"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Country of Residence"
                          required data-id="q681ogy13" data-path="src/pages/HotelBookingPage.tsx" />

                      </div>
                    </div>
                  </div>
                  
                  {/* Traveller 2 */}
                  <div data-id="tfvezacht" data-path="src/pages/HotelBookingPage.tsx">
                    <h3 className="text-lg font-medium mb-4" data-id="q2082oh8q" data-path="src/pages/HotelBookingPage.tsx">Traveler 2</h3>
                    
                    <div className="grid grid-cols-1 gap-4 mb-4" data-id="xil4t2fsb" data-path="src/pages/HotelBookingPage.tsx">
                      <div data-id="5wrnb1izq" data-path="src/pages/HotelBookingPage.tsx">
                        <label htmlFor="name2" className="block text-sm font-medium text-gray-700 mb-1" data-id="0r3456kiu" data-path="src/pages/HotelBookingPage.tsx">Name</label>
                        <input
                          type="text"
                          id="name2"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Full Name"
                          required data-id="0fi2hsinl" data-path="src/pages/HotelBookingPage.tsx" />

                      </div>
                      
                      <div data-id="czv1k3bwm" data-path="src/pages/HotelBookingPage.tsx">
                        <label htmlFor="email2" className="block text-sm font-medium text-gray-700 mb-1" data-id="qka5sw8yc" data-path="src/pages/HotelBookingPage.tsx">Email Address</label>
                        <input
                          type="email"
                          id="email2"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Email Address"
                          required data-id="imrud86sa" data-path="src/pages/HotelBookingPage.tsx" />

                      </div>
                      
                      <div data-id="v8mna654d" data-path="src/pages/HotelBookingPage.tsx">
                        <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-1" data-id="1su18k5cm" data-path="src/pages/HotelBookingPage.tsx">Password</label>
                        <input
                          type="password"
                          id="password2"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Password"
                          required data-id="qoidw50xz" data-path="src/pages/HotelBookingPage.tsx" />

                      </div>
                      
                      <div className="grid grid-cols-2 gap-4" data-id="2szgc7tko" data-path="src/pages/HotelBookingPage.tsx">
                        <div data-id="9khvqrs1t" data-path="src/pages/HotelBookingPage.tsx">
                          <label htmlFor="country2" className="block text-sm font-medium text-gray-700 mb-1" data-id="xq24kgt1v" data-path="src/pages/HotelBookingPage.tsx">Country Code</label>
                          <input
                            type="text"
                            id="country2"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Country Code"
                            required data-id="7c3md9btr" data-path="src/pages/HotelBookingPage.tsx" />

                        </div>
                        
                        <div data-id="xsgy6mk90" data-path="src/pages/HotelBookingPage.tsx">
                          <label htmlFor="phone2" className="block text-sm font-medium text-gray-700 mb-1" data-id="4zzzows76" data-path="src/pages/HotelBookingPage.tsx">Phone Number</label>
                          <input
                            type="tel"
                            id="phone2"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Phone Number"
                            required data-id="dhtqusuo3" data-path="src/pages/HotelBookingPage.tsx" />

                        </div>
                      </div>
                      
                      <div data-id="14ziloel9" data-path="src/pages/HotelBookingPage.tsx">
                        <label className="block text-sm font-medium text-gray-700 mb-1" data-id="wqdc7galz" data-path="src/pages/HotelBookingPage.tsx">Date of Birth</label>
                        <div className="grid grid-cols-3 gap-4" data-id="0222s7806" data-path="src/pages/HotelBookingPage.tsx">
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Day"
                            required data-id="n6tixu6ls" data-path="src/pages/HotelBookingPage.tsx" />

                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Month"
                            required data-id="9fvfzett4" data-path="src/pages/HotelBookingPage.tsx" />

                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Year"
                            required data-id="ozzrtabjj" data-path="src/pages/HotelBookingPage.tsx" />

                        </div>
                      </div>
                      
                      <div data-id="lnywl322t" data-path="src/pages/HotelBookingPage.tsx">
                        <label className="block text-sm font-medium text-gray-700 mb-1" data-id="coir75k8s" data-path="src/pages/HotelBookingPage.tsx">Gender</label>
                        <div className="flex gap-4" data-id="q6ocfjv8n" data-path="src/pages/HotelBookingPage.tsx">
                          <label className="flex items-center" data-id="39jk0c5bl" data-path="src/pages/HotelBookingPage.tsx">
                            <input type="radio" name="gender2" value="female" className="mr-2" data-id="omu7ipgwg" data-path="src/pages/HotelBookingPage.tsx" /> Female
                          </label>
                          <label className="flex items-center" data-id="e9dddrv4q" data-path="src/pages/HotelBookingPage.tsx">
                            <input type="radio" name="gender2" value="male" className="mr-2" data-id="10fp0pxw1" data-path="src/pages/HotelBookingPage.tsx" /> Male
                          </label>
                        </div>
                      </div>
                      
                      <div data-id="2vyhng2c8" data-path="src/pages/HotelBookingPage.tsx">
                        <label htmlFor="country-residence2" className="block text-sm font-medium text-gray-700 mb-1" data-id="tdorekrx6" data-path="src/pages/HotelBookingPage.tsx">Country of Residence</label>
                        <input
                          type="text"
                          id="country-residence2"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Country of Residence"
                          required data-id="fxdzh9rkc" data-path="src/pages/HotelBookingPage.tsx" />

                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Section */}
                <div className="bg-white rounded-lg shadow-md p-4 mt-6" data-id="02jefqiqp" data-path="src/pages/HotelBookingPage.tsx">
                  <h2 className="text-xl font-bold mb-6" data-id="mywj9u3lq" data-path="src/pages/HotelBookingPage.tsx">Payment</h2>
                  
                  <div className="grid grid-cols-1 gap-4" data-id="7f0zu8w8b" data-path="src/pages/HotelBookingPage.tsx">
                    <div data-id="ogdybzghp" data-path="src/pages/HotelBookingPage.tsx">
                      <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1" data-id="vnxiypeuh" data-path="src/pages/HotelBookingPage.tsx">Card number</label>
                      <input
                        type="text"
                        id="card-number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="0000 0000 0000 0000"
                        required data-id="il4u8zoxe" data-path="src/pages/HotelBookingPage.tsx" />

                    </div>
                    
                    <div className="grid grid-cols-2 gap-4" data-id="d3lsehvd9" data-path="src/pages/HotelBookingPage.tsx">
                      <div data-id="xjjfxsx7i" data-path="src/pages/HotelBookingPage.tsx">
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1" data-id="6o3lolvx1" data-path="src/pages/HotelBookingPage.tsx">Expiration date (MM / YY)</label>
                        <input
                          type="text"
                          id="expiry"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="MM / YY"
                          required data-id="cnnokihmu" data-path="src/pages/HotelBookingPage.tsx" />

                      </div>
                      
                      <div data-id="atzvpofou" data-path="src/pages/HotelBookingPage.tsx">
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1" data-id="cxv6tu25j" data-path="src/pages/HotelBookingPage.tsx">Security code</label>
                        <input
                          type="text"
                          id="cvv"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="CVV"
                          required data-id="qqiovmizz" data-path="src/pages/HotelBookingPage.tsx" />

                      </div>
                    </div>
                    
                    <div data-id="paezg135f" data-path="src/pages/HotelBookingPage.tsx">
                      <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700 mb-1" data-id="6rnpesgf2" data-path="src/pages/HotelBookingPage.tsx">Name on card</label>
                      <input
                        type="text"
                        id="name-on-card"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Name as it appears on card"
                        required data-id="l1ihp2vo8" data-path="src/pages/HotelBookingPage.tsx" />

                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2" data-id="l10bkucxx" data-path="src/pages/HotelBookingPage.tsx">All transactions are secure and encrypted.</p>
                    
                    <Button type="submit" className="bg-aerotrav-blue text-white font-medium py-3" data-id="tb32es8vq" data-path="src/pages/HotelBookingPage.tsx">
                      Pay Now
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 text-right" data-id="uxeqtqczb" data-path="src/pages/HotelBookingPage.tsx">
                  <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-lg px-8" data-id="wsl8og3a5" data-path="src/pages/HotelBookingPage.tsx">
                    Complete booking
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer data-id="9zxvtthvv" data-path="src/pages/HotelBookingPage.tsx" />
    </div>);

};

export default HotelBookingPage;