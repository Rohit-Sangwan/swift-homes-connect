import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import { useSystemSettings } from '@/context/SystemSettingsContext';
import { Moon, Sun, Languages, Type, Bell, Shield } from 'lucide-react';

const AppSettingsPage = () => {
  const { toast } = useToast();
  const { darkMode, fontSize, language, setDarkMode, setFontSize, setLanguage } = useSystemSettings();
  
  const handleSettingChange = (setting: string, value: any) => {
    // Apply settings changes based on the SystemSettingsContext
    switch (setting) {
      case 'darkMode':
        setDarkMode(value);
        break;
      case 'fontSize':
        setFontSize(value);
        break;
      case 'language':
        setLanguage(value);
        break;
    }
    
    toast({
      title: "Setting Updated",
      description: "Your preferences have been saved.",
    });
  };

  // Map font size string to slider value
  const fontSizeMap = {
    'small': 12,
    'medium': 16,
    'large': 20
  };
  
  const fontSizeToSlider = (size: string) => {
    return fontSizeMap[size as keyof typeof fontSizeMap] || 16;
  };
  
  const sliderToFontSize = (value: number) => {
    if (value <= 13) return 'small';
    if (value <= 17) return 'medium';
    return 'large';
  };
  
  return (
    <PageContainer title="App Settings" showBack>
      <div className="p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="p-2 bg-brand-blue/10 rounded-full mr-3">
                <Sun size={16} className="text-brand-blue" />
              </div>
              Display
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-full mr-3">
                  {darkMode ? (
                    <Moon size={18} className="text-indigo-400" />
                  ) : (
                    <Sun size={18} className="text-amber-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500">Use dark theme</p>
                </div>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={(checked) => handleSettingChange('darkMode', checked)} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="p-2 rounded-full mr-3">
                  <Type size={18} className="text-brand-blue" />
                </div>
                <Label>Font Size</Label>
              </div>
              <div className="flex items-center space-x-4 px-4">
                <span className="text-sm">A</span>
                <Slider 
                  defaultValue={[fontSizeToSlider(fontSize)]} 
                  min={12} 
                  max={20} 
                  step={4}
                  onValueChange={(value) => handleSettingChange('fontSize', sliderToFontSize(value[0]))}
                  className="flex-1" 
                />
                <span className="text-lg">A</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="p-2 rounded-full mr-3">
                  <Languages size={18} className="text-brand-blue" />
                </div>
                <Label htmlFor="language">Language</Label>
              </div>
              <Select 
                value={language} 
                onValueChange={(value) => handleSettingChange('language', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                  <SelectItem value="bn">Bengali</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                  <SelectItem value="te">Telugu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="p-2 bg-brand-blue/10 rounded-full mr-3">
                <Bell size={16} className="text-brand-blue" />
              </div>
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive push notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email updates</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive SMS alerts</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="p-2 bg-brand-blue/10 rounded-full mr-3">
                <Shield size={16} className="text-brand-blue" />
              </div>
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Location Services</p>
                <p className="text-sm text-gray-500">Allow app to use your location</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data Collection</p>
                <p className="text-sm text-gray-500">Help improve the app with usage data</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
      <BottomNavigation />
    </PageContainer>
  );
};

export default AppSettingsPage;
