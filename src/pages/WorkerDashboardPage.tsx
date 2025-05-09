
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import { Calendar, Clock, MessageCircle, Star, Users, BarChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string | null;
  user_id: string;
}

interface BookingStats {
  total: number;
  completed: number;
  upcoming: number;
  cancelled: number;
}

const WorkerDashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    completed: 0,
    upcoming: 0,
    cancelled: 0
  });

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();

      if (!session.session) {
        navigate('/auth');
        toast({
          title: "Authentication Required",
          description: "Please log in to access your worker dashboard.",
          variant: "destructive",
        });
        return;
      }

      const userId = session.session.user.id;

      // Check if user is a registered service provider
      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .single();

      if (providerError || !providerData) {
        navigate('/profile');
        toast({
          title: "Not a Service Provider",
          description: "You need to register and be approved as a service provider to access this dashboard.",
          variant: "destructive",
        });
        return;
      }

      setProfile(providerData);

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('provider_id', providerData.id)
        .order('created_at', { ascending: false });

      if (!reviewsError && reviewsData) {
        setReviews(reviewsData);
      }

      // In a real app, you'd fetch actual booking stats
      // For this example, we'll use dummy data
      setStats({
        total: 35,
        completed: 28,
        upcoming: 4,
        cancelled: 3
      });

    } catch (error) {
      console.error('Error in worker dashboard:', error);
      toast({
        title: "Error",
        description: "Failed to load your worker dashboard. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <PageContainer title="Worker Dashboard" showBack>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-blue border-t-transparent"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Worker Dashboard" showBack>
      <div className="p-4">
        {profile && (
          <>
            {/* Worker Profile Summary */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden">
                    {profile.profile_image_url ? (
                      <img 
                        src={profile.profile_image_url} 
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xl font-medium text-gray-500">{profile.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium text-lg">{profile.name}</h2>
                    <div className="text-sm text-gray-500">{profile.service_category}</div>
                    <div className="flex items-center mt-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                      <span>{getAverageRating()}</span>
                      <span className="text-xs text-gray-500 ml-1">({reviews.length} reviews)</span>
                      <Badge variant="outline" className="ml-2 bg-blue-50">{profile.price_range}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Tabs */}
            <Tabs defaultValue="statistics">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              {/* Statistics Tab */}
              <TabsContent value="statistics" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <Users className="h-8 w-8 mb-2 text-brand-blue" />
                        <p className="text-sm text-gray-500">Total Bookings</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <Star className="h-8 w-8 mb-2 text-brand-blue" />
                        <p className="text-sm text-gray-500">Rating</p>
                        <p className="text-2xl font-bold">{getAverageRating()}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <BarChart className="h-8 w-8 mb-2 text-brand-blue" />
                        <p className="text-sm text-gray-500">Completion Rate</p>
                        <p className="text-2xl font-bold">
                          {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <Calendar className="h-8 w-8 mb-2 text-brand-blue" />
                        <p className="text-sm text-gray-500">Upcoming</p>
                        <p className="text-2xl font-bold">{stats.upcoming}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Completed Jobs:</span>
                        <span className="ml-2 font-medium">{stats.completed}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Cancelled:</span>
                        <span className="ml-2 font-medium">{stats.cancelled}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Response Rate:</span>
                        <span className="ml-2 font-medium">92%</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">On-time Rate:</span>
                        <span className="ml-2 font-medium">96%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                              <span className="text-xs font-medium">U</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">User</p>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={12}
                                    className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            {review.created_at ? format(new Date(review.created_at), 'MMM dd, yyyy') : ''}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment || "No comment provided."}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <MessageCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reviews yet</p>
                    <p className="text-sm text-gray-400">Complete more jobs to get reviews from clients</p>
                  </div>
                )}
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Availability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="text-brand-blue mr-2" size={16} />
                      <div>
                        <p className="text-sm font-medium">Working Days</p>
                        <p className="text-sm text-gray-500">Monday - Saturday</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="text-brand-blue mr-2" size={16} />
                      <div>
                        <p className="text-sm font-medium">Working Hours</p>
                        <p className="text-sm text-gray-500">9:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.upcoming > 0 ? (
                      <div className="space-y-4">
                        {[...Array(stats.upcoming)].map((_, index) => (
                          <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex justify-between">
                              <p className="font-medium">Booking #{index + 1}</p>
                              <Badge>Upcoming</Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              {format(new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000), 'EEEE, MMMM dd, yyyy')}
                            </p>
                            <p className="text-sm">10:00 AM - 12:00 PM</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No upcoming bookings</p>
                        <p className="text-sm text-gray-400">Your schedule is clear</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      <BottomNavigation />
    </PageContainer>
  );
};

export default WorkerDashboardPage;
