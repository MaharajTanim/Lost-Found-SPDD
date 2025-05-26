import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { itemService } from '../services/supabase';
import { Item } from '../types';
import ItemForm from '../components/Items/ItemForm';
import Card, { CardHeader, CardContent } from '../components/UI/Card';
import Loading from '../components/UI/Loading';

const EditItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchItem = async () => {
      if (!id || !user) return;
      
      try {
        const { data, error } = await itemService.getItemById(id);
        
        if (error) throw error;
        
        if (!data) {
          setError('Item not found');
          return;
        }
        
        // Check if the user is the owner of the item
        if (data.user_id !== user.id && !user.is_admin) {
          setError('You do not have permission to edit this item');
          return;
        }
        
        setItem(data);
      } catch (error: any) {
        console.error('Error fetching item:', error);
        setError(error.message || 'Failed to load item');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!authLoading) {
      fetchItem();
    }
  }, [id, user, authLoading]);
  
  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/login\" replace />;
  }
  
  const handleSuccess = () => {
    navigate(`/item/${id}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }
  
  if (error || !item) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error</h2>
        <p className="text-red-600 mb-6">{error || 'Item not found'}</p>
        <button
          className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors duration-200"
          onClick={() => navigate('/')}
        >
          Go Home
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Edit className="h-8 w-8 text-teal-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Update Item Details</h2>
          <p className="text-gray-600 mt-1">
            Make changes to your lost or found item posting.
          </p>
        </CardHeader>
        <CardContent>
          <ItemForm initialData={item} onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditItemPage;