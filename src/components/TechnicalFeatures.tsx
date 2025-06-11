import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, Database, Zap, Shield, BarChart3, FileText, Brain, Clock } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Token Optimization Engine",
    description: "Advanced algorithms reduce token consumption by 80% while maintaining output quality",
    badge: "Core Technology",
    technical: "Proprietary compression algorithms with semantic preservation"
  },
  {
    icon: Brain,
    title: "Intelligent Data Processing",
    description: "AI-powered CSV analysis with automatic pattern recognition and insight generation",
    badge: "ML/AI",
    technical: "Neural networks optimized for tabular data understanding"
  },
  {
    icon: BarChart3,
    title: "Multi-Chart Visualization",
    description: "Dynamic chart generation including line, bar, scatter, composed, and area charts",
    badge: "Visualization",
    technical: "React-based rendering with D3.js mathematical foundations"
  },
  {
    icon: Database,
    title: "Real-time Data Analysis",
    description: "Instant processing of datasets with live preview and interactive exploration",
    badge: "Performance",
    technical: "Stream processing with sub-second response times"
  },
  {
    icon: FileText,
    title: "Advanced Data Insights",
    description: "Comprehensive analysis reports with statistical significance testing",
    badge: "Analytics",
    technical: "Statistical engines with hypothesis testing frameworks"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Secure authentication, HTTPS encryption, and JWT-based API security",
    badge: "Security",
    technical: "Supabase Auth with JWT tokens"
  },
  {
    icon: Cpu,
    title: "Distributed Computing",
    description: "Scalable infrastructure that adapts to workload demands automatically",
    badge: "Infrastructure",
    technical: "Kubernetes-orchestrated microservices with auto-scaling"
  },
  {
    icon: Clock,
    title: "Efficient Resource Usage",
    description: "Optimized algorithms ensure minimal computational overhead",
    badge: "Efficiency",
    technical: "O(n log n) complexity with memory-efficient data structures"
  }
]

export default function TechnicalFeatures() {
  return (
    <section id="technology" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Technical Architecture
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Built with cutting-edge technology stack designed for performance, scalability, and efficiency
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <feature.icon className="h-8 w-8 text-indigo-600" />
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-3">
                  {feature.description}
                </CardDescription>
                <div className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                  {feature.technical}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
