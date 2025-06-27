import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsPage: React.FC = () => {
  return (
    <div className="page-layout bg-gray-50">
      <Header />
      
      <div className="page-content">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-aerotrav-blue to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-xl text-aerotrav-blue-100 max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our services.
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-8">
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">1. Acceptance of Terms</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-4">
                  <p>
                    By accessing and using AeroTrav services, you accept and agree to be bound by the terms and 
                    provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                  <p>
                    These terms and conditions are subject to change at any time without notice. Your continued use of 
                    AeroTrav after any changes constitutes acceptance of those changes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">2. Booking and Payment</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-4">
                  <p>
                    All bookings are subject to availability and confirmation. Prices displayed on our platform are 
                    in the currency specified and include all applicable taxes unless otherwise stated.
                  </p>
                  <p>
                    Payment must be made in full at the time of booking. We accept major credit cards, debit cards, 
                    and other payment methods as specified on our platform.
                  </p>
                  <p>
                    All prices are subject to change without notice until payment has been received and confirmed.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">3. Cancellation and Refund Policy</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-4">
                  <p>
                    Cancellation policies vary depending on the service provider and the type of booking. Please refer 
                    to the specific cancellation terms provided at the time of booking.
                  </p>
                  <p>
                    Refunds, if applicable, will be processed according to the cancellation policy of the respective 
                    service provider and may take 5-10 business days to reflect in your account.
                  </p>
                  <p>
                    AeroTrav reserves the right to charge administrative fees for cancellations and modifications.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">4. Travel Documents and Requirements</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-4">
                  <p>
                    It is your responsibility to ensure that you have all necessary travel documents including but not 
                    limited to valid passports, visas, and health certificates.
                  </p>
                  <p>
                    AeroTrav is not responsible for any costs, damages, or inconvenience caused by invalid or insufficient 
                    travel documentation.
                  </p>
                  <p>
                    We strongly recommend checking visa requirements and travel advisories for your destination before traveling.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">5. Liability and Insurance</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-4">
                  <p>
                    AeroTrav acts as an intermediary between you and service providers (airlines, hotels, car rental companies, etc.). 
                    We are not liable for the acts, errors, omissions, representations, warranties, breaches, or negligence of any such suppliers.
                  </p>
                  <p>
                    We strongly recommend purchasing comprehensive travel insurance to protect against unforeseen circumstances, 
                    cancellations, medical emergencies, and other travel-related risks.
                  </p>
                  <p>
                    Our liability is limited to the total amount paid for the services booked through our platform.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">6. Privacy and Data Protection</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-4">
                  <p>
                    We are committed to protecting your privacy and personal information. Please refer to our Privacy Policy 
                    for detailed information about how we collect, use, and protect your data.
                  </p>
                  <p>
                    By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">7. Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-4">
                  <p>
                    All content on the AeroTrav platform, including but not limited to text, graphics, logos, images, and software, 
                    is owned by AeroTrav or its licensors and is protected by copyright and other intellectual property laws.
                  </p>
                  <p>
                    You may not reproduce, modify, distribute, or republish any content from our platform without our express written consent.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">8. Governing Law</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-4">
                  <p>
                    These terms and conditions are governed by and construed in accordance with the laws of Malaysia, 
                    and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">9. Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-4">
                  <p>
                    If you have any questions about these Terms & Conditions, please contact us at:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Email:</strong> 1201102665@student.mmu.edu.my</p>
                    <p><strong>Phone:</strong> +60 1-8321-1296</p>
                    <p><strong>Address:</strong> Persiaran Multimedia, 63100 Cyberjaya, Selangor</p>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center text-gray-600 mt-12">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default TermsPage; 