import React from 'react';
import { useParams } from 'react-router-dom';
import BookingConfirmed from './BookingConfirmed';

const BookingConfirmedWrapper: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();
  
  return <BookingConfirmed bookingReference={reference || 'N/A'} />;
};

export default BookingConfirmedWrapper; 