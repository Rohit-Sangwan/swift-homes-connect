
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Upload, Loader2 } from 'lucide-react';

interface ProfileEditorProps {
  providerId: string;
  initialName: string;
  initialPhone: string;
  initialImageUrl: string | null;
  onProfileUpdated: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  providerId,
  initialName,
  initialPhone,
  initialImageUrl,
  onProfileUpdated
}) => {
  const { toast } = useToast();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract username from name field (first part before space)
  const username = name.split(' ')[0] || name;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${providerId}/${fileName}`;
      
      // Upload the file to Supabase storage using the profiles bucket
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      if (publicUrlData) {
        setImageUrl(publicUrlData.publicUrl);
      }
      
      toast({
        title: "Image uploaded",
        description: "Your profile image has been successfully uploaded."
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhoneCall = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      toast({
        title: "No phone number",
        description: "Please add a phone number first.",
        variant: "destructive"
      });
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format the phone number based on length
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both name and phone number.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const updateData: any = {
        name,
        phone
      };
      
      // Only include image URL if it was changed
      if (imageUrl !== initialImageUrl) {
        updateData.profile_image_url = imageUrl;
      }
      
      const { error } = await supabase
        .from('service_providers')
        .update(updateData)
        .eq('id', providerId);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
      
      onProfileUpdated();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center mb-4">
        <div className="text-center mb-2">
          <h3 className="text-lg font-medium">{username}</h3>
          <p className="text-sm text-gray-500">Service Provider</p>
        </div>
        
        <Avatar className="w-24 h-24 mb-2">
          <AvatarImage 
            src={imageUrl || '/placeholder.svg'} 
            alt={name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => document.getElementById('profile-image-upload')?.click()}
            className="flex items-center"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Change Photo
              </>
            )}
          </Button>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
        <div className="flex gap-2">
          <Input
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Your phone number"
            className="flex-1"
          />
          <Button 
            type="button" 
            size="icon"
            variant="outline"
            onClick={handlePhoneCall}
            className="flex-none"
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-brand-blue hover:bg-brand-blue/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
};

export default ProfileEditor;
