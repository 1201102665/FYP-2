import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import useUserActivity, { UserActivity } from '@/hooks/use-user-activity';

interface UserPreferences {
  preferredActivities: string[];
  favoriteDestinations: string[];
  budgetRange: [number, number];
  travelStyle: string[];
}

interface UserActivityContextType {
  userActivity: {
    preferences: UserPreferences;
  };
  trackSearch: (destination: string, date: string, type: 'flight' | 'hotel' | 'car' | 'package') => void;
  trackView: (itemId: string, type: 'flight' | 'hotel' | 'car' | 'package' | 'destination') => void;
  trackBooking: (itemId: string, type: 'flight' | 'hotel' | 'car' | 'package', destination: string) => void;
  updatePreferences: (preferences: UserPreferences) => void;
}

const defaultPreferences: UserPreferences = {
  preferredActivities: [],
  favoriteDestinations: [],
  budgetRange: [0, 5000],
  travelStyle: []
};

const UserActivityContext = createContext<UserActivityContextType>({
  userActivity: {
    preferences: defaultPreferences
  },
  trackSearch: () => { },
  trackView: () => { },
  trackBooking: () => { },
  updatePreferences: () => { }
});

export const UserActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userActivityHook = useUserActivity();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Store the hook functions in refs to prevent recreation
  const hookRefs = useRef({
    trackSearch: userActivityHook.trackSearch,
    trackView: userActivityHook.trackView,
    trackBooking: userActivityHook.trackBooking
  });

  // Update refs when hook functions change
  useEffect(() => {
    hookRefs.current = {
      trackSearch: userActivityHook.trackSearch,
      trackView: userActivityHook.trackView,
      trackBooking: userActivityHook.trackBooking
    };
  }, [userActivityHook.trackSearch, userActivityHook.trackView, userActivityHook.trackBooking]);

  const updatePreferences = useCallback((newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
  }, []);

  const trackSearch = useCallback((destination: string, date: string, type: 'flight' | 'hotel' | 'car' | 'package') => {
    hookRefs.current.trackSearch(destination, date, type);
  }, []);

  const trackView = useCallback((itemId: string, type: 'flight' | 'hotel' | 'car' | 'package' | 'destination') => {
    hookRefs.current.trackView(itemId, type);
  }, []);

  const trackBooking = useCallback((itemId: string, type: 'flight' | 'hotel' | 'car' | 'package', destination: string) => {
    hookRefs.current.trackBooking(itemId, type, destination);
  }, []);

  const value = {
    userActivity: {
      preferences
    },
    trackSearch,
    trackView,
    trackBooking,
    updatePreferences
  };

  return (
    <UserActivityContext.Provider value={value} data-id="1xpxlxi23" data-path="src/contexts/UserActivityContext.tsx">
      {children}
    </UserActivityContext.Provider>
  );
};

export const useUserActivityContext = () => {
  const context = useContext(UserActivityContext);
  if (context === undefined) {
    throw new Error('useUserActivityContext must be used within a UserActivityProvider');
  }
  return context;
};

export default UserActivityContext;