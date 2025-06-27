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
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:3001';

export const AuthProvider: React.FC<{children: ReactNode;}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Check for saved auth state on initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
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

      // Call the backend API
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (error) {
        console.error('Login error: Failed to parse JSON', error);
        toast({
          title: "Login Failed",
          description: "Network error occurred. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      if (data.success && data.token) {
        // Store the token
        localStorage.setItem('token', data.token);
        
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

      // Call the backend API with correct URL
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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

      if (response.status === 409) {
        toast({
          title: "Email Already Exists",
          description: "This email address is already registered. Please try logging in instead.",
          variant: "destructive"
        });
        return false;
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data?.message || `Server error: ${response.status}`;
        toast({
          title: "Registration Failed",
          description: errorMsg,
          variant: "destructive"
        });
        return false;
      }

      if (data.success && data.token) {
        // Store the token immediately after successful registration
        localStorage.setItem('token', data.token);
        
        // Create user object from response
        const newUser = {
          id: data.user.id.toString(),
          name: data.user.name,
          email: data.user.email,
          avatar: `https://i.pravatar.cc/150?u=${email}`
        };

        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));

        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully!",
          variant: "default"
        });

        return true;
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Failed to create account.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Registration Failed",
        description: "Network error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default"
    });
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      signup, 
      logout,
      getToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;