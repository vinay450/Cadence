
import { Upload, MessageSquare, BarChart3, Search, Zap, Shield } from "lucide-react";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  const features = [
    {
      icon: Upload,
      title: "Easy Data Upload",
      description: "Upload CSV, Excel, JSON, or any structured data format with simple drag-and-drop functionality.",
      gradientColors: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageSquare,
      title: "Natural Language Queries",
      description: "Ask questions about your data in plain English and get instant, intelligent responses.",
      gradientColors: "from-purple-500 to-purple-600"
    },
    {
      icon: BarChart3,
      title: "Smart Visualizations",
      description: "Automatically generate beautiful charts, graphs, and interactive visualizations from your data.",
      gradientColors: "from-teal-500 to-teal-600"
    },
    {
      icon: Search,
      title: "Deep Insights",
      description: "Discover hidden patterns, trends, and correlations in your data with AI-powered analysis.",
      gradientColors: "from-orange-500 to-orange-600"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Get instant results as you upload data and ask questions - no waiting, no delays.",
      gradientColors: "from-green-500 to-green-600"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. We prioritize privacy and never share your information.",
      gradientColors: "from-red-500 to-red-600"
    }
  ];

  return (
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
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradientColors={feature.gradientColors}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
