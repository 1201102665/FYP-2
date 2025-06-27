import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  User, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CreditCard,
  Shield,
  Plane,
  Hotel,
  Car,
  Package,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

interface TravelerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total } = useCartContext();
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [travelers, setTravelers] = useState<TravelerInfo[]>([
    {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      passportNumber: '',
      passportExpiry: '',
      nationality: ''
    }
  ]);

  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  });

  const [specialRequests, setSpecialRequests] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  const totalTravelers = items.reduce((total, item) => total + item.quantity, 0);

  const addTraveler = () => {
    if (travelers.length < totalTravelers) {
      setTravelers([...travelers, {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        passportNumber: '',
        passportExpiry: '',
        nationality: ''
      }]);
    }
  };

  const removeTraveler = (index: number) => {
    if (travelers.length > 1) {
      setTravelers(travelers.filter((_, i) => i !== index));
    }
  };

  const updateTraveler = (index: number, field: keyof TravelerInfo, value: string) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index] = {
      ...updatedTravelers[index],
      [field]: value
    };
    setTravelers(updatedTravelers);
  };

  const updateContactInfo = (field: keyof ContactInfo, value: string) => {
    setContactInfo({
      ...contactInfo,
      [field]: value
    });
  };

  const calculateTotal = () => {
    const subtotal = total;
    const serviceFee = 25;
    const taxes = Math.round(subtotal * 0.08);
    return subtotal + serviceFee + taxes;
  };

  const handleProceedToPayment = () => {
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    // Validate required fields
    const isContactValid = contactInfo.email && contactInfo.phone && contactInfo.address;
    const areTravelersValid = travelers.every(traveler => 
      traveler.firstName && traveler.lastName && traveler.email && traveler.phone
    );

    if (!isContactValid || !areTravelersValid) {
      alert('Please fill in all required fields');
      return;
    }

    // Store checkout data for payment page
    const checkoutData = {
      contactInfo,
      travelers,
      emergencyContact,
      specialRequests,
      total: calculateTotal()
    };
    
    navigate('/payment', { state: { checkoutData, cartItems: items } });
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

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">No Items to Checkout</h2>
            <p className="text-gray-600 mb-6">Your cart is empty. Add some items to proceed with checkout.</p>
            <Button onClick={() => navigate('/')} className="bg-aerotrav-blue hover:bg-aerotrav-blue-700">
              Start Shopping
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
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-email">Email Address *</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => updateContactInfo('email', e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Phone Number *</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => updateContactInfo('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={contactInfo.address}
                      onChange={(e) => updateContactInfo('address', e.target.value)}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={contactInfo.city}
                        onChange={(e) => updateContactInfo('city', e.target.value)}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={contactInfo.state}
                        onChange={(e) => updateContactInfo('state', e.target.value)}
                        placeholder="NY"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={contactInfo.zipCode}
                        onChange={(e) => updateContactInfo('zipCode', e.target.value)}
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Traveler Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Traveler Information ({travelers.length} of {totalTravelers})
                    </div>
                    {travelers.length < totalTravelers && (
                      <Button onClick={addTraveler} size="sm" variant="outline">
                        Add Traveler
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {travelers.map((traveler, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Traveler {index + 1}</h4>
                        {travelers.length > 1 && (
                          <Button 
                            onClick={() => removeTraveler(index)} 
                            size="sm" 
                            variant="destructive"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>First Name *</Label>
                          <Input
                            value={traveler.firstName}
                            onChange={(e) => updateTraveler(index, 'firstName', e.target.value)}
                            placeholder="John"
                            required
                          />
                        </div>
                        <div>
                          <Label>Last Name *</Label>
                          <Input
                            value={traveler.lastName}
                            onChange={(e) => updateTraveler(index, 'lastName', e.target.value)}
                            placeholder="Doe"
                            required
                          />
                        </div>
                        <div>
                          <Label>Email *</Label>
                          <Input
                            type="email"
                            value={traveler.email}
                            onChange={(e) => updateTraveler(index, 'email', e.target.value)}
                            placeholder="john.doe@example.com"
                            required
                          />
                        </div>
                        <div>
                          <Label>Phone *</Label>
                          <Input
                            type="tel"
                            value={traveler.phone}
                            onChange={(e) => updateTraveler(index, 'phone', e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            required
                          />
                        </div>
                        <div>
                          <Label>Date of Birth</Label>
                          <Input
                            type="date"
                            value={traveler.dateOfBirth}
                            onChange={(e) => updateTraveler(index, 'dateOfBirth', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Nationality</Label>
                          <Input
                            value={traveler.nationality}
                            onChange={(e) => updateTraveler(index, 'nationality', e.target.value)}
                            placeholder="American"
                          />
                        </div>
                        <div>
                          <Label>Passport Number</Label>
                          <Input
                            value={traveler.passportNumber}
                            onChange={(e) => updateTraveler(index, 'passportNumber', e.target.value)}
                            placeholder="123456789"
                          />
                        </div>
                        <div>
                          <Label>Passport Expiry</Label>
                          <Input
                            type="date"
                            value={traveler.passportExpiry}
                            onChange={(e) => updateTraveler(index, 'passportExpiry', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={emergencyContact.name}
                        onChange={(e) => setEmergencyContact({...emergencyContact, name: e.target.value})}
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <Label>Relationship</Label>
                      <Input
                        value={emergencyContact.relationship}
                        onChange={(e) => setEmergencyContact({...emergencyContact, relationship: e.target.value})}
                        placeholder="Spouse, Parent, Sibling"
                      />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        type="tel"
                        value={emergencyContact.phone}
                        onChange={(e) => setEmergencyContact({...emergencyContact, phone: e.target.value})}
                        placeholder="+1 (555) 987-6543"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={emergencyContact.email}
                        onChange={(e) => setEmergencyContact({...emergencyContact, email: e.target.value})}
                        placeholder="jane.doe@example.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      />
                      <label htmlFor="terms" className="text-sm">
                        I agree to the <a href="#" className="text-aerotrav-blue underline">Terms and Conditions</a> and <a href="#" className="text-aerotrav-blue underline">Privacy Policy</a> *
                      </label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={subscribeNewsletter}
                        onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
                      />
                      <label htmlFor="newsletter" className="text-sm">
                        Subscribe to our newsletter for travel deals and updates
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
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
                      <span>${total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service Fee</span>
                      <span>$25</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes & Fees</span>
                      <span>${Math.round(total * 0.08)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${calculateTotal()}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleProceedToPayment}
                    className="w-full bg-aerotrav-blue hover:bg-aerotrav-blue-700"
                    size="lg"
                    disabled={!agreeToTerms}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Payment
                  </Button>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Secure 256-bit SSL encryption
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

export default CheckoutPage; 