import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Item } from '../../types';
import Card from './Card';
import { MapPin, Calendar } from 'lucide-react';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const statusColor = item.status === 'lost' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';
  
  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={item.image_url || 'https://images.pexels.com/photos/8108086/pexels-photo-8108086.jpeg'}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-2 right-2 ${statusColor} px-2 py-1 rounded-md text-xs font-semibold uppercase`}>
          {item.status}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{item.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{format(new Date(item.date), 'MMM d, yyyy')}</span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
        
        <Link
          to={`/item/${item.id}`}
          className="inline-block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </Card>
  );
};

export default ItemCard;