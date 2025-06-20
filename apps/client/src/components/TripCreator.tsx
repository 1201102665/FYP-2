import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { useToast } from '@/hooks/use-toast';

interface TripCreatorProps {
  onTripCreated: (trip: any) => void;
}

const TripCreator: React.FC<TripCreatorProps> = ({ onTripCreated }) => {
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState<number[]>([1000]);
  const [travelers, setTravelers] = useState('1');
  const [dateRange, setDateRange] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [additionalRequests, setAdditionalRequests] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { trackSearch } = useUserActivityContext();
  const { toast } = useToast();

  const interestOptions = [
  { id: 'beach', label: 'Beaches & Relaxation' },
  { id: 'culture', label: 'Culture & History' },
  { id: 'adventure', label: 'Adventure & Outdoor' },
  { id: 'food', label: 'Food & Cuisine' },
  { id: 'shopping', label: 'Shopping & Entertainment' },
  { id: 'nature', label: 'Nature & Wildlife' },
  { id: 'luxury', label: 'Luxury & Wellness' },
  { id: 'family', label: 'Family-Friendly Activities' }];


  const handleInterestChange = (id: string, checked: boolean) => {
    if (checked) {
      setInterests([...interests, id]);
    } else {
      setInterests(interests.filter((interest) => interest !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Track this search
      trackSearch(destination, dateRange, 'package');

      // Create the request payload
      const tripRequest = {
        destination,
        budget: budget[0],
        travelers: parseInt(travelers),
        dateRange,
        interests,
        additionalRequests
      };

      // This would normally call an API with window.ezsite.apis.someAIEndpoint
      // For now we'll simulate a call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate a mock trip recommendation - in a real implementation, this would come from the AI service
      const mockTripRecommendation = {
        destination,
        budget: budget[0],
        travelers: parseInt(travelers),
        dateRange,
        itinerary: [
        {
          day: 1,
          activities: [
          'Check-in to hotel',
          'Welcome dinner at a local restaurant']

        },
        {
          day: 2,
          activities: interests.includes('beach') ?
          ['Beach day with water activities', 'Sunset cocktails'] :
          ['City tour of major attractions', 'Visit to historical sites']
        },
        {
          day: 3,
          activities: interests.includes('adventure') ?
          ['Hiking expedition', 'Zip-lining adventure'] :
          ['Shopping at local markets', 'Cultural show in the evening']
        }],

        accommodation: {
          name: `${destination} ${interests.includes('luxury') ? 'Luxury' : 'Comfort'} Hotel`,
          rating: interests.includes('luxury') ? 5 : 4,
          amenities: ['WiFi', 'Pool', 'Restaurant', interests.includes('luxury') ? 'Spa' : 'Fitness Center']
        },
        totalPrice: budget[0] * 0.85, // Slightly under budget
        inclusions: [
        'Hotel accommodation',
        'Daily breakfast',
        'Airport transfers',
        'Guided tours as per itinerary'],

        recommendations: [
        'Best time to visit: March-May',
        `Pack ${interests.includes('beach') ? 'beachwear and sunscreen' : 'comfortable walking shoes'}`,
        'Local currency is recommended for small purchases']

      };

      // Pass the results back to the parent component
      onTripCreated(mockTripRecommendation);

      toast({
        title: "Trip Created!",
        description: "Your personalized trip has been created.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error creating trip:', error);
      toast({
        title: "Error Creating Trip",
        description: "We encountered an issue while creating your trip. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-md rounded-lg" data-id="n57y96qpi" data-path="src/components/TripCreator.tsx">
      <h2 className="text-2xl font-bold mb-4" data-id="fidz4nfc2" data-path="src/components/TripCreator.tsx">Create Your Dream Trip</h2>
      <p className="text-gray-600 mb-6" data-id="2nzq30ds6" data-path="src/components/TripCreator.tsx">
        Tell us what you're looking for, and our AI will create a personalized travel plan just for you.
      </p>

      <form onSubmit={handleSubmit} data-id="sw1reopas" data-path="src/components/TripCreator.tsx">
        <div className="space-y-6" data-id="wv5twjaj5" data-path="src/components/TripCreator.tsx">
          <div data-id="hte20c1jl" data-path="src/components/TripCreator.tsx">
            <Label htmlFor="destination" data-id="pc943dmr1" data-path="src/components/TripCreator.tsx">Where would you like to go?</Label>
            <Input
              id="destination"
              placeholder="e.g., Bali, Tokyo, Paris..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className="mt-1" data-id="2ea63clqv" data-path="src/components/TripCreator.tsx" />

          </div>

          <div data-id="9zl2sjtl0" data-path="src/components/TripCreator.tsx">
            <Label htmlFor="budget" data-id="jkr5j5odw" data-path="src/components/TripCreator.tsx">What's your budget? (USD)</Label>
            <div className="flex items-center gap-4 mt-2" data-id="h74146h6l" data-path="src/components/TripCreator.tsx">
              <Slider
                value={budget}
                min={500}
                max={10000}
                step={100}
                onValueChange={setBudget}
                className="flex-grow" data-id="sz6swpfbg" data-path="src/components/TripCreator.tsx" />

              <span className="font-medium" data-id="uhtilkt6d" data-path="src/components/TripCreator.tsx">${budget[0]}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="anvcdxzd2" data-path="src/components/TripCreator.tsx">
            <div data-id="1qn8am5y2" data-path="src/components/TripCreator.tsx">
              <Label htmlFor="travelers" data-id="vlzdco97f" data-path="src/components/TripCreator.tsx">Number of Travelers</Label>
              <Input
                id="travelers"
                type="number"
                min="1"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                required
                className="mt-1" data-id="bz4bix00e" data-path="src/components/TripCreator.tsx" />

            </div>
            <div data-id="pwr1u8qdn" data-path="src/components/TripCreator.tsx">
              <Label htmlFor="dateRange" data-id="yei46bbpq" data-path="src/components/TripCreator.tsx">When do you plan to travel?</Label>
              <Input
                id="dateRange"
                placeholder="e.g., June 2023, Summer 2023"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                required
                className="mt-1" data-id="v7ep8c28o" data-path="src/components/TripCreator.tsx" />

            </div>
          </div>

          <div data-id="sa6uoy4lf" data-path="src/components/TripCreator.tsx">
            <Label className="block mb-2" data-id="d5n2zpvif" data-path="src/components/TripCreator.tsx">What interests you? (Select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1" data-id="6linj6en6" data-path="src/components/TripCreator.tsx">
              {interestOptions.map((option) =>
              <div key={option.id} className="flex items-center space-x-2" data-id="50qfnbart" data-path="src/components/TripCreator.tsx">
                  <Checkbox
                  id={option.id}
                  checked={interests.includes(option.id)}
                  onCheckedChange={(checked) => handleInterestChange(option.id, checked as boolean)} data-id="g9abfg2zo" data-path="src/components/TripCreator.tsx" />

                  <Label htmlFor={option.id} className="cursor-pointer" data-id="aaf1vbspe" data-path="src/components/TripCreator.tsx">{option.label}</Label>
                </div>
              )}
            </div>
          </div>

          <div data-id="jczyrh4sj" data-path="src/components/TripCreator.tsx">
            <Label htmlFor="additionalRequests" data-id="sez4pylos" data-path="src/components/TripCreator.tsx">Any additional requests?</Label>
            <Textarea
              id="additionalRequests"
              placeholder="Special requirements, preferred activities, accessibility needs..."
              value={additionalRequests}
              onChange={(e) => setAdditionalRequests(e.target.value)}
              className="mt-1"
              rows={3} data-id="zcvxyk2cg" data-path="src/components/TripCreator.tsx" />

          </div>

          <Separator data-id="t9w12r817" data-path="src/components/TripCreator.tsx" />

          <Button
            type="submit"
            className="w-full bg-aerotrav-blue hover:bg-aerotrav-blue/90 text-white"
            disabled={isLoading} data-id="d1flh7034" data-path="src/components/TripCreator.tsx">

            {isLoading ?
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-id="xcl9tb4l4" data-path="src/components/TripCreator.tsx">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" data-id="0jfr5gqv5" data-path="src/components/TripCreator.tsx"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-id="ssc4o46t9" data-path="src/components/TripCreator.tsx"></path>
                </svg>
                Creating Your Trip...
              </> :

            'Create My Trip'
            }
          </Button>
        </div>
      </form>
    </Card>);

};

export default TripCreator;