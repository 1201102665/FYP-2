import React, { createContext, useContext, useState, useCallback } from 'react';

interface CartItem {
  type: 'car' | 'flight' | 'hotel' | 'package';
  id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
  details: Record<string, unknown>;
}

export type { CartItem };

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, type: string) => void;
  updateQuantity: (id: number, type: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((newItem: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.id === newItem.id && item.type === newItem.type
      );

      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id && item.type === newItem.type
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, newItem];
    });
  }, []);

  const removeFromCart = useCallback((id: number, type: string) => {
    setItems(currentItems => 
      currentItems.filter(item => !(item.id === id && item.type === type))
    );
  }, []);

  const updateQuantity = useCallback((id: number, type: string, quantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id && item.type === type
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

export default CartContext;