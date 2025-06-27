import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const { itemCount } = useCartContext();

  const handleViewCart = () => {
    navigate('/cart'); // Navigate to cart page
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-id="x65lgps43" data-path="src/components/CartModal.tsx">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full" data-id="ry9dk17sn" data-path="src/components/CartModal.tsx">
        <h2 className="text-2xl font-bold text-center mb-6" data-id="dh0tcd3jv" data-path="src/components/CartModal.tsx">
          Item Added to Cart
        </h2>
        <p className="text-center text-gray-600 mb-6" data-id="x19io70n8" data-path="src/components/CartModal.tsx">
          You have {itemCount} item(s) in your cart
        </p>
        
        <div className="flex gap-4 justify-center" data-id="4coejyzsw" data-path="src/components/CartModal.tsx">
          <Button
            onClick={handleViewCart}
            className="bg-aerotrav-blue hover:bg-blue-700 text-white" data-id="fwl3gw0bt" data-path="src/components/CartModal.tsx">

            View the cart
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="border-aerotrav-blue text-aerotrav-blue hover:bg-aerotrav-blue/10" data-id="lm9w7vp65" data-path="src/components/CartModal.tsx">

            Cancel
          </Button>
        </div>
      </div>
    </div>);

};

export default CartModal;