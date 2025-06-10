
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import AnimatedTextAnalysis from './AnimatedTextAnalysis'
import DataNavigationSection from './DataNavigationSection'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LineChart } from '@/components/visualizations/LineChart'
import { BarChart } from '@/components/visualizations/BarChart'

interface DemoDataset {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  recordCount: string
  category: string
}

interface DemoAnalysisDisplayProps {
  dataset: DemoDataset
  onBack: () => void
}

// Placeholder static data - replace with your actual demo data
const getDemoData = (datasetId: string) => {
  switch (datasetId) {
    case 'sales-performance':
      return {
        analysisText: "Based on the sales performance data analysis, I've identified several key trends and insights:\n\n📈 **Revenue Growth**: The data shows a consistent 15% quarter-over-quarter growth with Q4 showing the strongest performance at $2.3M revenue.\n\n🌍 **Regional Performance**: North America leads with 45% of total sales, followed by Europe (32%) and Asia-Pacific (23%). The West Coast region shows particularly strong growth in the technology sector.\n\n📊 **Product Categories**: Software solutions account for 60% of revenue, while hardware sales represent 40%. The subscription model shows 23% higher customer lifetime value.\n\n💡 **Key Recommendations**: Focus on expanding the subscription model in Asia-Pacific markets and increase investment in the West Coast technology sector.",
        tableData: {
          headers: ['Quarter', 'Revenue', 'Growth %', 'Region', 'Product Category'],
          rows: [
            ['Q1 2024', '$1,850,000', '12%', 'North America', 'Software'],
            ['Q2 2024', '$2,100,000', '14%', 'Europe', 'Software'],
            ['Q3 2024', '$2,000,000', '8%', 'Asia-Pacific', 'Hardware'],
            ['Q4 2024', '$2,300,000', '15%', 'North America', 'Software'],
            ['Q1 2024', '$950,000', '10%', 'Europe', 'Hardware']
          ]
        },
        chartData: [
          { quarter: 'Q1 2024', revenue: 1850000, growth: 12 },
          { quarter: 'Q2 2024', revenue: 2100000, growth: 14 },
          { quarter: 'Q3 2024', revenue: 2000000, growth: 8 },
          { quarter: 'Q4 2024', revenue: 2300000, growth: 15 }
        ],
        recommendations: [
          {
            title: "Revenue Trend Analysis",
            chartType: "LineChart",
            dataPoints: { xAxis: "quarter", yAxis: "revenue" },
            insights: "Strong upward trend in quarterly revenue with Q4 showing exceptional performance"
          },
          {
            title: "Growth Rate Performance",
            chartType: "BarChart", 
            dataPoints: { xAxis: "quarter", yAxis: ["growth"] },
            insights: "Growth rates remain consistently strong across all quarters"
          }
        ]
      }
    
    case 'customer-demographics':
      return {
        analysisText: "Customer demographics analysis reveals distinct segmentation patterns and behavioral insights:\n\n👥 **Age Distribution**: Millennials (25-40) represent 42% of the customer base, followed by Gen Z (18-24) at 28%, and Gen X (41-55) at 22%.\n\n🏙️ **Geographic Spread**: Urban customers show 35% higher engagement rates, with metropolitan areas contributing 68% of total revenue.\n\n🛒 **Purchase Behavior**: Average order value varies significantly by age group, with Gen X showing the highest AOV at $156, while Gen Z demonstrates the highest purchase frequency.\n\n📱 **Channel Preferences**: Mobile commerce accounts for 67% of transactions among Gen Z, while Gen X prefers desktop (54%) and in-store purchases (31%).",
        tableData: {
          headers: ['Age Group', 'Percentage', 'Avg Order Value', 'Purchase Frequency', 'Preferred Channel'],
          rows: [
            ['Gen Z (18-24)', '28%', '$89', '4.2/month', 'Mobile'],
            ['Millennials (25-40)', '42%', '$124', '3.1/month', 'Mobile/Desktop'],
            ['Gen X (41-55)', '22%', '$156', '2.8/month', 'Desktop'],
            ['Boomers (56+)', '8%', '$143', '1.9/month', 'In-store']
          ]
        },
        chartData: [
          { ageGroup: 'Gen Z', percentage: 28, avgOrderValue: 89 },
          { ageGroup: 'Millennials', percentage: 42, avgOrderValue: 124 },
          { ageGroup: 'Gen X', percentage: 22, avgOrderValue: 156 },
          { ageGroup: 'Boomers', percentage: 8, avgOrderValue: 143 }
        ],
        recommendations: [
          {
            title: "Customer Age Distribution",
            chartType: "BarChart",
            dataPoints: { xAxis: "ageGroup", yAxis: ["percentage"] },
            insights: "Millennials dominate the customer base, presenting the largest market opportunity"
          }
        ]
      }

    default:
      return {
        analysisText: "Loading demo analysis data...",
        tableData: { headers: [], rows: [] },
        chartData: [],
        recommendations: []
      }
  }
}

export default function DemoAnalysisDisplay({ dataset, onBack }: DemoAnalysisDisplayProps) {
  const [isAnalyzing] = useState(false)
  const demoData = getDemoData(dataset.id)

  return (
    <div className="space-y-8">
      {/* Header with back button */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-blue-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Datasets
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold mb-4">
              🎯 Demo Analysis Complete
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {dataset.title} Analysis
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {dataset.description} • {dataset.recordCount}
            </p>
          </div>
        </div>
      </Card>

      {/* Navigation Section */}
      <DataNavigationSection />

      {/* AI Analysis Section */}
      <div id="ai-analysis">
        <AnimatedTextAnalysis text={demoData.analysisText} isAnalyzing={isAnalyzing} />
      </div>

      {/* Data Preview Section */}
      {demoData.tableData.headers.length > 0 && (
        <div id="data-preview" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Data Preview</h2>
          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    {demoData.tableData.headers.map((header, index) => (
                      <TableHead key={index} className="font-semibold sticky top-0 bg-white z-10 dark:bg-gray-800">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoData.tableData.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* Chart Recommendations Section */}
      {demoData.recommendations.length > 0 && (
        <div id="visualizations" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Recommended Visualizations</h2>
          <div className="grid grid-cols-1 gap-8">
            {demoData.recommendations.map((rec, idx) => (
              <div key={idx} className="flex flex-col">
                <h3 className="text-lg font-bold mb-2 dark:text-white">{rec.title}</h3>
                <p className="mb-2 text-gray-600 dark:text-gray-300">{rec.insights}</p>
                <div className="h-80 min-w-[600px]">
                  {rec.chartType === 'LineChart' && (
                    <LineChart
                      data={demoData.chartData}
                      dataPoints={rec.dataPoints}
                      xAxisLabel="Time Period"
                      yAxisLabel="Revenue ($)"
                    />
                  )}
                  {rec.chartType === 'BarChart' && (
                    <BarChart
                      data={demoData.chartData}
                      dataPoints={rec.dataPoints}
                      xAxisLabel="Category"
                      yAxisLabel="Value"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
