import { useState, useEffect } from 'react';

export interface UserActivity {
  searches: {
    destination: string;
    date: string;
    type: 'flight' | 'hotel' | 'car' | 'package';
    timestamp: string;
  }[];
  views: {
    itemId: string;
    type: 'flight' | 'hotel' | 'car' | 'package' | 'destination';
    timestamp: string;
  }[];
  bookings: {
    itemId: string;
    type: 'flight' | 'hotel' | 'car' | 'package';
    destination: string;
    timestamp: string;
    timeToBook?: number; // Time in seconds from first view to booking
  }[];
  preferences: {
    favoriteDestinations: string[];
    preferredActivities: string[];
    budgetRange: [number, number];
    travelStyle: string[];
  };
}

const DEFAULT_USER_ACTIVITY: UserActivity = {
  searches: [],
  views: [],
  bookings: [],
  preferences: {
    favoriteDestinations: [],
    preferredActivities: [],
    budgetRange: [0, 5000],
    travelStyle: []
  }
};

export function useUserActivity() {
  const [userActivity, setUserActivity] = useState<UserActivity>(DEFAULT_USER_ACTIVITY);

  // Load from localStorage on mount
  useEffect(() => {
    const storedActivity = localStorage.getItem('userActivity');
    if (storedActivity) {
      try {
        setUserActivity(JSON.parse(storedActivity));
      } catch (e) {
        console.error('Failed to parse stored user activity:', e);
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('userActivity', JSON.stringify(userActivity));
  }, [userActivity]);

  const trackSearch = (destination: string, date: string, type: 'flight' | 'hotel' | 'car' | 'package') => {
    setUserActivity((prev) => ({
      ...prev,
      searches: [...prev.searches, {
        destination,
        date,
        type,
        timestamp: new Date().toISOString()
      }].slice(-20) // Keep last 20 searches
    }));
  };

  const trackView = (itemId: string, type: 'flight' | 'hotel' | 'car' | 'package' | 'destination') => {
    setUserActivity((prev) => ({
      ...prev,
      views: [...prev.views, {
        itemId,
        type,
        timestamp: new Date().toISOString()
      }].slice(-50) // Keep last 50 views
    }));
  };

  const trackBooking = (itemId: string, type: 'flight' | 'hotel' | 'car' | 'package', destination: string) => {
    setUserActivity((prev) => {
      // Find the first view of this item to calculate time-to-book
      const firstView = prev.views.find((view) => view.itemId === itemId && view.type === type);
      const timeToBook = firstView ?
      (new Date().getTime() - new Date(firstView.timestamp).getTime()) / 1000 : // Convert to seconds
      undefined;

      return {
        ...prev,
        bookings: [...prev.bookings, {
          itemId,
          type,
          destination,
          timestamp: new Date().toISOString(),
          timeToBook
        }]
      };
    });
  };

  const updatePreferences = (preferences: Partial<UserActivity['preferences']>) => {
    setUserActivity((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...preferences
      }
    }));
  };

  return {
    userActivity,
    trackSearch,
    trackView,
    trackBooking,
    updatePreferences
  };
}

export default useUserActivity;