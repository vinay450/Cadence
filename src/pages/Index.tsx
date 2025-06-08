import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, BarChart3, MessageSquare, Search, Zap, Shield, Globe, Users, Send, File, Database } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0].name);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0].name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cadence
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">Demo</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
              🚀 AI-Powered Data Analytics
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Data Into Insights
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload your datasets and let Cadence's intelligent chat engine create stunning visualizations 
              and provide deep analytical insights through natural conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Try Cadence Now
            </h2>
            <p className="text-xl text-gray-600">
              Drop your dataset and ask questions to see the magic happen
            </p>
          </div>

          <Card className="border-2 border-dashed border-gray-200 shadow-2xl">
            <CardContent className="p-8">
              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                  isDragOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : uploadedFile 
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".csv,.xlsx,.json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  {uploadedFile ? (
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Database className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-lg font-medium text-green-700">Dataset Uploaded!</p>
                      <p className="text-sm text-green-600">{uploadedFile}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your dataset here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports CSV, Excel, JSON files up to 50MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Interface */}
              <div className="mt-8 space-y-4">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-1">Cadence AI</p>
                      <p className="text-gray-600">
                        {uploadedFile 
                          ? `Great! I've analyzed your dataset "${uploadedFile}". What insights would you like me to generate?`
                          : "Hello! Upload a dataset above and I'll help you discover insights through interactive visualizations."
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Textarea
                    placeholder="Ask me anything about your data... e.g., 'Show me sales trends by region' or 'What are the top performing products?'"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 min-h-[60px] resize-none border-gray-300 focus:border-blue-500"
                    disabled={!uploadedFile}
                  />
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6"
                    disabled={!uploadedFile || !chatMessage.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>

                {uploadedFile && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-left justify-start"
                      onClick={() => setChatMessage("Show me a summary of the data")}
                    >
                      📊 Data Summary
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-left justify-start"
                      onClick={() => setChatMessage("Create a trend analysis")}
                    >
                      📈 Trend Analysis
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-left justify-start"
                      onClick={() => setChatMessage("Find correlations in the data")}
                    >
                      🔍 Find Patterns
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Data Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to unlock insights from your data through intelligent conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Easy Data Upload</CardTitle>
                <CardDescription>
                  Upload CSV, Excel, JSON, or any structured data format with simple drag-and-drop functionality.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Natural Language Queries</CardTitle>
                <CardDescription>
                  Ask questions about your data in plain English and get instant, intelligent responses.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Smart Visualizations</CardTitle>
                <CardDescription>
                  Automatically generate beautiful charts, graphs, and interactive visualizations from your data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Deep Insights</CardTitle>
                <CardDescription>
                  Discover hidden patterns, trends, and correlations in your data with AI-powered analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Real-time Processing</CardTitle>
                <CardDescription>
                  Get instant results as you upload data and ask questions - no waiting, no delays.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your data is encrypted and secure. We prioritize privacy and never share your information.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Cadence Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your data into actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Data</h3>
              <p className="text-gray-600">
                Simply drag and drop your dataset or connect to your data source. We support all major formats.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ask Questions</h3>
              <p className="text-gray-600">
                Chat with your data using natural language. Ask anything - from simple queries to complex analysis.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Insights</h3>
              <p className="text-gray-600">
                Receive instant visualizations, analytics, and insights that help you make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of data professionals who are already using Cadence to unlock insights from their datasets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Cadence</span>
              </div>
              <p className="text-gray-400">
                Transforming data into insights through intelligent conversation.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Cadence. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
