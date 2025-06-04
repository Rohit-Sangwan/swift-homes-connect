
import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageContainer from '@/components/PageContainer';
import { supabase } from '@/integrations/supabase/client';
import { Category, UICategory } from '@/types/database';

const ServicesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<UICategory[]>([]);
  const [loading, setLoading] = useState(true);
  
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
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      if (data) {
        // Map the data to include icons and colors
        const mappedCategories = data.map(category => ({
          ...category,
          icon: getCategoryIcon(category.slug),
          color: getCategoryColor(category.slug)
        }));
        
        setCategories(mappedCategories as UICategory[]);
      }
    } catch (error) {
      console.error('Error in fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get category icon
  const getCategoryIcon = (slug: string) => {
    const iconMap: { [key: string]: string } = {
      plumbing: '🔧',
      electrical: '⚡',
      cleaning: '🧹',
      painting: '🎨',
      carpentry: '🪚',
      gardening: '🌱',
      appliances: '🔌',
      roofing: '🏠',
      hvac: '❄️',
      flooring: '🧱',
    };
    
    return iconMap[slug] || '🛠️';
  };
  
  // Helper to get category color
  const getCategoryColor = (slug: string) => {
    const colorMap: { [key: string]: string } = {
      plumbing: 'bg-blue-100',
      electrical: 'bg-yellow-100',
      cleaning: 'bg-green-100',
      painting: 'bg-purple-100',
      carpentry: 'bg-orange-100',
      gardening: 'bg-lime-100',
      appliances: 'bg-red-100',
      roofing: 'bg-teal-100',
      hvac: 'bg-indigo-100',
      flooring: 'bg-rose-100',
    };
    
    return colorMap[slug] || 'bg-gray-100';
  };
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <PageContainer title="Services" showBack>
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Categories Grid */}
        <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-blue border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredCategories.map(category => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center cursor-pointer animate-fade-in hover:shadow-md transition-shadow"
                onClick={() => navigate(`/services/${category.slug}`)}
              >
                <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mr-4 text-xl`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-xs text-gray-500">Find local experts</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredCategories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No services found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default ServicesPage;
