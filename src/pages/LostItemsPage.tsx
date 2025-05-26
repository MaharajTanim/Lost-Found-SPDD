import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { itemService } from '../services/supabase';
import { Item } from '../types';
import ItemGrid from '../components/Items/ItemGrid';
import SearchBar from '../components/UI/SearchBar';
import ItemFilters from '../components/Items/ItemFilters';

const LostItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await itemService.getItems('lost');
        
        if (error) throw error;
        
        setItems(data);
        setFilteredItems(data);
        
        // Extract unique locations
        const uniqueLocations = Array.from(new Set(data.map(item => item.location)));
        setLocations(uniqueLocations);
      } catch (error) {
        console.error('Error fetching lost items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItems();
  }, []);
  
  useEffect(() => {
    // Apply filters
    let result = items;
    
    if (searchQuery) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (category) {
      result = result.filter(item => item.category === category);
    }
    
    if (location) {
      result = result.filter(item => item.location === location);
    }
    
    setFilteredItems(result);
  }, [items, searchQuery, category, location]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <AlertTriangle className="h-8 w-8 text-amber-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Lost Items</h1>
      </div>
      
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="Search lost items..." />
      </div>
      
      <ItemFilters
        category={category}
        setCategory={setCategory}
        location={location}
        setLocation={setLocation}
        locations={locations}
      />
      
      <ItemGrid items={filteredItems} isLoading={isLoading} />
    </div>
  );
};

export default LostItemsPage;