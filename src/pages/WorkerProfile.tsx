
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, Phone, Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageContainer from '@/components/PageContainer';
import { supabase } from '@/integrations/supabase/client';

interface WorkerData {
  id: string;
  name: string;
  profession?: string;
  service_category: string;
  rating?: number;
  reviews?: number;
  hourlyRate?: string;
  price_range: string;
  location?: string;
  city: string;
  distance?: string;
  availability?: string;
  bio?: string;
  about: string;
  skills?: string[];
  image?: string;
  profile_image_url: string | null;
  phone: string;
  experience: string;
}

interface Review {
  id: string;
  user_id: string;
  provider_id: string;
  rating: number;
  comment: string | null;
  created_at: string | null;
  username?: string;
}

const serviceCategories = {
  plumbing: 'Professional Plumber',
  electrical: 'Electrician',
  cleaning: 'Cleaning Professional',
  painting: 'Painter',
  carpentry: 'Carpenter',
  gardening: 'Gardener',
  appliances: 'Appliance Technician',
  roofing: 'Roofer',
  hvac: 'HVAC Technician',
  flooring: 'Flooring Expert',
};

const WorkerProfile = () => {
  const navigate = useNavigate();
  const { workerId } = useParams<{ workerId: string }>();
  const [worker, setWorker] = useState<WorkerData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        setLoading(true);
        
        if (!workerId) {
          console.error("No worker ID provided");
          return;
        }
        
        // Fetch worker data
        const { data: workerData, error: workerError } = await supabase
          .from('service_providers')
          .select('*')
          .eq('id', workerId)
          .eq('status', 'approved')
          .single();
          
        if (workerError) {
          console.error('Error fetching worker data:', workerError);
          return;
        }
        
        // Fetch reviews for this worker
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('provider_id', workerId);
          
        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        }
        
        // Calculate average rating
        let avgRating = 0;
        if (reviewsData && reviewsData.length > 0) {
          avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
        }
        
        // Set the worker data with additional information
        if (workerData) {
          setWorker({
            ...workerData,
            rating: parseFloat(avgRating.toFixed(1)),
            reviews: reviewsData?.length || 0,
            profession: serviceCategories[workerData.service_category as keyof typeof serviceCategories] || 
                      workerData.service_category.charAt(0).toUpperCase() + workerData.service_category.slice(1),
          });
          
          // Format reviews data with dates
          if (reviewsData) {
            const formattedReviews = reviewsData.map(review => {
              // Format the date
              const formattedDate = review.created_at ? 
                new Date(review.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : '';
                
              return {
                ...review,
                username: "User", // In a real app, you'd fetch the user's name
                created_at: formattedDate
              };
            });
            
            setReviews(formattedReviews);
          }
        }
      } catch (error) {
        console.error('Error in worker profile data fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkerData();
  }, [workerId]);
  
  if (loading) {
    return (
      <PageContainer transparent showHeader={false}>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-blue border-t-transparent"></div>
        </div>
      </PageContainer>
    );
  }
  
  if (!worker) {
    return (
      <PageContainer transparent showHeader={false}>
        <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Worker Profile Not Found</h2>
          <p className="text-gray-500 mb-6">The worker profile you're looking for might have been removed or is not available.</p>
          <Button 
            onClick={() => navigate('/services')}
            className="bg-brand-blue hover:bg-brand-blue/90"
          >
            Browse Services
          </Button>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer transparent showHeader={false}>
      {/* Header with back button and profile image */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 z-10 pt-safe-top">
          <div className="p-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-white/70 backdrop-blur-sm rounded-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft />
            </Button>
          </div>
        </div>
        
        <div className="h-48 bg-brand-blue" />
        
        <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 flex justify-center">
          <Avatar className="w-24 h-24 border-4 border-white">
            <AvatarImage 
              src={worker.profile_image_url || '/placeholder.svg'} 
              alt={worker.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            <AvatarFallback>{worker.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Profile content */}
      <div className="pt-16 px-4">
        {/* Worker info */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">{worker.name}</h1>
          <p className="text-gray-500">{worker.profession}</p>
          <div className="flex items-center justify-center mt-1">
            <Star className="text-yellow-500 fill-yellow-500 mr-1" size={16} />
            <span className="font-medium">{worker.rating || "New"}</span>
            <span className="text-gray-500 text-sm ml-1">({worker.reviews || 0} reviews)</span>
          </div>
          <div className="flex items-center justify-center mt-2">
            <Badge variant="outline" className="mr-2 bg-blue-50">{worker.price_range}</Badge>
            <Badge variant="outline" className="bg-green-50">Available for work</Badge>
          </div>
        </div>
        
        {/* Contact button */}
        <div className="mb-6">
          <Button className="w-full gap-2">
            <Phone size={16} /> Call Now
          </Button>
        </div>
        
        {/* Location info */}
        <div className="flex items-center mb-6">
          <MapPin className="text-gray-400 mr-2" size={18} />
          <div>
            <p className="text-sm">{worker.city}</p>
            <p className="text-xs text-gray-500">{worker.distance || "Distance unavailable"}</p>
          </div>
        </div>
        
        {/* Tabs for Bio, Reviews, etc. */}
        <Tabs defaultValue="about" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Bio</h3>
              <p className="text-sm text-gray-600">{worker.about}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Experience</h3>
              <p className="text-sm text-gray-600">{worker.experience}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {worker.skills ? (
                  worker.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">{skill}</Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="bg-gray-50">{worker.service_category}</Badge>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{review.username || "User"}</div>
                    <div className="text-xs text-gray-500">{review.created_at}</div>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{review.comment || "No comment provided."}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No reviews yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="availability" className="space-y-4">
            <div className="flex items-center mb-4">
              <Calendar className="text-brand-blue mr-2" size={18} />
              <div>
                <p className="font-medium">Available Days</p>
                <p className="text-sm text-gray-500">Monday - Saturday</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="text-brand-blue mr-2" size={18} />
              <div>
                <p className="font-medium">Working Hours</p>
                <p className="text-sm text-gray-500">9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default WorkerProfile;
