import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export interface CartItem {
  id: string;
  type: 'flight' | 'hotel' | 'car' | 'package';
  name: string;
  image?: string;
  details: {
    [key: string]: any;
  };
  price: number;
  quantity: number;
  specialRequests?: string;
  addOns?: string[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  addItemWithCustomToast: (item: Omit<CartItem, 'quantity'>, navigate: (path: string) => void) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateSpecialRequests: (id: string, requests: string) => void;
  updateAddOns: (id: string, addOns: string[]) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: ReactNode;}> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on initialization
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse stored cart:', e);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((currentItems) => {
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex((i) => i.id === item.id && i.type === item.type);

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += 1;

        toast({
          title: "Item Updated",
          description: `${item.name} quantity increased.`,
          variant: "default"
        });

        return updatedItems;
      } else {
        // Add new item
        toast({
          title: "Item Added",
          description: `${item.name} added to your cart.`,
          variant: "default"
        });

        return [...currentItems, { ...item, quantity: 1 }];
      }
    });
  };

  const addItemWithCustomToast = (item: Omit<CartItem, 'quantity'>, navigate: (path: string) => void) => {
    setItems((currentItems) => {
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex((i) => i.id === item.id && i.type === item.type);

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += 1;

        toast({
          title: "Item Updated",
          description: `${item.name} quantity increased.`,
          variant: "default",
          action: (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => navigate('/cart')}
                className="bg-aerotrav-blue hover:bg-aerotrav-blue-700"
              >
                Check Cart
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {}}
              >
                Continue Browse
              </Button>
            </div>
          )
        });

        return updatedItems;
      } else {
        // Add new item
        const itemTypeName = item.type === 'flight' ? 'Flight' : 
                            item.type === 'hotel' ? 'Room' : 
                            item.type === 'car' ? 'Car' : 'Package';
        
        toast({
          title: `${itemTypeName} Added to Cart`,
          description: `${item.name} has been added to your cart.`,
          variant: "default",
          action: (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => navigate('/cart')}
                className="bg-aerotrav-blue hover:bg-aerotrav-blue-700"
              >
                Check Cart
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {}}
              >
                Continue Browse
              </Button>
            </div>
          )
        });

        return [...currentItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => {
      const itemToRemove = currentItems.find((item) => item.id === id);

      if (itemToRemove) {
        toast({
          title: "Item Removed",
          description: `${itemToRemove.name} removed from your cart.`,
          variant: "default"
        });
      }

      return currentItems.filter((item) => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const updateSpecialRequests = (id: string, requests: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, specialRequests: requests } : item
      )
    );
  };

  const updateAddOns = (id: string, addOns: string[]) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, addOns } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      variant: "default"
    });
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addItemWithCustomToast,
        removeItem,
        updateQuantity,
        updateSpecialRequests,
        updateAddOns,
        clearCart,
        getTotalPrice,
        getItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;