import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TripCreator from "@/components/TripCreator";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface TripData {
  id?: string;
  title: string;
  destination: string;
  duration: number;
  budget: number;
  activities: string[];
  accommodation: string;
  transportation: string;
}

const TripCreatorPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTripCreated = (tripData: TripData) => {
    setIsLoading(true);

    // Simulate API call to save trip
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Trip Created!",
        description: "Your custom trip has been saved successfully.",
        duration: 3000,
      });

      // Navigate to trip details or home
      navigate("/");
    }, 1500);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
      duration: 5000,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="lg" text="Creating your trip..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Create Your Perfect Trip
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Design your dream vacation with our AI-powered trip creator.
              Tell us your preferences and we'll craft the perfect itinerary for you.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setError(null)}
                    className="ml-auto border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    AI
                  </Badge>
                  Smart Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our AI analyzes your preferences to suggest the best destinations,
                  activities, and accommodations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ✨
                  </Badge>
                  Personalized Itinerary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get a detailed day-by-day itinerary tailored to your interests,
                  budget, and travel style.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    🎯
                  </Badge>
                  Instant Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Book flights, hotels, and activities directly from your
                  personalized trip plan.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trip Creator Component */}
          <TripCreator
            onTripCreated={handleTripCreated}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TripCreatorPage;