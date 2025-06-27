import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCarById, Car } from "@/services/carService";
import { createBooking } from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const CarPaymentPage = () => {
  const { id } = useParams<{ id: string; }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  // Get data from navigation state
  const { car: carFromState, driverDetails, totalAmount } = location.state || {};

  // Helper functions for input formatting
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpirationDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpirationDate(e.target.value);
    setExpirationDate(formatted);
  };

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "Car ID not provided",
          variant: "destructive",
        });
        navigate("/car-rentals");
        return;
      }

      // Check if we have the required booking data
      if (!carFromState && !driverDetails) {
        toast({
          title: "Error",
          description: "Please complete the booking form first",
          variant: "destructive",
        });
        navigate(`/car-booking/${id}`);
        return;
      }

      try {
        setLoading(true);
        // Use car from state if available, otherwise fetch from API
        if (carFromState) {
          setCar(carFromState);
        } else {
          const carData = await getCarById(parseInt(id));
          if (!carData) {
            toast({
              title: "Error",
              description: "Car not found",
              variant: "destructive",
            });
            navigate("/car-rentals");
            return;
          }
          setCar(carData);
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
        toast({
          title: "Error",
          description: "Failed to load car details",
          variant: "destructive",
        });
        navigate("/car-rentals");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id, navigate, toast, carFromState, driverDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car || !driverDetails) {
      toast({
        title: "Error",
        description: "Missing car or driver details",
        variant: "destructive",
      });
      return;
    }

    // Basic payment form validation
    if (!cardNumber.trim() || !expirationDate.trim() || !securityCode.trim() || !nameOnCard.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all payment fields",
        variant: "destructive",
      });
      return;
    }

    // Basic card number validation (should be 13-19 digits)
    if (!/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid card number",
        variant: "destructive",
      });
      return;
    }

    // Basic expiration date validation (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
      toast({
        title: "Invalid Expiration Date",
        description: "Please enter expiration date in MM/YY format",
        variant: "destructive",
      });
      return;
    }

    // Basic CVV validation (3-4 digits)
    if (!/^\d{3,4}$/.test(securityCode)) {
      toast({
        title: "Invalid Security Code",
        description: "Please enter a valid security code",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create the booking after payment is processed
      const name = driverDetails.name || 'Car Guest';
      const email = driverDetails.email || 'guest@example.com';

      const response = await createBooking(
        name,
        email,
        name,
        [{
          type: 'car',
          id: car.id,
          title: `${car.make} ${car.model}`,
          image: car.images[0] || '',
          price: totalAmount || (car.daily_rate + Math.round(car.daily_rate * 0.3)),
          quantity: 1,
          details: { ...car }
        }],
        'card',
        undefined,
        totalAmount || (car.daily_rate + Math.round(car.daily_rate * 0.3))
      );

      const bookingReference = response?.bookingReference;
      const paymentAmount = totalAmount || (car.daily_rate + Math.round(car.daily_rate * 0.3));
      const cartItems = [{
        type: 'car',
        id: car.id,
        title: `${car.make} ${car.model}`,
        image: car.images[0] || '',
        price: paymentAmount,
        quantity: 1,
        details: { ...car }
      }];

      // Navigate to success page with booking details
      navigate('/payment-success', {
        state: {
          bookingReference,
          paymentAmount,
          cartItems,
          bookingDate: new Date().toISOString(),
          checkoutData: {
            contactInfo: {
              email: driverDetails.email,
              phone: driverDetails.phoneNumber,
              address: driverDetails.countryOfResidence
            },
            travelers: [{
              firstName: driverDetails.name.split(' ')[0] || '',
              lastName: driverDetails.name.split(' ').slice(1).join(' ') || '',
              email: driverDetails.email,
              phone: driverDetails.phoneNumber
            }]
          }
        }
      });

      toast({
        title: "Payment Successful!",
        description: `Your car rental has been confirmed. Reference: ${bookingReference}`,
        variant: "default"
      });

    } catch (error) {
      console.error("Payment/Booking error:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Car not found</h2>
            <Button onClick={() => navigate("/car-rentals")}>
              Back to Car Rentals
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-id="b5l894e3j" data-path="src/pages/CarPaymentPage.tsx">
      <Header data-id="mjieqw98i" data-path="src/pages/CarPaymentPage.tsx" />

      <main className="flex-grow py-8" data-id="24vx5ur6m" data-path="src/pages/CarPaymentPage.tsx">
        <div className="container mx-auto max-w-4xl px-4" data-id="q1lqjfa4a" data-path="src/pages/CarPaymentPage.tsx">
          <div className="bg-white rounded-lg shadow-md overflow-hidden" data-id="m9m9zan5g" data-path="src/pages/CarPaymentPage.tsx">
            <div className="p-6 border-b border-gray-200" data-id="cs16jhg9s" data-path="src/pages/CarPaymentPage.tsx">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/car-booking/${id}`)}
                  className="flex items-center gap-2"
                >
                  ← Back to Booking
                </Button>
                <h1 className="text-2xl font-bold" data-id="xtyhyqjhi" data-path="src/pages/CarPaymentPage.tsx">Payment</h1>
                <div className="w-24"></div> {/* Spacer for centering */}
              </div>
            </div>

            <div className="p-6" data-id="gt9ppoiuz" data-path="src/pages/CarPaymentPage.tsx">
              <div className="mb-6 flex flex-col md:flex-row gap-6" data-id="19pwxvlh1" data-path="src/pages/CarPaymentPage.tsx">
                <div className="md:w-1/3" data-id="cnbs71mcu" data-path="src/pages/CarPaymentPage.tsx">
                  <div className="bg-gray-100 p-4 rounded-lg" data-id="gt45cf175" data-path="src/pages/CarPaymentPage.tsx">
                    <h3 className="font-bold mb-2" data-id="k9s2osg3i" data-path="src/pages/CarPaymentPage.tsx">Order Summary</h3>
                    <div className="flex justify-between mb-2">
                      <span>Car:</span>
                      <span>{car.make} {car.model}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Category:</span>
                      <span>{car.category}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Location:</span>
                      <span>{car.location_city}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Days:</span>
                      <span>1</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Car hire charge:</span>
                      <span>RM {car.daily_rate}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Deposit:</span>
                      <span>RM {Math.round(car.daily_rate * 0.3)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-gray-300 pt-2 mt-2">
                      <span>Total:</span>
                      <span>RM {totalAmount || (car.daily_rate + Math.round(car.daily_rate * 0.3))}</span>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3" data-id="l9avuuc9b" data-path="src/pages/CarPaymentPage.tsx">
                  <form onSubmit={handleSubmit} data-id="w8vbqur8l" data-path="src/pages/CarPaymentPage.tsx">
                    <div className="mb-4" data-id="pph8r3aov" data-path="src/pages/CarPaymentPage.tsx">
                      <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1" data-id="77z8ozr8e" data-path="src/pages/CarPaymentPage.tsx">
                        Card number
                      </label>
                      <input
                        type="text"
                        id="card-number"
                        className="w-full p-2 border rounded-md"
                        placeholder="Card number"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={23}
                        required data-id="3h7qybp89" data-path="src/pages/CarPaymentPage.tsx" />

                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4" data-id="4yk3t6rhi" data-path="src/pages/CarPaymentPage.tsx">
                      <div data-id="tf84a7c9d" data-path="src/pages/CarPaymentPage.tsx">
                        <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700 mb-1" data-id="1yc67qjw8" data-path="src/pages/CarPaymentPage.tsx">
                          Expiration date (MM / YY)
                        </label>
                        <input
                          type="text"
                          id="expiration-date"
                          className="w-full p-2 border rounded-md"
                          placeholder="Expiration date (MM / YY)"
                          value={expirationDate}
                          onChange={handleExpirationDateChange}
                          required data-id="mzzj6wclp" data-path="src/pages/CarPaymentPage.tsx" />

                      </div>
                      <div data-id="txc62kj27" data-path="src/pages/CarPaymentPage.tsx">
                        <label htmlFor="security-code" className="block text-sm font-medium text-gray-700 mb-1" data-id="31nh8dl7z" data-path="src/pages/CarPaymentPage.tsx">
                          Security code
                        </label>
                        <input
                          type="text"
                          id="security-code"
                          className="w-full p-2 border rounded-md"
                          placeholder="Security code"
                          value={securityCode}
                          onChange={(e) => setSecurityCode(e.target.value)}
                          maxLength={4}
                          required data-id="nlipw899a" data-path="src/pages/CarPaymentPage.tsx" />

                      </div>
                    </div>

                    <div className="mb-6" data-id="pnvwh23oy" data-path="src/pages/CarPaymentPage.tsx">
                      <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700 mb-1" data-id="x81v3n787" data-path="src/pages/CarPaymentPage.tsx">
                        Name on card
                      </label>
                      <input
                        type="text"
                        id="name-on-card"
                        className="w-full p-2 border rounded-md"
                        placeholder="Name on card"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        required data-id="6da8n7t6m" data-path="src/pages/CarPaymentPage.tsx" />

                    </div>

                    <p className="text-xs text-gray-500 text-center mb-4" data-id="nr30s722r" data-path="src/pages/CarPaymentPage.tsx">
                      All transactions are secure and encrypted.
                    </p>

                    <Button
                      type="submit"
                      className="w-full bg-aerotrav-blue hover:bg-aerotrav-blue/90 text-white font-medium py-3"
                      disabled={isProcessing} data-id="oqevkppey" data-path="src/pages/CarPaymentPage.tsx">

                      {isProcessing ? "Processing..." : "Pay Now"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer data-id="yjylitlbe" data-path="src/pages/CarPaymentPage.tsx" />
    </div>);

};

export default CarPaymentPage;