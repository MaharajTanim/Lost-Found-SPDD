import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { itemService } from '../services/supabase';
import { Item } from '../types';
import Button from '../components/UI/Button';
import ItemGrid from '../components/Items/ItemGrid';
import Card, { CardContent } from '../components/UI/Card';

const MyPostsPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await itemService.getItemsByUserId(user.id);
        
        if (error) throw error;
        
        setItems(data);
      } catch (error) {
        console.error('Error fetching user items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!authLoading) {
      fetchUserItems();
    }
  }, [user, authLoading]);
  
  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/login\" replace />;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-teal-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
        </div>
        
        <Link to="/new">
          <Button
            leftIcon={<Plus className="h-5 w-5" />}
          >
            New Post
          </Button>
        </Link>
      </div>
      
      {items.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">You haven't created any posts yet</h2>
            <p className="text-gray-600 mb-6">
              Start by creating a post for a lost or found item.
            </p>
            <Link to="/new">
              <Button
                leftIcon={<Plus className="h-5 w-5" />}
              >
                Create Your First Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ItemGrid items={items} isLoading={isLoading} />
      )}
    </div>
  );
};

export default MyPostsPage;