
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, Phone, Calendar, Clock, MapPin, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageContainer from '@/components/PageContainer';

// Sample worker data
const workerData = {
  id: "1",
  name: "John Smith",
  profession: "Professional Plumber",
  rating: 4.8,
  reviews: 124,
  hourlyRate: "$45",
  location: "San Francisco, CA",
  distance: "2.5 miles away",
  availability: "Available today",
  bio: "Experienced plumber with over 10 years in residential and commercial plumbing. Specializing in repairs, installations, and maintenance.",
  skills: ["Pipe Fitting", "Leak Repair", "Drain Cleaning", "Water Heater Installation"],
  image: "/placeholder.svg",
  phone: "+1 (555) 123-4567",
};

// Sample reviews data
const reviewsData = [
  {
    id: 1,
    user: "Sarah Johnson",
    rating: 5,
    date: "June 15, 2023",
    comment: "John did an amazing job fixing our kitchen sink. He was prompt, professional, and even cleaned up afterwards. Highly recommend!"
  },
  {
    id: 2,
    user: "Mike Peterson",
    rating: 4,
    date: "May 22, 2023",
    comment: "Fixed my leaky faucet quickly. Good service at a fair price."
  },
  {
    id: 3,
    user: "Emma Wilson",
    rating: 5,
    date: "April 10, 2023",
    comment: "Very knowledgeable and professional. Solved a complex plumbing issue that two other plumbers couldn't figure out."
  }
];

const WorkerProfile = () => {
  const navigate = useNavigate();
  const { workerId } = useParams();
  
  // In a real app, we would fetch the worker data based on the workerId
  
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
            <AvatarImage src={workerData.image} alt={workerData.name} />
            <AvatarFallback>{workerData.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Profile content */}
      <div className="pt-16 px-4">
        {/* Worker info */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">{workerData.name}</h1>
          <p className="text-gray-500">{workerData.profession}</p>
          <div className="flex items-center justify-center mt-1">
            <Star className="text-yellow-500 fill-yellow-500 mr-1" size={16} />
            <span className="font-medium">{workerData.rating}</span>
            <span className="text-gray-500 text-sm ml-1">({workerData.reviews} reviews)</span>
          </div>
          <div className="flex items-center justify-center mt-2">
            <Badge variant="outline" className="mr-2 bg-blue-50">{workerData.hourlyRate}/hr</Badge>
            <Badge variant="outline" className="bg-green-50">{workerData.availability}</Badge>
          </div>
        </div>
        
        {/* Contact button */}
        <div className="flex gap-2 mb-6">
          <Button className="flex-1 gap-2">
            <Phone size={16} /> Call Now
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <MessageSquare size={16} /> Message
          </Button>
        </div>
        
        {/* Location info */}
        <div className="flex items-center mb-6">
          <MapPin className="text-gray-400 mr-2" size={18} />
          <div>
            <p className="text-sm">{workerData.location}</p>
            <p className="text-xs text-gray-500">{workerData.distance}</p>
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
              <p className="text-sm text-gray-600">{workerData.bio}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {workerData.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50">{skill}</Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            {reviewsData.map(review => (
              <div key={review.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{review.user}</div>
                  <div className="text-xs text-gray-500">{review.date}</div>
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
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
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
