
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { Card } from '@/components/ui/card';
import { Bell, CheckCircle, Calendar, AlertCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/BottomNavigation';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'appointment';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Booking Confirmed',
    message: 'Your cleaning service has been confirmed for tomorrow at 10:00 AM.',
    time: '2 hours ago',
    read: false,
    type: 'success'
  },
  {
    id: '2',
    title: 'New Service Available',
    message: 'We now offer home painting services in your area!',
    time: '1 day ago',
    read: false,
    type: 'info'
  },
  {
    id: '3',
    title: 'Appointment Reminder',
    message: 'Don\'t forget your plumbing service scheduled for tomorrow.',
    time: '2 days ago',
    read: true,
    type: 'appointment'
  },
  {
    id: '4',
    title: 'Payment Required',
    message: 'Please complete the payment for your recent electrical service.',
    time: '3 days ago',
    read: true,
    type: 'warning'
  }
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" />;
      case 'warning':
        return <AlertCircle className="text-orange-500" />;
      case 'appointment':
        return <Calendar className="text-blue-500" />;
      case 'info':
      default:
        return <Info className="text-gray-500" />;
    }
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <PageContainer title="Notifications" showBack>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="outline" className="bg-brand-blue text-white">
              {unreadCount} new
            </Badge>
          )}
        </div>
        
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`p-4 ${!notification.read ? 'border-l-4 border-l-brand-blue' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex">
                  <div className="mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Bell size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500">No Notifications</h3>
            <p className="text-sm text-gray-400">You don't have any notifications yet</p>
          </div>
        )}
      </div>
      <BottomNavigation />
    </PageContainer>
  );
};

export default NotificationsPage;
