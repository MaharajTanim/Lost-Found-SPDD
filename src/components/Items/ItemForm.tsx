import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { itemService } from '../../services/supabase';
import { ItemCategory, ItemStatus } from '../../types';
import Input from '../UI/Input';
import TextArea from '../UI/TextArea';
import Select from '../UI/Select';
import Button from '../UI/Button';

interface ItemFormProps {
  initialData?: any;
  onSuccess: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ initialData, onSuccess }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      category: '',
      status: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      contact_info: user?.email || '',
    },
  });
  
  const categoryOptions = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'documents', label: 'Documents' },
    { value: 'pets', label: 'Pets' },
    { value: 'other', label: 'Other' },
  ];
  
  const statusOptions = [
    { value: 'lost', label: 'Lost' },
    { value: 'found', label: 'Found' },
  ];
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error('You must be logged in to create a post');
      return;
    }
    
    setIsLoading(true);
    
    try {
      let imageUrl = initialData?.image_url || null;
      
      // Upload image if provided
      if (imageFile) {
        const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await itemService.uploadImage(imageFile, fileName);
        
        if (uploadError) {
          throw new Error(uploadError.message);
        }
        
        imageUrl = itemService.getImageUrl(fileName);
      }
      
      const itemData = {
        ...data,
        user_id: user.id,
        image_url: imageUrl,
      };
      
      let response;
      
      if (initialData?.id) {
        // Update existing item
        response = await itemService.updateItem(initialData.id, itemData);
        toast.success('Item updated successfully!');
      } else {
        // Create new item
        response = await itemService.createItem(itemData);
        toast.success('Item created successfully!');
      }
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save item');
      console.error('Error saving item:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Input
            id="title"
            label="Title"
            placeholder="Item name or brief description"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />
          
          <Select
            id="category"
            label="Category"
            options={categoryOptions}
            {...register('category', { required: 'Category is required' })}
            error={errors.category?.message}
          />
          
          <Select
            id="status"
            label="Status"
            options={statusOptions}
            {...register('status', { required: 'Status is required' })}
            error={errors.status?.message}
          />
          
          <Input
            id="date"
            label="Date"
            type="date"
            {...register('date', { required: 'Date is required' })}
            error={errors.date?.message}
          />
        </div>
        
        <div>
          <TextArea
            id="description"
            label="Description"
            placeholder="Detailed description of the item"
            {...register('description', { required: 'Description is required' })}
            error={errors.description?.message}
          />
          
          <Input
            id="location"
            label="Location"
            placeholder="Where was the item lost or found?"
            {...register('location', { required: 'Location is required' })}
            error={errors.location?.message}
          />
          
          <Input
            id="contact_info"
            label="Contact Information"
            placeholder="Email or phone number"
            {...register('contact_info', { required: 'Contact information is required' })}
            error={errors.contact_info?.message}
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-contain rounded-lg"
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, or JPEG (MAX. 2MB)</p>
                    </>
                  )}
                </div>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onSuccess()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          {initialData ? 'Update Item' : 'Create Item'}
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;