import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CarPaymentPage = () => {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock car data based on ID
  const car = {
    id: Number(id) || 1,
    name: "Toyota Avanza",
    price: 150,
    location: "Destin",
    image: "/placeholder.svg",
    category: "Economy",
    features: ["4 Seats", "2 Bags", "Automatic"],
    days: 2
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/car-payment-success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-id="b5l894e3j" data-path="src/pages/CarPaymentPage.tsx">
      <Header data-id="mjieqw98i" data-path="src/pages/CarPaymentPage.tsx" />
      
      <main className="flex-grow py-8" data-id="24vx5ur6m" data-path="src/pages/CarPaymentPage.tsx">
        <div className="container mx-auto max-w-4xl px-4" data-id="q1lqjfa4a" data-path="src/pages/CarPaymentPage.tsx">
          <div className="bg-white rounded-lg shadow-md overflow-hidden" data-id="m9m9zan5g" data-path="src/pages/CarPaymentPage.tsx">
            <div className="p-6 border-b border-gray-200" data-id="cs16jhg9s" data-path="src/pages/CarPaymentPage.tsx">
              <h1 className="text-2xl font-bold text-center" data-id="xtyhyqjhi" data-path="src/pages/CarPaymentPage.tsx">Payment</h1>
            </div>
            
            <div className="p-6" data-id="gt9ppoiuz" data-path="src/pages/CarPaymentPage.tsx">
              <div className="mb-6 flex flex-col md:flex-row gap-6" data-id="19pwxvlh1" data-path="src/pages/CarPaymentPage.tsx">
                <div className="md:w-1/3" data-id="cnbs71mcu" data-path="src/pages/CarPaymentPage.tsx">
                  <div className="bg-gray-100 p-4 rounded-lg" data-id="gt45cf175" data-path="src/pages/CarPaymentPage.tsx">
                    <h3 className="font-bold mb-2" data-id="k9s2osg3i" data-path="src/pages/CarPaymentPage.tsx">Order Summary</h3>
                    <div className="flex justify-between mb-2" data-id="5psqzeh8e" data-path="src/pages/CarPaymentPage.tsx">
                      <span data-id="qcn425s52" data-path="src/pages/CarPaymentPage.tsx">Car:</span>
                      <span data-id="is7xo1sfd" data-path="src/pages/CarPaymentPage.tsx">{car.name}</span>
                    </div>
                    <div className="flex justify-between mb-2" data-id="g8xe2d568" data-path="src/pages/CarPaymentPage.tsx">
                      <span data-id="srrsv30y9" data-path="src/pages/CarPaymentPage.tsx">Category:</span>
                      <span data-id="yglioalno" data-path="src/pages/CarPaymentPage.tsx">{car.category}</span>
                    </div>
                    <div className="flex justify-between mb-2" data-id="3aroueznn" data-path="src/pages/CarPaymentPage.tsx">
                      <span data-id="drtov3kr5" data-path="src/pages/CarPaymentPage.tsx">Location:</span>
                      <span data-id="8mdmjql2w" data-path="src/pages/CarPaymentPage.tsx">{car.location}</span>
                    </div>
                    <div className="flex justify-between mb-2" data-id="iihbsehwn" data-path="src/pages/CarPaymentPage.tsx">
                      <span data-id="q00xf4ktv" data-path="src/pages/CarPaymentPage.tsx">Days:</span>
                      <span data-id="9km3mqaut" data-path="src/pages/CarPaymentPage.tsx">{car.days}</span>
                    </div>
                    <div className="flex justify-between mb-2" data-id="m7nnk2604" data-path="src/pages/CarPaymentPage.tsx">
                      <span data-id="cj5frecck" data-path="src/pages/CarPaymentPage.tsx">Price per day:</span>
                      <span data-id="vb92r90sy" data-path="src/pages/CarPaymentPage.tsx">RM {car.price}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-gray-300 pt-2 mt-2" data-id="ljnf7ptz4" data-path="src/pages/CarPaymentPage.tsx">
                      <span data-id="albl7601y" data-path="src/pages/CarPaymentPage.tsx">Total:</span>
                      <span data-id="5wnn1gabf" data-path="src/pages/CarPaymentPage.tsx">RM {car.price * car.days}</span>
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
                        onChange={(e) => setCardNumber(e.target.value)}
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
                          onChange={(e) => setExpirationDate(e.target.value)}
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