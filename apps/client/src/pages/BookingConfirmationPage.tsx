import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const BookingConfirmationPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <h1 className="text-3xl font-bold mb-4 text-green-600">Booking Confirmed!</h1>
                    <p className="text-gray-700 mb-6">Thank you for your booking. A confirmation email has been sent to you. We look forward to serving you!</p>
                    <Button className="w-full bg-aerotrav-blue hover:bg-blue-700 mb-2" onClick={() => navigate('/')}>Back to Home</Button>
                    <Button className="w-full" variant="outline" onClick={() => navigate('/profile')}>View My Bookings</Button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookingConfirmationPage; 