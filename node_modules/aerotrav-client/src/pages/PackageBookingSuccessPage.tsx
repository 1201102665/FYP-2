import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PackageBookingSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen" data-id="8728fknhh" data-path="src/pages/PackageBookingSuccessPage.tsx">
      <Header data-id="ywg4ukvuf" data-path="src/pages/PackageBookingSuccessPage.tsx" />
      
      <main className="flex-grow container mx-auto py-12 px-4 flex items-center justify-center" data-id="uquzjrpgu" data-path="src/pages/PackageBookingSuccessPage.tsx">
        <Card className="max-w-md w-full" data-id="d7qhhusug" data-path="src/pages/PackageBookingSuccessPage.tsx">
          <CardContent className="pt-6 text-center" data-id="5vifwr90t" data-path="src/pages/PackageBookingSuccessPage.tsx">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100" data-id="ppvqrx71s" data-path="src/pages/PackageBookingSuccessPage.tsx">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="rnqvolzdm" data-path="src/pages/PackageBookingSuccessPage.tsx">
                <polyline points="20 6 9 17 4 12" data-id="prbtgfgnj" data-path="src/pages/PackageBookingSuccessPage.tsx"></polyline>
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold mb-2" data-id="hqdcj9p7n" data-path="src/pages/PackageBookingSuccessPage.tsx">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-6" data-id="f5l4fdbex" data-path="src/pages/PackageBookingSuccessPage.tsx">
              Your travel package has been successfully booked. We've sent a confirmation to your email with all the details.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left" data-id="llg9j6qz8" data-path="src/pages/PackageBookingSuccessPage.tsx">
              <h2 className="font-medium mb-2" data-id="jx1r8as5i" data-path="src/pages/PackageBookingSuccessPage.tsx">What's Next?</h2>
              <ul className="space-y-2" data-id="ii7tchlue" data-path="src/pages/PackageBookingSuccessPage.tsx">
                <li className="flex items-start" data-id="9yofqxcn1" data-path="src/pages/PackageBookingSuccessPage.tsx">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="s0rkxz1xu" data-path="src/pages/PackageBookingSuccessPage.tsx">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" data-id="4q9nt7fhp" data-path="src/pages/PackageBookingSuccessPage.tsx"></path>
                    <polyline points="22 4 12 14.01 9 11.01" data-id="o4yu1zbkd" data-path="src/pages/PackageBookingSuccessPage.tsx"></polyline>
                  </svg>
                  <span className="text-sm" data-id="nk7zpensq" data-path="src/pages/PackageBookingSuccessPage.tsx">Check your email for booking confirmation</span>
                </li>
                <li className="flex items-start" data-id="20wg5w9zg" data-path="src/pages/PackageBookingSuccessPage.tsx">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="h28utnsiy" data-path="src/pages/PackageBookingSuccessPage.tsx">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" data-id="rnzttbyhl" data-path="src/pages/PackageBookingSuccessPage.tsx"></path>
                    <polyline points="22 4 12 14.01 9 11.01" data-id="roolz4006" data-path="src/pages/PackageBookingSuccessPage.tsx"></polyline>
                  </svg>
                  <span className="text-sm" data-id="dztibpxa0" data-path="src/pages/PackageBookingSuccessPage.tsx">Prepare your travel documents</span>
                </li>
                <li className="flex items-start" data-id="w91frypg3" data-path="src/pages/PackageBookingSuccessPage.tsx">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-id="zgd9llnpb" data-path="src/pages/PackageBookingSuccessPage.tsx">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" data-id="4ztwb4t6b" data-path="src/pages/PackageBookingSuccessPage.tsx"></path>
                    <polyline points="22 4 12 14.01 9 11.01" data-id="2kndzmdi5" data-path="src/pages/PackageBookingSuccessPage.tsx"></polyline>
                  </svg>
                  <span className="text-sm" data-id="tevjrjvei" data-path="src/pages/PackageBookingSuccessPage.tsx">Our travel consultant will contact you within 24 hours</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3" data-id="uhnkp0mbc" data-path="src/pages/PackageBookingSuccessPage.tsx">
              <Button
                className="w-full"
                onClick={() => navigate('/packages')} data-id="0yl9rviun" data-path="src/pages/PackageBookingSuccessPage.tsx">

                Browse More Packages
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')} data-id="aha6efjew" data-path="src/pages/PackageBookingSuccessPage.tsx">

                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer data-id="i2z7b9ee6" data-path="src/pages/PackageBookingSuccessPage.tsx" />
    </div>);

};

export default PackageBookingSuccessPage;