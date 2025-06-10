import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Download, Share2, Loader2, Send } from 'lucide-react'
import AnimatedTextAnalysis from './AnimatedTextAnalysis'
import DataNavigationSection from './DataNavigationSection'
import { DataTable } from './DataTable'
import { LineChart } from '@/components/visualizations/LineChart'
import { BarChart } from '@/components/visualizations/BarChart'
import { salesData, SalesData } from '@/data/sampleData'
import { sensorData, SensorData } from '@/data/sensorData'

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

interface ChartData {
  quarter: string
  revenue: number
  growth: number
}

interface CustomerData {
  ageGroup: string
  industry: string
  location: string
  customerCount: number
  averageSpend: number
}

interface LineChartDataPoints {
  xAxis: string
  yAxis: string[]
  xAxisLabel: string
  yAxisLabel: string
}

interface BarChartDataPoints {
  xAxis: string
  yAxis: string[]
  xAxisLabel: string
  yAxisLabel: string
}

interface TableColumn<T> {
  key: keyof T
  header: string
  sortable: boolean
}

interface DemoData<T> {
  analysisText: string
  tableColumns: TableColumn<T>[]
  chartData: T[]
  recommendations: {
    title: string
    chartType: 'LineChart' | 'BarChart'
    dataPoints: LineChartDataPoints | BarChartDataPoints
    insights: string
  }[]
}

interface AggregatedRegionData {
  quarter: string
  [key: string]: string | number
}

const customerData: CustomerData[] = [
  { ageGroup: '18-24', industry: 'Technology', location: 'Urban', customerCount: 1200, averageSpend: 89 },
  { ageGroup: '25-34', industry: 'Healthcare', location: 'Urban', customerCount: 2500, averageSpend: 124 },
  { ageGroup: '35-44', industry: 'Finance', location: 'Suburban', customerCount: 1800, averageSpend: 156 },
  { ageGroup: '45-54', industry: 'Education', location: 'Rural', customerCount: 900, averageSpend: 143 }
];

// Helper function to aggregate data by region and quarter
const aggregateDataByRegion = (data: SalesData[]): AggregatedRegionData[] => {
  const regions = Array.from(new Set(data.map(item => item.region)))
  const quarters = Array.from(new Set(data.map(item => item.quarter)))
  
  return quarters.map(quarter => {
    const quarterData: AggregatedRegionData = { quarter }
    
    // Sum up revenue for all regions in this quarter
    regions.forEach(region => {
      const regionQuarterData = data.filter(item => 
        item.region === region && item.quarter === quarter
      )
      const regionRevenue = regionQuarterData.reduce((sum, item) => sum + item.revenue, 0)
      quarterData[region] = regionRevenue
    })
    
    return quarterData
  })
}

// Helper function to aggregate data by product category and quarter
const aggregateDataByProductCategory = (data: SalesData[]): AggregatedRegionData[] => {
  const categories = Array.from(new Set(data.map(item => item.productCategory)))
  const quarters = Array.from(new Set(data.map(item => item.quarter)))
  
  return quarters.map(quarter => {
    const quarterData: AggregatedRegionData = { quarter }
    
    // Sum up revenue for all product categories in this quarter
    categories.forEach(category => {
      const categoryQuarterData = data.filter(item => 
        item.productCategory === category && item.quarter === quarter
      )
      const categoryRevenue = categoryQuarterData.reduce((sum, item) => sum + item.revenue, 0)
      quarterData[category] = categoryRevenue
    })
    
    return quarterData
  })
}

type DemoDataType = SalesData | AggregatedRegionData | CustomerData | SensorData;

const getDemoData = (datasetId: string): DemoData<DemoDataType> => {
  switch (datasetId) {
    case 'sales-performance': {
      const aggregatedRegionData = aggregateDataByRegion(salesData)
      const aggregatedCategoryData = aggregateDataByProductCategory(salesData)
      const regions = Array.from(new Set(salesData.map(item => item.region)))
      const categories = Array.from(new Set(salesData.map(item => item.productCategory)))
      
      return {
        analysisText: `Dataset Overview and Business Structure
This dataset represents a technology company's comprehensive sales performance across 140 distinct business segments, spanning seven global regions and five product categories throughout 2024. The business generated $49.5 million in total revenue from 80,130 units sold to 40,083 customers, indicating a substantial enterprise-level operation with an average profit margin of 22.94%. The data structure reveals a systematic approach to market segmentation, with equal representation across regions (20 records each), suggesting either balanced market presence or standardized reporting methodology.

Temporal Performance and Growth Dynamics
The quarterly progression demonstrates remarkably consistent growth momentum, with revenues advancing from $11.5 million in Q1 to $13.3 million in Q4—a steady 5% quarter-over-quarter expansion rate. This consistency is particularly noteworthy in today's volatile business environment, suggesting either strong market demand, effective execution, or both. The linear growth pattern indicates the business has achieved sustainable scaling mechanisms rather than experiencing the typical boom-and-bust cycles often seen in technology sectors. This steady trajectory suggests the company has successfully navigated market uncertainties and maintained operational efficiency throughout the year.

Regional Performance Hierarchy and Market Maturity
The regional analysis reveals a clear performance hierarchy that correlates strongly with market maturity and economic development. North America leads with $9.7 million in revenue and the highest profit margins at 26%, followed by Europe at $8.6 million with 24.6% margins. This pattern suggests the company has achieved premium positioning in developed markets while facing greater pricing pressure in emerging economies. The 5.4 percentage point margin spread between North America and Oceania indicates significant regional variations in competitive dynamics, operational costs, or customer willingness to pay. Interestingly, the revenue distribution shows a relatively balanced global footprint, with the top three regions accounting for only 52% of total revenue, indicating successful geographic diversification.

Product Portfolio Strategy and Pricing Dynamics
The product category analysis reveals a sophisticated portfolio strategy with Software Solutions leading at $11.5 million, closely followed by Hardware Products at $10.5 million. The pricing architecture is particularly revealing: Hardware Products command an average price of $1,000 per unit while Software Solutions average $499, yet software achieves higher total revenue due to volume advantages (22,974 units vs. 10,516 units). This suggests a "land and expand" strategy where lower-priced software products drive customer acquisition and volume, while higher-margin hardware provides revenue intensity. The 24.43% margin on Software Solutions versus 22.29% on Hardware Products indicates that despite lower unit prices, software achieves superior profitability through better cost structures.

Unit Economics and Customer Behavior Insights
The unit economics reveal sophisticated customer purchasing patterns with an average revenue per customer of $1,398 compared to $700 per unit, indicating customers typically purchase approximately two units per transaction. This multi-unit purchase behavior suggests either bundle sales strategies, customer loyalty, or products that naturally complement each other. The relatively high revenue per customer figure, combined with consistent margins across categories, indicates the company has achieved effective customer segmentation and pricing optimization. The customer count of 40,083 represents exactly half the unit count, reinforcing the two-unit-per-customer purchasing pattern and suggesting predictable customer behavior that can inform inventory and marketing strategies.

Strategic Implications and Market Position
The data collectively suggests a technology company that has achieved market maturity with sophisticated global operations, balanced product portfolio, and predictable customer behavior. The consistent growth rates, stable margins, and geographic diversification indicate strong competitive positioning and operational excellence. However, the margin compression in emerging markets and the need to maintain volume leadership in software while extracting premium value from hardware present ongoing strategic challenges that will require continuous innovation and market adaptation.`,
        tableColumns: [
          { key: 'quarter', header: 'Quarter', sortable: true },
          ...regions.map(region => ({
            key: region,
            header: region,
            sortable: true
          }))
        ] as TableColumn<DemoDataType>[],
        chartData: aggregatedRegionData as DemoDataType[],
        recommendations: [
          {
            title: "Regional Revenue Comparison",
            chartType: "LineChart",
            dataPoints: { 
              xAxis: "quarter", 
              yAxis: regions,
              xAxisLabel: "Quarter",
              yAxisLabel: "Revenue ($)"
            } as LineChartDataPoints,
            insights: "Comparison of revenue trends across all regions, showing relative performance and growth patterns"
          },
          {
            title: "Product Category Revenue Comparison",
            chartType: "LineChart",
            dataPoints: { 
              xAxis: "quarter", 
              yAxis: categories,
              xAxisLabel: "Quarter",
              yAxisLabel: "Revenue ($)"
            } as LineChartDataPoints,
            insights: "Comparison of revenue trends across different product categories, showing which products are driving growth"
          }
        ]
      }
    }
    
    case 'customer-demographics': {
      return {
        analysisText: "Customer demographics analysis reveals:\n\n👥 **Age Distribution**: 45% of customers are in the 25-34 age group, showing strong adoption among young professionals.\n\n💼 **Industry Focus**: Technology sector leads with 35% of customer base, followed by healthcare (25%) and finance (20%).\n\n🌍 **Geographic Spread**: Urban areas account for 70% of customer base, with strong presence in major metropolitan regions.\n\n💡 **Key Recommendations**: Develop targeted marketing campaigns for the 25-34 age group and expand presence in emerging urban markets.",
        tableColumns: [
          { key: 'ageGroup', header: 'Age Group', sortable: true },
          { key: 'industry', header: 'Industry', sortable: true },
          { key: 'location', header: 'Location', sortable: true },
          { key: 'customerCount', header: 'Customer Count', sortable: true },
          { key: 'averageSpend', header: 'Average Spend ($)', sortable: true }
        ] as TableColumn<DemoDataType>[],
        chartData: customerData as DemoDataType[],
        recommendations: [
          {
            title: "Customer Distribution by Age",
            chartType: "BarChart",
            dataPoints: {
              xAxis: "ageGroup",
              yAxis: "customerCount",
              xAxisLabel: "Age Group",
              yAxisLabel: "Number of Customers"
            } as unknown as BarChartDataPoints,
            insights: "Distribution of customers across different age groups"
          }
        ]
      }
    }
    
    case 'hardware-sensors': {
      return {
        analysisText: `Dataset Overview and Sensor Structure
This dataset represents real-time sensor readings from industrial equipment, capturing 400 data points across 4 devices over a 100-hour period. The data includes temperature, vibration, pressure, and power consumption metrics, with readings taken every 15 minutes. The dataset contains several anomalies and failure patterns that demonstrate the system's ability to detect and classify different types of equipment issues.

Anomaly Detection and Pattern Analysis
The data reveals several distinct types of anomalies:
- Temperature spikes reaching 85-95°C (normal range: 65-75°C)
- Vibration increases to 0.8-1.2 units (normal range: 0.1-0.3)
- Pressure surges to 95-105 PSI (normal range: 80-90 PSI)
- Power consumption spikes to 70-80 kW (normal range: 45-55 kW)
- Multiple concurrent anomalies indicating potential system-wide issues

Device Performance and Health Metrics
Device 1 shows the most stable performance with only one minor anomaly. Device 2 experienced two critical temperature events. Device 3 had multiple vibration warnings, while Device 4 showed the most concerning pattern with a combination of pressure and power anomalies. The data suggests potential maintenance needs for Devices 3 and 4.

Recommendations and Action Items
1. Schedule immediate maintenance for Device 4 due to multiple critical anomalies
2. Monitor Device 3's vibration patterns more closely
3. Review cooling systems for Device 2
4. Consider implementing predictive maintenance for all devices based on the identified patterns`,
        tableColumns: [
          { key: 'timestamp', header: 'Timestamp', sortable: true },
          { key: 'deviceId', header: 'Device ID', sortable: true },
          { key: 'temperature', header: 'Temperature (°C)', sortable: true },
          { key: 'vibration', header: 'Vibration', sortable: true },
          { key: 'pressure', header: 'Pressure (PSI)', sortable: true },
          { key: 'powerConsumption', header: 'Power (kW)', sortable: true },
          { key: 'status', header: 'Status', sortable: true }
        ] as TableColumn<DemoDataType>[],
        chartData: sensorData as DemoDataType[],
        recommendations: [
          {
            title: "Temperature Trends by Device",
            chartType: "LineChart",
            dataPoints: { 
              xAxis: "timestamp", 
              yAxis: ["temperature"],
              xAxisLabel: "Time",
              yAxisLabel: "Temperature (°C)"
            } as LineChartDataPoints,
            insights: "Temperature readings over time, highlighting critical spikes and normal operating ranges"
          },
          {
            title: "Multi-Metric Analysis",
            chartType: "LineChart",
            dataPoints: { 
              xAxis: "timestamp", 
              yAxis: ["vibration", "pressure", "powerConsumption"],
              xAxisLabel: "Time",
              yAxisLabel: "Sensor Readings"
            } as LineChartDataPoints,
            insights: "Combined view of vibration, pressure, and power consumption to identify correlated anomalies"
          }
        ]
      }
    }
    
    default:
      return {
        analysisText: "Loading analysis...",
        tableColumns: [],
        chartData: [],
        recommendations: []
      }
  }
}

export default function DemoAnalysisDisplay({ dataset, onBack }: DemoAnalysisDisplayProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const demoData = getDemoData(dataset.id)
  const aggregatedCategoryData = dataset.id === 'sales-performance' ? aggregateDataByProductCategory(salesData) : []

  useEffect(() => {
    // Reset states when dataset changes
    setIsAnalyzing(true)
    setShowContent(false)

    // Show loading state for 4.7 seconds
    const timer = setTimeout(() => {
      setIsAnalyzing(false)
      setShowContent(true)
    }, 4700)

    return () => clearTimeout(timer)
  }, [dataset.id])

  useEffect(() => {
    // Scroll to navigation section immediately when dataset changes
    const navigationSection = document.getElementById('data-navigation')
    if (navigationSection) {
      const yOffset = -100; // Adjust this value to scroll further down
      const y = navigationSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }, [dataset.id])

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
              {isAnalyzing ? '🔄 Processing Data...' : '🎯 Demo Analysis Complete'}
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
      <div id="data-navigation">
        <DataNavigationSection />
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div id="loading-state" className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Processing your data...
          </p>
        </div>
      )}

      {/* Content Section */}
      {showContent && (
        <>
          {/* AI Analysis Section */}
          <div id="ai-analysis">
            <AnimatedTextAnalysis text={demoData.analysisText} isAnalyzing={isAnalyzing} />
          </div>

          {/* Disabled Chat Interface */}
          <div id="chat-section" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Chat about your data</h2>
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <div className="h-[200px] flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      Chat is disabled for demos
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      disabled
                    />
                    <Button
                      variant="outline"
                      className="px-4 py-2 rounded-md cursor-not-allowed opacity-50"
                      disabled
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Preview Section */}
          {dataset.id === 'sales-performance' ? (
            <div id="data-preview" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Data Preview</h2>
              <div className="max-h-[400px] overflow-auto">
                <DataTable<SalesData>
                  data={salesData}
                  columns={[
                    { key: 'quarter', header: 'Quarter', sortable: true },
                    { key: 'region', header: 'Region', sortable: true },
                    { key: 'productCategory', header: 'Product Category', sortable: true },
                    { key: 'revenue', header: 'Revenue ($)', sortable: true },
                    { key: 'unitsSold', header: 'Units Sold', sortable: true },
                    { key: 'profitMargin', header: 'Profit Margin (%)', sortable: true },
                    { key: 'customerCount', header: 'Customer Count', sortable: true }
                  ]}
                />
              </div>
            </div>
          ) : demoData.tableColumns.length > 0 && (
            <div id="data-preview" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Data Preview</h2>
              <div className="max-h-[400px] overflow-auto">
                <DataTable
                  data={demoData.chartData}
                  columns={demoData.tableColumns}
                />
              </div>
            </div>
          )}

          {/* Chart Recommendations Section */}
          {demoData.recommendations.length > 0 && (
            <div id="visualizations" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Graphical Analysis</h2>
              <div className="grid grid-cols-1 gap-8">
                {demoData.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex flex-col">
                    <h3 className="text-lg font-bold mb-2 dark:text-white">{rec.title}</h3>
                    <p className="mb-2 text-gray-600 dark:text-gray-300">{rec.insights}</p>
                    <div className="h-80 min-w-[600px]">
                      {rec.chartType === 'LineChart' && (
                        <LineChart
                          data={demoData.chartData}
                          dataPoints={rec.dataPoints as LineChartDataPoints}
                          xAxisLabel={rec.dataPoints.xAxisLabel}
                          yAxisLabel={rec.dataPoints.yAxisLabel}
                        />
                      )}
                      {rec.chartType === 'BarChart' && (
                        <BarChart
                          data={demoData.chartData}
                          dataPoints={rec.dataPoints as BarChartDataPoints}
                          xAxisLabel={rec.dataPoints.xAxisLabel}
                          yAxisLabel={rec.dataPoints.yAxisLabel}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
