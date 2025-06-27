import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface PackageDetailsProps {
  title: string;
  description: string;
  destination: string;
  duration: string;
  itinerary: ItineraryItem[];
  flightDetails?: {
    departure: string;
    arrival: string;
    airline: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    class: string;
  };
  hotelDetails?: {
    name: string;
    rating: number;
    location: string;
    roomType: string;
    boardType: string; // All-inclusive, breakfast only, etc.
    amenities: string[];
  };
  carDetails?: {
    type: string;
    brand: string;
    model: string;
    pickupLocation: string;
    dropoffLocation: string;
  };
  includedServices: string[];
  excludedServices: string[];
}

const PackageDetails: React.FC<PackageDetailsProps> = ({
  title,
  description,
  destination,
  duration,
  itinerary,
  flightDetails,
  hotelDetails,
  carDetails,
  includedServices,
  excludedServices
}) => {
  return (
    <Card className="shadow-md" data-id="tyd186yzv" data-path="src/components/PackageDetails.tsx">
      <CardContent className="p-6" data-id="ip48zwsy2" data-path="src/components/PackageDetails.tsx">
        <h2 className="text-2xl font-bold mb-2" data-id="u71b22kvm" data-path="src/components/PackageDetails.tsx">{title}</h2>
        <div className="flex items-center mb-4" data-id="36ghk645h" data-path="src/components/PackageDetails.tsx">
          <Badge variant="outline" className="mr-2" data-id="hv4y8pafe" data-path="src/components/PackageDetails.tsx">{destination}</Badge>
          <Badge variant="outline" data-id="dolen9uk0" data-path="src/components/PackageDetails.tsx">{duration}</Badge>
        </div>
        
        <p className="text-muted-foreground mb-6" data-id="z9pxrji0o" data-path="src/components/PackageDetails.tsx">{description}</p>
        
        {itinerary && itinerary.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">Your Journey</h3>
            <ol className="space-y-8">
              {itinerary.map((day) => (
                <li key={day.day} className="relative pl-8">
                  <span className="absolute left-0 top-0 flex items-center justify-center h-8 w-8 rounded-full bg-black text-white font-bold">{day.day}</span>
                  <h4 className="font-bold text-lg">{day.title}</h4>
                  <p className="text-muted-foreground mb-2">{day.description}</p>
                  <div>
                    <span className="font-semibold">Daily Activities:</span>
                    <ul className="list-disc ml-6">
                      {day.activities.map((activity, idx) => (
                        <li key={idx}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
      </CardContent>
    </Card>);

};

export default PackageDetails;