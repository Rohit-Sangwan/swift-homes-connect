
import React, { useState } from 'react';
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

const serviceCategories = [
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
];

const BecomeProvider = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(1);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [idProofImage, setIdProofImage] = useState<string | null>(null);
  
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
  
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleIdProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setIdProofImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = () => {
    toast({
      title: "Profile Submitted",
      description: "Your service provider profile is under review. We'll notify you once it's approved.",
      duration: 5000,
    });
    
    // Navigate back to profile page
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };
  
  const goToNextStep = () => {
    setActiveStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const goToPrevStep = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
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
                disabled={!idProofImage}
              >
                Submit Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default BecomeProvider;
