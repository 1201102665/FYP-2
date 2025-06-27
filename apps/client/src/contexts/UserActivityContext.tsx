import React, { createContext, useContext, useState, useCallback } from 'react';
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
  trackSearch: () => {},
  trackView: () => {},
  trackBooking: () => {},
  updatePreferences: () => {}
});

export const UserActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userActivityHook = useUserActivity();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  const updatePreferences = useCallback((newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
  }, []);

  const value = {
    userActivity: {
      preferences
    },
    trackSearch: userActivityHook.trackSearch,
    trackView: userActivityHook.trackView,
    trackBooking: userActivityHook.trackBooking,
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