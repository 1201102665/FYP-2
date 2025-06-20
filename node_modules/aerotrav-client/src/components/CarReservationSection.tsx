import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Reservation {
  id: string;
  carName: string;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  status: "active" | "upcoming" | "completed";
}

interface CarReservationSectionProps {
  reservations: Reservation[];
}

const CarReservationSection = ({ reservations }: CarReservationSectionProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full" data-id="u4abv7xqk" data-path="src/components/CarReservationSection.tsx">
      <h2 className="text-2xl font-bold mb-6" data-id="ls8sf9t51" data-path="src/components/CarReservationSection.tsx">Your Reservations</h2>
      
      {reservations.length === 0 ?
      <Card data-id="teh6butt0" data-path="src/components/CarReservationSection.tsx">
          <CardContent className="py-10 text-center" data-id="jwlpu1ck4" data-path="src/components/CarReservationSection.tsx">
            <p className="text-gray-500" data-id="h8likp5ko" data-path="src/components/CarReservationSection.tsx">You don't have any reservations yet.</p>
            <Button className="mt-4 bg-aerotrav-blue hover:bg-blue-700" data-id="5xcrn0ol2" data-path="src/components/CarReservationSection.tsx">Book a Car</Button>
          </CardContent>
        </Card> :

      <div className="space-y-4" data-id="trukus8gh" data-path="src/components/CarReservationSection.tsx">
          {reservations.map((reservation) =>
        <Card key={reservation.id} className="overflow-hidden" data-id="e3inkrwh7" data-path="src/components/CarReservationSection.tsx">
              <CardHeader className="bg-gray-50 p-4" data-id="naar6gm1z" data-path="src/components/CarReservationSection.tsx">
                <div className="flex justify-between items-center" data-id="z3wfx9zqr" data-path="src/components/CarReservationSection.tsx">
                  <CardTitle className="text-lg" data-id="qxsm5kc5x" data-path="src/components/CarReservationSection.tsx">{reservation.carName}</CardTitle>
                  <Badge className={getStatusColor(reservation.status)} data-id="cc44zlwmi" data-path="src/components/CarReservationSection.tsx">
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4" data-id="cwktmlxf7" data-path="src/components/CarReservationSection.tsx">
                <div className="grid grid-cols-2 gap-4" data-id="5q17ldsk1" data-path="src/components/CarReservationSection.tsx">
                  <div data-id="0aw3t50do" data-path="src/components/CarReservationSection.tsx">
                    <p className="text-sm text-gray-500" data-id="5qrmn0zhi" data-path="src/components/CarReservationSection.tsx">Pickup Date</p>
                    <p data-id="hv8chwpxy" data-path="src/components/CarReservationSection.tsx">{reservation.startDate}</p>
                  </div>
                  <div data-id="831bi3uz6" data-path="src/components/CarReservationSection.tsx">
                    <p className="text-sm text-gray-500" data-id="bxujqicsg" data-path="src/components/CarReservationSection.tsx">Return Date</p>
                    <p data-id="cyw33uquo" data-path="src/components/CarReservationSection.tsx">{reservation.endDate}</p>
                  </div>
                  <div data-id="v7rl7h8h2" data-path="src/components/CarReservationSection.tsx">
                    <p className="text-sm text-gray-500" data-id="0wvlkbg5x" data-path="src/components/CarReservationSection.tsx">Location</p>
                    <p data-id="je9mjhzpv" data-path="src/components/CarReservationSection.tsx">{reservation.location}</p>
                  </div>
                  <div data-id="w6j4jiaon" data-path="src/components/CarReservationSection.tsx">
                    <p className="text-sm text-gray-500" data-id="gobfitidl" data-path="src/components/CarReservationSection.tsx">Total Price</p>
                    <p className="font-bold" data-id="rsvbo31iu" data-path="src/components/CarReservationSection.tsx">RM {reservation.price}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2" data-id="r1otykeyd" data-path="src/components/CarReservationSection.tsx">
                  <Button variant="outline" size="sm" data-id="g3zxajejq" data-path="src/components/CarReservationSection.tsx">View Details</Button>
                  {reservation.status === "upcoming" &&
              <Button variant="destructive" size="sm" data-id="eobitxaqn" data-path="src/components/CarReservationSection.tsx">Cancel</Button>
              }
                </div>
              </CardContent>
            </Card>
        )}
        </div>
      }
    </div>);

};

export default CarReservationSection;