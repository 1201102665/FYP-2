import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-aerotrav-blue text-white py-8" data-id="32xgesj7t" data-path="src/components/Footer.tsx">
      <div className="container mx-auto px-4" data-id="mu63mtrm8" data-path="src/components/Footer.tsx">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8" data-id="njthw7rxf" data-path="src/components/Footer.tsx">
          <div data-id="2rvqm8bsf" data-path="src/components/Footer.tsx">
            <h3 className="font-bold mb-4" data-id="pwszx1s8k" data-path="src/components/Footer.tsx">About Us</h3>
            <ul className="space-y-2" data-id="jsl6fvsu1" data-path="src/components/Footer.tsx">
              <li data-id="t1hf7iqzg" data-path="src/components/Footer.tsx"><Link to="/about" className="text-sm hover:underline" data-id="uq7w40d4v" data-path="src/components/Footer.tsx">Our Story</Link></li>
              <li data-id="sdkv4ctdc" data-path="src/components/Footer.tsx"><Link to="/careers" className="text-sm hover:underline" data-id="49r04x7hw" data-path="src/components/Footer.tsx">Careers</Link></li>
            </ul>
          </div>
          <div data-id="jp1vww0rb" data-path="src/components/Footer.tsx">
            <h3 className="font-bold mb-4" data-id="le2luet01" data-path="src/components/Footer.tsx">Travel</h3>
            <ul className="space-y-2" data-id="nztn82o5z" data-path="src/components/Footer.tsx">
              <li data-id="ib7i4dlh8" data-path="src/components/Footer.tsx"><Link to="/flights" className="text-sm hover:underline" data-id="5wutxuocu" data-path="src/components/Footer.tsx">Flights</Link></li>
              <li data-id="t9pnj9ygs" data-path="src/components/Footer.tsx"><Link to="/hotels" className="text-sm hover:underline" data-id="qbdugww0q" data-path="src/components/Footer.tsx">Hotels</Link></li>
              <li data-id="1vp2flxq4" data-path="src/components/Footer.tsx"><Link to="/car-rentals" className="text-sm hover:underline" data-id="h8ml5cvu3" data-path="src/components/Footer.tsx">Car Rentals</Link></li>
              <li data-id="3bcfxcb49" data-path="src/components/Footer.tsx"><Link to="/packages" className="text-sm hover:underline" data-id="y55lteep2" data-path="src/components/Footer.tsx">Travel Packages</Link></li>
            </ul>
          </div>
          <div data-id="vhohdm6pf" data-path="src/components/Footer.tsx">
            <h3 className="font-bold mb-4" data-id="vi3siifv9" data-path="src/components/Footer.tsx">Support</h3>
            <ul className="space-y-2" data-id="xaq3z4kfk" data-path="src/components/Footer.tsx">
              <li data-id="qmzcwrp9o" data-path="src/components/Footer.tsx"><Link to="/faq" className="text-sm hover:underline" data-id="haggwbb8n" data-path="src/components/Footer.tsx">FAQ</Link></li>
              <li data-id="2tiicng8c" data-path="src/components/Footer.tsx"><Link to="/contact" className="text-sm hover:underline" data-id="0t85szn3o" data-path="src/components/Footer.tsx">Contact Us</Link></li>
              <li data-id="7lkdid8s2" data-path="src/components/Footer.tsx"><Link to="/terms" className="text-sm hover:underline" data-id="iuxsd62yd" data-path="src/components/Footer.tsx">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-700 pt-6 text-center" data-id="sq4gaze50" data-path="src/components/Footer.tsx">
          <p className="text-sm" data-id="0m5bmv4c6" data-path="src/components/Footer.tsx">© {new Date().getFullYear()} Aerotrav. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;