import React, { createContext, useContext, ReactNode } from 'react';
import useUserActivity, { UserActivity } from '@/hooks/use-user-activity';

interface UserActivityContextType {
  userActivity: UserActivity;
  trackSearch: (destination: string, date: string, type: 'flight' | 'hotel' | 'car' | 'package') => void;
  trackView: (itemId: string, type: 'flight' | 'hotel' | 'car' | 'package' | 'destination') => void;
  trackBooking: (itemId: string, type: 'flight' | 'hotel' | 'car' | 'package', destination: string) => void;
  updatePreferences: (preferences: Partial<UserActivity['preferences']>) => void;
}

const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined);

export const UserActivityProvider: React.FC<{children: ReactNode;}> = ({ children }) => {
  const userActivityHook = useUserActivity();

  return (
    <UserActivityContext.Provider value={userActivityHook} data-id="1xpxlxi23" data-path="src/contexts/UserActivityContext.tsx">
      {children}
    </UserActivityContext.Provider>);

};

export const useUserActivityContext = () => {
  const context = useContext(UserActivityContext);
  if (context === undefined) {
    throw new Error('useUserActivityContext must be used within a UserActivityProvider');
  }
  return context;
};

export default UserActivityContext;