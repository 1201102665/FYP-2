import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Plane, 
  Hotel, 
  Car, 
  Package,
  Star,
  MapPin,
  Calendar,
  Users,
  CreditCard
} from 'lucide-react';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    updateSpecialRequests, 
    updateAddOns, 
    getTotalPrice, 
    clearCart 
  } = useCart();

  const [specialRequests, setSpecialRequests] = useState<{[key: string]: string}>({});
  const [selectedAddOns, setSelectedAddOns] = useState<{[key: string]: string[]}>({});

  // Available add-ons for different service types
  const availableAddOns = {
    flight: [
      { id: 'extra-baggage', name: 'Extra Baggage (20kg)', price: 50 },
      { id: 'seat-selection', name: 'Premium Seat Selection', price: 25 },
      { id: 'meal-upgrade', name: 'Meal Upgrade', price: 15 },
      { id: 'fast-track', name: 'Fast Track Security', price: 20 }
    ],
    hotel: [
      { id: 'late-checkout', name: 'Late Checkout (until 6 PM)', price: 30 },
      { id: 'room-upgrade', name: 'Room Upgrade', price: 75 },
      { id: 'spa-package', name: 'Spa Package', price: 120 },
      { id: 'airport-transfer', name: 'Airport Transfer', price: 40 }
    ],
    car: [
      { id: 'gps-navigation', name: 'GPS Navigation', price: 10 },
      { id: 'child-seat', name: 'Child Seat', price: 15 },
      { id: 'additional-driver', name: 'Additional Driver', price: 25 },
      { id: 'full-insurance', name: 'Full Insurance Coverage', price: 35 }
    ],
    package: [
      { id: 'travel-insurance', name: 'Premium Travel Insurance', price: 45 },
      { id: 'private-guide', name: 'Private Tour Guide', price: 100 },
      { id: 'photography', name: 'Professional Photography', price: 150 },
      { id: 'cultural-experience', name: 'Cultural Experience Package', price: 80 }
    ]
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-5 w-5" />;
      case 'hotel': return <Hotel className="h-5 w-5" />;
      case 'car': return <Car className="h-5 w-5" />;
      case 'package': return <Package className="h-5 w-5" />;
      default: return <ShoppingCart className="h-5 w-5" />;
    }
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      updateQuantity(itemId, Math.max(1, item.quantity + change));
    }
  };

  const handleSpecialRequestChange = (itemId: string, request: string) => {
    setSpecialRequests(prev => ({ ...prev, [itemId]: request }));
    updateSpecialRequests(itemId, request);
  };

  const handleAddOnToggle = (itemId: string, addOnId: string, addOnName: string) => {
    setSelectedAddOns(prev => {
      const currentAddOns = prev[itemId] || [];
      const isSelected = currentAddOns.includes(addOnId);
      
      let newAddOns;
      if (isSelected) {
        newAddOns = currentAddOns.filter(id => id !== addOnId);
      } else {
        newAddOns = [...currentAddOns, addOnId];
      }
      
      updateAddOns(itemId, newAddOns);
      return { ...prev, [itemId]: newAddOns };
    });
  };

  const calculateAddOnPrice = (itemId: string, itemType: string) => {
    const itemAddOns = selectedAddOns[itemId] || [];
    const typeAddOns = availableAddOns[itemType] || [];
    
    return itemAddOns.reduce((total, addOnId) => {
      const addOn = typeAddOns.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
  };

  const getTotalPriceWithAddOns = () => {
    const baseTotal = getTotalPrice();
    const addOnsTotal = items.reduce((total, item) => {
      return total + calculateAddOnPrice(item.id, item.type) * item.quantity;
    }, 0);
    return baseTotal + addOnsTotal;
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart to get started with your booking.</p>
            <Button onClick={() => navigate('/')} className="bg-aerotrav-blue hover:bg-aerotrav-blue-700">
              Start Browsing
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Your Cart</h1>
            <Button 
              variant="outline" 
              onClick={clearCart}
              className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Item Image */}
                      <div className="md:w-48 h-32 rounded-lg overflow-hidden bg-gray-200">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getItemIcon(item.type)}
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              {getItemIcon(item.type)}
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Item specific details */}
                        <div className="text-sm text-gray-600 mb-4">
                          {item.type === 'flight' && (
                            <div className="space-y-1">
                              <p className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {item.details.departureAirport} → {item.details.arrivalAirport}
                              </p>
                              <p>{item.details.departureTime} - {item.details.arrivalTime}</p>
                            </div>
                          )}
                          {item.type === 'hotel' && (
                            <div className="space-y-1">
                              <p className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {item.details.location}
                              </p>
                              <p className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {item.details.startDate} - {item.details.endDate} ({item.details.nights} nights)
                              </p>
                            </div>
                          )}
                          {item.type === 'package' && (
                            <div className="space-y-1">
                              <p className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {item.details.destination}
                              </p>
                              <p>{item.details.duration}</p>
                            </div>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-sm font-medium">Quantity:</span>
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 py-1 text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Add-ons */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Available Add-ons:</h4>
                          <div className="space-y-2">
                            {(availableAddOns[item.type] || []).map((addOn) => (
                              <div key={addOn.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${item.id}-${addOn.id}`}
                                    checked={(selectedAddOns[item.id] || []).includes(addOn.id)}
                                    onCheckedChange={() => handleAddOnToggle(item.id, addOn.id, addOn.name)}
                                  />
                                  <label 
                                    htmlFor={`${item.id}-${addOn.id}`}
                                    className="text-sm"
                                  >
                                    {addOn.name}
                                  </label>
                                </div>
                                <span className="text-sm font-medium">${addOn.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Special Requests */}
                        <div className="mb-4">
                          <label className="text-sm font-medium mb-2 block">Special Requests:</label>
                          <Textarea
                            placeholder="Any special requests or requirements..."
                            value={specialRequests[item.id] || ''}
                            onChange={(e) => handleSpecialRequestChange(item.id, e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>

                        {/* Price */}
                        <div className="flex justify-between items-center pt-4 border-t">
                          <span className="text-sm text-gray-600">
                            Base: ${item.price} × {item.quantity}
                            {calculateAddOnPrice(item.id, item.type) > 0 && (
                              <span> + Add-ons: ${calculateAddOnPrice(item.id, item.type)} × {item.quantity}</span>
                            )}
                          </span>
                          <span className="text-lg font-semibold">
                            ${(item.price + calculateAddOnPrice(item.id, item.type)) * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span>${getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Add-ons</span>
                      <span>${getTotalPriceWithAddOns() - getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service Fee</span>
                      <span>$25</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${getTotalPriceWithAddOns() + 25}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleProceedToCheckout}
                    className="w-full bg-aerotrav-blue hover:bg-aerotrav-blue-700"
                    size="lg"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;