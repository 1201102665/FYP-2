import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface PackageBookingFormProps {
  packageId: string;
  packageName: string;
  basePrice: number;
  destination: string;
  startDate: string;
  endDate: string;
}

const PackageBookingForm: React.FC<PackageBookingFormProps> = ({
  packageId,
  packageName,
  basePrice,
  destination,
  startDate,
  endDate
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    adults: 2,
    children: 0,
    additionalServices: {
      airportTransfer: false,
      travelInsurance: false,
      tourGuide: false,
      premiumMeals: false
    },
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    paymentMethod: ''
  });

  const additionalServicesPrice = {
    airportTransfer: 30,
    travelInsurance: 45,
    tourGuide: 100,
    premiumMeals: 80
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [group, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [group]: {
          ...(prev[group as keyof typeof prev] as Record<string, any>),
          [field]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean, service: keyof typeof formData.additionalServices) => {
    setFormData({
      ...formData,
      additionalServices: {
        ...formData.additionalServices,
        [service]: checked
      }
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculateTotalPrice = () => {
    let total = basePrice * (formData.adults + formData.children * 0.7);

    Object.entries(formData.additionalServices).forEach(([service, isSelected]) => {
      if (isSelected) {
        total += additionalServicesPrice[service as keyof typeof additionalServicesPrice];
      }
    });

    return total.toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.contactInfo.firstName || !formData.contactInfo.lastName ||
    !formData.contactInfo.email || !formData.contactInfo.phone ||
    !formData.paymentMethod) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you would submit the booking data to your backend here

    // Show success toast
    toast({
      title: "Booking Confirmed!",
      description: `Your ${packageName} package has been booked successfully.`
    });

    // Navigate to success page (you would create this page too)
    navigate('/package-booking-success');
  };

  return (
    <form onSubmit={handleSubmit} data-id="l7qdodxm5" data-path="src/components/PackageBookingForm.tsx">
      <Card data-id="80xfz3arn" data-path="src/components/PackageBookingForm.tsx">
        <CardHeader data-id="q8d3mbpmt" data-path="src/components/PackageBookingForm.tsx">
          <CardTitle data-id="2cfd4grig" data-path="src/components/PackageBookingForm.tsx">Book Your Package</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6" data-id="ah14w5cho" data-path="src/components/PackageBookingForm.tsx">
          <div className="space-y-4" data-id="wez8cpher" data-path="src/components/PackageBookingForm.tsx">
            <h3 className="text-lg font-medium" data-id="a9pgzp989" data-path="src/components/PackageBookingForm.tsx">Trip Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-id="rcnfz8810" data-path="src/components/PackageBookingForm.tsx">
              <div className="space-y-2" data-id="yuugqpch7" data-path="src/components/PackageBookingForm.tsx">
                <Label htmlFor="destination" data-id="b7fq0dcj6" data-path="src/components/PackageBookingForm.tsx">Destination</Label>
                <Input id="destination" value={destination} disabled data-id="ljyxomd9r" data-path="src/components/PackageBookingForm.tsx" />
              </div>
              
              <div className="space-y-2" data-id="bgm2u1e3e" data-path="src/components/PackageBookingForm.tsx">
                <Label htmlFor="packageName" data-id="n1qbbp7eb" data-path="src/components/PackageBookingForm.tsx">Package</Label>
                <Input id="packageName" value={packageName} disabled data-id="9ms31gnb2" data-path="src/components/PackageBookingForm.tsx" />
              </div>
              
              <div className="space-y-2" data-id="5yan7awzz" data-path="src/components/PackageBookingForm.tsx">
                <Label htmlFor="startDate" data-id="34ghodest" data-path="src/components/PackageBookingForm.tsx">Departure Date</Label>
                <Input id="startDate" value={startDate} disabled data-id="95wmxjh86" data-path="src/components/PackageBookingForm.tsx" />
              </div>
              
              <div className="space-y-2" data-id="pd3eo9es6" data-path="src/components/PackageBookingForm.tsx">
                <Label htmlFor="endDate" data-id="zr4ruhtds" data-path="src/components/PackageBookingForm.tsx">Return Date</Label>
                <Input id="endDate" value={endDate} disabled data-id="k5z1j2oxg" data-path="src/components/PackageBookingForm.tsx" />
              </div>
            </div>
          </div>
          
          <Separator data-id="sb6hb3d7t" data-path="src/components/PackageBookingForm.tsx" />
          
          <div className="space-y-4" data-id="zc53h1ngk" data-path="src/components/PackageBookingForm.tsx">
            <h3 className="text-lg font-medium" data-id="qr5wldnp9" data-path="src/components/PackageBookingForm.tsx">Travelers</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-id="s4viy6bru" data-path="src/components/PackageBookingForm.tsx">
              <div className="space-y-2" data-id="btqr1jnpe" data-path="src/components/PackageBookingForm.tsx">
                <Label htmlFor="adults" data-id="cez7ppd00" data-path="src/components/PackageBookingForm.tsx">Adults</Label>
                <Select
                  onValueChange={(value) => handleSelectChange(value, 'adults')}
                  defaultValue="2" data-id="h1nfhdely" data-path="src/components/PackageBookingForm.tsx">

                  <SelectTrigger data-id="gpsxxxd6p" data-path="src/components/PackageBookingForm.tsx">
                    <SelectValue placeholder="Adults" data-id="qxpozuov4" data-path="src/components/PackageBookingForm.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="q4yeb4tzb" data-path="src/components/PackageBookingForm.tsx">
                    {[1, 2, 3, 4, 5, 6].map((number) =>
                    <SelectItem key={number} value={number.toString()} data-id="ew6yuu78o" data-path="src/components/PackageBookingForm.tsx">
                        {number} {number === 1 ? 'Adult' : 'Adults'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2" data-id="4a5m3fgqo" data-path="src/components/PackageBookingForm.tsx">
                <Label htmlFor="children" data-id="oqv96ckyn" data-path="src/components/PackageBookingForm.tsx">Children (2-12 years)</Label>
                <Select
                  onValueChange={(value) => handleSelectChange(value, 'children')}
                  defaultValue="0" data-id="kz9imbls2" data-path="src/components/PackageBookingForm.tsx">

                  <SelectTrigger data-id="kkbvoyn4v" data-path="src/components/PackageBookingForm.tsx">
                    <SelectValue placeholder="Children" data-id="be0gzvhi2" data-path="src/components/PackageBookingForm.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="58qr2ldp4" data-path="src/components/PackageBookingForm.tsx">
                    {[0, 1, 2, 3, 4].map((number) =>
                    <SelectItem key={number} value={number.toString()} data-id="2l7v53180" data-path="src/components/PackageBookingForm.tsx">
                        {number} {number === 1 ? 'Child' : 'Children'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator data-id="71ojf1f8q" data-path="src/components/PackageBookingForm.tsx" />
          
          <div className="space-y-4" data-id="qq8q9e5ce" data-path="src/components/PackageBookingForm.tsx">
            <h3 className="text-lg font-medium" data-id="6y97jxzfx" data-path="src/components/PackageBookingForm.tsx">Additional Services</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-id="qqhdbr9cn" data-path="src/components/PackageBookingForm.tsx">
              <div className="flex items-center space-x-2" data-id="9xkgtq6h5" data-path="src/components/PackageBookingForm.tsx">
                <Checkbox
                  id="airportTransfer"
                  checked={formData.additionalServices.airportTransfer}
                  onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'airportTransfer')} data-id="cjm7gtrkv" data-path="src/components/PackageBookingForm.tsx" />

                <div className="grid gap-1.5 leading-none" data-id="vlqegfnpk" data-path="src/components/PackageBookingForm.tsx">
                  <Label htmlFor="airportTransfer" data-id="6v7i248e5" data-path="src/components/PackageBookingForm.tsx">Airport Transfer</Label>
                  <p className="text-sm text-muted-foreground" data-id="0y6tjk9c7" data-path="src/components/PackageBookingForm.tsx">
                    ${additionalServicesPrice.airportTransfer} per booking
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2" data-id="ancmuppxm" data-path="src/components/PackageBookingForm.tsx">
                <Checkbox
                  id="travelInsurance"
                  checked={formData.additionalServices.travelInsurance}
                  onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'travelInsurance')} data-id="mp2sxhsmm" data-path="src/components/PackageBookingForm.tsx" />

                <div className="grid gap-1.5 leading-none" data-id="chselwm8i" data-path="src/components/PackageBookingForm.tsx">
                  <Label htmlFor="travelInsurance" data-id="y4qpamqhr" data-path="src/components/PackageBookingForm.tsx">Travel Insurance</Label>
                  <p className="text-sm text-muted-foreground" data-id="bzmxxouw4" data-path="src/components/PackageBookingForm.tsx">
                    ${additionalServicesPrice.travelInsurance} per person
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2" data-id="fi5pmtlvv" data-path="src/components/PackageBookingForm.tsx">
                <Checkbox
                  id="tourGuide"
                  checked={formData.additionalServices.tourGuide}
                  onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'tourGuide')} data-id="n5uhs6di3" data-path="src/components/PackageBookingForm.tsx" />

                <div className="grid gap-1.5 leading-none" data-id="8cnv9y8ip" data-path="src/components/PackageBookingForm.tsx">
                  <Label htmlFor="tourGuide" data-id="03iza3cq9" data-path="src/components/PackageBookingForm.tsx">Private Tour Guide</Label>
                  <p className="text-sm text-muted-foreground" data-id="uyt2xdwza" data-path="src/components/PackageBookingForm.tsx">
                    ${additionalServicesPrice.tourGuide} per day
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2" data-id="j9t6fggh7" data-path="src/components/PackageBookingForm.tsx">
                <Checkbox
                  id="premiumMeals"
                  checked={formData.additionalServices.premiumMeals}
                  onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'premiumMeals')} data-id="7qap2m9ug" data-path="src/components/PackageBookingForm.tsx" />

                <div className="grid gap-1.5 leading-none" data-id="vrv1hm9lq" data-path="src/components/PackageBookingForm.tsx">
                  <Label htmlFor="premiumMeals" data-id="mdibahhtp" data-path="src/components/PackageBookingForm.tsx">Premium Meals</Label>
                  <p className="text-sm text-muted-foreground" data-id="akvlzd45v" data-path="src/components/PackageBookingForm.tsx">
                    ${additionalServicesPrice.premiumMeals} per person
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator data-id="xfom3qnli" data-path="src/components/PackageBookingForm.tsx" />
          
          <div className="space-y-4" data-id="h2v4qmyhd" data-path="src/components/PackageBookingForm.tsx">
            <h3 className="text-lg font-medium" data-id="xv0or4br6" data-path="src/components/PackageBookingForm.tsx">Contact Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-id="tw8i1cv51" data-path="src/components/PackageBookingForm.tsx">
              <div className="space-y-2" data-id="4fz3hildd" data-path="src/components/PackageBookingForm.tsx">
                <Label htmlFor="firstName" data-id="ur1a766p1" data-path="src/components/PackageBookingForm.tsx">First Name*</Label>
                <Input
                  id="firstName"
                  name="contactInfo.firstName"
                  value={formData.contactInfo.firstName}
                  onChange={handleInputChange}
                  required data-id="lcpiwpk4o" data-path="src/components/PackageBookingForm.tsx" />

              </div>
              
              <div className="space-y-2" data-id="z9vgyd7a0" data-path="src/components/PackageBookingForm.tsx">
                <Label htmlFor="lastName" data-id="uxylnafd7" data-path="src/components/PackageBookingForm.tsx">Last Name*</Label>
                <Input
                  id="lastName"
                  name="contactInfo.lastName"
                  value={formData.contactInfo.lastName}
                  onChange={handleInputChange}
                  required data-id="efe6291m6" data-path="src/components/PackageBookingForm.tsx" />

              </div>
              
              <div className="space-y-2" data-id="18zjwd4vp" data-path="src/components/PackageBookingForm.tsx">
                <Label htmlFor="email" data-id="q2ojgrjjp" data-path="src/components/PackageBookingForm.tsx">Email*</Label>
                <Input
                  id="email"
                  name="contactInfo.email"
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                  required data-id="dk7tls89h" data-path="src/components/PackageBookingForm.tsx" />

              </div>
              
              <div className="space-y-2" data-id="3fyr5ko73" data-path="src/components/PackageBookingForm.tsx">
                <Label htmlFor="phone" data-id="ovpd8f3ak" data-path="src/components/PackageBookingForm.tsx">Phone Number*</Label>
                <Input
                  id="phone"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleInputChange}
                  required data-id="a515jww5i" data-path="src/components/PackageBookingForm.tsx" />

              </div>
            </div>
          </div>
          
          <Separator data-id="ppvznpnvq" data-path="src/components/PackageBookingForm.tsx" />
          
          <div className="space-y-4" data-id="dtmvbvqqm" data-path="src/components/PackageBookingForm.tsx">
            <h3 className="text-lg font-medium" data-id="4l3lisl1y" data-path="src/components/PackageBookingForm.tsx">Payment Method</h3>
            
            <div className="space-y-2" data-id="712cehl3k" data-path="src/components/PackageBookingForm.tsx">
              <Select onValueChange={(value) => handleSelectChange(value, 'paymentMethod')} required data-id="nl3oas4cy" data-path="src/components/PackageBookingForm.tsx">
                <SelectTrigger data-id="zepu6cznr" data-path="src/components/PackageBookingForm.tsx">
                  <SelectValue placeholder="Select payment method" data-id="5wzaetnxr" data-path="src/components/PackageBookingForm.tsx" />
                </SelectTrigger>
                <SelectContent data-id="crfoofumw" data-path="src/components/PackageBookingForm.tsx">
                  <SelectItem value="creditCard" data-id="bhpqd4q34" data-path="src/components/PackageBookingForm.tsx">Credit Card</SelectItem>
                  <SelectItem value="paypal" data-id="5iv68fhhl" data-path="src/components/PackageBookingForm.tsx">PayPal</SelectItem>
                  <SelectItem value="bankTransfer" data-id="v4p3a0f14" data-path="src/components/PackageBookingForm.tsx">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        
        <Separator data-id="4cl9o71hl" data-path="src/components/PackageBookingForm.tsx" />
        
        <CardFooter className="flex-col sm:flex-row justify-between items-center gap-4 pt-6" data-id="xnz80np2g" data-path="src/components/PackageBookingForm.tsx">
          <div data-id="0y93gluoi" data-path="src/components/PackageBookingForm.tsx">
            <p className="font-semibold text-lg" data-id="3dmtzgl3w" data-path="src/components/PackageBookingForm.tsx">Total: ${calculateTotalPrice()}</p>
            <p className="text-sm text-muted-foreground" data-id="dkbqwdnxd" data-path="src/components/PackageBookingForm.tsx">Includes all taxes and fees</p>
          </div>
          
          <div className="w-full sm:w-auto" data-id="pabq0a8me" data-path="src/components/PackageBookingForm.tsx">
            <Button type="submit" className="w-full" data-id="jqsy9zoqf" data-path="src/components/PackageBookingForm.tsx">Complete Booking</Button>
          </div>
        </CardFooter>
      </Card>
    </form>);

};

export default PackageBookingForm;