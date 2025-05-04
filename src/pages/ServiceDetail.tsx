
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Filter, SortAsc } from 'lucide-react';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data for service providers
const mockProviders = {
  plumbing: [
    { id: 'p1', name: 'John Smith', experience: '8 years', rating: 4.8, reviews: 124, price: '₹500-1000/hr', distance: '2.3 km', image: '/placeholder.svg' },
    { id: 'p2', name: 'Raj Kumar', experience: '5 years', rating: 4.5, reviews: 78, price: '₹400-800/hr', distance: '3.5 km', image: '/placeholder.svg' },
    { id: 'p3', name: 'Sanjay Patel', experience: '10 years', rating: 4.9, reviews: 156, price: '₹600-1200/hr', distance: '1.8 km', image: '/placeholder.svg' },
  ],
  electrical: [
    { id: 'e1', name: 'David Lee', experience: '7 years', rating: 4.7, reviews: 92, price: '₹500-900/hr', distance: '1.5 km', image: '/placeholder.svg' },
    { id: 'e2', name: 'Vikram Singh', experience: '12 years', rating: 4.9, reviews: 210, price: '₹700-1300/hr', distance: '4.2 km', image: '/placeholder.svg' },
  ],
  cleaning: [
    { id: 'c1', name: 'Maria Garcia', experience: '6 years', rating: 4.9, reviews: 87, price: '₹300-600/hr', distance: '2.8 km', image: '/placeholder.svg' },
    { id: 'c2', name: 'Priya Sharma', experience: '4 years', rating: 4.6, reviews: 63, price: '₹250-500/hr', distance: '3.1 km', image: '/placeholder.svg' },
  ],
  painting: [
    { id: 'pt1', name: 'Ravi Verma', experience: '9 years', rating: 4.7, reviews: 118, price: '₹400-800/day', distance: '5.2 km', image: '/placeholder.svg' },
  ],
  carpentry: [
    { id: 'cp1', name: 'Mohammed Ali', experience: '15 years', rating: 4.8, reviews: 142, price: '₹600-1100/day', distance: '3.7 km', image: '/placeholder.svg' },
  ],
  gardening: [
    { id: 'g1', name: 'Suresh Kumar', experience: '8 years', rating: 4.6, reviews: 79, price: '₹350-700/day', distance: '2.9 km', image: '/placeholder.svg' },
  ],
  appliances: [
    { id: 'a1', name: 'Amit Patel', experience: '6 years', rating: 4.5, reviews: 64, price: '₹500-900/hr', distance: '4.5 km', image: '/placeholder.svg' },
  ],
  roofing: [
    { id: 'r1', name: 'Harish Mehta', experience: '11 years', rating: 4.7, reviews: 93, price: '₹800-1500/day', distance: '6.1 km', image: '/placeholder.svg' },
  ],
  hvac: [
    { id: 'h1', name: 'Prakash Joshi', experience: '9 years', rating: 4.8, reviews: 87, price: '₹700-1200/hr', distance: '3.8 km', image: '/placeholder.svg' },
  ],
  flooring: [
    { id: 'f1', name: 'Deepak Shah', experience: '7 years', rating: 4.6, reviews: 72, price: '₹500-1000/day', distance: '5.5 km', image: '/placeholder.svg' },
  ],
};

// Map icons to category names
const categoryIcons = {
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

const ServiceDetail = () => {
  const { serviceId = 'plumbing' } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  
  // Format service name with proper capitalization
  const serviceName = serviceId.charAt(0).toUpperCase() + serviceId.slice(1);
  
  // Get providers for this service, defaulting to plumbing if not found
  const providers = mockProviders[serviceId as keyof typeof mockProviders] || mockProviders.plumbing;
  
  return (
    <PageContainer title={serviceName} showBack>
      <div className="p-4">
        {/* Service Header */}
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-xl`}>
            {categoryIcons[serviceId as keyof typeof categoryIcons] || '🔧'}
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
              <Badge variant="outline" className="bg-white">Rating 4.5+</Badge>
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
        <div className="space-y-4">
          {providers.map((provider) => (
            <div 
              key={provider.id} 
              className="bg-white rounded-xl p-4 border border-gray-100 soft-shadow animate-slide-up"
              onClick={() => navigate(`/workers/${provider.id}`)}
            >
              <div className="flex mb-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4">
                  <img 
                    src={provider.image} 
                    alt={provider.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{provider.name}</h3>
                  <p className="text-sm text-gray-500">{serviceName} Expert • {provider.experience}</p>
                  <div className="flex items-center mt-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium ml-1">{provider.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({provider.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{provider.price}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin size={12} className="mr-1" />
                      {provider.distance} away
                    </div>
                  </div>
                  <Button className="bg-brand-orange hover:bg-brand-orange/90 flex items-center">
                    <Phone size={14} className="mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {providers.length === 0 && (
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
    </PageContainer>
  );
};

export default ServiceDetail;
