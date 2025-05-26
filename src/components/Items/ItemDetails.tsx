import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { MapPin, Calendar, Mail, Phone, Edit, Trash, AlertCircle } from 'lucide-react';
import { Item } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { itemService } from '../../services/supabase';
import Card, { CardContent, CardFooter } from '../UI/Card';
import Button from '../UI/Button';

interface ItemDetailsProps {
  item: Item;
  onDelete?: () => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isOwner = user?.id === item.user_id;
  const isAdmin = user?.is_admin || false;
  const canModify = isOwner || isAdmin;
  
  const statusColor = item.status === 'lost' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const { error } = await itemService.deleteItem(item.id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Item deleted successfully!');
      
      if (onDelete) {
        onDelete();
      } else {
        navigate('/myposts');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete item');
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4">
          <div className="relative">
            <img
              src={item.image_url || 'https://images.pexels.com/photos/8108086/pexels-photo-8108086.jpeg'}
              alt={item.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className={`absolute top-2 right-2 ${statusColor} px-2 py-1 rounded-md text-xs font-semibold uppercase`}>
              {item.status}
            </div>
          </div>
        </div>
        
        <CardContent>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h1>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2 text-teal-600" />
              <span>{item.location}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2 text-teal-600" />
              <span>{format(new Date(item.date), 'MMMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <div className="h-5 w-5 mr-2 text-teal-600 flex items-center justify-center">
                <span className="text-xs font-bold">@</span>
              </div>
              <span>{item.contact_info}</span>
            </div>
            
            <div className="mt-4">
              <span className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {item.category}
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{item.description}</p>
          </div>
        </CardContent>
      </div>
      
      {canModify && (
        <CardFooter className="flex justify-end space-x-3">
          {isOwner && (
            <Link to={`/edit/${item.id}`}>
              <Button
                variant="secondary"
                leftIcon={<Edit className="h-4 w-4" />}
              >
                Edit
              </Button>
            </Link>
          )}
          
          <Button
            variant="danger"
            isLoading={isDeleting}
            leftIcon={<Trash className="h-4 w-4" />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ItemDetails;