export type ItemCategory = 
  | 'electronics'
  | 'clothing'
  | 'accessories'
  | 'documents'
  | 'pets'
  | 'other';

export type ItemStatus = 'lost' | 'found' | 'resolved';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  status: ItemStatus;
  date: string;
  location: string;
  contact_info: string;
  image_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_admin: boolean;
}

export interface AuthState {
  user: Profile | null;
  session: any | null;
  isLoading: boolean;
}