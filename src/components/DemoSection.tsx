import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart3, TrendingUp, PieChart, Users, ActivitySquare, Stethoscope, Waypoints } from "lucide-react"

interface DemoDataset {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  recordCount: string
  category: string
}

interface DemoSectionProps {
  onSelectDataset: (dataset: DemoDataset) => void
}

const sampleDatasets: DemoDataset[] = [
  {
    id: "sales-performance",
    title: "Company Sales Data",
    description: "Quarterly sales data with revenue, regions, and product categories",
    icon: TrendingUp,
    recordCount: "7k-10k tokens used with Claude. 1k-2k tokens used with Cadence.",
    category: "Business Analytics"
  },
  {
    id: "hardware-sensors",
    title: "Hardware Sensor Data",
    description: "Real-time sensor readings from industrial equipment with temperature, vibration, pressure, and power metrics",
    icon: ActivitySquare,
    recordCount: "12k-15k tokens used with Claude. 2k-3k tokens used with Cadence.",
    category: "Engineering Analytics"
  },
  {
    id: "medical-research",
    title: "Medical Research Data",
    description: "Clinical trial outcomes, patient responses, and treatment efficacy across multiple studies",
    icon: Stethoscope,
    recordCount: "16k-21k tokens used with Claude. 6k-8k tokens used with Cadence.",
    category: "Healthcare Analytics"
  },
  {
    id: "supply-chain",
    title: "Supply Chain Optimization",
    description: "End-to-end supply chain metrics with inventory levels, delivery times, and supplier performance",
    icon: Waypoints,
    recordCount: "14k-18k tokens used with Claude. 5k-7k tokens used with Cadence.",
    category: "Operations Analytics"
  }
]

export default function DemoSection({ onSelectDataset }: DemoSectionProps) {
  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold mb-6">
            🚀 Try it out with our sample datasets for free
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Experience AI Analytics in Action
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 whitespace-nowrap">
            Explore our pre-loaded datasets to see how Cadence transforms raw data into actionable insights instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleDatasets.map((dataset) => {
            const Icon = dataset.icon
            return (
              <Card 
                key={dataset.id}
                className="relative group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/70 dark:bg-gray-800/70 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-600"
                onClick={() => onSelectDataset(dataset)}
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">
                      {dataset.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {dataset.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {dataset.description}
                  </p>
                  
                  <div className="flex flex-col mt-auto">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      {dataset.recordCount}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectDataset(dataset)
                      }}
                    >
                      Try Demo
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No signup required • Experience full analytics in seconds • Real AI processing
          </p>
        </div>
      </div>
    </section>
  )
}
