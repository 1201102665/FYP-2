import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("Malaysia (+60)");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate the form
      if (password.length < 6) {
        toast({
          title: "Password Too Short",
          description: "Password must be at least 6 characters long.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Format phone with country code
      const formattedPhone = `${countryCode.split('(')[1].split(')')[0].trim()} ${phone}`;

      console.log('SignupPage: Attempting signup with:', { name, email, formattedPhone });

      const success = await signup(name, email, password, formattedPhone);
      
      console.log('SignupPage: Signup result:', success);

      if (success) {
        // Clear the form
        clearForm();
        
        console.log('SignupPage: Signup successful, showing toast and redirecting...');
        
        toast({
          title: "Registration Successful",
          description: "Welcome to Aerotrav!",
          variant: "default"
        });
        
        // Immediate redirect to homepage
        console.log('SignupPage: Navigating to homepage...');
        console.log('SignupPage: Current location:', window.location.href);
        
        // Try the redirect
        navigate('/', { replace: true });
        
        // Backup redirect after a short delay
        setTimeout(() => {
          console.log('SignupPage: Backup redirect executing...');
          if (window.location.pathname === '/signup') {
            window.location.href = '/';
          }
        }, 100);
        
      } else {
        console.log('SignupPage: Signup failed, clearing password');
        // If signup failed, clear the password field for security
        setPassword("");
      }
    } catch (error) {
      console.error('SignupPage: Signup error:', error);
      setPassword(""); // Clear password on error
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" data-id="iiwod4d07" data-path="src/pages/SignupPage.tsx">
      <Header data-id="d5mu75h61" data-path="src/pages/SignupPage.tsx" />
      
      <main className="flex-grow flex justify-center items-center py-12 px-4" data-id="c8gl52z52" data-path="src/pages/SignupPage.tsx">
        <div className="max-w-lg w-full" data-id="5duh6p4cn" data-path="src/pages/SignupPage.tsx">
          <div className="bg-aerotrav-blue rounded-lg p-8 relative overflow-hidden" data-id="hz8gw60vy" data-path="src/pages/SignupPage.tsx">
            <div className="relative z-10" data-id="n68am6m5s" data-path="src/pages/SignupPage.tsx">
              <h1 className="text-4xl font-bold text-white text-center mb-8" data-id="42wm3acyb" data-path="src/pages/SignupPage.tsx">Sign Up & Join Us</h1>
              
              <form onSubmit={handleSubmit} className="w-full" data-id="up2u03gki" data-path="src/pages/SignupPage.tsx">
                <div className="space-y-4" data-id="5mvic2utm" data-path="src/pages/SignupPage.tsx">
                  <div data-id="3yoijp2tf" data-path="src/pages/SignupPage.tsx">
                    <label htmlFor="name" className="block text-sm font-medium text-aerotrav-yellow mb-1" data-id="0fd9b2e1q" data-path="src/pages/SignupPage.tsx">
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-white text-gray-900 w-full" data-id="ns66tztkx" data-path="src/pages/SignupPage.tsx" />

                  </div>
                  
                  <div data-id="933tbn03q" data-path="src/pages/SignupPage.tsx">
                    <label htmlFor="email" className="block text-sm font-medium text-aerotrav-yellow mb-1" data-id="fp188bnhq" data-path="src/pages/SignupPage.tsx">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white text-gray-900 w-full" data-id="yoqywh6mv" data-path="src/pages/SignupPage.tsx" />

                  </div>
                  
                  <div data-id="ldz2ozntp" data-path="src/pages/SignupPage.tsx">
                    <label htmlFor="password" className="block text-sm font-medium text-aerotrav-yellow mb-1" data-id="u0o2h0qab" data-path="src/pages/SignupPage.tsx">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white text-gray-900 w-full" data-id="b83m9x5ci" data-path="src/pages/SignupPage.tsx" />

                  </div>
                  
                  <div className="grid grid-cols-3 gap-4" data-id="rfdzkavq7" data-path="src/pages/SignupPage.tsx">
                    <div className="col-span-1" data-id="wkafgb1af" data-path="src/pages/SignupPage.tsx">
                      <label htmlFor="countryCode" className="block text-sm font-medium text-aerotrav-yellow mb-1" data-id="e9q5s3bqb" data-path="src/pages/SignupPage.tsx">
                        Country Code
                      </label>
                      <Input
                        id="countryCode"
                        type="text"
                        value={countryCode}
                        readOnly
                        className="bg-white text-gray-900 w-full" data-id="u9n9mtpgy" data-path="src/pages/SignupPage.tsx" />

                    </div>
                    
                    <div className="col-span-2" data-id="e80yt8yth" data-path="src/pages/SignupPage.tsx">
                      <label htmlFor="phone" className="block text-sm font-medium text-aerotrav-yellow mb-1" data-id="tsbsq7uaz" data-path="src/pages/SignupPage.tsx">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter Here..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="bg-white text-gray-900 w-full" data-id="6o03xtak1" data-path="src/pages/SignupPage.tsx" />

                    </div>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="mt-8 w-full bg-aerotrav-yellow hover:bg-aerotrav-yellow-500 text-gray-900 font-medium"
                  disabled={isLoading} data-id="0yt9a5w24" data-path="src/pages/SignupPage.tsx">

                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>
              
              <p className="mt-4 text-white text-sm text-center" data-id="ot7s5r0eb" data-path="src/pages/SignupPage.tsx">
                Already have an account?{" "}
                <Link to="/login" className="text-aerotrav-yellow hover:underline" data-id="o8a322owq" data-path="src/pages/SignupPage.tsx">
                  Login
                </Link>
              </p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 opacity-20" data-id="nvffskouv" data-path="src/pages/SignupPage.tsx">
              <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" data-id="e7kjgalmh" data-path="src/pages/SignupPage.tsx">
                <path d="M50 10L150 90M150 90L120 30M150 90L60 70" stroke="white" strokeWidth="2" data-id="wd3lw64ch" data-path="src/pages/SignupPage.tsx" />
              </svg>
            </div>
            
            <div className="absolute top-0 right-0 opacity-20" data-id="l4zqzck0g" data-path="src/pages/SignupPage.tsx">
              <svg width="100" height="200" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" data-id="5u8l6jt5q" data-path="src/pages/SignupPage.tsx">
                <path d="M90 40V160M90 160L40 140M90 160L60 100" stroke="white" strokeWidth="2" data-id="sol5uqejl" data-path="src/pages/SignupPage.tsx" />
                <rect x="60" y="40" width="10" height="20" stroke="white" strokeWidth="2" data-id="01980guo3" data-path="src/pages/SignupPage.tsx" />
                <rect x="80" y="50" width="10" height="30" stroke="white" strokeWidth="2" data-id="ev7u9pvgj" data-path="src/pages/SignupPage.tsx" />
                <rect x="70" y="60" width="10" height="40" stroke="white" strokeWidth="2" data-id="jchs25o4s" data-path="src/pages/SignupPage.tsx" />
              </svg>
            </div>
          </div>
        </div>
      </main>
      
      <Footer data-id="2oezivmol" data-path="src/pages/SignupPage.tsx" />
    </div>);

};

export default SignupPage;