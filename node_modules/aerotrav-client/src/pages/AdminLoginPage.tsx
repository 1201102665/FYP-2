import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password, true);
      if (success) {
        // Check if user is admin after login
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      } else {
        setError('Invalid admin credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to main site link */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to AeroTrav
          </Link>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Admin Portal
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to access the AeroTrav admin dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aerotrav.com"
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your admin password"
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In to Admin Portal'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                This is a restricted area. Access is limited to authorized administrators only.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Admin Demo Credentials (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-4 bg-yellow-50 border-yellow-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-xs font-medium text-yellow-800 mb-2">Development Mode</p>
                <p className="text-xs text-yellow-700">
                  Demo admin credentials will be available once an admin user is created in the database.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage; 