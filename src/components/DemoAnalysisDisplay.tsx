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
        analysisText: `Dataset Overview and Structure
This dataset represents a robust industrial sensor monitoring system capturing 400 data points across four identical devices (DEV-1 through DEV-4) over a continuous monitoring period. Each device contributed exactly 100 readings, indicating systematic data collection with balanced representation across the hardware fleet. The monitoring captures four critical operational parameters: temperature, vibration, pressure, and power consumption, alongside operational status classifications and anomaly type identification.
Operational Baseline and Normal Operating Conditions
The analysis reveals well-defined normal operating ranges that suggest properly calibrated industrial equipment. Temperature readings during normal operations cluster tightly around 69.9°C with a standard deviation of 3.87°C, maintaining a narrow operational band between 65.0°C and 75.0°C. This tight distribution indicates stable thermal management under normal conditions. Vibration measurements show typical industrial machinery patterns, averaging 0.20 units with most readings concentrated in the 0.10-0.30 range, suggesting well-maintained mechanical systems. Pressure readings demonstrate consistent performance around 85.4 units with a 3.28-unit standard deviation, while power consumption maintains remarkable stability at 49.9W average during normal operations.
Anomaly Patterns and Critical Thresholds
The dataset reveals a concerning but manageable anomaly rate of 4.3%, with 13 critical incidents and 4 warning-level events across the monitoring period. Temperature emerges as the primary failure mode, accounting for 1.8% of all readings and representing 7 distinct thermal anomaly events. The temperature threshold analysis reveals a clear demarcation point around 85°C, above which all readings are classified as anomalous. The temperature anomalies range from 85.0°C to 90.4°C, representing substantial deviations from the normal range and indicating potential thermal runaway conditions or cooling system failures.
Pressure anomalies constitute the second most frequent failure mode at 1.3% occurrence rate, while vibration anomalies appear in 0.8% of readings. Notably, power consumption anomalies are rare (0.3%), and one instance of multiple simultaneous parameter failures was detected, suggesting cascading failure scenarios. This pattern indicates that temperature monitoring serves as an effective early warning system, as thermal issues often precede or trigger other operational problems.
Power Consumption and Performance Correlations
A significant finding emerges from the power consumption analysis during anomalous conditions. While normal operations consume an average of 49.9W, anomalous conditions show a 4.5% increase to 52.1W average consumption. This correlation suggests that system stress manifests not only in the primary sensor readings but also in increased energy demand, potentially due to compensatory mechanisms like increased cooling efforts, higher operational loads, or system inefficiencies during stress conditions. This power signature could serve as an additional diagnostic indicator for predictive maintenance algorithms.
Device Reliability and Fleet Performance
The four-device fleet demonstrates remarkably consistent reliability profiles, with uptime percentages ranging from 95.0% to 96.0%. DEV-3 shows slightly higher anomaly susceptibility with 5 incidents compared to 4 for the other three devices, though this difference falls within statistical variation given the limited sample size. The uniform distribution of anomalies across devices suggests systematic rather than device-specific issues, pointing toward environmental factors, operational conditions, or maintenance schedules as primary drivers rather than manufacturing defects or individual device degradation.
Temporal and Operational Insights
The balanced nature of the anomaly distribution across devices, combined with the clear threshold-based failure patterns, suggests this system operates in a challenging but predictable environment. The predominance of temperature-based failures indicates either high ambient conditions, intensive operational loads, or potential cooling system limitations. The fact that 95.8% of all readings fall within normal parameters demonstrates overall system resilience, while the clear failure thresholds provide actionable intelligence for preventive maintenance scheduling.
Strategic Recommendations
This analysis reveals a well-instrumented system with clear failure signatures that could significantly benefit from predictive maintenance strategies. The distinct temperature threshold at 85°C provides a precise trigger point for maintenance alerts, while the power consumption correlation offers a secondary validation metric. The consistent cross-device failure patterns suggest that environmental or operational modifications could yield fleet-wide reliability improvements, potentially reducing the 4.3% anomaly rate through targeted interventions in thermal management or operational protocols.`,
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

// Utility function to convert array of objects to CSV
function arrayToCSV(data: any[]): string {
  if (!data || data.length === 0) return '';
  const keys = Object.keys(data[0]);
  const csvRows = [keys.join(',')];
  for (const row of data) {
    csvRows.push(keys.map(k => JSON.stringify(row[k] ?? '')).join(','));
  }
  return csvRows.join('\n');
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

  const handleDownloadCSV = () => {
    const csv = arrayToCSV(demoData.chartData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.title.replace(/\s+/g, '_').toLowerCase()}_data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

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
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Data Preview</h3>
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                  title="Download CSV"
                >
                  <Download className="w-4 h-4" /> Download CSV
                </button>
              </div>
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Data Preview</h3>
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                  title="Download CSV"
                >
                  <Download className="w-4 h-4" /> Download CSV
                </button>
              </div>
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
