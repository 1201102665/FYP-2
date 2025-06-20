import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart, CartItem } from '@/contexts/CartContext';
import { ShoppingCart, Check } from 'lucide-react';

interface AddToCartButtonProps {
  item: Omit<CartItem, 'quantity'>;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  item,
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const navigate = useNavigate();
  const { addItemWithCustomToast, items } = useCart();
  const isInCart = items.some((cartItem) => cartItem.id === item.id && cartItem.type === item.type);

  const handleAddToCart = () => {
    if (!isInCart) {
      addItemWithCustomToast(item, navigate);
    }
  };

  return (
    <Button
      variant={isInCart ? 'secondary' : variant}
      size={size}
      onClick={handleAddToCart}
      disabled={isInCart}
      className={className} data-id="5sgpo29om" data-path="src/components/AddToCartButton.tsx">

      {isInCart ?
      <>
          <Check className="mr-2 h-4 w-4" data-id="5kh8v7e5z" data-path="src/components/AddToCartButton.tsx" />
          Added to Cart
        </> :

      <>
          <ShoppingCart className="mr-2 h-4 w-4" data-id="88eu44syy" data-path="src/components/AddToCartButton.tsx" />
          Add to Cart
        </>
      }
    </Button>);

};

export default AddToCartButton;