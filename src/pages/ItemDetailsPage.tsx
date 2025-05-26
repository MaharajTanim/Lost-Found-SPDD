import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemService } from '../services/supabase';
import { Item } from '../types';
import ItemDetails from '../components/Items/ItemDetails';
import Loading from '../components/UI/Loading';

const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await itemService.getItemById(id);
        
        if (error) throw error;
        
        if (!data) {
          setError('Item not found');
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
    
    fetchItem();
  }, [id]);
  
  const handleDelete = () => {
    navigate('/');
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
      <ItemDetails item={item} onDelete={handleDelete} />
    </div>
  );
};

export default ItemDetailsPage;