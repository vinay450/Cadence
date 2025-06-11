
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, TrendingUp, BarChart3, MessageCircle, Database } from 'lucide-react'

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

// Static demo data for different datasets
const demoAnalysisData = {
  sales: {
    analysis: `# E-commerce Sales Analysis Results

## Key Insights Discovered:

**Revenue Trends**: Your sales data shows a strong **43% growth** in Q4 compared to Q3, with December being the peak month generating $2.4M in revenue.

**Top Performing Categories**:
- Electronics: 35% of total revenue ($1.8M)
- Clothing & Apparel: 28% of total revenue ($1.4M)  
- Home & Garden: 22% of total revenue ($1.1M)

**Regional Performance**:
- West Coast leads with 38% market share
- East Coast follows with 31% market share
- Midwest showing promising 15% growth rate

**Customer Behavior Patterns**:
- Average order value increased by 18% to $127
- Mobile purchases now account for 64% of transactions
- Customer retention rate improved to 73%

## Recommendations:
1. **Expand mobile experience** - Mobile is driving majority of sales
2. **Focus marketing spend** on West Coast high-performers  
3. **Seasonal inventory planning** - Prepare for Q4 demand spikes
4. **Cross-sell opportunities** between Electronics and Home categories`,
    
    chatMessages: [
      { id: '1', content: 'What are the top performing product categories?', isUser: true, timestamp: new Date() },
      { id: '2', content: 'Based on your e-commerce data, Electronics leads with 35% of total revenue at $1.8M, followed by Clothing & Apparel at 28% ($1.4M), and Home & Garden at 22% ($1.1M). Electronics shows particularly strong growth in mobile purchases.', isUser: false, timestamp: new Date() },
      { id: '3', content: 'How does regional performance compare?', isUser: true, timestamp: new Date() },
      { id: '4', content: 'The West Coast dominates with 38% market share, East Coast follows at 31%, and the Midwest is showing impressive 15% growth. I recommend focusing marketing efforts on the high-performing West Coast while nurturing the growing Midwest market.', isUser: false, timestamp: new Date() }
    ]
  },
  financial: {
    analysis: `# Financial Performance Analysis Results

## Executive Summary:

**Overall Performance**: Strong financial health with **27% year-over-year revenue growth** and improved profit margins across all business units.

**Revenue Breakdown**:
- Total Revenue: $12.8M (↑27% YoY)
- Operating Expenses: $8.2M (↑15% YoY)  
- Net Profit Margin: 36% (↑8 percentage points)

**Business Unit Performance**:
- **Software Division**: Leading performer with 45% revenue share
- **Consulting Services**: Highest profit margin at 42%
- **Product Sales**: Fastest growth at 31% YoY

**Cash Flow Analysis**:
- Operating Cash Flow: $4.1M positive
- Free Cash Flow: $2.9M after capital expenditures
- Working Capital improved by 23%

**Key Financial Ratios**:
- Return on Assets (ROA): 18.2%
- Debt-to-Equity: 0.34 (healthy leverage)
- Current Ratio: 2.8 (strong liquidity)

## Strategic Recommendations:
1. **Increase investment** in Software Division given strong performance
2. **Optimize cost structure** in underperforming units
3. **Expand consulting services** to leverage high margins
4. **Consider debt refinancing** to reduce interest expenses`,
    
    chatMessages: [
      { id: '1', content: 'What is our strongest business unit financially?', isUser: true, timestamp: new Date() },
      { id: '2', content: 'Your Software Division is the strongest performer, contributing 45% of total revenue while maintaining healthy margins. Consulting Services has the highest profit margin at 42%, making it your most efficient unit.', isUser: false, timestamp: new Date() },
      { id: '3', content: 'Should we be concerned about our debt levels?', isUser: true, timestamp: new Date() },
      { id: '4', content: 'Your debt-to-equity ratio of 0.34 is actually quite healthy and conservative. You have room to take on strategic debt for growth opportunities, especially given your strong cash flow of $4.1M and current ratio of 2.8.', isUser: false, timestamp: new Date() }
    ]
  }
}

// Sample table data
const sampleTableData = {
  sales: [
    { Month: 'January', Revenue: '$180k', Orders: '1,250', 'Avg Order': '$144', Category: 'Electronics' },
    { Month: 'February', Revenue: '$210k', Orders: '1,380', 'Avg Order': '$152', Category: 'Clothing' },
    { Month: 'March', Revenue: '$195k', Orders: '1,290', 'Avg Order': '$151', Category: 'Home & Garden' },
    { Month: 'April', Revenue: '$225k', Orders: '1,440', 'Avg Order': '$156', Category: 'Electronics' }
  ],
  financial: [
    { Quarter: 'Q1 2024', Revenue: '$3.2M', Expenses: '$2.1M', 'Net Profit': '$1.1M', Margin: '34.4%' },
    { Quarter: 'Q2 2024', Revenue: '$3.1M', Expenses: '$2.0M', 'Net Profit': '$1.1M', Margin: '35.5%' },
    { Quarter: 'Q3 2024', Revenue: '$3.3M', Expenses: '$2.0M', 'Net Profit': '$1.3M', Margin: '39.4%' },
    { Quarter: 'Q4 2024', Revenue: '$3.2M', Expenses: '$2.1M', 'Net Profit': '$1.1M', Margin: '34.4%' }
  ]
}

export default function DemoAnalysisDisplay({ dataset, onBack }: DemoAnalysisDisplayProps) {
  const [activeSection, setActiveSection] = useState<string>('analysis')
  
  const currentData = demoAnalysisData[dataset.id as keyof typeof demoAnalysisData] || demoAnalysisData.sales
  const currentTableData = sampleTableData[dataset.id as keyof typeof sampleTableData] || sampleTableData.sales

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Datasets
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Demo: {dataset.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{dataset.description}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        {[
          { key: 'analysis', label: 'AI Analysis', icon: TrendingUp },
          { key: 'chat', label: 'Chat Assistant', icon: MessageCircle },
          { key: 'data', label: 'Data Preview', icon: Database },
          { key: 'charts', label: 'Visualizations', icon: BarChart3 }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeSection === key
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      {activeSection === 'analysis' && (
        <Card className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{currentData.analysis}</div>
          </div>
        </Card>
      )}

      {activeSection === 'chat' && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Sample Conversation</h3>
            <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <div className="space-y-4">
                {currentData.chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900 p-3 rounded">
              💡 This is a demo conversation. In the real app, you can ask any questions about your data!
            </div>
          </div>
        </Card>
      )}

      {activeSection === 'data' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sample Data Preview</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  {Object.keys(currentTableData[0]).map((header) => (
                    <th key={header} className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900 p-3 rounded mt-4">
            📊 This is sample data. Upload your own CSV to see your actual data here!
          </div>
        </Card>
      )}

      {activeSection === 'charts' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sample Visualizations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200 dark:border-gray-500">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-blue-500 mb-2" />
                <p className="text-gray-600 dark:text-gray-300">Revenue Trend Chart</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Interactive charts generated from your data</p>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200 dark:border-gray-500">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-green-500 mb-2" />
                <p className="text-gray-600 dark:text-gray-300">Performance Metrics</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">AI-recommended visualizations</p>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-purple-50 dark:bg-purple-900 p-3 rounded mt-4">
            📈 These are placeholder visualizations. The real app generates dynamic charts based on your data!
          </div>
        </Card>
      )}
    </div>
  )
}
