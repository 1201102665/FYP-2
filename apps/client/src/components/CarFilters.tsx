import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface CarFiltersProps {
  filters: {
    priceRange: [number, number];
    category: string;
    transmission: string;
    features: string[];
    supplier: string;
  };
  onFilterChange: (filters: CarFiltersProps['filters']) => void;
}

const CarFilters: React.FC<CarFiltersProps> = ({ filters, onFilterChange }) => {
  // Handle price range change
  const handlePriceChange = (value: number[]) => {
    onFilterChange({
      ...filters,
      priceRange: [value[0], value[1]]
    });
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? '' : category
    });
  };

  // Handle transmission change
  const handleTransmissionChange = (transmission: string) => {
    onFilterChange({
      ...filters,
      transmission: filters.transmission === transmission ? '' : transmission
    });
  };

  // Handle feature toggle
  const handleFeatureToggle = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    
    onFilterChange({
      ...filters,
      features: newFeatures
    });
  };

  // Handle supplier change
  const handleSupplierChange = (supplier: string) => {
    onFilterChange({
      ...filters,
      supplier: filters.supplier === supplier ? '' : supplier
    });
  };

  // Reset all filters
  const handleReset = () => {
    onFilterChange({
      priceRange: [50, 500],
      category: '',
      transmission: '',
      features: [],
      supplier: ''
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Filters</h2>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Price Range (RM per day)</h3>
        <div className="px-2">
          <Slider
            defaultValue={filters.priceRange}
            min={50}
            max={500}
            step={10}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>RM {filters.priceRange[0]}</span>
            <span>RM {filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Category</h3>
        <div className="space-y-2">
          {['Economy', 'Compact', 'SUV', 'Luxury', 'Van'].map((category) => (
            <div key={category} className="flex items-center">
              <Checkbox
                id={`category-${category}`}
                checked={filters.category === category}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <Label htmlFor={`category-${category}`} className="ml-2">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Transmission</h3>
        <div className="space-y-2">
          {['Automatic', 'Manual'].map((transmission) => (
            <div key={transmission} className="flex items-center">
              <Checkbox
                id={`transmission-${transmission}`}
                checked={filters.transmission === transmission}
                onCheckedChange={() => handleTransmissionChange(transmission)}
              />
              <Label htmlFor={`transmission-${transmission}`} className="ml-2">
                {transmission}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Features</h3>
        <div className="space-y-2">
          {[
            'GPS Navigation',
            'Bluetooth',
            'Air Conditioning',
            'Leather Seats',
            'Parking Sensors',
            'Cruise Control',
            'Sunroof'
          ].map((feature) => (
            <div key={feature} className="flex items-center">
              <Checkbox
                id={`feature-${feature}`}
                checked={filters.features.includes(feature)}
                onCheckedChange={() => handleFeatureToggle(feature)}
              />
              <Label htmlFor={`feature-${feature}`} className="ml-2">
                {feature}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleReset}
      >
        Reset Filters
      </Button>
    </Card>
  );
};

export default CarFilters;