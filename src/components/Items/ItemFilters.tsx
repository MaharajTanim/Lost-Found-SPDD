import React from 'react';
import Select from '../UI/Select';

interface ItemFiltersProps {
  category: string;
  setCategory: (category: string) => void;
  location: string;
  setLocation: (location: string) => void;
  locations: string[];
}

const ItemFilters: React.FC<ItemFiltersProps> = ({
  category,
  setCategory,
  location,
  setLocation,
  locations,
}) => {
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'documents', label: 'Documents' },
    { value: 'pets', label: 'Pets' },
    { value: 'other', label: 'Other' },
  ];
  
  const locationOptions = [
    { value: '', label: 'All Locations' },
    ...locations.map(loc => ({ value: loc, label: loc })),
  ];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        
        <Select
          label="Location"
          options={locationOptions}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ItemFilters;