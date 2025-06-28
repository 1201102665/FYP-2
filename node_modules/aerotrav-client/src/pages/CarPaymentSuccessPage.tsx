import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle } from "lucide-react";

const CarPaymentSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to car rentals after 10 seconds
    const timer = setTimeout(() => {
      navigate("/car-rentals");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-8">
        <div className="container mx-auto max-w-md px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600">
                Your car rental has been confirmed. You will receive a confirmation email shortly.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => navigate("/car-rentals")}
                className="w-full bg-aerotrav-blue hover:bg-aerotrav-blue/90 text-white"
              >
                Rent Another Car
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/profile")}
                className="w-full"
              >
                View My Bookings
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Back to Home
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              You will be redirected to car rentals in 10 seconds...
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarPaymentSuccessPage;