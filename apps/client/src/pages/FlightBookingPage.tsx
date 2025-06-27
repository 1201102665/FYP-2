import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createBooking } from '@/services/bookingService';

const FlightBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingComplete, setBookingComplete] = useState(false);
  const [passengerDetails, setPassengerDetails] = useState({
    name: '',
    email: '',
    password: '',
    countryCode: '+60',
    phoneNumber: '',
    dob: { day: '', month: '', year: '' },
    gender: '',
    residence: '',
    passport: ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    nameOnCard: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get flight details from location state or use defaults
  const flightDetails = location.state || {
    flightId: 1,
    airline: 'AirAsia',
    logo: '/airasia-logo.png',
    departureTime: '13:35',
    arrivalTime: '15:15',
    duration: '2h 40m',
    departureAirport: 'Kuala Lumpur (KUL)',
    arrivalAirport: 'Da Nang (DAD)',
    direct: true,
    price: 567,
    currency: 'MYR'
  };

  const handlePassengerChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPassengerDetails((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPassengerDetails((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate passenger details
    if (!passengerDetails.name) newErrors.name = 'Name is required';
    if (!passengerDetails.email) newErrors.email = 'Email is required';
    if (!passengerDetails.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!passengerDetails.gender) newErrors.gender = 'Gender selection is required';
    if (!passengerDetails.passport) newErrors.passport = 'Passport number is required';

    // Validate payment details
    if (!paymentDetails.cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!paymentDetails.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!paymentDetails.securityCode) newErrors.securityCode = 'Security code is required';
    if (!paymentDetails.nameOnCard) newErrors.nameOnCard = 'Name on card is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteBooking = async () => {
    if (validateForm()) {
      try {
        await createBooking(
          passengerDetails.name, // userId (use name/email as fallback for guest)
          passengerDetails.email,
          passengerDetails.name,
          [{
            type: 'flight',
            id: flightDetails.flightId,
            title: flightDetails.airline,
            image: flightDetails.logo || '',
            price: flightDetails.price,
            quantity: 1,
            details: flightDetails
          }],
          'card', // payment method
          undefined, // paymentIntentId
          flightDetails.price
        );
        setBookingComplete(true);
      } catch (error) {
        alert('Booking failed. Please try again.');
      }
    }
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  const handleRateUs = () => {
    navigate('/rate-flight');
  };

  const handleBackToFlights = () => {
    navigate('/flights');
  };

  return (
    <div className="flex flex-col min-h-screen" data-id="lres1y7ot" data-path="src/pages/FlightBookingPage.tsx">
      <Header data-id="6d2u60jk9" data-path="src/pages/FlightBookingPage.tsx" />

      <div className="bg-primary text-white py-6" data-id="m61pyn2a5" data-path="src/pages/FlightBookingPage.tsx">
        <div className="container mx-auto" data-id="t29ogjm47" data-path="src/pages/FlightBookingPage.tsx">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBackToFlights}
              variant="ghost"
              className="text-white hover:bg-white/20 p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <h1 className="text-2xl font-bold" data-id="yclchrwzj" data-path="src/pages/FlightBookingPage.tsx">Complete Your Flight Booking</h1>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto py-6 px-4" data-id="gece6mu19" data-path="src/pages/FlightBookingPage.tsx">
        {bookingComplete ?
          <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-lg shadow-lg text-center" data-id="ttwrfiv5l" data-path="src/pages/FlightBookingPage.tsx">
            <h2 className="text-3xl font-bold mb-6" data-id="w7v1uwiyr" data-path="src/pages/FlightBookingPage.tsx">Your flight is already booked</h2>
            <div className="flex justify-center gap-4" data-id="94etxrskc" data-path="src/pages/FlightBookingPage.tsx">
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={handleBackToMain} data-id="97ct4pmg6" data-path="src/pages/FlightBookingPage.tsx">

                Okay, Back to main page
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={handleRateUs} data-id="i9xvtxtik" data-path="src/pages/FlightBookingPage.tsx">

                Rate us
              </Button>
            </div>
          </div> :

          <div className="space-y-6" data-id="hg56bmhzv" data-path="src/pages/FlightBookingPage.tsx">
            {/* Flight Info */}
            <div className="border rounded-lg overflow-hidden shadow-md" data-id="8uosdzjzq" data-path="src/pages/FlightBookingPage.tsx">
              <div className="p-4" data-id="eiwjz1n6l" data-path="src/pages/FlightBookingPage.tsx">
                <div className="flex items-center gap-4" data-id="gmmth6hw7" data-path="src/pages/FlightBookingPage.tsx">
                  <div className="flex-shrink-0 w-16 h-16 bg-white rounded-md overflow-hidden flex items-center justify-center" data-id="vpjo0nk8o" data-path="src/pages/FlightBookingPage.tsx">
                    {flightDetails.logo ? (
                      <img
                        src={flightDetails.logo}
                        alt={flightDetails.airline}
                        className="w-14 h-14 object-contain" data-id="ub99670mt" data-path="src/pages/FlightBookingPage.tsx"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm font-medium">
                        {flightDetails.airline.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 flex-grow" data-id="6i5x3qwkn" data-path="src/pages/FlightBookingPage.tsx">
                    <div className="flex items-center gap-2" data-id="ck9x89kvb" data-path="src/pages/FlightBookingPage.tsx">
                      <span className="text-xl font-bold" data-id="6ququtkhi" data-path="src/pages/FlightBookingPage.tsx">{flightDetails.departureTime}</span>
                      <div className="relative w-20 md:w-32 h-0.5 bg-green-500" data-id="wu04oyai7" data-path="src/pages/FlightBookingPage.tsx">
                        <div className="absolute w-2 h-2 bg-green-500 rounded-full -top-0.75 -left-1" data-id="ykh6j02sz" data-path="src/pages/FlightBookingPage.tsx"></div>
                        <div className="absolute w-2 h-2 bg-green-500 rounded-full -top-0.75 -right-1" data-id="p6uo3wfm9" data-path="src/pages/FlightBookingPage.tsx"></div>
                      </div>
                      <span className="text-xl font-bold" data-id="0vydcy8an" data-path="src/pages/FlightBookingPage.tsx">{flightDetails.arrivalTime}</span>
                    </div>

                    <div className="text-sm md:text-base" data-id="ghtijxas2" data-path="src/pages/FlightBookingPage.tsx">
                      <p data-id="2wkujp9gs" data-path="src/pages/FlightBookingPage.tsx">{flightDetails.departureAirport} - {flightDetails.arrivalAirport}</p>
                      <p data-id="fheylp34r" data-path="src/pages/FlightBookingPage.tsx">{flightDetails.airline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" data-id="hrb43l2yu" data-path="src/pages/FlightBookingPage.tsx">
                    <span className="text-base font-medium" data-id="29ukn3pv8" data-path="src/pages/FlightBookingPage.tsx">{flightDetails.duration}•</span>
                    <span className="text-green-600 font-medium" data-id="j5okiaxun" data-path="src/pages/FlightBookingPage.tsx">{flightDetails.direct ? 'Direct' : 'Non-direct'}</span>
                  </div>

                  <div className="text-right" data-id="dn5cbiwz0" data-path="src/pages/FlightBookingPage.tsx">
                    <div className="text-xl font-bold" data-id="m3n2aueu0" data-path="src/pages/FlightBookingPage.tsx">{flightDetails.currency}{flightDetails.price}</div>
                  </div>
                </div>

                <div className="flex mt-2 gap-4" data-id="6tlurqvtc" data-path="src/pages/FlightBookingPage.tsx">
                  <div className="flex items-center text-red-500" data-id="w9h0q6hib" data-path="src/pages/FlightBookingPage.tsx">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-id="i3mepa77k" data-path="src/pages/FlightBookingPage.tsx">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" data-id="44nedokax" data-path="src/pages/FlightBookingPage.tsx" />
                    </svg>
                    <span data-id="rdkdaxygs" data-path="src/pages/FlightBookingPage.tsx">Seat choice not allowed</span>
                  </div>
                  <div className="flex items-center text-green-500" data-id="m4hnpdiaa" data-path="src/pages/FlightBookingPage.tsx">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-id="tsngfndqz" data-path="src/pages/FlightBookingPage.tsx">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" data-id="hy1lkvjdm" data-path="src/pages/FlightBookingPage.tsx" />
                    </svg>
                    <span data-id="js4o5z25h" data-path="src/pages/FlightBookingPage.tsx">Hand baggage included</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="43nu103ff" data-path="src/pages/FlightBookingPage.tsx">
              {/* Departure & Arrival */}
              <div className="border rounded-lg p-4 shadow-md" data-id="kfxv59ca7" data-path="src/pages/FlightBookingPage.tsx">
                <h3 className="text-lg font-bold text-center mb-4" data-id="8lze1s8on" data-path="src/pages/FlightBookingPage.tsx">Departure & Arrival</h3>
                <div className="space-y-4" data-id="8i2a3dv8x" data-path="src/pages/FlightBookingPage.tsx">
                  <div className="flex items-center" data-id="vngzdg0ut" data-path="src/pages/FlightBookingPage.tsx">
                    <div className="relative flex flex-col items-center mr-4" data-id="a160g5bza" data-path="src/pages/FlightBookingPage.tsx">
                      <div className="h-6 w-6 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white z-10" data-id="pdvf8y6vn" data-path="src/pages/FlightBookingPage.tsx">
                        <div className="h-3 w-3 rounded-full bg-gray-300" data-id="a05567gyk" data-path="src/pages/FlightBookingPage.tsx"></div>
                      </div>
                      <div className="h-14 w-0.5 bg-gray-300" data-id="xmwimtp5m" data-path="src/pages/FlightBookingPage.tsx"></div>
                    </div>
                    <div data-id="ofylgv648" data-path="src/pages/FlightBookingPage.tsx">
                      <p className="text-sm text-gray-500" data-id="ozvq66wr6" data-path="src/pages/FlightBookingPage.tsx">Mon 10 Feb - 13:35</p>
                      <p className="font-medium" data-id="k3qh7wh8u" data-path="src/pages/FlightBookingPage.tsx">Kuala Lumpur (KUL)</p>
                    </div>
                  </div>

                  <div className="flex items-center" data-id="f6p46txdl" data-path="src/pages/FlightBookingPage.tsx">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white mr-4" data-id="0j5ckj4et" data-path="src/pages/FlightBookingPage.tsx">
                      <div className="h-3 w-3 rounded-full bg-gray-300" data-id="9ifjkquyu" data-path="src/pages/FlightBookingPage.tsx"></div>
                    </div>
                    <div data-id="25q19sn07" data-path="src/pages/FlightBookingPage.tsx">
                      <p className="text-sm text-gray-500" data-id="fn0dlgwip" data-path="src/pages/FlightBookingPage.tsx">Mon 13 Feb - 15:15</p>
                      <p className="font-medium" data-id="bs7t4ou62" data-path="src/pages/FlightBookingPage.tsx">Da Nang (DAD)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border rounded-lg p-4 shadow-md" data-id="bop189uct" data-path="src/pages/FlightBookingPage.tsx">
                <h3 className="text-lg font-bold text-center mb-4" data-id="4tfxybk7s" data-path="src/pages/FlightBookingPage.tsx">Price Breakdown</h3>
                <div className="space-y-2" data-id="uzbtn4m9x" data-path="src/pages/FlightBookingPage.tsx">
                  <div className="flex justify-between items-center" data-id="v7qx1ihbm" data-path="src/pages/FlightBookingPage.tsx">
                    <p className="text-gray-600" data-id="a7g864r1g" data-path="src/pages/FlightBookingPage.tsx">To pay now</p>
                    <img src="https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTg3MTl8MHwxfHNlYXJjaHwxfHxUaGUlMjBpbWFnZSUyMGlzJTIwYSUyMHN5bWJvbCUyMHJlcHJlc2VudGluZyUyMHRoZSUyME1hbGF5c2lhbiUyMFJpbmdnaXQlMjBjdXJyZW5jeSUyQyUyMGRlcGljdGVkJTIwaW4lMjBhJTIwc3R5bGl6ZWQlMjBkZXNpZ24ufGVufDB8fHx8MTc0NzI4MTQ0NXww&ixlib=rb-4.1.0&q=80&w=200$w=512" alt="MYR" className="h-5 w-5" data-id="hs6lraddc" data-path="src/pages/FlightBookingPage.tsx" />
                  </div>
                  <div className="flex justify-between items-center" data-id="ldyumcnwd" data-path="src/pages/FlightBookingPage.tsx">
                    <p className="text-gray-600" data-id="gvyzevr90" data-path="src/pages/FlightBookingPage.tsx">Flight charge</p>
                    <p data-id="ejnr5jxo3" data-path="src/pages/FlightBookingPage.tsx">MYR567</p>
                  </div>
                  <div className="flex justify-between items-center" data-id="60s0po1n2" data-path="src/pages/FlightBookingPage.tsx">
                    <p className="text-gray-600" data-id="goo0uwqqg" data-path="src/pages/FlightBookingPage.tsx">Taxes</p>
                    <p data-id="s3iu3dnyd" data-path="src/pages/FlightBookingPage.tsx">MYR500</p>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold" data-id="3g2uwigh3" data-path="src/pages/FlightBookingPage.tsx">
                    <p data-id="m2mzzyw0r" data-path="src/pages/FlightBookingPage.tsx">Total</p>
                    <p data-id="4k6gbajbt" data-path="src/pages/FlightBookingPage.tsx">MYR1113</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Traveler Details */}
            <div className="border rounded-lg p-6 shadow-md" data-id="tmf6i6gwh" data-path="src/pages/FlightBookingPage.tsx">
              <h2 className="text-2xl font-bold mb-4" data-id="nccimm75g" data-path="src/pages/FlightBookingPage.tsx">Traveller Details</h2>
              <h3 className="text-xl font-semibold mb-4" data-id="2udr4rkjx" data-path="src/pages/FlightBookingPage.tsx">Traveler 1</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-id="hji1udxwh" data-path="src/pages/FlightBookingPage.tsx">
                <div data-id="x52ffy8le" data-path="src/pages/FlightBookingPage.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-1" data-id="i5xtwdy4p" data-path="src/pages/FlightBookingPage.tsx">Name</label>
                  <Input
                    name="name"
                    value={passengerDetails.name}
                    onChange={handlePassengerChange}
                    placeholder="Name"
                    className={errors.name ? "border-red-500" : ""} data-id="649umpsxh" data-path="src/pages/FlightBookingPage.tsx" />
                  {errors.name && <p className="text-red-500 text-xs mt-1" data-id="mng7z5i28" data-path="src/pages/FlightBookingPage.tsx">{errors.name}</p>}
                </div>
                <div data-id="bja7781x2" data-path="src/pages/FlightBookingPage.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-1" data-id="rggkaq6r5" data-path="src/pages/FlightBookingPage.tsx">Email Address</label>
                  <Input
                    name="email"
                    value={passengerDetails.email}
                    onChange={handlePassengerChange}
                    placeholder="Email Address"
                    type="email"
                    className={errors.email ? "border-red-500" : ""} data-id="7ayyx45qo" data-path="src/pages/FlightBookingPage.tsx" />
                  {errors.email && <p className="text-red-500 text-xs mt-1" data-id="s6qobiseb" data-path="src/pages/FlightBookingPage.tsx">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-id="xine0eiij" data-path="src/pages/FlightBookingPage.tsx">
                <div data-id="78zmpo3e8" data-path="src/pages/FlightBookingPage.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-1" data-id="xts3as5qw" data-path="src/pages/FlightBookingPage.tsx">Password</label>
                  <Input
                    name="password"
                    value={passengerDetails.password}
                    onChange={handlePassengerChange}
                    placeholder="Password"
                    type="password" data-id="ztrn4zkdw" data-path="src/pages/FlightBookingPage.tsx" />
                </div>
                <div className="grid grid-cols-2 gap-4" data-id="w5zw9e11z" data-path="src/pages/FlightBookingPage.tsx">
                  <div data-id="6czfk0gv6" data-path="src/pages/FlightBookingPage.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-1" data-id="0ar32qn4u" data-path="src/pages/FlightBookingPage.tsx">Country Code</label>
                    <Input
                      name="countryCode"
                      value={passengerDetails.countryCode}
                      onChange={handlePassengerChange}
                      placeholder="Malaysia (+60)" data-id="zefbtwa9b" data-path="src/pages/FlightBookingPage.tsx" />
                  </div>
                  <div data-id="nwe7bqd16" data-path="src/pages/FlightBookingPage.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-1" data-id="wv90xro8x" data-path="src/pages/FlightBookingPage.tsx">Phone Number</label>
                    <Input
                      name="phoneNumber"
                      value={passengerDetails.phoneNumber}
                      onChange={handlePassengerChange}
                      placeholder="Phone Number"
                      className={errors.phoneNumber ? "border-red-500" : ""} data-id="h4dstvpmj" data-path="src/pages/FlightBookingPage.tsx" />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1" data-id="61bxocz7r" data-path="src/pages/FlightBookingPage.tsx">{errors.phoneNumber}</p>}
                  </div>
                </div>
              </div>

              <div className="mb-4" data-id="hl6vtzo78" data-path="src/pages/FlightBookingPage.tsx">
                <label className="block text-sm font-medium text-gray-700 mb-1" data-id="16m965h39" data-path="src/pages/FlightBookingPage.tsx">Date of Birth</label>
                <div className="grid grid-cols-3 gap-2" data-id="mceymd2u2" data-path="src/pages/FlightBookingPage.tsx">
                  <Input
                    name="dob.day"
                    value={passengerDetails.dob.day}
                    onChange={handlePassengerChange}
                    placeholder="Day" data-id="k2pt8ghpa" data-path="src/pages/FlightBookingPage.tsx" />
                  <Input
                    name="dob.month"
                    value={passengerDetails.dob.month}
                    onChange={handlePassengerChange}
                    placeholder="Month" data-id="31p55j3wm" data-path="src/pages/FlightBookingPage.tsx" />
                  <Input
                    name="dob.year"
                    value={passengerDetails.dob.year}
                    onChange={handlePassengerChange}
                    placeholder="Year" data-id="dssyzkz5g" data-path="src/pages/FlightBookingPage.tsx" />
                </div>
              </div>

              <div className="mb-4" data-id="zm7cjj8e8" data-path="src/pages/FlightBookingPage.tsx">
                <label className="block text-sm font-medium text-gray-700 mb-1" data-id="6ukbjpqhn" data-path="src/pages/FlightBookingPage.tsx">Gender</label>
                <div className="flex items-center gap-6" data-id="11ds0245t" data-path="src/pages/FlightBookingPage.tsx">
                  <div className="flex items-center" data-id="zotzu29kn" data-path="src/pages/FlightBookingPage.tsx">
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      checked={passengerDetails.gender === 'female'}
                      onChange={handlePassengerChange}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary" data-id="rigj867xf" data-path="src/pages/FlightBookingPage.tsx" />

                    <label htmlFor="female" className="ml-2 text-sm font-medium text-gray-700" data-id="iqlj0wstw" data-path="src/pages/FlightBookingPage.tsx">Female</label>
                  </div>
                  <div className="flex items-center" data-id="uq3x5ihhn" data-path="src/pages/FlightBookingPage.tsx">
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      checked={passengerDetails.gender === 'male'}
                      onChange={handlePassengerChange}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary" data-id="l70c9pzzk" data-path="src/pages/FlightBookingPage.tsx" />

                    <label htmlFor="male" className="ml-2 text-sm font-medium text-gray-700" data-id="hdzgnvup2" data-path="src/pages/FlightBookingPage.tsx">Male</label>
                  </div>
                </div>
                {errors.gender && <p className="text-red-500 text-xs mt-1" data-id="c0dfr8at1" data-path="src/pages/FlightBookingPage.tsx">{errors.gender}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4" data-id="i1rd3xjd1" data-path="src/pages/FlightBookingPage.tsx">
                <div data-id="pb3svajew" data-path="src/pages/FlightBookingPage.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-1" data-id="2578w7j6x" data-path="src/pages/FlightBookingPage.tsx">Country of Residence</label>
                  <Input
                    name="residence"
                    value={passengerDetails.residence}
                    onChange={handlePassengerChange}
                    placeholder="Country of Residence" data-id="x5ucjirrh" data-path="src/pages/FlightBookingPage.tsx" />
                </div>
                <div data-id="tsme4i2rn" data-path="src/pages/FlightBookingPage.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-1" data-id="c7xurcwv5" data-path="src/pages/FlightBookingPage.tsx">Passport Number</label>
                  <Input
                    name="passport"
                    value={passengerDetails.passport}
                    onChange={handlePassengerChange}
                    placeholder="Passport Number"
                    className={errors.passport ? "border-red-500" : ""} data-id="krp1qupjh" data-path="src/pages/FlightBookingPage.tsx" />
                  {errors.passport && <p className="text-red-500 text-xs mt-1" data-id="lzowiadkg" data-path="src/pages/FlightBookingPage.tsx">{errors.passport}</p>}
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="border rounded-lg p-6 shadow-md" data-id="yy9y1umyy" data-path="src/pages/FlightBookingPage.tsx">
              <h2 className="text-2xl font-bold mb-4" data-id="bgb6xf9lh" data-path="src/pages/FlightBookingPage.tsx">Payment</h2>

              <div className="space-y-4" data-id="8f0og1b5n" data-path="src/pages/FlightBookingPage.tsx">
                <div data-id="2d7ffzr6i" data-path="src/pages/FlightBookingPage.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-1" data-id="g4oio1vn2" data-path="src/pages/FlightBookingPage.tsx">Card number</label>
                  <Input
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="Card number"
                    className={errors.cardNumber ? "border-red-500" : ""} data-id="xdrpdep3t" data-path="src/pages/FlightBookingPage.tsx" />
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1" data-id="ae5la3x3u" data-path="src/pages/FlightBookingPage.tsx">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="c8mx2xe2c" data-path="src/pages/FlightBookingPage.tsx">
                  <div data-id="1kgb4w9uc" data-path="src/pages/FlightBookingPage.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-1" data-id="te9ilsif3" data-path="src/pages/FlightBookingPage.tsx">Expiration date (MM / YY)</label>
                    <Input
                      name="expiryDate"
                      value={paymentDetails.expiryDate}
                      onChange={handlePaymentChange}
                      placeholder="MM / YY"
                      className={errors.expiryDate ? "border-red-500" : ""} data-id="4fd5pbffp" data-path="src/pages/FlightBookingPage.tsx" />
                    {errors.expiryDate && <p className="text-red-500 text-xs mt-1" data-id="4tgp53ghj" data-path="src/pages/FlightBookingPage.tsx">{errors.expiryDate}</p>}
                  </div>
                  <div data-id="aa5cjpg3y" data-path="src/pages/FlightBookingPage.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-1" data-id="i4hoqz1gb" data-path="src/pages/FlightBookingPage.tsx">Security code</label>
                    <Input
                      name="securityCode"
                      value={paymentDetails.securityCode}
                      onChange={handlePaymentChange}
                      placeholder="Security code"
                      className={errors.securityCode ? "border-red-500" : ""} data-id="bk5h818hf" data-path="src/pages/FlightBookingPage.tsx" />
                    {errors.securityCode && <p className="text-red-500 text-xs mt-1" data-id="arby3il2r" data-path="src/pages/FlightBookingPage.tsx">{errors.securityCode}</p>}
                  </div>
                </div>

                <div data-id="dtxbxh8yc" data-path="src/pages/FlightBookingPage.tsx">
                  <label className="block text-sm font-medium text-gray-700 mb-1" data-id="tfz979ck4" data-path="src/pages/FlightBookingPage.tsx">Name on card</label>
                  <Input
                    name="nameOnCard"
                    value={paymentDetails.nameOnCard}
                    onChange={handlePaymentChange}
                    placeholder="Name on card"
                    className={errors.nameOnCard ? "border-red-500" : ""} data-id="n8puvenfh" data-path="src/pages/FlightBookingPage.tsx" />
                  {errors.nameOnCard && <p className="text-red-500 text-xs mt-1" data-id="51p3uznso" data-path="src/pages/FlightBookingPage.tsx">{errors.nameOnCard}</p>}
                </div>

                <p className="text-sm text-gray-500 text-center" data-id="5g0w9d9k8" data-path="src/pages/FlightBookingPage.tsx">All transactions are secure and encrypted</p>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
                  onClick={handleCompleteBooking} data-id="bf548sdtx" data-path="src/pages/FlightBookingPage.tsx">

                  Pay Now
                </Button>
              </div>
            </div>

            <div className="flex justify-end" data-id="63x3xofz8" data-path="src/pages/FlightBookingPage.tsx">
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-6 px-8"
                onClick={handleCompleteBooking} data-id="9vep5oaa9" data-path="src/pages/FlightBookingPage.tsx">

                Complete booking
              </Button>
            </div>
          </div>
        }
      </main>

      <Footer data-id="wtn252gxm" data-path="src/pages/FlightBookingPage.tsx" />
    </div>);

};

export default FlightBookingPage;