import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { User, Camera, Edit3, Save, X, BookOpen, Settings, LogOut } from 'lucide-react';
import BookingsList from '@/components/BookingsList';
import { toast } from 'sonner';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

type ActiveSection = 'profile' | 'bookings' | 'preferences';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, getToken } = useAuth();
  const { userActivity, updatePreferences } = useUserActivityContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize state from context only once
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
    () => userActivity.preferences.preferredActivities || []
  );
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    () => userActivity.preferences.favoriteDestinations || []
  );
  const [budgetRange, setBudgetRange] = useState<[number, number]>(
    () => userActivity.preferences.budgetRange || [0, 5000]
  );
  const [travelStyle, setTravelStyle] = useState<string[]>(
    () => userActivity.preferences.travelStyle || []
  );

  // Load initial preferences from backend
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const response = await fetch('http://localhost:3001/api/preferences', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSelectedPreferences(data.preferred_activities || []);
          setSelectedDestinations(data.favorite_destinations || []);
          setBudgetRange([data.budget_range_min || 0, data.budget_range_max || 5000]);
          setTravelStyle(data.travel_style || []);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
        toast.error("Failed to load preferences. Please try again.");
      }
    };

    if (isAuthenticated) {
      fetchPreferences();
    }
  }, [isAuthenticated, getToken]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Authentication Required", {
        description: "Please log in to view your profile."
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Navigation State
  const [activeSection, setActiveSection] = useState<ActiveSection>('profile');

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [profilePicture, setProfilePicture] = useState<string>('');
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  const activityOptions = [
    { id: 'beach', label: 'Beach & Relaxation' },
    { id: 'adventure', label: 'Adventure & Outdoor' },
    { id: 'cultural', label: 'Cultural Experiences' },
    { id: 'food', label: 'Food & Culinary' },
    { id: 'nightlife', label: 'Nightlife & Entertainment' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'wellness', label: 'Wellness & Spa' },
    { id: 'family', label: 'Family Activities' }
  ];

  const destinationOptions = [
    { id: 'europe', label: 'Europe' },
    { id: 'asia', label: 'Asia' },
    { id: 'northamerica', label: 'North America' },
    { id: 'southamerica', label: 'South America' },
    { id: 'africa', label: 'Africa' },
    { id: 'oceania', label: 'Australia & Oceania' },
    { id: 'caribbean', label: 'Caribbean' },
    { id: 'middleeast', label: 'Middle East' }
  ];

  const travelStyleOptions = [
    { id: 'luxury', label: 'Luxury Travel' },
    { id: 'budget', label: 'Budget Travel' },
    { id: 'eco', label: 'Eco-friendly Travel' },
    { id: 'solo', label: 'Solo Travel' },
    { id: 'family', label: 'Family Travel' },
    { id: 'group', label: 'Group Travel' },
    { id: 'romantic', label: 'Romantic Getaways' }
  ];

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File too large", {
          description: "Please select an image smaller than 5MB."
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicture(result);
        toast.success("Profile Picture Updated", {
          description: "Your profile picture has been updated successfully."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const savePersonalInfo = () => {
    // In a real application, this would save to a backend database
    setIsEditingPersonal(false);
    toast.success("Personal Information Updated", {
      description: "Your personal information has been saved to the database successfully."
    });
  };

  const handleActivityToggle = useCallback((activityId: string) => {
    setSelectedPreferences(prev =>
      prev.includes(activityId) ?
        prev.filter((id) => id !== activityId) :
        [...prev, activityId]
    );
  }, []);

  const handleDestinationToggle = useCallback((destinationId: string) => {
    setSelectedDestinations(prev =>
      prev.includes(destinationId) ?
        prev.filter((id) => id !== destinationId) :
        [...prev, destinationId]
    );
  }, []);

  const handleTravelStyleToggle = useCallback((styleId: string) => {
    setTravelStyle(prev =>
      prev.includes(styleId) ?
        prev.filter((id) => id !== styleId) :
        [...prev, styleId]
    );
  }, []);

  const handleMinBudgetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setBudgetRange(prev => [value, prev[1]]);
    }
  }, []);

  const handleMaxBudgetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setBudgetRange(prev => [prev[0], value]);
    }
  }, []);

  const savePreferences = async () => {
    try {
      // Validate data before sending
      if (!Array.isArray(selectedPreferences) || !Array.isArray(selectedDestinations)) {
        throw new Error('Invalid preferences format');
      }

      // Ensure budgetRange values are numbers
      const minBudget = Number(budgetRange[0]);
      const maxBudget = Number(budgetRange[1]);

      if (isNaN(minBudget) || isNaN(maxBudget)) {
        throw new Error('Invalid budget range');
      }

      const token = getToken();
      if (!token) {
        toast.error("Authentication Error", {
          description: "Please log in to save preferences."
        });
        return;
      }

      const response = await fetch('http://localhost:3001/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          preferred_activities: selectedPreferences,
          favorite_destinations: selectedDestinations,
          budget_range_min: minBudget,
          budget_range_max: maxBudget,
          travel_style: Array.isArray(travelStyle) ? travelStyle : [travelStyle].filter(Boolean)
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        updatePreferences({
          preferredActivities: selectedPreferences,
          favoriteDestinations: selectedDestinations,
          budgetRange: [minBudget, maxBudget],
          travelStyle: Array.isArray(travelStyle) ? travelStyle : [travelStyle]
        });

        toast.success("Preferences Saved", {
          description: "Your travel preferences have been updated successfully."
        });
      } else {
        // Handle server error response
        const errorMessage = data.error || data.message || 'Failed to save preferences';
        toast.error(errorMessage);
      }
    } catch (error) {
      // Handle network or parsing errors
      console.error('Error saving preferences:', error);
      toast.error("Network error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success("Logged Out", {
      description: "You have been successfully logged out."
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Manage your personal details and contact information
                  </CardDescription>
                </div>
                <Button
                  onClick={() => isEditingPersonal ? savePersonalInfo() : setIsEditingPersonal(true)}
                  variant={isEditingPersonal ? "default" : "outline"}
                >
                  {isEditingPersonal ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-medium mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={personalInfo.firstName}
                      onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                      disabled={!isEditingPersonal}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={personalInfo.lastName}
                      onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                      disabled={!isEditingPersonal}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      disabled={!isEditingPersonal}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      disabled={!isEditingPersonal}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                      disabled={!isEditingPersonal}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={personalInfo.nationality}
                      onChange={(e) => handlePersonalInfoChange('nationality', e.target.value)}
                      disabled={!isEditingPersonal}
                      placeholder="American"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Travel Documents */}
              <div>
                <h4 className="text-sm font-medium mb-3">Travel Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="passportNumber">Passport Number</Label>
                    <Input
                      id="passportNumber"
                      value={personalInfo.passportNumber}
                      onChange={(e) => handlePersonalInfoChange('passportNumber', e.target.value)}
                      disabled={!isEditingPersonal}
                      placeholder="123456789"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address Information */}
              <div>
                <h4 className="text-sm font-medium mb-3">Address</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={personalInfo.address}
                      onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                      disabled={!isEditingPersonal}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={personalInfo.city}
                        onChange={(e) => handlePersonalInfoChange('city', e.target.value)}
                        disabled={!isEditingPersonal}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={personalInfo.state}
                        onChange={(e) => handlePersonalInfoChange('state', e.target.value)}
                        disabled={!isEditingPersonal}
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        value={personalInfo.zipCode}
                        onChange={(e) => handlePersonalInfoChange('zipCode', e.target.value)}
                        disabled={!isEditingPersonal}
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={personalInfo.country}
                      onChange={(e) => handlePersonalInfoChange('country', e.target.value)}
                      disabled={!isEditingPersonal}
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              {isEditingPersonal && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={savePersonalInfo} className="bg-aerotrav-blue hover:bg-aerotrav-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setIsEditingPersonal(false)}
                    variant="outline"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'bookings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>
                View your past and upcoming bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingsList />
            </CardContent>
          </Card>
        );

      case 'preferences':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Travel Preferences</CardTitle>
              <CardDescription>
                Customize your preferences for better recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Activities */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Preferred Activities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {activityOptions.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`activity-${activity.id}`}
                          checked={selectedPreferences.includes(activity.id)}
                          onCheckedChange={() => handleActivityToggle(activity.id)}
                        />
                        <Label htmlFor={`activity-${activity.id}`}>{activity.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Destinations */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Favorite Destinations</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {destinationOptions.map((destination) => (
                      <div key={destination.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`destination-${destination.id}`}
                          checked={selectedDestinations.includes(destination.id)}
                          onCheckedChange={() => handleDestinationToggle(destination.id)}
                        />
                        <Label htmlFor={`destination-${destination.id}`}>{destination.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Budget Range */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Budget Range</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-budget">Minimum ($)</Label>
                      <Input
                        id="min-budget"
                        type="number"
                        value={budgetRange[0]}
                        onChange={handleMinBudgetChange}
                        min="0"
                        step="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-budget">Maximum ($)</Label>
                      <Input
                        id="max-budget"
                        type="number"
                        value={budgetRange[1]}
                        onChange={handleMaxBudgetChange}
                        min="0"
                        step="100"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Travel Style */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Travel Style</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {travelStyleOptions.map((style) => (
                      <div key={style.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`style-${style.id}`}
                          checked={travelStyle.includes(style.id)}
                          onCheckedChange={() => handleTravelStyleToggle(style.id)}
                        />
                        <Label htmlFor={`style-${style.id}`}>{style.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={savePreferences} className="bg-aerotrav-blue hover:bg-aerotrav-blue-700">
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - User Profile */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  {/* Profile Picture Section */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-aerotrav-blue-100 flex items-center justify-center text-aerotrav-blue overflow-hidden">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12" />
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-aerotrav-blue text-white rounded-full flex items-center justify-center hover:bg-aerotrav-blue-700 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </div>

                  <h3 className="text-lg font-medium">{personalInfo.firstName} {personalInfo.lastName}</h3>
                  <p className="text-sm text-gray-500">{personalInfo.email}</p>
                  <div className="flex items-center mt-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-xs text-gray-500">Premium Member</span>
                  </div>
                </div>

                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveSection('profile')}
                    className={`flex w-full items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'profile'
                      ? 'bg-aerotrav-blue-50 text-aerotrav-blue'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <User className="h-5 w-5 mr-2" />
                    My Profile
                  </button>

                  <button
                    onClick={() => setActiveSection('bookings')}
                    className={`flex w-full items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'bookings'
                      ? 'bg-aerotrav-blue-50 text-aerotrav-blue'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    My Bookings
                  </button>

                  <button
                    onClick={() => setActiveSection('preferences')}
                    className={`flex w-full items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'preferences'
                      ? 'bg-aerotrav-blue-50 text-aerotrav-blue'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    Preferences
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="md:col-span-2">
            {renderContent()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;