import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ItemForm from '../components/Items/ItemForm';
import Card, { CardHeader, CardContent } from '../components/UI/Card';

const NewItemPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }
  
  const handleSuccess = () => {
    navigate('/myposts');
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Plus className="h-8 w-8 text-teal-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
      </div>
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Item Details</h2>
          <p className="text-gray-600 mt-1">
            Please provide as much information as possible to help others identify your item.
          </p>
        </CardHeader>
        <CardContent>
          <ItemForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewItemPage;