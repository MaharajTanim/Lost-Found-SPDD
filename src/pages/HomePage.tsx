import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { itemService } from '../services/supabase';
import { Item } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import ItemCard from '../components/UI/ItemCard';
import Loading from '../components/UI/Loading';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [recentLostItems, setRecentLostItems] = useState<Item[]>([]);
  const [recentFoundItems, setRecentFoundItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data: lostItems, error: lostError } = await itemService.getItems('lost');
        const { data: foundItems, error: foundError } = await itemService.getItems('found');
        
        if (lostError) throw lostError;
        if (foundError) throw foundError;
        
        setRecentLostItems(lostItems.slice(0, 4));
        setRecentFoundItems(foundItems.slice(0, 4));
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItems();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }
  
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg shadow-xl mb-12">
        <div className="px-6 py-12 sm:px-12 sm:py-16 md:py-20 lg:py-24 text-center text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Lost something? Found something?
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-teal-100">
            Connect with your community to recover lost items or help others find their belongings.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link to="/search">
              <Button
                size="lg"
                variant="secondary"
                leftIcon={<Search className="h-5 w-5" />}
              >
                Search Items
              </Button>
            </Link>
            
            {user && (
              <Link to="/new">
                <Button
                  size="lg"
                  variant="success"
                  leftIcon={<Plus className="h-5 w-5" />}
                >
                  Post New Item
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Category Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-amber-50 p-6 rounded-lg shadow-md border border-amber-100">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Recently Lost</h2>
          </div>
          
          {recentLostItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentLostItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No lost items have been reported yet.</p>
          )}
          
          <div className="mt-6 text-center">
            <Link to="/lost">
              <Button variant="warning">View All Lost Items</Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-emerald-50 p-6 rounded-lg shadow-md border border-emerald-100">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-emerald-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Recently Found</h2>
          </div>
          
          {recentFoundItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentFoundItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No found items have been reported yet.</p>
          )}
          
          <div className="mt-6 text-center">
            <Link to="/found">
              <Button variant="success">View All Found Items</Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-4">
            <div className="bg-teal-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-teal-600">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Post Your Item</h3>
            <p className="text-gray-600">
              Create a detailed post about the item you lost or found, including images and location information.
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-teal-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-teal-600">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Connect with Others</h3>
            <p className="text-gray-600">
              Get notified when someone posts an item matching your description or responds to your post.
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-teal-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-teal-600">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Recover Your Item</h3>
            <p className="text-gray-600">
              Arrange to meet at a safe location to recover your lost item or return a found one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;