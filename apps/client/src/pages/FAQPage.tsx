import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs: FAQ[] = [
  {
    question: "What is Aerotrav?",
    answer: "Aerotrav is an online travel booking platform where you can explore and book flights, hotels, car rentals, and travel packages all in one place. We provide a seamless experience for planning your entire trip with the best deals and exclusive offers.",
    category: "general"
  },
  {
    question: "Do I need to create an account to browse services?",
    answer: "No, you don't need an account to browse our services. You can explore hotels, flights, car rentals, and travel packages without signing up. However, to make a booking, you'll need to sign up or log in to your account.",
    category: "general"
  },
  {
    question: "How do I create an account?",
    answer: "To create an account, simply click on the 'Sign Up' button in the top right corner of any page. You'll need to provide your name, email address, password, and phone number to complete the registration process.",
    category: "account"
  },
  {
    question: "What payment methods do you accept?",
    answer: "Currently, we only accept credit card payments for all bookings made through Aerotrav. We ensure secure processing of all payments with industry-standard encryption and security measures.",
    category: "payment"
  },
  {
    question: "How can I find the best deals on flights?",
    answer: "To find the best deals on flights, use our search tool on the Flights page. Enter your departure and arrival locations, dates, and number of passengers. We'll show you the best available options. For additional savings, consider flexible dates or booking packages that include flights, hotels, and car rentals together.",
    category: "flights"
  },
  {
    question: "Can I cancel or modify my hotel booking?",
    answer: "Yes, you can cancel or modify your hotel booking through your account. Navigate to 'My Bookings' after logging in, select the reservation you wish to change, and follow the prompts for cancellation or modification. Please note that cancellation policies vary by hotel and rate type, so be sure to check the specific terms before booking.",
    category: "hotels"
  },
  {
    question: "What documents do I need for car rental?",
    answer: "For car rentals, you'll need a valid driver's license, a credit card in the driver's name, and possibly additional identification. International travelers may need an International Driving Permit along with their national license. Specific requirements can vary by location and rental company.",
    category: "car-rentals"
  },
  {
    question: "How does the AI trip creation tool work?",
    answer: "Our AI-powered trip creation tool helps you build personalized itineraries based on your preferences. On the Travel Packages page, provide details about your interests, budget, preferred destinations, and travel dates. The AI will suggest a tailored itinerary that you can further customize before booking.",
    category: "packages"
  },
  {
    question: "Are there any booking fees?",
    answer: "We strive to be transparent about all costs. While some services may include service fees, these will always be clearly displayed before you complete your booking. There are no hidden fees when booking through Aerotrav.",
    category: "payment"
  },
  {
    question: "How can I contact customer service?",
    answer: "Our customer service team is available 24/7. You can reach us through the 'Contact Us' form on our website, by email at support@aerotrav.com, or by phone at +1-800-AEROTRAV. We aim to respond to all inquiries within 24 hours.",
    category: "general"
  }];


  const categories = [
  { id: "general", name: "General Questions" },
  { id: "account", name: "Account & Registration" },
  { id: "payment", name: "Payment & Pricing" },
  { id: "flights", name: "Flights" },
  { id: "hotels", name: "Hotels" },
  { id: "car-rentals", name: "Car Rentals" },
  { id: "packages", name: "Travel Packages" }];


  const filteredFAQs = faqs.filter((faq) => faq.category === activeCategory);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-id="18oogxhz1" data-path="src/pages/FAQPage.tsx">
      <Header data-id="86x0tt6o5" data-path="src/pages/FAQPage.tsx" />
      
      <main className="flex-grow" data-id="3gsc1cya6" data-path="src/pages/FAQPage.tsx">
        <div className="bg-aerotrav-blue py-10" data-id="fhc44ulyz" data-path="src/pages/FAQPage.tsx">
          <div className="container mx-auto px-4" data-id="lw1vpbu2i" data-path="src/pages/FAQPage.tsx">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center" data-id="9xhf316wn" data-path="src/pages/FAQPage.tsx">Frequently Asked Questions</h1>
            <p className="text-white text-center mt-4 max-w-3xl mx-auto" data-id="3ir313xg0" data-path="src/pages/FAQPage.tsx">
              Find answers to the most common questions about our services, booking process, and more.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8" data-id="mizc8g3ob" data-path="src/pages/FAQPage.tsx">
          {/* Category Selection */}
          <div className="mb-8 overflow-x-auto" data-id="7v3oqaml3" data-path="src/pages/FAQPage.tsx">
            <div className="flex space-x-2 min-w-max" data-id="io3p1o7ow" data-path="src/pages/FAQPage.tsx">
              {categories.map((category) =>
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeCategory === category.id ?
                "bg-aerotrav-blue text-white" :
                "bg-gray-200 text-gray-800 hover:bg-gray-300"}`
                } data-id="esflud7it" data-path="src/pages/FAQPage.tsx">

                  {category.name}
                </button>
              )}
            </div>
          </div>
          
          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden" data-id="0ef72g9ui" data-path="src/pages/FAQPage.tsx">
            {filteredFAQs.length > 0 ?
            filteredFAQs.map((faq, index) =>
            <div key={index} className="border-b border-gray-200 last:border-b-0" data-id="vbmkfbw9o" data-path="src/pages/FAQPage.tsx">
                  <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none" data-id="403o6rp1z" data-path="src/pages/FAQPage.tsx">

                    <span className="font-medium text-gray-900" data-id="44f2it0lz" data-path="src/pages/FAQPage.tsx">{faq.question}</span>
                    <span data-id="uil90caey" data-path="src/pages/FAQPage.tsx">
                      <svg
                    className={`w-5 h-5 transition-transform ${expandedFAQ === index ? "transform rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor" data-id="0sstum5l6" data-path="src/pages/FAQPage.tsx">

                        <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd" data-id="qza2fafdl" data-path="src/pages/FAQPage.tsx" />

                      </svg>
                    </span>
                  </button>
                  <div
                className={`px-6 py-4 text-gray-700 bg-gray-50 transition-all duration-300 ${
                expandedFAQ === index ? "block" : "hidden"}`
                } data-id="r2j1zqc8q" data-path="src/pages/FAQPage.tsx">

                    <p data-id="w0gvx2kh5" data-path="src/pages/FAQPage.tsx">{faq.answer}</p>
                  </div>
                </div>
            ) :

            <div className="px-6 py-10 text-center text-gray-500" data-id="59an3qtkx" data-path="src/pages/FAQPage.tsx">
                <p data-id="k505f0e9n" data-path="src/pages/FAQPage.tsx">No FAQs found in this category.</p>
              </div>
            }
          </div>
          
          {/* Contact Section */}
          <div className="mt-12 bg-aerotrav-blue rounded-lg p-8 text-center max-w-3xl mx-auto" data-id="oz2otov7i" data-path="src/pages/FAQPage.tsx">
            <h2 className="text-2xl font-bold text-white mb-2" data-id="lz0z6zlv0" data-path="src/pages/FAQPage.tsx">Still Have Questions?</h2>
            <p className="text-white mb-4" data-id="4gj4hq8vt" data-path="src/pages/FAQPage.tsx">
              Our customer service team is here to help you with any queries you might have.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4" data-id="e0wptbxnt" data-path="src/pages/FAQPage.tsx">
              <div className="bg-white/10 rounded-lg p-4 flex-1" data-id="2nee4v6cs" data-path="src/pages/FAQPage.tsx">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2" data-id="9z8bji41n" data-path="src/pages/FAQPage.tsx">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor" data-id="wdkb9zmgt" data-path="src/pages/FAQPage.tsx">

                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" data-id="yzn3itggx" data-path="src/pages/FAQPage.tsx" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" data-id="6trthm2d6" data-path="src/pages/FAQPage.tsx" />
                  </svg>
                </div>
                <h3 className="text-white font-bold" data-id="kawnnn16z" data-path="src/pages/FAQPage.tsx">Email Us</h3>
                <p className="text-white text-sm" data-id="hubd9j241" data-path="src/pages/FAQPage.tsx">support@aerotrav.com</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 flex-1" data-id="xx7fhvxex" data-path="src/pages/FAQPage.tsx">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2" data-id="wjmqw0md1" data-path="src/pages/FAQPage.tsx">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor" data-id="h0fri5lp3" data-path="src/pages/FAQPage.tsx">

                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" data-id="qrg9bx2bp" data-path="src/pages/FAQPage.tsx" />
                  </svg>
                </div>
                <h3 className="text-white font-bold" data-id="vy4kik944" data-path="src/pages/FAQPage.tsx">Call Us</h3>
                <p className="text-white text-sm" data-id="trr3xc5pc" data-path="src/pages/FAQPage.tsx">+1-800-AEROTRAV</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer data-id="un0lw601c" data-path="src/pages/FAQPage.tsx" />
    </div>);

};

export default FAQPage;