import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ChatInterface from "@/components/ChatInterface";
import FileUpload from "@/components/FileUpload";
import { MessageSquare, BarChart } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
          Data Analysis Made Simple
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Upload your datasets and get instant insights through our AI-powered analysis platform.
        </p>
        {user && (
          <Button 
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </Button>
        )}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
            <MessageSquare className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Natural Language Analysis</h3>
            <p className="text-muted-foreground text-center">
              Upload your datasets and get comprehensive analysis through natural language conversations.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
            <BarChart className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-muted-foreground text-center">
              Leverage advanced AI to uncover hidden patterns and correlations in your data.
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Join professionals who are already using our platform to gain valuable insights.
          </p>
        </div>
      </main>

      {/* Chat Interface Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <FileUpload>
            {(uploadedFile, fileContent) => (
              <ChatInterface
                uploadedFile={uploadedFile}
                fileContent={fileContent}
                dataDomain="general"
              />
            )}
          </FileUpload>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Data Analysis</h3>
            <p className="text-gray-600">
              Upload your medical datasets and get comprehensive analysis through natural language conversations.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Visualizations</h3>
            <p className="text-gray-600">
              Generate interactive charts and graphs to better understand your data patterns.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">AI-Powered Insights</h3>
            <p className="text-gray-600">
              Leverage advanced AI to uncover hidden patterns and correlations in your medical data.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Join healthcare professionals who are already using our platform to gain valuable insights.
          </p>
          {user && (
            <Button 
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing; 