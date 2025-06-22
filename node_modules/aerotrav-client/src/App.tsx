import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserActivityProvider } from './contexts/UserActivityContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from "@/components/ui/toaster";
import HomePage from './pages/HomePage';
import FlightResultsPage from './pages/FlightResultsPage';
import HotelSearchPage from './pages/HotelSearchPage';
import CarRentalPage from './pages/CarRentalPage';
import PackagePage from './pages/PackagePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import FlightDetailsPage from './pages/FlightDetailsPage';
import FlightBookingPage from './pages/FlightBookingPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import HotelBookingPage from './pages/HotelBookingPage';
import CarDetailsPage from './pages/CarDetailsPage';
import PackageDetailsPage from './pages/PackageDetailsPage';
import PackageBookingSuccessPage from './pages/PackageBookingSuccessPage';
import RateFlightPage from './pages/RateFlightPage';
import BookingConfirmedWrapper from './components/BookingConfirmedWrapper';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AIAssistantPage from './pages/AIAssistantPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <UserActivityProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/flights" element={<FlightResultsPage />} />
                <Route path="/hotels" element={<HotelSearchPage />} />
                <Route path="/car-rentals" element={<CarRentalPage />} />
                <Route path="/packages" element={<PackagePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/flight-details/:id" element={<FlightDetailsPage />} />
                <Route path="/flight-booking" element={<FlightBookingPage />} />
                <Route path="/hotel-details/:id" element={<HotelDetailsPage />} />
                <Route path="/hotel-booking" element={<HotelBookingPage />} />
                <Route path="/hotel-booking/:id" element={<HotelBookingPage />} />
                <Route path="/car-details/:id" element={<CarDetailsPage />} />
                <Route path="/package-details/:id" element={<PackageDetailsPage />} />
                <Route path="/package-booking-success" element={<PackageBookingSuccessPage />} />
                <Route path="/rate-flight" element={<RateFlightPage />} />
                <Route path="/booking-confirmation/:reference" element={<BookingConfirmedWrapper />} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
                <Route path="/ai-assistant" element={<AIAssistantPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
          <Toaster />
        </CartProvider>
      </UserActivityProvider>
    </AuthProvider>
  );
}

export default App;