import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { itemService } from '../services/supabase';
import { Item } from '../types';
import SearchBar from '../components/UI/SearchBar';
import ItemGrid from '../components/Items/ItemGrid';
import ItemFilters from '../components/Items/ItemFilters';

const SearchPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const { data, error } = await itemService.getItems();
        
        if (error) throw error;
        
        setItems(data);
        setFilteredItems(data);
        
        // Extract unique locations
        const uniqueLocations = Array.from(new Set(data.map(item => item.location)));
        setLocations(uniqueLocations);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllItems();
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
        <Search className="h-8 w-8 text-teal-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Search Items</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Find Lost or Found Items</h2>
        <SearchBar onSearch={handleSearch} placeholder="Search by title, description..." />
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

export default SearchPage;