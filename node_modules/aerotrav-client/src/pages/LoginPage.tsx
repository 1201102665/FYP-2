import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from);
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" data-id="g8j8vf35k" data-path="src/pages/LoginPage.tsx">
      <Header data-id="fn526agz9" data-path="src/pages/LoginPage.tsx" />
      
      <main className="flex-grow flex justify-center items-center py-12 px-4" data-id="8wanm2mu9" data-path="src/pages/LoginPage.tsx">
        <div className="max-w-lg w-full" data-id="178d2a4qj" data-path="src/pages/LoginPage.tsx">
          <div className="bg-aerotrav-blue rounded-lg p-8 relative overflow-hidden" data-id="6by8813d1" data-path="src/pages/LoginPage.tsx">
            <div className="relative z-10 flex flex-col items-center" data-id="6eovm3rdk" data-path="src/pages/LoginPage.tsx">
              <h1 className="text-4xl font-bold text-white mb-8" data-id="4ycvql6fg" data-path="src/pages/LoginPage.tsx">Welcome Back</h1>
              
              <form onSubmit={handleSubmit} className="w-full" data-id="1p0msk04u" data-path="src/pages/LoginPage.tsx">
                <div className="space-y-4" data-id="m3kogavkk" data-path="src/pages/LoginPage.tsx">
                  <div data-id="ngdeoq4w8" data-path="src/pages/LoginPage.tsx">
                    <label htmlFor="email" className="block text-sm font-medium text-aerotrav-yellow mb-1" data-id="3d3nnh0oa" data-path="src/pages/LoginPage.tsx">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white text-gray-900 w-full" data-id="i6fifrokj" data-path="src/pages/LoginPage.tsx" />

                  </div>
                  
                  <div data-id="s83uquvr3" data-path="src/pages/LoginPage.tsx">
                    <label htmlFor="password" className="block text-sm font-medium text-aerotrav-yellow mb-1" data-id="d1tl62hwf" data-path="src/pages/LoginPage.tsx">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white text-gray-900 w-full" data-id="8hdl3yt6l" data-path="src/pages/LoginPage.tsx" />

                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="mt-8 w-full bg-aerotrav-yellow hover:bg-aerotrav-yellow-500 text-gray-900 font-medium"
                  disabled={isLoading} data-id="zrxq4yw84" data-path="src/pages/LoginPage.tsx">

                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
              
              <p className="mt-4 text-white text-sm" data-id="98yz7thdg" data-path="src/pages/LoginPage.tsx">
                Don't have an account?{" "}
                <Link to="/signup" className="text-aerotrav-yellow hover:underline" data-id="4od0f80kj" data-path="src/pages/LoginPage.tsx">
                  Sign up
                </Link>
              </p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 opacity-20" data-id="vuf31zz38" data-path="src/pages/LoginPage.tsx">
              <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" data-id="jqykhqnjo" data-path="src/pages/LoginPage.tsx">
                <path d="M50 10L150 90M150 90L120 30M150 90L60 70" stroke="white" strokeWidth="2" data-id="y7paqk5qs" data-path="src/pages/LoginPage.tsx" />
              </svg>
            </div>
            
            <div className="absolute top-0 right-0 opacity-20" data-id="vvwcn0deo" data-path="src/pages/LoginPage.tsx">
              <svg width="100" height="200" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" data-id="4hmz2ygy5" data-path="src/pages/LoginPage.tsx">
                <path d="M90 40V160M90 160L40 140M90 160L60 100" stroke="white" strokeWidth="2" data-id="mpjzbcrsk" data-path="src/pages/LoginPage.tsx" />
                <rect x="60" y="40" width="10" height="20" stroke="white" strokeWidth="2" data-id="pw59y7n1i" data-path="src/pages/LoginPage.tsx" />
                <rect x="80" y="50" width="10" height="30" stroke="white" strokeWidth="2" data-id="tmiwj221v" data-path="src/pages/LoginPage.tsx" />
                <rect x="70" y="60" width="10" height="40" stroke="white" strokeWidth="2" data-id="ms18850zb" data-path="src/pages/LoginPage.tsx" />
              </svg>
            </div>
          </div>
        </div>
      </main>
      
      <Footer data-id="i1dlej3gj" data-path="src/pages/LoginPage.tsx" />
    </div>);

};

export default LoginPage;