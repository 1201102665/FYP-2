import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode;}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Check for saved auth state on initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Validate inputs
      if (!email || !password) {
        toast({
          title: "Login Failed",
          description: "Please enter both email and password.",
          variant: "destructive"
        });
        return false;
      }

      // Call the PHP backend API
      const response = await fetch('/login_submit.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Create user object from response
        const loggedInUser = {
          id: data.user.id.toString(),
          name: data.user.name,
          email: data.user.email,
          avatar: `https://i.pravatar.cc/150?u=${email}`
        };

        setUser(loggedInUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(loggedInUser));

        toast({
          title: "Login Successful",
          description: data.message || "Welcome back!",
          variant: "default"
        });

        return true;
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Network error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    try {
      // Validate inputs
      if (!name || !email || !password) {
        console.log('AuthContext: Validation failed - missing fields');
        toast({
          title: "Registration Failed",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return false;
      }

      console.log('AuthContext: Starting signup process...');
      console.log('AuthContext: Attempting signup with data:', { name, email, phone });

      // Call the PHP backend API
      const response = await fetch('/signup_submit.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone
        })
      });

      console.log('AuthContext: Response received');
      console.log('AuthContext: Response status:', response.status);
      console.log('AuthContext: Response ok:', response.ok);
      console.log('AuthContext: Response headers:', Object.fromEntries(response.headers.entries()));

      // Handle different response statuses
      if (response.status === 409) {
        console.log('AuthContext: 409 Conflict - Email already exists');
        // Duplicate email case
        toast({
          title: "Email Already Exists",
          description: "This email address is already registered. Please try logging in instead.",
          variant: "destructive"
        });
        return false;
      }

      if (!response.ok) {
        console.error('AuthContext: HTTP error:', response.status, response.statusText);
        toast({
          title: "Registration Failed",
          description: `Server error: ${response.status} ${response.statusText}`,
          variant: "destructive"
        });
        return false;
      }

      let data;
      try {
        data = await response.json();
        console.log('AuthContext: JSON parsed successfully');
        console.log('AuthContext: Response data:', data);
      } catch (parseError) {
        console.error('AuthContext: Failed to parse JSON response:', parseError);
        toast({
          title: "Registration Failed",
          description: "Server returned invalid response.",
          variant: "destructive"
        });
        return false;
      }

      if (data.success) {
        console.log('AuthContext: Backend reports success!');
        console.log('AuthContext: User ID from backend:', data.user_id);
        
        // Create user object from response
        const newUser = {
          id: data.user_id.toString(),
          name,
          email,
          avatar: `https://i.pravatar.cc/150?u=${email}`
        };

        console.log('AuthContext: Created user object:', newUser);

        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));

        console.log('AuthContext: User state updated, authentication set to true');
        console.log('AuthContext: Returning true for successful signup');

        return true;
      } else {
        console.error('AuthContext: Backend returned success: false');
        console.error('AuthContext: Backend error message:', data.message);
        toast({
          title: "Registration Failed",
          description: data.message || "Failed to create account.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('AuthContext: Exception caught during signup:', error);
      console.error('AuthContext: Error type:', typeof error);
      console.error('AuthContext: Error constructor:', error.constructor.name);
      
      // More specific error handling
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('AuthContext: Fetch/network error detected');
        toast({
          title: "Connection Error",
          description: "Cannot connect to server. Please check your internet connection.",
          variant: "destructive"
        });
      } else if (error instanceof SyntaxError) {
        console.log('AuthContext: JSON parsing error detected');
        toast({
          title: "Registration Failed",
          description: "Server returned invalid response. Please try again.",
          variant: "destructive"
        });
      } else {
        console.log('AuthContext: Unknown error detected');
        toast({
          title: "Registration Failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default"
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }} data-id="od1a7zfbf" data-path="src/contexts/AuthContext.tsx">
      {children}
    </AuthContext.Provider>);

};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;