
import { Badge } from "@/components/ui/badge";

const HeroSection = () => {
  return (
    <div className="text-center mb-12">
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
  );
};

export default HeroSection;
