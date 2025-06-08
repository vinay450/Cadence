import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FileUploadArea from "@/components/FileUploadArea";
import ChatInterface from "@/components/ChatInterface";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");

  const handleFileContent = (content: string) => {
    setFileContent(content);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />

      {/* Interactive Demo Section - Now First */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <HeroSection />

          <Card className="border-2 border-dashed border-gray-200 shadow-2xl">
            <CardContent className="p-8">
              <FileUploadArea 
                uploadedFile={uploadedFile} 
                setUploadedFile={setUploadedFile}
                onFileContent={handleFileContent}
              />
              <ChatInterface 
                uploadedFile={uploadedFile}
                fileContent={fileContent}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
