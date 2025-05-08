
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Filter, SortAsc, Loader2 } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types/database';

// Map icons to category names
const categoryIcons: { [key: string]: string } = {
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

interface Provider {
  id: string;
  name: string;
  experience: string;
  price_range: string;
  city: string;
  profile_image_url: string | null;
}

const ServiceDetail = () => {
  const { serviceId = 'plumbing' } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  
  useEffect(() => {
    fetchCategoryInfo();
    fetchProvidersByCategory();
  }, [serviceId]);
  
  const fetchCategoryInfo = async () => {
    try {
      // First try to fetch the category by slug
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('slug', serviceId)
        .single();
        
      if (error) {
        // If not found by slug, try by ID
        const { data: dataById, error: errorById } = await supabase
          .from('service_categories')
          .select('*')
          .eq('id', serviceId)
          .single();
          
        if (!errorById && dataById) {
          setCategoryInfo(dataById);
        } else {
          // Fallback to creating a category object from the serviceId
          setCategoryInfo({
            id: serviceId,
            slug: serviceId,
            name: serviceId.charAt(0).toUpperCase() + serviceId.slice(1)
          });
        }
      } else {
        setCategoryInfo(data);
      }
    } catch (error) {
      console.error('Error fetching category info:', error);
    }
  };
  
  const fetchProvidersByCategory = async () => {
    try {
      setLoading(true);
      
      // Try to find category ID first if we have a slug
      let categoryId = serviceId;
      const { data: categoryData } = await supabase
        .from('service_categories')
        .select('id')
        .eq('slug', serviceId)
        .single();
        
      if (categoryData) {
        categoryId = categoryData.id;
      }
      
      // Fetch providers using category ID
      const { data, error } = await supabase
        .from('service_providers')
        .select('id, name, experience, price_range, city, profile_image_url')
        .eq('status', 'approved')
        .eq('service_category', categoryId);
        
      if (error) {
        console.error('Error fetching providers:', error);
      } else {
        setProviders(data || []);
      }
    } catch (error) {
      console.error('Error in fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const serviceName = categoryInfo?.name || serviceId.charAt(0).toUpperCase() + serviceId.slice(1);
  const serviceIcon = categoryIcons[categoryInfo?.slug as keyof typeof categoryIcons] || '🔧';
  
  return (
    <PageContainer title={serviceName} showBack>
      <div className="p-4">
        {/* Service Header */}
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-xl`}>
            {serviceIcon}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{serviceName} Services</h1>
            <p className="text-sm text-gray-500">{providers.length} providers available</p>
          </div>
        </div>
        
        {/* Filter & Sort */}
        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <SortAsc size={16} className="mr-2" />
            Sort by
          </Button>
          <Button variant="outline" size="sm" className="ml-auto">
            <MapPin size={16} className="mr-2" />
            Near Me
          </Button>
        </div>
        
        {/* Filters panel (collapsible) */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4 animate-fade-in">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white">Within 5km</Badge>
              <Badge variant="outline" className="bg-white">Available Today</Badge>
              <Badge variant="outline" className="bg-white">Price: Low to High</Badge>
              <Button variant="ghost" size="sm" className="text-brand-blue text-xs">
                Clear All
              </Button>
            </div>
          </div>
        )}
        
        {/* Service Provider List */}
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin h-8 w-8 text-brand-blue" />
          </div>
        ) : (
          <div className="space-y-4">
            {providers.length > 0 ? (
              providers.map((provider) => (
                <div 
                  key={provider.id} 
                  className="bg-white rounded-xl p-4 border border-gray-100 soft-shadow animate-slide-up"
                  onClick={() => navigate(`/workers/${provider.id}`)}
                >
                  <div className="flex mb-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4">
                      {provider.profile_image_url ? (
                        <img 
                          src={provider.profile_image_url}
                          alt={provider.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-500 text-xl">{provider.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{provider.name}</h3>
                      <p className="text-sm text-gray-500">{serviceName} Expert • {provider.experience}</p>
                      <div className="flex items-center mt-1">
                        <MapPin size={12} className="text-gray-500 mr-1" />
                        <span className="text-xs text-gray-500">{provider.city}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{provider.price_range}</p>
                      </div>
                      <Button className="bg-brand-orange hover:bg-brand-orange/90 flex items-center">
                        <Phone size={14} className="mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No providers found for this service in your area.</p>
                <Button 
                  variant="link" 
                  className="text-brand-blue"
                  onClick={() => navigate('/services')}
                >
                  Browse other services
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default ServiceDetail;
