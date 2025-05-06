
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  transparent?: boolean;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBack = false, 
  transparent = false,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState("San Francisco, CA");
  const [mapboxApiKey, setMapboxApiKey] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    // In a production app, we would get this from environment variables or Supabase secrets
    // For now, we'll use localStorage to demo functionality
    const savedApiKey = localStorage.getItem('mapbox_api_key');
    if (savedApiKey) {
      setMapboxApiKey(savedApiKey);
    }
  }, []);

  const handleBack = () => {
    if (location.pathname === "/") {
      return;
    }
    navigate(-1);
  };

  const handleLocationChange = (newLocation: string) => {
    setCurrentLocation(newLocation);
    setIsDialogOpen(false);
  };

  const handleLocationSearch = async () => {
    if (!mapboxApiKey || !locationInput.trim()) return;
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationInput)}.json?access_token=${mapboxApiKey}&types=place,locality,neighborhood`
      );
      
      const data = await response.json();
      
      if (data.features) {
        setSuggestions(data.features);
      }
    } catch (error) {
      console.error("Error searching locations:", error);
    }
  };

  const saveApiKey = () => {
    const input = document.getElementById('mapbox-api-key') as HTMLInputElement;
    if (input && input.value) {
      localStorage.setItem('mapbox_api_key', input.value);
      setMapboxApiKey(input.value);
    }
  };
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-10 w-full h-16 flex items-center justify-between px-4",
        transparent ? "bg-transparent" : "bg-white border-b border-gray-100",
        className
      )}
    >
      <div className="flex items-center">
        {showBack && (
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 mr-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
        )}
        {title && <h1 className="font-semibold text-lg">{title}</h1>}
      </div>
      
      <div className="flex items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center text-sm font-medium hover:bg-gray-100 px-2 py-1 rounded">
              <MapPin size={16} className="text-brand-blue mr-1" />
              <span>{currentLocation}</span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Set Your Location</DialogTitle>
            </DialogHeader>
            
            {!mapboxApiKey ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Please provide your Mapbox API key to enable location search.
                </p>
                <Input 
                  id="mapbox-api-key"
                  placeholder="Enter Mapbox API key"
                  type="password"
                />
                <Button onClick={saveApiKey}>Save API Key</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search for a location..."
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && handleLocationSearch()}
                  />
                  <Button onClick={handleLocationSearch}>Search</Button>
                </div>
                
                {suggestions.length > 0 && (
                  <div className="max-h-56 overflow-y-auto divide-y">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        className="w-full text-left py-2 px-3 hover:bg-gray-100 transition-colors"
                        onClick={() => handleLocationChange(suggestion.place_name)}
                      >
                        <div className="font-medium">{suggestion.text}</div>
                        <div className="text-xs text-gray-500">{suggestion.place_name}</div>
                      </button>
                    ))}
                  </div>
                )}
                
                {suggestions.length === 0 && locationInput && (
                  <div className="text-center py-4 text-gray-500">
                    No locations found. Try a different search term.
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        <button className="p-2 rounded-full hover:bg-gray-100 ml-2">
          <Bell size={20} className="text-gray-700" />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
