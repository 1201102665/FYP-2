import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserActivityProvider } from './contexts/UserActivityContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from "sonner";
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
import CarBookingPage from './pages/CarBookingPage';
import CarPaymentPage from './pages/CarPaymentPage';
import CarPaymentSuccessPage from './pages/CarPaymentSuccessPage';
import PackageDetailsPage from './pages/PackageDetailsPage';
import PackageBookingSuccessPage from './pages/PackageBookingSuccessPage';
import RateFlightPage from './pages/RateFlightPage';
import BookingConfirmedWrapper from './components/BookingConfirmedWrapper';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import CareersPage from './pages/CareersPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import BookingDetailsPage from './pages/BookingDetailsPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';

// Admin Components
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminBookingDetailsPage from './pages/AdminBookingDetailsPage';
import AdminContentPage from './pages/AdminContentPage';
import AdminRatingsPage from './pages/AdminRatingsPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <UserActivityProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
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
                <Route path="/car-booking/:id" element={<ProtectedRoute><CarBookingPage /></ProtectedRoute>} />
                <Route path="/car-payment/:id" element={<ProtectedRoute><CarPaymentPage /></ProtectedRoute>} />
                <Route path="/car-payment-success" element={<ProtectedRoute><CarPaymentSuccessPage /></ProtectedRoute>} />
                <Route path="/package-details/:id" element={<PackageDetailsPage />} />
                <Route path="/package-booking-success" element={<PackageBookingSuccessPage />} />
                <Route path="/rate-flight" element={<RateFlightPage />} />
                <Route path="/booking-confirmation/:reference" element={<BookingConfirmedWrapper />} />
                <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
                <Route path="/ai-assistant" element={<AIAssistantPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetailsPage /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
                <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsersPage /></AdminProtectedRoute>} />
                <Route path="/admin/bookings" element={<AdminProtectedRoute><AdminBookingsPage /></AdminProtectedRoute>} />
                <Route path="/admin/bookings/:id" element={<AdminProtectedRoute><AdminBookingDetailsPage /></AdminProtectedRoute>} />
                <Route path="/admin/content" element={<AdminProtectedRoute><AdminContentPage /></AdminProtectedRoute>} />
                <Route path="/admin/ratings" element={<AdminProtectedRoute><AdminRatingsPage /></AdminProtectedRoute>} />

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
          <Toaster richColors closeButton position="top-right" />
        </UserActivityProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;