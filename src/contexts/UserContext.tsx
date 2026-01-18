import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Location, SavedRoute } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { validateAndRedeemCode, PromoCode } from '@/config/promoCodes';

interface UserContextType {
  user: UserProfile | null;
  isOnboardingComplete: boolean;
  updateUser: (userData: Partial<UserProfile>) => void;
  setHomeLocation: (location: Location) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  saveRoute: (route: Omit<SavedRoute, 'id'>) => void;
  deleteRoute: (routeId: string) => void;
  useAirCredits: (amount: number) => boolean;
  getAvailableCredits: () => number;
  redeemPromoCode: (code: string) => { success: boolean; message: string; credits?: number };
  redeemedCodes: string[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
  const [redeemedCodes, setRedeemedCodes] = useState<string[]>([]);

  // Load user data and redeemed codes from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedOnboardingStatus = localStorage.getItem('onboardingComplete');
    const storedRedeemedCodes = localStorage.getItem('redeemedCodes');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const refreshedUser = refreshCreditsIfNeeded(parsedUser);
      setUser(refreshedUser);
    }
    
    if (storedOnboardingStatus) {
      setIsOnboardingComplete(JSON.parse(storedOnboardingStatus));
    }

    if (storedRedeemedCodes) {
      setRedeemedCodes(JSON.parse(storedRedeemedCodes));
    }
  }, []);

  // Function to refresh credits if it's a new day
  const refreshCreditsIfNeeded = (userData: UserProfile): UserProfile => {
    const now = new Date();
    const lastRefresh = new Date(userData.lastCreditRefresh);
    
    // Check if it's a new day (comparing date strings without time)
    if (now.toDateString() !== lastRefresh.toDateString()) {
      return {
        ...userData,
        airCredits: 24, // Daily credit refresh
        lastCreditRefresh: now.toISOString()
      };
    }
    return userData;
  };

  // Function to use air credits
  const useAirCredits = (amount: number): boolean => {
    if (!user || user.airCredits < amount) {
      return false;
    }

    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        airCredits: prev.airCredits - amount
      };
    });
    return true;
  };

  // Function to get available credits
  const getAvailableCredits = (): number => {
    if (!user) return 0;
    return user.airCredits;
  };

  // Save user data and redeemed codes to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    localStorage.setItem('onboardingComplete', JSON.stringify(isOnboardingComplete));
    localStorage.setItem('redeemedCodes', JSON.stringify(redeemedCodes));
  }, [user, isOnboardingComplete, redeemedCodes]);

  const updateUser = (userData: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) {
        return { 
          id: uuidv4(), 
          name: '', 
          hasRespiratoryIssues: false, 
          sensitivityLevel: 'medium',
          airCredits: 24, // Initial credits
          lastCreditRefresh: new Date().toISOString(),
          ...userData 
        };
      }
      return { ...prev, ...userData };
    });
  };

  const setHomeLocation = (location: Location) => {
    updateUser({ homeLocation: location });
  };

  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
  };

  const resetOnboarding = () => {
    setIsOnboardingComplete(false);
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingComplete');
    localStorage.removeItem('redeemedCodes');
    setUser(null);
    setRedeemedCodes([]);
  };

  const saveRoute = (route: Omit<SavedRoute, 'id'>) => {
    const newRoute: SavedRoute = {
      ...route,
      id: uuidv4(),
    };
    
    updateUser({
      preferredRoutes: [...(user?.preferredRoutes || []), newRoute]
    });
  };

  const deleteRoute = (routeId: string) => {
    if (user?.preferredRoutes) {
      updateUser({
        preferredRoutes: user.preferredRoutes.filter(route => route.id !== routeId)
      });
    }
  };

  const redeemPromoCode = (code: string): { success: boolean; message: string; credits?: number } => {
    if (!user) {
      return { success: false, message: "Please sign in to redeem promo codes" };
    }

    if (redeemedCodes.includes(code.toUpperCase())) {
      return { success: false, message: "This promo code has already been redeemed" };
    }

    const promoCode = validateAndRedeemCode(code);
    if (!promoCode) {
      return { success: false, message: "Invalid or inactive promo code" };
    }

    // Add credits to user's account
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        airCredits: prev.airCredits + promoCode.credits
      };
    });

    // Add code to redeemed codes
    setRedeemedCodes(prev => [...prev, code.toUpperCase()]);

    return { 
      success: true, 
      message: `Successfully redeemed ${promoCode.credits} air credits!`,
      credits: promoCode.credits
    };
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isOnboardingComplete, 
      updateUser, 
      setHomeLocation,
      completeOnboarding,
      resetOnboarding,
      saveRoute,
      deleteRoute,
      useAirCredits,
      getAvailableCredits,
      redeemPromoCode,
      redeemedCodes
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
