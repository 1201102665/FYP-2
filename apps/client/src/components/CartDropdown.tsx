import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose } from
'@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, X, Plus, Minus, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CartDropdown: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, getItemCount, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to proceed to checkout",
        variant: "destructive"
      });
      navigate('/login', { state: { redirectTo: '/cart' } });
      return;
    }

    navigate('/cart');
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'flight':
        return 'Flight';
      case 'hotel':
        return 'Hotel';
      case 'car':
        return 'Car Rental';
      case 'package':
        return 'Travel Package';
      default:
        return 'Item';
    }
  };

  const itemCount = getItemCount();
  const totalPrice = getTotalPrice();

  return (
    <Sheet data-id="nmt670v83" data-path="src/components/CartDropdown.tsx">
      <SheetTrigger asChild data-id="34cr4v34q" data-path="src/components/CartDropdown.tsx">
        <Button variant="outline" size="icon" className="relative" data-id="0xutms1m3" data-path="src/components/CartDropdown.tsx">
          <ShoppingCart className="h-5 w-5" data-id="1xtc2mydi" data-path="src/components/CartDropdown.tsx" />
          {itemCount > 0 &&
          <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-aerotrav-blue text-white" data-id="jzw8lg8b9" data-path="src/components/CartDropdown.tsx">
              {itemCount}
            </Badge>
          }
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col" data-id="bay87t0me" data-path="src/components/CartDropdown.tsx">
        <SheetHeader data-id="7iv4442bc" data-path="src/components/CartDropdown.tsx">
          <SheetTitle className="flex justify-between items-center" data-id="quaittbkx" data-path="src/components/CartDropdown.tsx">
            <span data-id="2jhducfbl" data-path="src/components/CartDropdown.tsx">Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            {items.length > 0 &&
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-gray-500" data-id="ebs2345ui" data-path="src/components/CartDropdown.tsx">

                <Trash2 className="h-4 w-4 mr-1" data-id="355t35b8q" data-path="src/components/CartDropdown.tsx" />
                Clear
              </Button>
            }
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ?
        <div className="flex flex-col items-center justify-center flex-grow py-12" data-id="65h9m0y0c" data-path="src/components/CartDropdown.tsx">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" data-id="vk8h8o4na" data-path="src/components/CartDropdown.tsx" />
            <p className="text-gray-500 mb-4" data-id="2rvhrblyb" data-path="src/components/CartDropdown.tsx">Your cart is empty</p>
            <SheetClose asChild data-id="4thwyxchr" data-path="src/components/CartDropdown.tsx">
              <Button onClick={() => navigate('/')} className="bg-aerotrav-blue" data-id="tsv87tswz" data-path="src/components/CartDropdown.tsx">
                Start Browsing
              </Button>
            </SheetClose>
          </div> :

        <>
            <ScrollArea className="flex-grow my-4" data-id="llq73vwmb" data-path="src/components/CartDropdown.tsx">
              <div className="space-y-4 pr-4" data-id="l2t9jwvzq" data-path="src/components/CartDropdown.tsx">
                {items.map((item) =>
              <div key={item.id} className="flex items-start gap-3 pb-3" data-id="0hed1ljhf" data-path="src/components/CartDropdown.tsx">
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0" data-id="6twdrnfk6" data-path="src/components/CartDropdown.tsx">
                      {item.image ?
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover" data-id="w97qqycos" data-path="src/components/CartDropdown.tsx" /> :


                  <div className="h-full w-full flex items-center justify-center text-gray-400" data-id="x3h5v46x2" data-path="src/components/CartDropdown.tsx">
                          No Image
                        </div>
                  }
                    </div>
                    
                    <div className="flex-grow" data-id="jdsphvihy" data-path="src/components/CartDropdown.tsx">
                      <div className="flex justify-between" data-id="2kio4i9ht" data-path="src/components/CartDropdown.tsx">
                        <h4 className="font-medium text-sm line-clamp-1" data-id="un2c8eeq2" data-path="src/components/CartDropdown.tsx">{item.name}</h4>
                        <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeItem(item.id)} data-id="y10zawaw9" data-path="src/components/CartDropdown.tsx">

                          <X className="h-3 w-3" data-id="1a00grr1d" data-path="src/components/CartDropdown.tsx" />
                        </Button>
                      </div>
                      
                      <Badge variant="outline" className="mt-1 bg-gray-50" data-id="fphuip91g" data-path="src/components/CartDropdown.tsx">
                        {getItemTypeLabel(item.type)}
                      </Badge>
                      
                      <div className="mt-2 space-y-2" data-id="s3ey5223j" data-path="src/components/CartDropdown.tsx">
                        <div className="flex flex-col" data-id="tmxk9ees5" data-path="src/components/CartDropdown.tsx">
                          {item.type === 'flight' && item.details.departureTime &&
                      <div className="flex items-center text-xs text-gray-500" data-id="z5kjazs47" data-path="src/components/CartDropdown.tsx">
                              <Clock className="h-3 w-3 mr-1" data-id="2skd8slck" data-path="src/components/CartDropdown.tsx" />
                              <span data-id="cvyvxodmk" data-path="src/components/CartDropdown.tsx">{item.details.departureTime} - {item.details.arrivalTime}</span>
                            </div>
                      }
                          {item.type === 'package' && item.details.startDate &&
                      <div className="flex items-center text-xs text-gray-500" data-id="cyue0jpvz" data-path="src/components/CartDropdown.tsx">
                              <Calendar className="h-3 w-3 mr-1" data-id="tf106fsue" data-path="src/components/CartDropdown.tsx" />
                              <span data-id="bti3c71b9" data-path="src/components/CartDropdown.tsx">{item.details.startDate} - {item.details.endDate}</span>
                            </div>
                      }
                          {item.details.destination &&
                      <div className="flex items-center text-xs text-gray-500" data-id="rzio64s0h" data-path="src/components/CartDropdown.tsx">
                              <MapPin className="h-3 w-3 mr-1" data-id="b4e4fq2ei" data-path="src/components/CartDropdown.tsx" />
                              <span data-id="oi29kdvy4" data-path="src/components/CartDropdown.tsx">{item.details.destination}</span>
                            </div>
                      }
                        </div>
                        
                        <div className="flex justify-between items-center" data-id="3y7z34ujb" data-path="src/components/CartDropdown.tsx">
                          <span className="text-sm font-medium" data-id="xnu2g39l8" data-path="src/components/CartDropdown.tsx">
                            ${item.price.toFixed(2)}
                          </span>
                          
                          <div className="flex items-center space-x-2" data-id="atyjrhxl6" data-path="src/components/CartDropdown.tsx">
                            <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 rounded-full p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1} data-id="8h26ft4xc" data-path="src/components/CartDropdown.tsx">

                              <Minus className="h-3 w-3" data-id="r4jedfvnz" data-path="src/components/CartDropdown.tsx" />
                            </Button>
                            <span className="text-sm w-4 text-center" data-id="0fomix78q" data-path="src/components/CartDropdown.tsx">{item.quantity}</span>
                            <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 rounded-full p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)} data-id="qbr4nhw9m" data-path="src/components/CartDropdown.tsx">

                              <Plus className="h-3 w-3" data-id="aiht1nt04" data-path="src/components/CartDropdown.tsx" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}
              </div>
            </ScrollArea>
            
            <div className="mt-auto" data-id="sv51l63jz" data-path="src/components/CartDropdown.tsx">
              <Separator className="my-4" data-id="spcnxsmg3" data-path="src/components/CartDropdown.tsx" />
              
              <div className="space-y-2 mb-4" data-id="j6g30xqia" data-path="src/components/CartDropdown.tsx">
                <div className="flex justify-between" data-id="jowm5eovs" data-path="src/components/CartDropdown.tsx">
                  <span className="text-sm" data-id="4sririz9s" data-path="src/components/CartDropdown.tsx">Subtotal</span>
                  <span className="font-medium" data-id="8h4j4inqr" data-path="src/components/CartDropdown.tsx">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between" data-id="92bd9b2dy" data-path="src/components/CartDropdown.tsx">
                  <span className="text-sm" data-id="usnwp2714" data-path="src/components/CartDropdown.tsx">Tax (10%)</span>
                  <span data-id="jvgjmjl6z" data-path="src/components/CartDropdown.tsx">${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium" data-id="g44y8dein" data-path="src/components/CartDropdown.tsx">
                  <span data-id="yfu340xfw" data-path="src/components/CartDropdown.tsx">Total</span>
                  <span data-id="46kutst4s" data-path="src/components/CartDropdown.tsx">${(totalPrice * 1.1).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3" data-id="5hcr8nwwc" data-path="src/components/CartDropdown.tsx">
                <SheetClose asChild data-id="a85p8kn3u" data-path="src/components/CartDropdown.tsx">
                  <Button onClick={handleCheckout} className="w-full bg-aerotrav-blue" data-id="8vmu2ygcc" data-path="src/components/CartDropdown.tsx">
                    Proceed to Checkout
                  </Button>
                </SheetClose>
                
                <SheetClose asChild data-id="3jcyg9wts" data-path="src/components/CartDropdown.tsx">
                  <Button variant="outline" className="w-full" onClick={() => navigate('/')} data-id="we4uq0izd" data-path="src/components/CartDropdown.tsx">
                    <Plus className="h-4 w-4 mr-2" data-id="47h4zs45t" data-path="src/components/CartDropdown.tsx" />
                    Add More Items
                  </Button>
                </SheetClose>
              </div>
            </div>
          </>
        }
      </SheetContent>
    </Sheet>);

};

export default CartDropdown;