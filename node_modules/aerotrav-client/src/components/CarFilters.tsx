import React from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CarFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  carTypes: string[];
  selectedCarTypes: string[];
  onCarTypeChange: (type: string) => void;
}

const CarFilters = ({
  priceRange,
  onPriceRangeChange,
  carTypes,
  selectedCarTypes,
  onCarTypeChange
}: CarFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4" data-id="a8htyr7dz" data-path="src/components/CarFilters.tsx">
      <h3 className="font-bold text-lg mb-4" data-id="c9o3peqn0" data-path="src/components/CarFilters.tsx">Filters</h3>
      
      {/* Price Range Filter */}
      <div className="mb-6" data-id="13o3szbwt" data-path="src/components/CarFilters.tsx">
        <h4 className="font-medium mb-2" data-id="pwnl2j8oh" data-path="src/components/CarFilters.tsx">Price Range</h4>
        <div className="px-2" data-id="iq04geuti" data-path="src/components/CarFilters.tsx">
          <Slider
            defaultValue={[priceRange[0], priceRange[1]]}
            max={1000}
            step={10}
            onValueChange={(values) => {
              onPriceRangeChange([values[0], values[1]]);
            }}
            className="mb-2" data-id="y5nxljm0e" data-path="src/components/CarFilters.tsx" />

          <div className="flex justify-between text-sm text-gray-600" data-id="pttgoxa05" data-path="src/components/CarFilters.tsx">
            <span data-id="am0rmes0c" data-path="src/components/CarFilters.tsx">RM {priceRange[0]}</span>
            <span data-id="tylgnay37" data-path="src/components/CarFilters.tsx">RM {priceRange[1]}</span>
          </div>
        </div>
      </div>
      
      {/* Car Type Filter */}
      <div data-id="ypzgf4gbe" data-path="src/components/CarFilters.tsx">
        <h4 className="font-medium mb-2" data-id="s5rx1qwn0" data-path="src/components/CarFilters.tsx">Car Type</h4>
        <div className="space-y-2" data-id="ffo43q6ud" data-path="src/components/CarFilters.tsx">
          {carTypes.map((type) =>
          <div key={type} className="flex items-center" data-id="uwhxgvcbc" data-path="src/components/CarFilters.tsx">
              <Checkbox
              id={`type-${type}`}
              checked={selectedCarTypes.includes(type)}
              onCheckedChange={() => onCarTypeChange(type)} data-id="ffjtu3iz2" data-path="src/components/CarFilters.tsx" />

              <Label
              htmlFor={`type-${type}`}
              className="ml-2 text-sm font-normal" data-id="2aadt9xfn" data-path="src/components/CarFilters.tsx">

                {type}
              </Label>
            </div>
          )}
        </div>
      </div>
    </div>);

};

export default CarFilters;