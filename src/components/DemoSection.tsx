import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, ShoppingCart, Heart, Zap } from 'lucide-react'

interface DemoDataset {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  recordCount: string
  category: string
}

const demoDatasets: DemoDataset[] = [
  {
    id: 'sales',
    title: 'E-commerce Sales Data',
    description: 'Monthly sales performance across different product categories and regions',
    icon: ShoppingCart,
    recordCount: '2,500+ records',
    category: 'Business Analytics'
  },
  {
    id: 'financial',
    title: 'Financial Performance',
    description: 'Quarterly revenue, expenses, and profit margins across business units',
    icon: TrendingUp,
    recordCount: '1,200+ records',
    category: 'Finance'
  },
  {
    id: 'healthcare',
    title: 'Healthcare Metrics',
    description: 'Patient satisfaction scores and treatment outcomes over time',
    icon: Heart,
    recordCount: '3,800+ records',
    category: 'Healthcare'
  },
  {
    id: 'marketing',
    title: 'Marketing Campaign Analytics',
    description: 'Multi-channel campaign performance and conversion rates',
    icon: Zap,
    recordCount: '5,100+ records',
    category: 'Marketing'
  }
]

interface DemoSectionProps {
  onSelectDataset: (dataset: DemoDataset) => void
}

export default function DemoSection({ onSelectDataset }: DemoSectionProps) {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold mb-6">
            🎯 Try Our Demo Datasets
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Try it out with our sample datasets for free
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the power of our AI analytics with pre-loaded sample data. No upload required!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoDatasets.map((dataset) => {
            const IconComponent = dataset.icon
            return (
              <Card 
                key={dataset.id}
                className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 bg-white/80 backdrop-blur-sm"
                onClick={() => onSelectDataset(dataset)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{dataset.title}</CardTitle>
                  <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                    {dataset.category}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-sm mb-3 line-clamp-2">
                    {dataset.description}
                  </CardDescription>
                  <div className="text-xs text-gray-500 font-medium">
                    {dataset.recordCount}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click any dataset above to see a live demo of our analytics platform
          </p>
        </div>
      </div>
    </section>
  )
}
