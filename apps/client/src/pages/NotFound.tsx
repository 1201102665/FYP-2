import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="space-y-4">
            <h1 className="text-8xl font-bold text-aerotrav-blue">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
            <p className="text-gray-600">
              Sorry, the page you are looking for does not exist or has been removed.
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild size="lg" className="bg-aerotrav-blue hover:bg-aerotrav-blue-700">
              <Link to="/">Back to Home</Link>
            </Button>
            
            <div className="text-sm text-gray-500">
              <p>You can also try:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Link to="/flights" className="text-aerotrav-blue hover:underline">Flights</Link>
                <span>•</span>
                <Link to="/hotels" className="text-aerotrav-blue hover:underline">Hotels</Link>
                <span>•</span>
                <Link to="/car-rentals" className="text-aerotrav-blue hover:underline">Car Rentals</Link>
                <span>•</span>
                <Link to="/packages" className="text-aerotrav-blue hover:underline">Packages</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );

};

export default NotFound;