import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, MapPin } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Category, UICategory } from '@/types/database';

interface Provider {
  id: string;
  name: string;
  service_category: string;
  profile_image_url: string | null;
  city: string;
  experience: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [serviceCategories, setServiceCategories] = useState<UICategory[]>([]);
  const [featuredWorkers, setFeaturedWorkers] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  useEffect(() => {
    fetchApprovedProviders();
    fetchCategories();
  }, []);
  
  const fetchApprovedProviders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_providers')
        .select('id, name, service_category, profile_image_url, city, experience')
        .eq('status', 'approved')
        .limit(3);
        
      if (error) {
        console.error('Error fetching providers:', error);
      } else if (data) {
        setFeaturedWorkers(data);
      }
    } catch (error) {
      console.error('Error in fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name', { ascending: true })
        .limit(8); // Limit to 8 categories for the grid display
        
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
        
        setServiceCategories(mappedCategories as UICategory[]);
      }
    } catch (error) {
      console.error('Error in fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };
  
  // Helper to get category name from id
  const getCategoryName = (categoryId: string) => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
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
    
    return iconMap[slug] || '🛠️'; // Default icon for unknown categories
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
      roofing: 'bg-sky-100',
      hvac: 'bg-cyan-100',
      flooring: 'bg-amber-100',
    };
    
    return colorMap[slug] || 'bg-gray-100'; // Default color for unknown categories
  };
  
  return (
    <PageContainer>
      <div className="px-4 py-4">
        {/* Search Bar */}
        <div 
          className="flex items-center bg-gray-100 rounded-full pl-4 pr-3 py-3 mb-8"
          onClick={() => navigate('/services')}
        >
          <Search size={18} className="text-gray-500 mr-3" />
          <span className="text-gray-500">Search for services...</span>
        </div>
        
        {/* Categories */}
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        {categoriesLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-blue border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 mb-8">
            {serviceCategories.map((category) => (
              <div 
                key={category.id} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => navigate(`/services/${category.slug}`)}
              >
                <div className={`w-14 h-14 ${category.color} rounded-full flex items-center justify-center mb-2 text-xl`}>
                  {category.icon}
                </div>
                <span className="text-xs text-center">{category.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Top Rated Professionals */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Top Rated Professionals</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-brand-blue flex items-center"
            onClick={() => navigate('/services')}
          >
            View all <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
        
        <div className="space-y-4 mb-8">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-blue border-t-transparent"></div>
            </div>
          ) : featuredWorkers.length > 0 ? (
            featuredWorkers.map(worker => (
              <div 
                key={worker.id} 
                className="bg-white rounded-xl p-4 flex items-center card-shadow animate-fade-in"
                onClick={() => navigate(`/workers/${worker.id}`)}
              >
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4">
                  {worker.profile_image_url ? (
                    <img 
                      src={worker.profile_image_url}
                      alt={worker.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500 text-xl">{worker.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{worker.name}</h3>
                  <p className="text-sm text-gray-500">{getCategoryName(worker.service_category)}</p>
                  <div className="flex items-center mt-1">
                    <MapPin size={12} className="text-gray-500 mr-1" />
                    <span className="text-xs text-gray-500">{worker.city}</span>
                    <span className="mx-1 text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{worker.experience}</span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-400" />
              </div>
            ))
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No service providers available yet</p>
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-4 border-2 border-brand-blue text-brand-blue bg-blue-50 hover:bg-blue-100"
            onClick={() => navigate('/become-provider')}
          >
            Become a Provider
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 border-2 border-brand-orange text-brand-orange bg-orange-50 hover:bg-orange-100"
            onClick={() => navigate('/profile')}
          >
            User Account
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
