import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartContext } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle, 
  ArrowLeft,
  AlertCircle,
  Calendar,
  User,
  Plane,
  Hotel,
  Car,
  Package
} from 'lucide-react';
import bookingService from '@/services/bookingService';

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useCartContext();
  const { toast } = useToast();

  const checkoutData = location.state?.checkoutData;
  const cartItems = location.state?.cartItems || items;

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sameBillingAddress, setSameBillingAddress] = useState(true);

  // Redirect if no checkout data
  useEffect(() => {
    if (!checkoutData) {
      toast({
        title: "Invalid Access",
        description: "Please complete the checkout process first.",
        variant: "destructive"
      });
      navigate('/cart');
    }
  }, [checkoutData, navigate, toast]);

  const updatePaymentInfo = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo({
      ...paymentInfo,
      [field]: value
    });
  };

  const handleSameBillingAddress = (checked: boolean) => {
    setSameBillingAddress(checked);
    if (checked && checkoutData) {
      setPaymentInfo({
        ...paymentInfo,
        billingAddress: checkoutData.contactInfo.address,
        billingCity: checkoutData.contactInfo.city,
        billingState: checkoutData.contactInfo.state,
        billingZip: checkoutData.contactInfo.zipCode,
        billingCountry: checkoutData.contactInfo.country
      });
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return match;
    }
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const validatePayment = () => {
    if (!paymentInfo.cardNumber || paymentInfo.cardNumber.replace(/\s/g, '').length < 13) {
      setErrorMessage('Please enter a valid card number');
      return false;
    }
    if (!paymentInfo.expiryDate || paymentInfo.expiryDate.length !== 5) {
      setErrorMessage('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!paymentInfo.cvv || paymentInfo.cvv.length < 3) {
      setErrorMessage('Please enter a valid CVV');
      return false;
    }
    if (!paymentInfo.cardholderName) {
      setErrorMessage('Please enter the cardholder name');
      return false;
    }
    if (!paymentInfo.billingAddress || !paymentInfo.billingCity || !paymentInfo.billingZip) {
      setErrorMessage('Please complete the billing address');
      return false;
    }
    return true;
  };

  const processPayment = async () => {
    if (!validatePayment()) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Call booking API
      if (!checkoutData || !checkoutData.contactInfo || !checkoutData.travelers) {
        setErrorMessage('Missing checkout data.');
        setIsProcessing(false);
        return;
      }

      // Get user info (if logged in)
      const userId = (typeof window !== 'undefined' && localStorage.getItem('userId')) || undefined;
      const userEmail = checkoutData.contactInfo.email;
      const userName = checkoutData.travelers[0]?.firstName + ' ' + checkoutData.travelers[0]?.lastName;
      const paymentMethod = 'credit_card';
      const paymentIntentId = undefined; // Not used in this flow
      const totalAmount = checkoutData.total;
      const items = cartItems;

      const bookingResponse = await bookingService.createBooking(
        userId || '',
        userEmail,
        userName,
        items,
        paymentMethod,
        paymentIntentId,
        totalAmount
      );

      // Clear cart
      clearCart();

      // Navigate to success page with booking details
      navigate('/payment-success', {
        state: {
          bookingReference: bookingResponse.bookingReference,
          checkoutData,
          cartItems,
          paymentAmount: totalAmount,
          bookingDate: new Date().toISOString()
        }
      });

      toast({
        title: 'Payment Successful!',
        description: `Your booking has been confirmed. Reference: ${bookingResponse.bookingReference}`,
        variant: 'default'
      });
    } catch (error) {
      setErrorMessage('Booking failed. Please try again.');
      toast({
        title: 'Booking Failed',
        description: 'There was an error saving your booking. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'hotel': return <Hotel className="h-4 w-4" />;
      case 'car': return <Car className="h-4 w-4" />;
      case 'package': return <Package className="h-4 w-4" />;
      default: return null;
    }
  };

  if (!checkoutData) {
    return null; // Will redirect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/checkout')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Checkout
            </Button>
            <h1 className="text-3xl font-bold">Payment</h1>
          </div>

          {errorMessage && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Credit Card Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Credit Card Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      maxLength={19}
                      value={paymentInfo.cardNumber}
                      onChange={(e) => updatePaymentInfo('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        maxLength={5}
                        value={paymentInfo.expiryDate}
                        onChange={(e) => updatePaymentInfo('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        type="text"
                        maxLength={4}
                        value={paymentInfo.cvv}
                        onChange={(e) => updatePaymentInfo('cvv', e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      type="text"
                      value={paymentInfo.cardholderName}
                      onChange={(e) => updatePaymentInfo('cardholderName', e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sameBilling"
                      checked={sameBillingAddress}
                      onChange={(e) => handleSameBillingAddress(e.target.checked)}
                    />
                    <label htmlFor="sameBilling" className="text-sm">
                      Same as contact address
                    </label>
                  </div>
                  
                  <div>
                    <Label htmlFor="billingAddress">Address *</Label>
                    <Input
                      id="billingAddress"
                      value={paymentInfo.billingAddress}
                      onChange={(e) => updatePaymentInfo('billingAddress', e.target.value)}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="billingCity">City *</Label>
                      <Input
                        id="billingCity"
                        value={paymentInfo.billingCity}
                        onChange={(e) => updatePaymentInfo('billingCity', e.target.value)}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingState">State *</Label>
                      <Input
                        id="billingState"
                        value={paymentInfo.billingState}
                        onChange={(e) => updatePaymentInfo('billingState', e.target.value)}
                        placeholder="NY"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingZip">ZIP Code *</Label>
                      <Input
                        id="billingZip"
                        value={paymentInfo.billingZip}
                        onChange={(e) => updatePaymentInfo('billingZip', e.target.value)}
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Information */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Shield className="h-4 w-4 text-green-600" />
                    Your payment is secured with 256-bit SSL encryption
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="h-4 w-4 text-green-600" />
                    We never store your credit card information
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getItemIcon(item.type)}
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-semibold">${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service Fee</span>
                      <span>$25</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes & Fees</span>
                      <span>${Math.round(cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) * 0.08)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${checkoutData.total}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={processPayment}
                    disabled={isProcessing}
                    className="w-full bg-aerotrav-blue hover:bg-aerotrav-blue-700"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Complete Payment
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-2 text-xs text-gray-600 justify-center">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Secure payment processing
                  </div>
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

export default PaymentPage;