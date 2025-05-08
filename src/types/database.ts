
import { Database as SupabaseDatabase } from '@/integrations/supabase/types';

// Adding service_categories to our Database type
export type Database = SupabaseDatabase;

// Type for service categories
export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
  // Add icon and color properties for UI rendering
  icon?: string;
  color?: string;
}

// Extended category type with UI properties
export interface UICategory extends Category {
  icon: string;
  color: string;
}
