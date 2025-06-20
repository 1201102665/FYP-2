import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CarPaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-id="x0gxcwpwt" data-path="src/pages/CarPaymentSuccessPage.tsx">
      <Header data-id="g1zjquxcq" data-path="src/pages/CarPaymentSuccessPage.tsx" />
      
      <main className="flex-grow py-12 flex items-center justify-center" data-id="sbpj01vb6" data-path="src/pages/CarPaymentSuccessPage.tsx">
        <div className="container mx-auto max-w-md px-4" data-id="ustfv5w9g" data-path="src/pages/CarPaymentSuccessPage.tsx">
          <div className="bg-white rounded-lg shadow-md overflow-hidden" data-id="wyzpgbsut" data-path="src/pages/CarPaymentSuccessPage.tsx">
            <div className="p-6 border-b border-gray-200" data-id="m6mqimhwa" data-path="src/pages/CarPaymentSuccessPage.tsx">
              <h1 className="text-2xl font-bold text-center" data-id="pym4iiukn" data-path="src/pages/CarPaymentSuccessPage.tsx">Payment</h1>
            </div>
            
            <div className="p-8 bg-gray-100" data-id="1gnhlm9bl" data-path="src/pages/CarPaymentSuccessPage.tsx">
              <div className="text-center" data-id="1t9ky74hl" data-path="src/pages/CarPaymentSuccessPage.tsx">
                <h2 className="text-2xl font-bold mb-4" data-id="6opfa1uzm" data-path="src/pages/CarPaymentSuccessPage.tsx">The payment is successfully done</h2>
                <Button
                  className="bg-aerotrav-blue hover:bg-aerotrav-blue/90 text-white px-8"
                  onClick={() => navigate("/car-rentals")} data-id="jje43mf98" data-path="src/pages/CarPaymentSuccessPage.tsx">

                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer data-id="r5xrcvoz6" data-path="src/pages/CarPaymentSuccessPage.tsx" />
    </div>);

};

export default CarPaymentSuccessPage;