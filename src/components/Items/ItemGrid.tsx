import React from 'react';
import { Item } from '../../types';
import ItemCard from '../UI/ItemCard';
import Loading from '../UI/Loading';

interface ItemGridProps {
  items: Item[];
  isLoading: boolean;
}

const ItemGrid: React.FC<ItemGridProps> = ({ items, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-500">There are no items matching your criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ItemGrid;