
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Star, Phone, MapPin, Calendar, Clock, Award, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Mock worker data
const workerData = {
  'p1': {
    id: 'p1',
    name: 'John Smith',
    service: 'Plumbing',
    experience: '8 years',
    rating: 4.8,
    reviews: 124,
    price: '₹500-1000/hr',
    distance: '2.3 km',
    image: '/placeholder.svg',
    about: 'Professional plumber with expertise in fixing leaks, installations, and maintenance of water systems. Licensed and insured with a focus on quality workmanship.',
    phone: '+91 9876543210',
    availability: 'Mon-Sat, 8AM-7PM',
    languages: ['English', 'Hindi'],
    servicesOffered: [
      'Leak Repairs', 
      'Pipe Installation', 
      'Drain Cleaning', 
      'Fixture Installation', 
      'Water Heater Repair'
    ],
    reviews: [
      { id: 1, user: 'Rahul M.', rating: 5, date: '2 weeks ago', comment: 'John fixed our leaky faucet quickly and efficiently. Highly recommend!' },
      { id: 2, user: 'Anita S.', rating: 4, date: '1 month ago', comment: 'Fixed our bathroom sink. Good service but arrived a little late.' },
      { id: 3, user: 'Vikram J.', rating: 5, date: '2 months ago', comment: 'Very knowledgeable and professional. Explained everything clearly.' },
    ]
  },
  'e1': {
    id: 'e1',
    name: 'David Lee',
    service: 'Electrical',
    experience: '7 years',
    rating: 4.7,
    reviews: 92,
    price: '₹500-900/hr',
    distance: '1.5 km',
    image: '/placeholder.svg',
    about: 'Certified electrician specializing in residential electrical repairs, installations, and troubleshooting. Safety-focused with attention to detail.',
    phone: '+91 8765432109',
    availability: 'Mon-Fri, 9AM-6PM',
    languages: ['English', 'Tamil'],
    servicesOffered: [
      'Wiring Installation', 
      'Electrical Repairs', 
      'Light Fixture Installation', 
      'Circuit Breaker Repair', 
      'Fan Installation'
    ],
    reviews: [
      { id: 1, user: 'Priya K.', rating: 5, date: '3 weeks ago', comment: 'David installed new lighting in our kitchen. Very neat work!' },
      { id: 2, user: 'Rajesh T.', rating: 4, date: '2 months ago', comment: 'Fixed our electrical issues efficiently. Fair pricing.' },
    ]
  },
  'c1': {
    id: 'c1',
    name: 'Maria Garcia',
    service: 'Cleaning',
    experience: '6 years',
    rating: 4.9,
    reviews: 87,
    price: '₹300-600/hr',
    distance: '2.8 km',
    image: '/placeholder.svg',
    about: 'Professional house cleaner with expertise in deep cleaning, regular maintenance, and organizing. Uses eco-friendly products upon request.',
    phone: '+91 7654321098',
    availability: 'Mon-Sun, 7AM-8PM',
    languages: ['English', 'Hindi', 'Spanish'],
    servicesOffered: [
      'Deep Cleaning', 
      'Regular Maintenance', 
      'Move-in/Move-out Cleaning', 
      'Office Cleaning', 
      'Post-Construction Cleaning'
    ],
    reviews: [
      { id: 1, user: 'Neha G.', rating: 5, date: '1 week ago', comment: 'Maria is thorough and detail-oriented. Our house has never been cleaner!' },
      { id: 2, user: 'Samir P.', rating: 5, date: '1 month ago', comment: 'Excellent service. Very reliable and professional.' },
    ]
  }
};

const WorkerProfile = () => {
  const { workerId = 'p1' } = useParams<{ workerId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  
  // Get worker data or use a default if not found
  const worker = workerData[workerId as keyof typeof workerData] || workerData.p1;
  
  return (
    <PageContainer showBack transparent>
      {/* Header Section with Profile */}
      <div className="bg-brand-blue text-white pt-4 pb-6 px-4 rounded-b-3xl">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-white rounded-full overflow-hidden mr-4 border-2 border-white">
            <img 
              src={worker.image} 
              alt={worker.name}
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{worker.name}</h2>
            <p className="opacity-90">{worker.service} Expert</p>
            <div className="flex items-center mt-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">{worker.rating}</span>
              <span className="ml-1 opacity-80">({worker.reviews} reviews)</span>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="icon"
            className="bg-white/20 hover:bg-white/30 text-white"
            onClick={() => alert('Shared profile!')}
          >
            <Share2 size={18} />
          </Button>
        </div>
        
        <div className="flex mt-6 gap-2">
          <Button className="flex-1 bg-brand-orange hover:bg-brand-orange/90">
            <Phone size={18} className="mr-2" />
            Call Now
          </Button>
          <Button variant="secondary" className="flex-1 bg-white/20 hover:bg-white/30 text-white">
            <Calendar size={18} className="mr-2" />
            Save Contact
          </Button>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid grid-cols-3 mb-2 mx-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="px-4 animate-fade-in">
          <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100 card-shadow">
            <h3 className="font-medium mb-2">About</h3>
            <p className="text-sm text-gray-600">{worker.about}</p>
            
            <div className="mt-4 space-y-3">
              <div className="flex">
                <MapPin size={18} className="text-brand-blue mr-3" />
                <div className="text-sm">{worker.distance} away</div>
              </div>
              <div className="flex">
                <Clock size={18} className="text-brand-blue mr-3" />
                <div className="text-sm">{worker.availability}</div>
              </div>
              <div className="flex">
                <Award size={18} className="text-brand-blue mr-3" />
                <div className="text-sm">{worker.experience} experience</div>
              </div>
              <div className="flex">
                <User size={18} className="text-brand-blue mr-3" />
                <div className="text-sm">Languages: {worker.languages?.join(', ')}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-100 card-shadow">
            <h3 className="font-medium mb-2">Contact Information</h3>
            <Button className="w-full bg-brand-orange hover:bg-brand-orange/90">
              <Phone size={16} className="mr-2" />
              {worker.phone}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="px-4 animate-fade-in">
          <div className="bg-white rounded-xl p-4 border border-gray-100 card-shadow">
            <h3 className="font-medium mb-3">Services Offered</h3>
            <div className="space-y-2">
              {worker.servicesOffered?.map((service, index) => (
                <div key={index} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 bg-brand-blue rounded-full mr-3"></div>
                  <span>{service}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Pricing</h4>
              <p className="text-sm text-gray-600">Starting at {worker.price}</p>
              <p className="text-xs text-gray-500 mt-1">
                *Final price may vary based on job complexity and materials required
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="px-4 animate-fade-in">
          <div className="bg-white rounded-xl p-4 border border-gray-100 card-shadow mb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Ratings & Reviews</h3>
              <div className="flex items-center">
                <Star size={16} className="fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{worker.rating}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {worker.reviews?.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-4 border border-gray-100 card-shadow">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{review.user}</h4>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                    />
                  ))}
                </div>
                
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default WorkerProfile;
