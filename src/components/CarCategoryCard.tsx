import React from "react";
import { Button } from "@/components/ui/button";

interface CarCategoryCardProps {
  title: string;
  description: string;
  image: string;
}

const CarCategoryCard = ({ title, description, image }: CarCategoryCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100" data-id="sbtfe21jc" data-path="src/components/CarCategoryCard.tsx">
      <div className="h-48 overflow-hidden" data-id="kz9ednxnz" data-path="src/components/CarCategoryCard.tsx">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover" data-id="5b55al6ie" data-path="src/components/CarCategoryCard.tsx" />

      </div>
      
      <div className="p-5" data-id="98s0f3zky" data-path="src/components/CarCategoryCard.tsx">
        <h3 className="text-lg font-bold mb-2" data-id="xkx9ts58h" data-path="src/components/CarCategoryCard.tsx">{title}</h3>
        <p className="text-sm text-gray-600 mb-4" data-id="j55m6trww" data-path="src/components/CarCategoryCard.tsx">{description}</p>
        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium w-full" data-id="s9lusw865" data-path="src/components/CarCategoryCard.tsx">
          Book Now
        </Button>
      </div>
    </div>);

};

export default CarCategoryCard;