import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Authentication services
export const authService = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },
  
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  // Sign in with Google
  signInWithGoogle: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
  },
  
  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  
  // Get the current session
  getSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
  
  // Get the current user
  getUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }
};

// Item services
export const itemService = {
  // Create a new item
  createItem: async (item: Omit<any, 'id' | 'created_at' | 'updated_at'>) => {
    return await supabase
      .from('items')
      .insert(item)
      .select()
      .single();
  },
  
  // Get all items with optional filters
  getItems: async (status?: string, category?: string, searchQuery?: string) => {
    let query = supabase
      .from('items')
      .select(`
        *,
        profiles (
          id, full_name, avatar_url
        )
      `);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }
    
    return await query.order('created_at', { ascending: false });
  },
  
  // Get a single item by ID
  getItemById: async (id: string) => {
    return await supabase
      .from('items')
      .select(`
        *,
        profiles (
          id, full_name, avatar_url
        )
      `)
      .eq('id', id)
      .single();
  },
  
  // Get items by user ID
  getItemsByUserId: async (userId: string) => {
    return await supabase
      .from('items')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },
  
  // Update an item
  updateItem: async (id: string, updates: Partial<any>) => {
    return await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },
  
  // Delete an item
  deleteItem: async (id: string) => {
    return await supabase
      .from('items')
      .delete()
      .eq('id', id);
  },
  
  // Upload an image
  uploadImage: async (file: File, path: string) => {
    return await supabase
      .storage
      .from('item-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
  },
  
  // Get the public URL for an image
  getImageUrl: (path: string) => {
    const { data } = supabase
      .storage
      .from('item-images')
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
};

// Profile services
export const profileService = {
  // Get profile by user ID
  getProfileByUserId: async (userId: string) => {
    return await supabase
      .from('profiles')
      .select()
      .eq('id', userId)
      .single();
  },
  
  // Update profile
  updateProfile: async (userId: string, updates: any) => {
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
  }
};