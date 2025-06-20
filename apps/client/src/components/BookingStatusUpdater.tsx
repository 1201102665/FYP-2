import React, { useEffect, useState } from 'react';
import { Booking } from '@/services/bookingService';
import { useToast } from '@/hooks/use-toast';

interface BookingStatusUpdaterProps {
  bookingId: number;
  initialStatus: Booking['status'];
  onStatusChange?: (newStatus: Booking['status']) => void;
  pollingInterval?: number; // in milliseconds
}

const BookingStatusUpdater: React.FC<BookingStatusUpdaterProps> = ({
  bookingId,
  initialStatus,
  onStatusChange,
  pollingInterval = 10000 // Default to 10 seconds
}) => {
  const [status, setStatus] = useState<Booking['status']>(initialStatus);
  const { toast } = useToast();

  // Function to fetch the latest booking status
  const fetchBookingStatus = async () => {
    try {
      // This would be a real API call in production
      // const response = await bookingService.getBooking(bookingId);
      // const newStatus = response.status;

      // For demo purposes, we'll simulate status changes
      const statusOptions: Booking['status'][] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
      const currentIndex = statusOptions.indexOf(status);

      // Only simulate a change occasionally and never go backwards in the flow
      // This is just for demonstration - real implementation would use actual API data
      const shouldChange = Math.random() > 0.7 && currentIndex < 2;

      if (shouldChange) {
        const newStatus = statusOptions[currentIndex + 1];

        if (newStatus !== status) {
          setStatus(newStatus);

          // Notify user of status change
          toast({
            title: "Booking Status Updated",
            description: `Your booking status has changed to ${newStatus}`,
            variant: "default"
          });

          // Call the callback if provided
          if (onStatusChange) {
            onStatusChange(newStatus);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching booking status:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchBookingStatus();

    // Set up polling
    const intervalId = setInterval(fetchBookingStatus, pollingInterval);

    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [bookingId, status, pollingInterval]);

  return null; // This is a non-visual component
};

export default BookingStatusUpdater;