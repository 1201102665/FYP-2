import React from "react";
import { Button } from "@/components/ui/button";
import { Car } from "@/services/carService";
import { useUserActivityContext } from "@/contexts/UserActivityContext";

// Car type is now imported from carService.ts

interface CarCardProps {
  car: Car;
  onBookNow: () => void;
}

const CarCard = ({ car, onBookNow }: CarCardProps) => {
  const { trackView } = useUserActivityContext();

  // Track when the car is viewed
  React.useEffect(() => {
    trackView(car.id.toString(), 'car');
  }, [car.id, trackView]);
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100" data-id="scem1811a" data-path="src/components/CarCard.tsx">
      <div className="flex flex-col md:flex-row" data-id="4g6l2809t" data-path="src/components/CarCard.tsx">
        <div className="md:w-1/3 h-48 md:h-auto" data-id="9xma1yr5o" data-path="src/components/CarCard.tsx">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover" data-id="x7r6t70pk" data-path="src/components/CarCard.tsx" />
        </div>
        
        <div className="p-4 flex flex-col justify-between flex-grow" data-id="2bhpzlt7o" data-path="src/components/CarCard.tsx">
          <div data-id="yoivetofk" data-path="src/components/CarCard.tsx">
            <h3 className="text-lg font-bold" data-id="f2d3p6moz" data-path="src/components/CarCard.tsx">{car.name}</h3>
            
            <div className="flex items-center mt-2" data-id="wqzcfy08g" data-path="src/components/CarCard.tsx">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-id="vankjaskd" data-path="src/components/CarCard.tsx">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" data-id="ddcu3f21g" data-path="src/components/CarCard.tsx" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" data-id="7tonhlsck" data-path="src/components/CarCard.tsx" />
              </svg>
              <span className="ml-1 text-sm text-gray-700" data-id="lqxr14cyv" data-path="src/components/CarCard.tsx">{car.location}</span>
            </div>
          </div>
          
          <div className="mt-4" data-id="oe7k3rtuq" data-path="src/components/CarCard.tsx">
            <p className="font-bold" data-id="xcepubz04" data-path="src/components/CarCard.tsx">${car.price} per day</p>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2" data-id="jvrlezovl" data-path="src/components/CarCard.tsx">
            {car.features.map((feature, index) =>
            <div key={index} className="flex items-center px-2 py-1 bg-gray-100 rounded-md" data-id="1zwbkxbu1" data-path="src/components/CarCard.tsx">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-gray-600" viewBox="0 0 20 20" fill="currentColor" data-id="oat8z4649" data-path="src/components/CarCard.tsx">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" data-id="gxrzas300" data-path="src/components/CarCard.tsx" />
                </svg>
                <span className="text-xs" data-id="gtknb7opk" data-path="src/components/CarCard.tsx">{feature}</span>
              </div>
            )}
            <div className="flex items-center px-2 py-1 bg-gray-100 rounded-md" data-id="m0igr4xhv" data-path="src/components/CarCard.tsx">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-gray-600" viewBox="0 0 20 20" fill="currentColor" data-id="poc1eczf8" data-path="src/components/CarCard.tsx">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" data-id="c8vjc6y98" data-path="src/components/CarCard.tsx" />
              </svg>
              <span className="text-xs" data-id="cea4oqmx4" data-path="src/components/CarCard.tsx">{car.category}</span>
            </div>
          </div>
          
          <div className="mt-4" data-id="3s3ey87xb" data-path="src/components/CarCard.tsx">
            <Button
              onClick={onBookNow}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium" data-id="o3hj0gifh" data-path="src/components/CarCard.tsx">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>);

};

export default CarCard;