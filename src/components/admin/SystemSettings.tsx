
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Settings } from 'lucide-react';

const SystemSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'ServiceHub',
    maintenanceMode: false,
    allowRegistration: true,
    maxFileSize: '10',
    emailNotifications: true,
    autoApproval: false
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Save settings to system_settings table
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'app_settings',
          value: settings
        });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "System settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings size={20} />
          System Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            value={settings.siteName}
            onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
            placeholder="Enter site name"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Maintenance Mode</Label>
            <p className="text-sm text-gray-500">Temporarily disable the site for maintenance</p>
          </div>
          <Switch
            checked={settings.maintenanceMode}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Allow New Registrations</Label>
            <p className="text-sm text-gray-500">Allow new users to create accounts</p>
          </div>
          <Switch
            checked={settings.allowRegistration}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowRegistration: checked }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
          <Input
            id="maxFileSize"
            type="number"
            value={settings.maxFileSize}
            onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: e.target.value }))}
            placeholder="10"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-gray-500">Send system notifications via email</p>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-approve Providers</Label>
            <p className="text-sm text-gray-500">Automatically approve new service providers</p>
          </div>
          <Switch
            checked={settings.autoApproval}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoApproval: checked }))}
          />
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          <Save size={16} className="mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
