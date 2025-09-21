import { useState } from 'react';
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus, List } from "lucide-react";
import { CreateUrlForm, UrlList } from '@/features/url/components';

const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('create');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };  

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create URL
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              My URLs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <CreateUrlForm />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <UrlList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
