import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, MessageSquare, Upload, BarChart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/FileUpload';
import ChatInterface from '@/components/ChatInterface';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const quickActions = [
    {
      title: 'Upload Dataset',
      description: 'Upload a new dataset for analysis',
      icon: Upload,
      action: () => setActiveTab('upload'),
    },
    {
      title: 'Analyze Data',
      description: 'Start a new analysis conversation',
      icon: MessageSquare,
      action: () => setActiveTab('chat'),
    },
    {
      title: 'View Visualizations',
      description: 'Explore your data visualizations',
      icon: BarChart,
      action: () => setActiveTab('visualizations'),
    },
  ];

  const recentAnalyses = [
    {
      id: 1,
      title: 'Data Analysis',
      description: 'Analysis of dataset patterns and trends',
      type: 'Analytics',
      date: '2024-03-20',
      status: 'Completed'
    },
    {
      title: 'Sales Performance Q1',
      date: '2024-03-14',
      type: 'Business',
      insights: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Welcome back, {getUserDisplayName()}!</CardTitle>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Quick Actions */}
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={action.action}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.title}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                {recentAnalyses.length > 0 ? (
                  <div className="space-y-4">
                    {recentAnalyses.map((analysis, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{analysis.title}</p>
                          <p className="text-sm text-gray-600">
                            {analysis.date} • {analysis.type}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Your recently analyzed datasets will appear here.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="chat">Analysis</TabsTrigger>
                    <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload">
                    <FileUpload>
                      {(uploadedFile, fileContent) => (
                        <div className="text-center">
                          <p className="text-green-600 font-medium">
                            ✓ File uploaded successfully!
                          </p>
                          <Button 
                            className="mt-4"
                            onClick={() => setActiveTab('chat')}
                          >
                            Analyze Data
                          </Button>
                        </div>
                      )}
                    </FileUpload>
                  </TabsContent>
                  <TabsContent value="chat">
                    <FileUpload>
                      {(uploadedFile, fileContent) => (
                        <ChatInterface
                          uploadedFile={uploadedFile}
                          fileContent={fileContent}
                          dataDomain="general"
                        />
                      )}
                    </FileUpload>
                  </TabsContent>
                  <TabsContent value="visualizations">
                    <div className="text-center text-gray-600">
                      <p>Upload a dataset and start a chat analysis to generate visualizations.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
