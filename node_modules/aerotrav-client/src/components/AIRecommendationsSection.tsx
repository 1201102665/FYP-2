import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import useUserActivity from '@/hooks/use-user-activity';
import GeminiService from '@/services/GeminiService';
import AIRecommendationCard, { Recommendation } from './AIRecommendationCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUserActivities, mockDestinations, mockHotels, mockPackages } from '../services/mockData';

// Sample destination images for recommendations
const destinationImages = {
  "Paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "Bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "Tokyo": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "New York": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "Barcelona": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "Rome": "https://images.unsplash.com/photo-1529260830199-42c24126f198?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
};

// Generate recommendations based on user activity data
const generateRecommendations = (userId: string): Recommendation[] => {
  // Find the user in mock data
  const user = mockUserActivities.find((u) => u.userId === userId) || mockUserActivities[0];

  // Get destinations based on user preferences
  const recommendedDestinations = [];

  // Look at search history for clues
  if (user.searchHistory.some((term) => /beach|tropical|resort/i.test(term))) {
    recommendedDestinations.push({
      destination: "Bali, Indonesia",
      activities: ["Explore Ubud's Sacred Monkey Forest", "Visit Tegalalang Rice Terraces", "Relax at Kuta Beach"],
      reason: "Based on your searches for beach destinations and interest in tropical locations.",
      imageUrl: destinationImages["Bali"]
    });
  }

  if (user.searchHistory.some((term) => /japan|tokyo|culture/i.test(term)) ||
  user.preferences.activities.some((act) => /cultural|tour/i.test(act))) {
    recommendedDestinations.push({
      destination: "Tokyo, Japan",
      activities: ["Visit Senso-ji Temple", "Explore Shinjuku Gyoen National Garden", "Experience Shibuya Crossing"],
      reason: "Matches your interest in Japanese culture and urban exploration.",
      imageUrl: destinationImages["Tokyo"]
    });
  }

  if (user.preferences.budget === "high" ||
  user.preferences.accommodation === "luxury") {
    recommendedDestinations.push({
      destination: "Paris, France",
      activities: ["Visit the Louvre Museum", "Explore Montmartre", "Dine at a Michelin-starred restaurant"],
      reason: "Aligns with your preference for luxury accommodations and fine dining experiences.",
      imageUrl: destinationImages["Paris"]
    });
  }

  if (user.preferences.activities.some((act) => /shopping|sightseeing/i.test(act))) {
    recommendedDestinations.push({
      destination: "New York, USA",
      activities: ["Shop on Fifth Avenue", "Visit the Metropolitan Museum of Art", "Explore Central Park"],
      reason: "Perfect for your shopping and sightseeing preferences in a vibrant urban setting.",
      imageUrl: destinationImages["New York"]
    });
  }

  if (user.preferences.activities.some((act) => /hiking|outdoor|adventure|wildlife/i.test(act))) {
    recommendedDestinations.push({
      destination: "Barcelona, Spain",
      activities: ["Tour Sagrada Familia", "Stroll through Park Güell", "Hike in Montserrat"],
      reason: "Offers a mix of cultural attractions and nearby outdoor activities you enjoy.",
      imageUrl: destinationImages["Barcelona"]
    });
  }

  // If we couldn't generate recommendations based on preferences, return some defaults
  if (recommendedDestinations.length === 0) {
    return [
    {
      destination: "Bali, Indonesia",
      activities: ["Explore Ubud's Sacred Monkey Forest", "Visit Tegalalang Rice Terraces", "Relax at Kuta Beach"],
      reason: "Popular destination with a mix of beaches, culture, and adventure.",
      imageUrl: destinationImages["Bali"]
    },
    {
      destination: "Tokyo, Japan",
      activities: ["Visit Senso-ji Temple", "Explore Shinjuku Gyoen National Garden", "Experience Shibuya Crossing"],
      reason: "Vibrant city with a unique blend of traditional and modern attractions.",
      imageUrl: destinationImages["Tokyo"]
    },
    {
      destination: "Rome, Italy",
      activities: ["Visit the Colosseum", "Explore the Vatican Museums", "Throw a coin in the Trevi Fountain"],
      reason: "Rich in history, art, and incredible cuisine.",
      imageUrl: destinationImages["Rome"]
    }];

  }

  // Return 3 recommendations at most
  return recommendedDestinations.slice(0, 3);
};

// Default recommendations if API fails
const fallbackRecommendations: Recommendation[] = [
{
  destination: "Bali, Indonesia",
  activities: ["Explore Ubud's Sacred Monkey Forest", "Visit Tegalalang Rice Terraces", "Relax at Kuta Beach"],
  reason: "Based on your preference for beach destinations and cultural experiences.",
  imageUrl: destinationImages["Bali"]
},
{
  destination: "Tokyo, Japan",
  activities: ["Visit Senso-ji Temple", "Explore Shinjuku Gyoen National Garden", "Experience Shibuya Crossing"],
  reason: "Matches your interest in urban exploration and cultural immersion.",
  imageUrl: destinationImages["Tokyo"]
},
{
  destination: "Barcelona, Spain",
  activities: ["Tour Sagrada Familia", "Stroll through Park Güell", "Enjoy La Boqueria Market"],
  reason: "Aligned with your history of exploring European destinations with rich architecture.",
  imageUrl: destinationImages["Barcelona"]
}];


const AIRecommendationsSection: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("destinations");
  const { toast } = useToast();
  const { userActivity } = useUserActivity();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // Simulate calling the Gemini API with our mock user data
        // Use a randomly selected user ID to see different recommendations
        const randomUserId = mockUserActivities[Math.floor(Math.random() * mockUserActivities.length)].userId;
        console.log('Using mock user data for', randomUserId);

        // Generate personalized recommendations based on user data
        const personalizedRecommendations = generateRecommendations(randomUserId);
        setRecommendations(personalizedRecommendations);

        // Simulate API latency
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast({
          title: "AI Recommendations Ready",
          description: "Personalized suggestions based on your profile and activity.",
          variant: "default"
        });
      } catch (error) {
        console.error("Failed to fetch AI recommendations:", error);
        setRecommendations(fallbackRecommendations);
        toast({
          title: "Notice",
          description: "Using sample recommendations - personalized suggestions will appear as you use the app.",
          variant: "default"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [toast]);

  const handleRefreshRecommendations = () => {
    setLoading(true);
    // Generate new recommendations with a different random user
    setTimeout(() => {
      const randomUserId = mockUserActivities[Math.floor(Math.random() * mockUserActivities.length)].userId;
      console.log('Refreshed with mock user data for', randomUserId);
      const personalizedRecommendations = generateRecommendations(randomUserId);
      setRecommendations(personalizedRecommendations);
      setLoading(false);
      toast({
        title: "Recommendations Updated",
        description: "We've refreshed your personalized suggestions.",
        variant: "default"
      });
    }, 1500);
  };

  return (
    <div className="py-8 px-4" data-id="gr6zujh31" data-path="src/components/AIRecommendationsSection.tsx">
      <div className="flex items-center justify-between mb-6" data-id="v3ghwnan1" data-path="src/components/AIRecommendationsSection.tsx">
        <div data-id="t4xq517mh" data-path="src/components/AIRecommendationsSection.tsx">
          <h2 className="text-2xl font-bold text-gray-900" data-id="bjqkjnv24" data-path="src/components/AIRecommendationsSection.tsx">Personalized for You</h2>
          <p className="text-gray-600" data-id="06cdsmt9p" data-path="src/components/AIRecommendationsSection.tsx">AI-powered recommendations based on your preferences and activity</p>
        </div>
        <Button
          onClick={handleRefreshRecommendations}
          variant="outline"
          disabled={loading}
          className="flex items-center gap-2" data-id="ytb7q9t6s" data-path="src/components/AIRecommendationsSection.tsx">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={loading ? "animate-spin" : ""} data-id="xcqoz9u5x" data-path="src/components/AIRecommendationsSection.tsx">

            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" data-id="sumhr7iyf" data-path="src/components/AIRecommendationsSection.tsx" />
            <path d="M3 3v5h5" data-id="kfejwe2x3" data-path="src/components/AIRecommendationsSection.tsx" />
          </svg>
          {loading ? "Updating..." : "Refresh"}
        </Button>
      </div>

      <Tabs defaultValue="destinations" className="mb-8" onValueChange={setActiveTab} data-id="jlsjug4d6" data-path="src/components/AIRecommendationsSection.tsx">
        <TabsList className="mb-4" data-id="xwncfumzw" data-path="src/components/AIRecommendationsSection.tsx">
          <TabsTrigger value="destinations" data-id="jqf2fiwiw" data-path="src/components/AIRecommendationsSection.tsx">Destinations</TabsTrigger>
          <TabsTrigger value="activities" data-id="83po9bwx9" data-path="src/components/AIRecommendationsSection.tsx">Activities</TabsTrigger>
          <TabsTrigger value="packages" data-id="swa1ary5l" data-path="src/components/AIRecommendationsSection.tsx">Packages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="destinations" className="mt-2" data-id="es2jv71ah" data-path="src/components/AIRecommendationsSection.tsx">
          {loading ?
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="gri94mid7" data-path="src/components/AIRecommendationsSection.tsx">
              {[1, 2, 3].map((i) =>
            <div key={i} className="rounded-lg bg-gray-100 animate-pulse h-[400px]" data-id="rlp2vvaxe" data-path="src/components/AIRecommendationsSection.tsx"></div>
            )}
            </div> :

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-id="o989ncvl3" data-path="src/components/AIRecommendationsSection.tsx">
              {recommendations.map((recommendation, index) =>
            <AIRecommendationCard
              key={index}
              recommendation={recommendation}
              onViewDetails={() => {
                toast({
                  title: "Destination Details",
                  description: `You selected ${recommendation.destination}`,
                  variant: "default"
                });
              }} data-id="akqsrsvk1" data-path="src/components/AIRecommendationsSection.tsx" />

            )}
            </div>
          }
        </TabsContent>
        
        <TabsContent value="activities" className="mt-2" data-id="ty1s20epr" data-path="src/components/AIRecommendationsSection.tsx">
          <div className="text-center py-12" data-id="lmuvvt2gh" data-path="src/components/AIRecommendationsSection.tsx">
            <p className="text-gray-500" data-id="gitkb766r" data-path="src/components/AIRecommendationsSection.tsx">Activity recommendations will be available as you use the app more.</p>
            <Button className="mt-4 bg-aerotrav-blue hover:bg-aerotrav-blue-700" data-id="uvjh7poy7" data-path="src/components/AIRecommendationsSection.tsx">Explore Popular Activities</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="packages" className="mt-2" data-id="c2t0d3ywc" data-path="src/components/AIRecommendationsSection.tsx">
          <div className="text-center py-12" data-id="9i7wzrh0i" data-path="src/components/AIRecommendationsSection.tsx">
            <p className="text-gray-500" data-id="25t1yacuc" data-path="src/components/AIRecommendationsSection.tsx">Package recommendations will be personalized as you browse more vacation packages.</p>
            <Button className="mt-4 bg-aerotrav-blue hover:bg-aerotrav-blue-700" data-id="2pzl3v1ej" data-path="src/components/AIRecommendationsSection.tsx">Browse All Packages</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>);

};

export default AIRecommendationsSection;