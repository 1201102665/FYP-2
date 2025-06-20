import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useCart, CartItem } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { createPaymentIntent, createBooking } from '@/services/bookingService';

interface PaymentFormProps {
  onSuccess: (bookingRef: string) => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onError }) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { trackBooking } = useUserActivityContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [processing, setProcessing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: user?.name || '',
    expiry: '',
    cvv: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Malaysia'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      onError('User is not authenticated');
      return;
    }

    if (items.length === 0) {
      onError('Your cart is empty');
      return;
    }

    try {
      setProcessing(true);

      // Step 1: Create payment intent (in a real app, this would interact with Stripe)
      const totalAmount = parseFloat((getTotalPrice() * 1.1).toFixed(2)); // Including tax
      const paymentIntent = await createPaymentIntent(totalAmount);

      // Step 2: Process the payment (simulated)
      // In a real implementation, this would use Stripe Elements to collect and process payment
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Step 3: Create the booking record
      const bookingResult = await createBooking(
        user.id,
        user.email,
        user.name,
        items,
        paymentMethod,
        paymentIntent.paymentIntentId,
        totalAmount
      );

      // Step 4: Track bookings for analytics
      items.forEach((item) => {
        trackBooking(
          item.id,
          item.type,
          item.name
        );
      });

      // Step 5: Clear cart after successful payment
      clearCart();

      // Step 6: Show success message and redirect
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed!",
        variant: "default"
      });

      // Call success callback with booking reference
      onSuccess(bookingResult.bookingReference);

    } catch (error) {
      console.error('Payment error:', error);
      onError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card data-id="0dm8qezta" data-path="src/components/PaymentForm.tsx">
      <CardHeader data-id="319gtvjlc" data-path="src/components/PaymentForm.tsx">
        <CardTitle data-id="ohcbtt2f0" data-path="src/components/PaymentForm.tsx">Payment Information</CardTitle>
        <CardDescription data-id="4bs21ay00" data-path="src/components/PaymentForm.tsx">
          Please enter your payment details
        </CardDescription>
      </CardHeader>
      
      <CardContent data-id="2lxqmy9ey" data-path="src/components/PaymentForm.tsx">
        <form onSubmit={handleSubmit} data-id="d4q6gn0b1" data-path="src/components/PaymentForm.tsx">
          <div className="mb-6" data-id="g90vldpuq" data-path="src/components/PaymentForm.tsx">
            <RadioGroup
              defaultValue={paymentMethod}
              onValueChange={setPaymentMethod}
              className="flex space-x-4" data-id="zpdju3k47" data-path="src/components/PaymentForm.tsx">
              <div className="flex items-center space-x-2" data-id="vme4b1ib5" data-path="src/components/PaymentForm.tsx">
                <RadioGroupItem value="card" id="payment-card" data-id="pcaigdykn" data-path="src/components/PaymentForm.tsx" />
                <Label htmlFor="payment-card" className="flex items-center" data-id="26rbsndjb" data-path="src/components/PaymentForm.tsx">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2" data-id="z5lom9qyc" data-path="src/components/PaymentForm.tsx">
                    <rect width="20" height="14" x="2" y="5" rx="2" data-id="oaeh7jdv2" data-path="src/components/PaymentForm.tsx" />
                    <line x1="2" x2="22" y1="10" y2="10" data-id="d8q0g4ed6" data-path="src/components/PaymentForm.tsx" />
                  </svg>
                  Credit Card
                </Label>
              </div>
              
              <div className="flex items-center space-x-2" data-id="vw45ugeao" data-path="src/components/PaymentForm.tsx">
                <RadioGroupItem value="paypal" id="payment-paypal" data-id="3arcj0uef" data-path="src/components/PaymentForm.tsx" />
                <Label htmlFor="payment-paypal" className="flex items-center" data-id="1a7jqrdsz" data-path="src/components/PaymentForm.tsx">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2" data-id="5wyq4xvtj" data-path="src/components/PaymentForm.tsx">
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" data-id="a0lwe0wj8" data-path="src/components/PaymentForm.tsx" />
                    <path d="M8.93 13H12a5 5 0 0 1 0 10H7v-6.59" data-id="5vna0uptr" data-path="src/components/PaymentForm.tsx" />
                  </svg>
                  PayPal
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {paymentMethod === 'card' ?
          <>
              <div className="space-y-4" data-id="i1gbwt32k" data-path="src/components/PaymentForm.tsx">
                <div data-id="oi8w7mbg6" data-path="src/components/PaymentForm.tsx">
                  <Label htmlFor="cardNumber" data-id="84wdyi1z4" data-path="src/components/PaymentForm.tsx">Card Number</Label>
                  <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required data-id="v6wfmu0b6" data-path="src/components/PaymentForm.tsx" />
                </div>
                
                <div data-id="ajo2ibpbx" data-path="src/components/PaymentForm.tsx">
                  <Label htmlFor="cardHolder" data-id="74k3qxlr2" data-path="src/components/PaymentForm.tsx">Card Holder Name</Label>
                  <Input
                  id="cardHolder"
                  name="cardHolder"
                  placeholder="John Doe"
                  value={formData.cardHolder}
                  onChange={handleInputChange}
                  required data-id="mapkxb3et" data-path="src/components/PaymentForm.tsx" />
                </div>
                
                <div className="grid grid-cols-2 gap-4" data-id="qlo7vchj4" data-path="src/components/PaymentForm.tsx">
                  <div data-id="syghdju7c" data-path="src/components/PaymentForm.tsx">
                    <Label htmlFor="expiry" data-id="vcrxweqrs" data-path="src/components/PaymentForm.tsx">Expiry Date</Label>
                    <Input
                    id="expiry"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    required data-id="dg4rqabhi" data-path="src/components/PaymentForm.tsx" />
                  </div>
                  
                  <div data-id="mx8k3lx23" data-path="src/components/PaymentForm.tsx">
                    <Label htmlFor="cvv" data-id="t9bq3zvbl" data-path="src/components/PaymentForm.tsx">CVV</Label>
                    <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                    maxLength={4} data-id="tpln6wi7e" data-path="src/components/PaymentForm.tsx" />
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" data-id="aaf4pmu65" data-path="src/components/PaymentForm.tsx" />
              
              <div className="space-y-4" data-id="ku2y86j0n" data-path="src/components/PaymentForm.tsx">
                <h3 className="font-medium" data-id="633snxx6m" data-path="src/components/PaymentForm.tsx">Billing Address</h3>
                
                <div data-id="peqsx0uy8" data-path="src/components/PaymentForm.tsx">
                  <Label htmlFor="address" data-id="ko1wevmdc" data-path="src/components/PaymentForm.tsx">Street Address</Label>
                  <Input
                  id="address"
                  name="address"
                  placeholder="123 Travel Street"
                  value={formData.address}
                  onChange={handleInputChange}
                  required data-id="6ddhw4ltt" data-path="src/components/PaymentForm.tsx" />
                </div>
                
                <div className="grid grid-cols-3 gap-4" data-id="eo0izdmlk" data-path="src/components/PaymentForm.tsx">
                  <div className="col-span-1" data-id="2ehaf8p7o" data-path="src/components/PaymentForm.tsx">
                    <Label htmlFor="city" data-id="dbw7s1hae" data-path="src/components/PaymentForm.tsx">City</Label>
                    <Input
                    id="city"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required data-id="2gjaoto2a" data-path="src/components/PaymentForm.tsx" />
                  </div>
                  
                  <div className="col-span-1" data-id="639il0loo" data-path="src/components/PaymentForm.tsx">
                    <Label htmlFor="zipCode" data-id="ru5vaftrn" data-path="src/components/PaymentForm.tsx">Zip Code</Label>
                    <Input
                    id="zipCode"
                    name="zipCode"
                    placeholder="12345"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required data-id="xln9rw3k3" data-path="src/components/PaymentForm.tsx" />
                  </div>
                  
                  <div className="col-span-1" data-id="8h8zerjh1" data-path="src/components/PaymentForm.tsx">
                    <Label htmlFor="country" data-id="qb8kvygk2" data-path="src/components/PaymentForm.tsx">Country</Label>
                    <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required data-id="2s0pimxbe" data-path="src/components/PaymentForm.tsx" />
                  </div>
                </div>
              </div>
            </> :

          <div className="flex flex-col items-center justify-center py-8" data-id="hcbsrgnzb" data-path="src/components/PaymentForm.tsx">
              <p className="text-center mb-4" data-id="05l01ksb8" data-path="src/components/PaymentForm.tsx">
                You will be redirected to PayPal to complete your payment.
              </p>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-id="4nkp0q9yw" data-path="src/components/PaymentForm.tsx">
                <path d="M7 11V7a5 5 0 0 1 9.9-1" data-id="fn0tg4uda" data-path="src/components/PaymentForm.tsx" />
                <path d="M8.93 13H12a5 5 0 0 1 0 10H7v-6.59" data-id="axhuzji1j" data-path="src/components/PaymentForm.tsx" />
              </svg>
            </div>
          }
          
          <div className="mt-6" data-id="rd698c47d" data-path="src/components/PaymentForm.tsx">
            <Button
              type="submit"
              className="w-full bg-aerotrav-blue hover:bg-blue-700"
              disabled={processing} data-id="dpncd6t1h" data-path="src/components/PaymentForm.tsx">
              {processing ? 'Processing...' : 'Complete Payment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>);

};

export default PaymentForm;