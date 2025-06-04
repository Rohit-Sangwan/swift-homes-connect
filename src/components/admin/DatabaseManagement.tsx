
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database, RefreshCw, Trash2, Download, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const DatabaseManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const fetchDatabaseStats = async () => {
    try {
      setLoading(true);
      
      const [providersResult, categoriesResult, reviewsResult] = await Promise.all([
        supabase.from('service_providers').select('id', { count: 'exact' }),
        supabase.from('service_categories').select('id', { count: 'exact' }),
        supabase.from('reviews').select('id', { count: 'exact' })
      ]);

      setStats({
        providers: providersResult.count || 0,
        categories: categoriesResult.count || 0,
        reviews: reviewsResult.count || 0
      });

      toast({
        title: "Database Stats Updated",
        description: "Latest database statistics have been fetched.",
      });
    } catch (error) {
      console.error("Error fetching database stats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch database statistics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      setLoading(true);
      
      const { data: providers, error } = await supabase
        .from('service_providers')
        .select('*');

      if (error) throw error;

      const dataStr = JSON.stringify(providers, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `providers_export_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Data has been exported successfully.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cleanupData = async () => {
    try {
      setLoading(true);
      
      // Delete rejected providers older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { error } = await supabase
        .from('service_providers')
        .delete()
        .eq('status', 'rejected')
        .lt('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;

      toast({
        title: "Cleanup Complete",
        description: "Old rejected applications have been removed.",
      });
    } catch (error) {
      console.error("Error cleaning up data:", error);
      toast({
        title: "Cleanup Failed",
        description: "Failed to cleanup data. Please try again.",
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
          <Database size={20} />
          Database Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.providers}</p>
              <p className="text-sm text-gray-600">Providers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.categories}</p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.reviews}</p>
              <p className="text-sm text-gray-600">Reviews</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          <Button 
            onClick={fetchDatabaseStats} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh Database Stats
          </Button>

          <Button 
            onClick={exportData} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            <Download size={16} className="mr-2" />
            Export Provider Data
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full text-orange-600 border-orange-200">
                <Trash2 size={16} className="mr-2" />
                Cleanup Old Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="text-orange-500" size={20} />
                  Confirm Data Cleanup
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all rejected provider applications older than 30 days. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={cleanupData} className="bg-orange-600 hover:bg-orange-700">
                  {loading ? 'Processing...' : 'Cleanup Data'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseManagement;
