
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import EmptyState from './EmptyState';
import { Category } from '@/types/database';

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingCategory, setAddingCategory] = useState(false);
  const { toast } = useToast();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();

    // Set up real-time subscription for category changes
    const channel = supabase
      .channel('service-categories-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'service_categories' 
        }, 
        () => {
          fetchCategories(); // Refetch when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Use the correct table name from our database
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      // Map the data to our Category type
      const typedCategories: Category[] = data?.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        created_at: item.created_at,
        updated_at: item.updated_at
      })) || [];
      
      setCategories(typedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load service categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      setAddingCategory(true);
      const slug = newCategory.toLowerCase().replace(/\s+/g, '-');

      // Insert into the correct table
      const { error } = await supabase
        .from('service_categories')
        .insert({
          name: newCategory.trim(),
          slug: slug,
        });

      if (error) throw error;

      toast({
        title: 'Category added',
        description: `${newCategory} has been added successfully`,
      });
      
      setNewCategory('');
      // Categories will update via real-time subscription
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error',
        description: 'Failed to add category',
        variant: 'destructive',
      });
    } finally {
      setAddingCategory(false);
    }
  };

  const removeCategory = async (id: string, name: string) => {
    try {
      // Delete from the correct table
      const { error } = await supabase
        .from('service_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Category removed',
        description: `${name} has been removed successfully`,
      });
      
      // Categories will update via real-time subscription
    } catch (error) {
      console.error('Error removing category:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove category',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-brand-blue" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Manage Service Categories</h2>
      <Card className="p-4 mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={addCategory} 
            disabled={addingCategory || !newCategory.trim()}
          >
            {addingCategory ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Add
          </Button>
        </div>
      </Card>

      {categories.length > 0 ? (
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-gray-500">{category.slug}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCategory(category.id, category.name)}
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          message="No categories found"
          description="Add your first service category to get started"
        />
      )}
    </div>
  );
};

export default CategoryManager;
