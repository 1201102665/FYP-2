import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import useUserActivity from '@/hooks/use-user-activity';
import GeminiService from '@/services/GeminiService';
import { mockUserActivities, mockDestinations, mockPackages } from '../services/mockData';

interface Insight {
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  type: 'suggestion' | 'improvement' | 'tip';
}

// Generate insights based on user data
const generateInsightsFromUserData = (userId: string): Insight[] => {
  // Find user in mock data
  const user = mockUserActivities.find((u) => u.userId === userId) || mockUserActivities[0];
  const insights: Insight[] = [];

  // Check profile completeness
  if (!user.preferences || Object.keys(user.preferences).length < 3) {
    insights.push({
      title: "Complete Your Profile",
      description: "Add your travel preferences to get more personalized recommendations.",
      actionText: "Update Profile",
      actionLink: "/profile",
      type: "improvement"
    });
  }

  // Check search history patterns
  if (user.searchHistory.some((term) => /beach|tropical|resort/i.test(term)) &&
  !user.clickedItems.includes(1) && !user.clickedItems.includes(8)) {
    insights.push({
      title: "Beaches You Might Like",
      description: "Based on your searches for beach destinations, you might enjoy exploring Bali or the Maldives.",
      actionText: "View Beach Destinations",
      actionLink: "/destinations",
      type: "suggestion"
    });
  }

  // Check booking history vs search patterns
  if (user.searchHistory.length > 3 && user.bookingHistory.length === 0) {
    insights.push({
      title: "Ready to Book?",
      description: "You've been searching but haven't made a booking yet. Prices might increase soon on popular destinations.",
      actionText: "View Deals",
      actionLink: "/packages",
      type: "tip"
    });
  }

  // Budget recommendations
  if (user.preferences?.budget === "high") {
    insights.push({
      title: "Luxury Experiences",
      description: "Discover our curated selection of premium travel experiences and exclusive accommodations.",
      actionText: "Explore Luxury Travel",
      actionLink: "/luxury",
      type: "suggestion"
    });
  } else if (user.preferences?.budget === "medium" || user.preferences?.budget === "low") {
    insights.push({
      title: "Travel Smart, Save More",
      description: "Book flights 2-3 months in advance and travel during shoulder seasons for the best deals.",
      actionText: "View Budget Tips",
      actionLink: "/tips",
      type: "tip"
    });
  }

  // Car rental suggestion if they've booked flights but no cars
  if (user.bookingHistory.some((h) => h.type === "flight") &&
  !user.bookingHistory.some((h) => h.type === "car")) {
    insights.push({
      title: "Need Transportation?",
      description: "You've booked flights, but no car rental yet. Secure your car early for better rates and availability.",
      actionText: "View Car Rentals",
      actionLink: "/car-rental",
      type: "improvement"
    });
  }

  // Activity preferences
  if (user.preferences?.activities?.some((act) => /cultural|tour/i.test(act))) {
    insights.push({
      title: "Cultural Experiences",
      description: "Discover authentic local experiences and guided cultural tours at your destinations.",
      actionText: "Explore Cultural Tours",
      actionLink: "/activities",
      type: "suggestion"
    });
  }

  // Return 3 insights at most
  return insights.slice(0, 3);
};

// Fallback insights if API fails
const fallbackInsights: Insight[] = [
{
  title: "Complete Your Profile",
  description: "Add your travel preferences to get more personalized recommendations.",
  actionText: "Update Profile",
  actionLink: "/profile",
  type: "improvement"
},
{
  title: "Try Different Destinations",
  description: "Based on your recent searches, you might enjoy exploring new regions.",
  actionText: "Explore Destinations",
  actionLink: "/destinations",
  type: "suggestion"
},
{
  title: "Travel Planning Tip",
  description: "Book flights 2-3 months in advance for the best prices on your favorite routes.",
  actionText: "Search Flights",
  actionLink: "/flights",
  type: "tip"
}];


const PerformanceInsights: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { userActivity } = useUserActivity();

  useEffect(() => {
    const generateInsights = async () => {
      setLoading(true);
      try {
        // In a real implementation, we would call the Gemini API here
        // For this demo, use our mock user data to generate insights
        const randomUserId = mockUserActivities[Math.floor(Math.random() * mockUserActivities.length)].userId;
        console.log('Generating insights for user', randomUserId);

        // Generate personalized insights based on user data
        const userInsights = generateInsightsFromUserData(randomUserId);

        // If we couldn't generate enough insights, add some from fallback
        const combinedInsights = [...userInsights];
        if (combinedInsights.length < 3) {
          const neededInsights = 3 - combinedInsights.length;
          combinedInsights.push(...fallbackInsights.slice(0, neededInsights));
        }

        // Simulate API latency
        setTimeout(() => {
          setInsights(combinedInsights);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to generate insights:", error);
        setInsights(fallbackInsights);
        toast({
          title: "Notice",
          description: "Using sample insights - personalized insights will appear as you use the app.",
          variant: "default"
        });
        setLoading(false);
      }
    };

    generateInsights();
  }, [toast, userActivity]);

  // Get icon based on insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'suggestion':
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600" data-id="45yj00yba" data-path="src/components/PerformanceInsights.tsx">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-id="tdvb3avip" data-path="src/components/PerformanceInsights.tsx">
              <path d="M12 3a6 6 0 0 0-6 6c0 2.4 1.4 4.5 3.5 5.5a2 2 0 0 1 1 1.5V18a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2a2 2 0 0 1 1-1.5A6 6 0 0 0 12 3" data-id="5cmjju7hl" data-path="src/components/PerformanceInsights.tsx" />
              <path d="M10 21h4" data-id="s6dds99hm" data-path="src/components/PerformanceInsights.tsx" />
            </svg>
          </div>);

      case 'improvement':
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600" data-id="0270slxjs" data-path="src/components/PerformanceInsights.tsx">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-id="h1arpd9xc" data-path="src/components/PerformanceInsights.tsx">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" data-id="x54rk0ob8" data-path="src/components/PerformanceInsights.tsx" />
              <polyline points="16 7 22 7 22 13" data-id="z7dtnidd4" data-path="src/components/PerformanceInsights.tsx" />
            </svg>
          </div>);

      case 'tip':
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600" data-id="8x05uvrhr" data-path="src/components/PerformanceInsights.tsx">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-id="2vd722dlb" data-path="src/components/PerformanceInsights.tsx">
              <circle cx="12" cy="12" r="10" data-id="ebw7cxquj" data-path="src/components/PerformanceInsights.tsx" />
              <line x1="12" x2="12" y1="8" y2="12" data-id="fonym03lm" data-path="src/components/PerformanceInsights.tsx" />
              <line x1="12" x2="12.01" y1="16" y2="16" data-id="p15y03jii" data-path="src/components/PerformanceInsights.tsx" />
            </svg>
          </div>);

      default:
        return null;
    }
  };

  return (
    <Card className="border-none shadow-sm" data-id="csrmf6m86" data-path="src/components/PerformanceInsights.tsx">
      <CardHeader className="pb-3" data-id="4il8tidpd" data-path="src/components/PerformanceInsights.tsx">
        <CardTitle className="text-xl font-bold flex items-center gap-2" data-id="4458ff2ay" data-path="src/components/PerformanceInsights.tsx">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-id="6ar82ie7a" data-path="src/components/PerformanceInsights.tsx">
            <circle cx="12" cy="12" r="10" data-id="acc4y6mgl" data-path="src/components/PerformanceInsights.tsx" />
            <line x1="12" x2="12" y1="16" y2="12" data-id="huyx2g3k9" data-path="src/components/PerformanceInsights.tsx" />
            <line x1="12" x2="12.01" y1="8" y2="8" data-id="b7r02fpt3" data-path="src/components/PerformanceInsights.tsx" />
          </svg>
          AI Travel Insights
        </CardTitle>
      </CardHeader>
      <CardContent data-id="y3isnm8og" data-path="src/components/PerformanceInsights.tsx">
        {loading ?
        <div className="space-y-4" data-id="tyr5xensr" data-path="src/components/PerformanceInsights.tsx">
            {[1, 2, 3].map((i) =>
          <div key={i} className="flex gap-4 animate-pulse" data-id="040oaznxs" data-path="src/components/PerformanceInsights.tsx">
                <div className="w-10 h-10 rounded-full bg-gray-200" data-id="ko3kxdanl" data-path="src/components/PerformanceInsights.tsx"></div>
                <div className="flex-1 space-y-2" data-id="6n5bbe9pt" data-path="src/components/PerformanceInsights.tsx">
                  <div className="h-4 bg-gray-200 rounded w-3/4" data-id="irukya9tk" data-path="src/components/PerformanceInsights.tsx"></div>
                  <div className="h-3 bg-gray-200 rounded" data-id="flefroytj" data-path="src/components/PerformanceInsights.tsx"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6" data-id="auyvf4byi" data-path="src/components/PerformanceInsights.tsx"></div>
                </div>
              </div>
          )}
          </div> :

        <div className="space-y-4" data-id="pzl9wfqp6" data-path="src/components/PerformanceInsights.tsx">
            {insights.map((insight, index) =>
          <React.Fragment key={index} data-id="03g3twrx9" data-path="src/components/PerformanceInsights.tsx">
                {index > 0 && <Separator className="my-4" data-id="t58r79d4e" data-path="src/components/PerformanceInsights.tsx" />}
                <div className="flex gap-4" data-id="9tds9a1wv" data-path="src/components/PerformanceInsights.tsx">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1" data-id="xze05pmxw" data-path="src/components/PerformanceInsights.tsx">
                    <h3 className="font-medium" data-id="hp2bkmdoo" data-path="src/components/PerformanceInsights.tsx">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 mb-2" data-id="q55axyz2e" data-path="src/components/PerformanceInsights.tsx">{insight.description}</p>
                    <Button
                  variant="link"
                  className="p-0 h-auto text-aerotrav-blue font-medium"
                  asChild data-id="rfotc7gzw" data-path="src/components/PerformanceInsights.tsx">

                      <a href={insight.actionLink} data-id="roiadewhh" data-path="src/components/PerformanceInsights.tsx">{insight.actionText} →</a>
                    </Button>
                  </div>
                </div>
              </React.Fragment>
          )}
          </div>
        }
      </CardContent>
    </Card>);

};

export default PerformanceInsights;