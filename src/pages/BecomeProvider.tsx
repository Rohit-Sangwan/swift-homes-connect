
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Camera, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const BecomeProvider = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [idProofImage, setIdProofImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<{id: string, name: string}[]>([]);
  const [userData, setUserData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    serviceCategory: '',
    experience: '',
    priceRange: '',
    about: '',
  });
  
  useEffect(() => {
    // Check if user is authenticated and fetch categories
    const initialization = async () => {
      try {
        // Check authentication
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          toast({
            title: "Authentication Required",
            description: "Please log in to continue",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }
        
        // Store user data
        setUserData(data.session.user);
        
        // Fetch service categories from database
        const { data: categoriesData, error } = await supabase
          .from('service_categories')
          .select('*')
          .order('name');
          
        if (error) {
          throw error;
        }
        
        if (categoriesData && categoriesData.length > 0) {
          setServiceCategories(categoriesData);
        } else {
          // Fallback if no categories in database
          setServiceCategories([
            { id: 'plumbing', name: 'Plumbing' },
            { id: 'electrical', name: 'Electrical' },
            { id: 'cleaning', name: 'Cleaning' },
            { id: 'painting', name: 'Painting' },
            { id: 'carpentry', name: 'Carpentry' },
            { id: 'gardening', name: 'Gardening' },
            { id: 'appliances', name: 'Appliances' },
            { id: 'roofing', name: 'Roofing' },
            { id: 'hvac', name: 'HVAC' },
            { id: 'flooring', name: 'Flooring' },
          ]);
        }
      } catch (error) {
        console.error("Error during initialization:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    initialization();
  }, [navigate, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleIdProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setIdProofImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Function to upload image to Supabase Storage
  const uploadImage = async (imagePath: string, imageData: string): Promise<string | null> => {
    try {
      if (!imageData) return null;
      
      // Remove the data URL prefix to get just the base64 data
      const base64Data = imageData.split(',')[1];
      if (!base64Data) return null;
      
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Create a unique file path
      const fileName = `${userId}_${Date.now()}_${imagePath}`;
      const filePath = `providers/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('provider_images')
        .upload(filePath, blob, { contentType: 'image/jpeg' });
      
      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage.from('provider_images').getPublicUrl(filePath);
      return urlData.publicUrl;
      
    } catch (error) {
      console.error('Error in image upload:', error);
      return null;
    }
  };
  
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      
      if (!userId) {
        toast({
          title: "Authentication Error",
          description: "Please log in and try again",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }
      
      // Upload images if available
      let profileImageUrl = null;
      let idProofUrl = null;
      
      if (profileImage) {
        profileImageUrl = await uploadImage('profile.jpg', profileImage);
        if (!profileImageUrl) {
          toast({
            title: "Upload Error",
            description: "Failed to upload profile image. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }
      
      if (idProofImage) {
        idProofUrl = await uploadImage('id_proof.jpg', idProofImage);
        if (!idProofUrl) {
          toast({
            title: "Upload Error",
            description: "Failed to upload ID proof. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Check if user already has a provider profile
      const { data: existingProvider } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', userId)
        .single();
        
      if (existingProvider) {
        toast({
          title: "Profile Exists",
          description: "You already have a service provider profile.",
          variant: "destructive",
        });
        navigate('/profile');
        return;
      }
      
      // Insert provider data into Supabase
      const { error } = await supabase
        .from('service_providers')
        .insert({
          user_id: userId,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          service_category: formData.serviceCategory,
          experience: formData.experience,
          price_range: formData.priceRange,
          about: formData.about,
          profile_image_url: profileImageUrl,
          id_proof_url: idProofUrl,
          status: 'pending'
        });
      
      if (error) {
        console.error('Error submitting provider data:', error);
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your application. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Profile Submitted",
        description: "Your service provider profile is under review. We'll notify you once it's approved.",
        duration: 5000,
      });
      
      // Navigate back to profile page
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const goToNextStep = () => {
    setActiveStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const goToPrevStep = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    // Pre-fill form with user data if available
    if (userData) {
      const userMetadata = userData.user_metadata || {};
      setFormData(prev => ({
        ...prev,
        name: userMetadata.full_name || userData.user_metadata?.name || '',
        phone: userMetadata.phone || '',
      }));
    }
  }, [userData]);
  
  return (
    <PageContainer title="Become a Provider" showBack>
      <div className="p-4">
        {/* Progress indicator */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <div className="h-1 bg-gray-200 rounded-full">
              <div 
                className="h-1 bg-brand-blue rounded-full transition-all duration-300" 
                style={{ width: `${(activeStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>
          <span className="text-xs font-medium ml-3">Step {activeStep} of 3</span>
        </div>
        
        {/* Step 1: Personal Information */}
        {activeStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-semibold mb-1">Personal Information</h2>
              <p className="text-sm text-gray-500">Fill in your basic details</p>
            </div>
            
            {/* Profile Photo Upload */}
            <div className="flex flex-col items-center">
              <div 
                className="w-24 h-24 rounded-full bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 mb-2 overflow-hidden"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera size={24} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add Photo</span>
                  </>
                )}
              </div>
              
              <label className="inline-flex items-center text-sm text-brand-blue cursor-pointer">
                <Upload size={14} className="mr-1" />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageUpload}
                />
              </label>
            </div>
            
            {/* Personal Details Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This number will be used for service requests
                </p>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Your address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Your city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <Button 
              className="w-full"
              onClick={goToNextStep}
              disabled={!formData.name || !formData.phone || !formData.city}
            >
              Continue <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        )}
        
        {/* Step 2: Service Information */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-semibold mb-1">Service Details</h2>
              <p className="text-sm text-gray-500">Tell us about your services</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="serviceCategory">Service Category</Label>
                <Select
                  value={formData.serviceCategory}
                  onValueChange={(value) => handleSelectChange('serviceCategory', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a service category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) => handleSelectChange('experience', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select years of experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<1">Less than 1 year</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priceRange">Price Range (per hour)</Label>
                <Select
                  value={formData.priceRange}
                  onValueChange={(value) => handleSelectChange('priceRange', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="₹200-400">₹200-400</SelectItem>
                    <SelectItem value="₹400-600">₹400-600</SelectItem>
                    <SelectItem value="₹600-800">₹600-800</SelectItem>
                    <SelectItem value="₹800-1000">₹800-1000</SelectItem>
                    <SelectItem value="₹1000+">₹1000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="about">About Your Services</Label>
                <Textarea
                  id="about"
                  name="about"
                  placeholder="Describe your services and expertise..."
                  value={formData.about}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={goToPrevStep}
              >
                Back
              </Button>
              <Button 
                className="flex-1"
                onClick={goToNextStep}
                disabled={!formData.serviceCategory || !formData.experience || !formData.about}
              >
                Continue <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 3: Verification */}
        {activeStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-semibold mb-1">Verification</h2>
              <p className="text-sm text-gray-500">Upload ID proof for verification</p>
            </div>
            
            {/* ID Proof Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {idProofImage ? (
                <div>
                  <div className="relative w-full h-40 mb-3">
                    <img src={idProofImage} alt="ID Proof" className="w-full h-full object-contain" />
                    <div className="absolute top-2 right-2 bg-green-100 text-green-600 rounded-full p-1">
                      <Check size={16} />
                    </div>
                  </div>
                  <p className="text-green-600 text-sm font-medium">ID Proof Uploaded</p>
                </div>
              ) : (
                <>
                  <Upload size={32} className="text-gray-400 mb-2 mx-auto" />
                  <p className="mb-2">Upload ID Proof</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Please upload your government ID (Aadhaar, PAN, Driver's License, etc.)
                  </p>
                  <label className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">
                    <Upload size={14} className="mr-2" />
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleIdProofUpload}
                    />
                  </label>
                </>
              )}
            </div>
            
            {/* Terms and Conditions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                By submitting your profile, you agree to our Terms of Service and Privacy Policy. 
                Your profile will be reviewed before being approved.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={goToPrevStep}
              >
                Back
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSubmit}
                disabled={!idProofImage || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Profile"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default BecomeProvider;
