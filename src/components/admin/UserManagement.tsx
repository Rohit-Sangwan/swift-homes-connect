
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserCog, Search, Ban, CheckCircle, Mail } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface User {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  user_metadata: any;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Note: In a real application, you'd need an admin API endpoint
      // to fetch user data since auth.users is not directly accessible
      toast({
        title: "Feature Coming Soon",
        description: "User management requires additional backend setup.",
        variant: "default",
      });
      
      // Mock data for demonstration
      const mockUsers = [
        {
          id: '1',
          email: 'user1@example.com',
          created_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          user_metadata: { name: 'John Doe' }
        },
        {
          id: '2',
          email: 'user2@example.com',
          created_at: new Date().toISOString(),
          email_confirmed_at: null,
          last_sign_in_at: null,
          user_metadata: { name: 'Jane Smith' }
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.user_metadata?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendResetEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      toast({
        title: "Reset Email Sent",
        description: `Password reset email sent to ${email}`,
      });
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast({
        title: "Error",
        description: "Failed to send reset email.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog size={20} />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={fetchUsers} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.user_metadata?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                      {user.email_confirmed_at ? 'Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendResetEmail(user.email)}
                      >
                        <Mail size={14} className="mr-1" />
                        Reset
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Ban size={14} className="mr-1" />
                            Block
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Block User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to block {user.email}? This action requires additional backend setup.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                              Block User
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-4 text-gray-500">
            No users found matching your search.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
