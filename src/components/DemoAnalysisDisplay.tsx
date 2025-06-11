import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Download, Share2, Loader2, Send, Brain } from 'lucide-react'
import AnimatedTextAnalysis from './AnimatedTextAnalysis'
import DataNavigationSection from './DataNavigationSection'
import { DataTable } from './DataTable'
import { LineChart } from '@/components/visualizations/LineChart'
import { BarChart } from '@/components/visualizations/BarChart'
import { salesData, SalesData } from '@/data/sampleData'
import { sensorData, SensorData } from '@/data/sensorData'
import { supplyChainData, SupplyChainData } from '@/data/supplyChainData'
import ChatBot from './ChatBot'

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

interface MedicalData {
  studyId: string
  treatment: string
  phase: string
  patients: number
  responseRate: number
  adverseEvents: number
  followUpMonths: number
  age: number
  gender: string
  baselineScore: number
  finalScore: number
  dosage: number
  visitNumber: number
  bloodPressure: number
  heartRate: number
  temperature: number
  weight: number
  labResult1: number
  labResult2: number
  labResult3: number
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

interface TreatmentMetrics {
  baseResponse: number;
  baseAdverse: number;
  baseDosage: number;
}

interface TreatmentMetricsMap {
  [key: string]: TreatmentMetrics;
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

type DemoDataType = SalesData | AggregatedRegionData | CustomerData | SensorData | MedicalData | SupplyChainData;

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
    
    case 'medical-research': {
      // Generate static medical data
      const generateMedicalData = () => {
        const data: MedicalData[] = [];
        const treatments = ['Treatment A', 'Treatment B', 'Treatment C', 'Treatment D', 'Treatment E'];
        const phases = ['Phase 2', 'Phase 3'];
        const genders = ['Male', 'Female'];
        
        // Base metrics for each treatment
        const treatmentMetrics: TreatmentMetricsMap = {
          'Treatment A': { baseResponse: 78.5, baseAdverse: 12.3, baseDosage: 100 },
          'Treatment B': { baseResponse: 82.1, baseAdverse: 9.8, baseDosage: 120 },
          'Treatment C': { baseResponse: 65.4, baseAdverse: 15.6, baseDosage: 80 },
          'Treatment D': { baseResponse: 75.9, baseAdverse: 11.2, baseDosage: 90 },
          'Treatment E': { baseResponse: 68.7, baseAdverse: 14.5, baseDosage: 85 }
        };

        // Generate 700 rows of data
        for (let i = 0; i < 700; i++) {
          const treatment = treatments[i % 5];
          const metrics = treatmentMetrics[treatment];
          const phase = i < 140 ? 'Phase 2' : 'Phase 3';
          const visitNumber = Math.floor(i / 50) + 1;
          const age = Math.floor(Math.random() * 40) + 18; // 18-57 years
          const gender = genders[Math.floor(Math.random() * 2)];
          
          // Generate realistic variations in metrics
          const responseVariation = (Math.random() - 0.5) * 10;
          const adverseVariation = (Math.random() - 0.5) * 4;
          const dosageVariation = (Math.random() - 0.5) * 10;
          
          // Calculate visit-specific metrics
          const baselineScore = Math.floor(Math.random() * 50) + 50;
          const improvement = (metrics.baseResponse / 100) * baselineScore;
          const finalScore = Math.min(100, Math.floor(baselineScore + improvement + (Math.random() * 10 - 5)));
          
          data.push({
            studyId: `ST-${String(Math.floor(i / 140) + 1).padStart(3, '0')}`,
            treatment,
            phase,
            patients: phase === 'Phase 2' ? 150 : 450,
            responseRate: Math.max(0, Math.min(100, metrics.baseResponse + responseVariation)),
            adverseEvents: Math.max(0, Math.min(100, metrics.baseAdverse + adverseVariation)),
            followUpMonths: phase === 'Phase 2' ? 12 : 24,
            age,
            gender,
            baselineScore,
            finalScore,
            dosage: Math.max(0, Math.min(200, metrics.baseDosage + dosageVariation)),
            visitNumber,
            bloodPressure: Math.floor(Math.random() * 40) + 100, // 100-140
            heartRate: Math.floor(Math.random() * 40) + 60, // 60-100
            temperature: 36.5 + (Math.random() * 1.5), // 36.5-38.0
            weight: Math.floor(Math.random() * 30) + 50, // 50-80 kg
            labResult1: Math.floor(Math.random() * 100) + 50, // 50-150
            labResult2: Math.floor(Math.random() * 100) + 30, // 30-130
            labResult3: Math.floor(Math.random() * 100) + 40  // 40-140
          });
        }
        return data;
      };

      const medicalData = generateMedicalData();

      return {
        analysisText: `Dataset Overview and Study Design
This dataset represents a robust clinical research portfolio spanning 5 distinct studies (ST-001 through ST-005) evaluating 5 different treatments (A through E) across Phase 2 and Phase 3 trials. The dataset demonstrates excellent methodological rigor with balanced patient enrollment of 140 records per treatment arm and a representative demographic distribution of 51% female participants across a broad age spectrum of 18-57 years (mean age 37.5 years). The studies employed extended follow-up periods ranging from 12-24 months (average 21.6 months), indicating commitment to long-term safety and efficacy assessment.

Treatment Efficacy Analysis
The efficacy analysis reveals significant performance differences across the five treatment regimens. Treatment B emerges as the clear leader with an 81.7% response rate, representing a clinically meaningful advantage over the other treatments. Treatment A follows with a 78.6% response rate, while Treatment D achieves 75.9%. The lower-performing treatments include Treatment E (68.7%) and Treatment C (64.8%). These response rates demonstrate substantial therapeutic benefit across all treatments, with even the lowest-performing option exceeding typical response thresholds for many therapeutic areas.

The patient improvement metrics are particularly compelling, with 100% of patients showing measurable improvement from baseline to final assessment scores. The average improvement of 24.1 points (±13.0 standard deviation) across all treatments suggests robust therapeutic effect sizes. This universal improvement pattern, combined with relatively narrow confidence intervals, indicates consistent treatment benefits across the diverse patient population.

Safety and Tolerability Profile
The safety analysis reveals an inverse relationship between efficacy and adverse events, with Treatment B not only demonstrating the highest response rate but also the most favorable safety profile at 9.8% adverse events. This represents an optimal therapeutic window that is highly desirable in clinical development. Treatment A maintains reasonable safety at 12.3% adverse events, while Treatment C shows the highest adverse event rate at 15.6%. The overall adverse event rates ranging from 7.9% to 17.6% across all treatments suggest manageable safety profiles, though Treatment B clearly offers the best risk-benefit ratio.

Demographic and Population Insights
The demographic analysis reveals minimal age-related efficacy differences, with young adults (18-30), middle-aged (31-45), and older adults (46-57) showing remarkably consistent response rates of 74.4%, 73.6%, and 73.8% respectively. This age-independent efficacy pattern suggests broad therapeutic applicability across adult populations. Similarly, gender analysis shows virtually identical response rates between males (74.0%) and females (73.9%), indicating no gender-specific treatment considerations are necessary.

Clinical Monitoring and Dosage Patterns
The dosage analysis reveals a strategic dose-finding approach with dosages ranging from 75-125 mg across treatments, suggesting ongoing optimization studies. The clinical monitoring data shows appropriate vital sign surveillance with blood pressure averaging 120 mmHg, heart rate at 80 bpm, and normal body temperatures around 37°C, indicating good overall patient health status throughout the trials. The laboratory results demonstrate diverse biomarker monitoring across three different parameters, suggesting comprehensive safety and mechanistic assessments.

Strategic Research Implications
This dataset represents a mature clinical development program with Treatment B positioned as the lead candidate for regulatory advancement based on its superior safety-efficacy profile. The consistent improvement across all patients and treatments suggests a validated therapeutic approach with multiple viable candidates. The balanced study design across phases and demographics provides robust evidence for regulatory submissions and supports broad label claims. The extended follow-up periods and comprehensive monitoring data demonstrate commitment to thorough safety characterization, which will be crucial for long-term clinical success and market acceptance.

The research portfolio's strength lies in its systematic comparison of multiple treatment options within a controlled framework, providing clear differentiation data that will inform clinical and commercial decision-making. Treatment B's emergence as the optimal candidate, combined with the demonstrated efficacy of backup options, positions this program well for continued development and potential market success.`,
        tableColumns: [
          { key: 'studyId', header: 'Study ID', sortable: true },
          { key: 'treatment', header: 'Treatment', sortable: true },
          { key: 'phase', header: 'Phase', sortable: true },
          { key: 'patients', header: 'Patients', sortable: true },
          { key: 'responseRate', header: 'Response Rate (%)', sortable: true },
          { key: 'adverseEvents', header: 'Adverse Events (%)', sortable: true },
          { key: 'followUpMonths', header: 'Follow-up (Months)', sortable: true },
          { key: 'age', header: 'Age', sortable: true },
          { key: 'gender', header: 'Gender', sortable: true },
          { key: 'baselineScore', header: 'Baseline Score', sortable: true },
          { key: 'finalScore', header: 'Final Score', sortable: true },
          { key: 'dosage', header: 'Dosage (mg)', sortable: true },
          { key: 'visitNumber', header: 'Visit #', sortable: true },
          { key: 'bloodPressure', header: 'BP (mmHg)', sortable: true },
          { key: 'heartRate', header: 'HR (bpm)', sortable: true },
          { key: 'temperature', header: 'Temp (°C)', sortable: true },
          { key: 'weight', header: 'Weight (kg)', sortable: true },
          { key: 'labResult1', header: 'Lab 1', sortable: true },
          { key: 'labResult2', header: 'Lab 2', sortable: true },
          { key: 'labResult3', header: 'Lab 3', sortable: true }
        ] as TableColumn<DemoDataType>[],
        chartData: medicalData as DemoDataType[],
        recommendations: [
          {
            title: "Treatment Response Rates",
            chartType: "BarChart",
            dataPoints: {
              xAxis: "treatment",
              yAxis: ["responseRate"],
              xAxisLabel: "Treatment",
              yAxisLabel: "Response Rate (%)"
            } as BarChartDataPoints,
            insights: "Comparison of response rates across different treatments, highlighting efficacy differences"
          },
          {
            title: "Safety Profile Analysis",
            chartType: "LineChart",
            dataPoints: {
              xAxis: "treatment",
              yAxis: ["responseRate", "adverseEvents"],
              xAxisLabel: "Treatment",
              yAxisLabel: "Percentage (%)"
            } as LineChartDataPoints,
            insights: "Balanced view of efficacy and safety, showing the risk-benefit ratio for each treatment"
          },
          {
            title: "Treatment Progress Over Time",
            chartType: "LineChart",
            dataPoints: {
              xAxis: "visitNumber",
              yAxis: ["baselineScore", "finalScore"],
              xAxisLabel: "Visit Number",
              yAxisLabel: "Score"
            } as LineChartDataPoints,
            insights: "Progression of patient scores from baseline to final assessment across treatment visits"
          }
        ]
      }
    }

    case 'supply-chain': {
      return {
        analysisText: `Dataset Overview and Quality Profile
The dataset represents a diverse supply chain operation spanning eight product categories from March through June 2025, with operations distributed across eight suppliers and multiple warehouse locations. The data exhibits strong completeness with minimal missing values, though the damage rate of 7.2% and return rate of 2% indicate quality control challenges that warrant immediate attention. The temporal distribution shows operational scaling, with order volumes increasing from 114 in March to 177 in April before tapering, suggesting seasonal demand patterns or capacity constraints.

Supplier Performance Disparities and Risk Concentration
The supplier landscape reveals significant performance heterogeneity that creates both operational risks and optimization opportunities. Fast Delivery Systems, despite being the largest supplier with 76 orders (15.2% of volume), exhibits the highest damage rate at 10.53% and concerning return rate of 2.63%, suggesting quality control issues that undermine their speed advantage. Conversely, Premium Products Corp and Bulk Wholesale Group demonstrate superior reliability with zero return rates, while Reliable Suppliers LLC achieves the highest average quality score of 54.43 despite moderate delivery times. This performance variance indicates insufficient supplier vetting processes and suggests that cost optimization through supplier consolidation could simultaneously improve quality metrics.

Cost Efficiency Paradoxes and Category-Specific Insights
The cost analysis reveals counterintuitive patterns that challenge conventional procurement strategies. Electronics and Sports Equipment categories, despite commanding the highest unit costs ($542.83 and $554.25 respectively), deliver the poorest cost-per-quality ratios at $11.41 and $11.37 per quality point. This suggests either premium pricing without commensurate quality improvements or fundamental sourcing inefficiencies in high-value categories. Office Supplies emerges as the most cost-efficient category at $8.91 per quality point, indicating mature supplier relationships and standardized procurement processes that could be replicated across other categories.

Warehouse Utilization and Storage Duration Inefficiencies
The warehouse operations data exposes systematic inefficiencies in inventory management and space utilization. With average warehouse utilization at 78.5% but significant variation (60-95% range), there's clear evidence of suboptimal inventory distribution across storage locations. The storage duration analysis reveals that 31.6% of items remain in storage beyond 60 days, yet surprisingly, these long-storage items don't correlate with extended fulfillment times (3.82 vs 3.90 days), suggesting that storage duration reflects demand unpredictability rather than operational bottlenecks. This pattern indicates opportunities for demand forecasting improvements and dynamic inventory rebalancing.

Quality-Damage Correlation and Predictive Implications
The quality score analysis reveals a statistically significant relationship between product quality ratings and damage outcomes, with damaged items averaging 45.42 quality points compared to 51.27 for undamaged items. This 5.85-point differential suggests that quality scores serve as reliable predictive indicators for damage risk, enabling proactive quality management interventions. The concentration of damage issues among specific suppliers (particularly Fast Delivery Systems) indicates that supplier-specific quality protocols could reduce overall damage rates more effectively than blanket quality improvements.

Strategic Recommendations for Supply Chain Optimization
The data strongly supports a multi-pronged optimization strategy focusing on supplier rationalization, category-specific procurement refinement, and predictive quality management. The immediate priority should be addressing the quality-cost imbalance in Electronics and Sports Equipment through either supplier diversification or renegotiated terms that align pricing with delivered quality. Simultaneously, the superior performance profiles of Premium Products Corp and Reliable Suppliers LLC suggest opportunities for expanded partnerships that could reduce both costs and operational risks. The warehouse utilization patterns indicate potential for 15-20% capacity optimization through improved demand forecasting and dynamic space allocation, while the quality-damage correlation enables implementation of predictive interventions that could reduce damage rates from the current 7.2% to below 5% industry benchmarks.`,
        tableColumns: [
          { key: 'id', header: 'ID', sortable: true },
          { key: 'timestamp', header: 'Timestamp', sortable: true },
          { key: 'productId', header: 'Product ID', sortable: true },
          { key: 'productName', header: 'Product Name', sortable: true },
          { key: 'category', header: 'Category', sortable: true },
          { key: 'supplierName', header: 'Supplier', sortable: true },
          { key: 'quantity', header: 'Quantity', sortable: true },
          { key: 'unitCost', header: 'Unit Cost', sortable: true },
          { key: 'storageLocation', header: 'Location', sortable: true },
          { key: 'warehouseUtilization', header: 'Utilization %', sortable: true },
          { key: 'daysInStorage', header: 'Days in Storage', sortable: true },
          { key: 'orderFulfillmentTime', header: 'Fulfillment Time', sortable: true },
          { key: 'supplierDeliveryTime', header: 'Delivery Time', sortable: true },
          { key: 'qualityScore', header: 'Quality Score', sortable: true },
          { key: 'transportationCost', header: 'Transport Cost', sortable: true },
          { key: 'isDamaged', header: 'Damaged', sortable: true },
          { key: 'isReturned', header: 'Returned', sortable: true },
          { key: 'returnReason', header: 'Return Reason', sortable: true }
        ] as TableColumn<DemoDataType>[],
        chartData: supplyChainData as DemoDataType[],
        recommendations: [
          {
            title: "Category Performance Analysis",
            chartType: "BarChart",
            dataPoints: {
              xAxis: "category",
              yAxis: ["qualityScore", "warehouseUtilization"],
              xAxisLabel: "Product Category",
              yAxisLabel: "Score/Utilization (%)"
            } as BarChartDataPoints,
            insights: "Comparison of quality scores and warehouse utilization across product categories"
          },
          {
            title: "Supplier Performance Metrics",
            chartType: "LineChart",
            dataPoints: {
              xAxis: "supplierName",
              yAxis: ["supplierDeliveryTime", "qualityScore"],
              xAxisLabel: "Supplier",
              yAxisLabel: "Days/Score"
            } as LineChartDataPoints,
            insights: "Analysis of supplier performance in terms of delivery time and quality"
          },
          {
            title: "Storage Duration Impact",
            chartType: "LineChart",
            dataPoints: {
              xAxis: "daysInStorage",
              yAxis: ["unitCost", "transportationCost"],
              xAxisLabel: "Days in Storage",
              yAxisLabel: "Cost ($)"
            } as LineChartDataPoints,
            insights: "Relationship between storage duration and associated costs"
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
  const [loadingDots, setLoadingDots] = useState('.')
  const [loadingDots2, setLoadingDots2] = useState('.')
  const [loadingDots3, setLoadingDots3] = useState('.')
  const demoData = getDemoData(dataset.id)
  const aggregatedCategoryData = dataset.id === 'sales-performance' ? aggregateDataByProductCategory(salesData) : []

  useEffect(() => {
    // Reset states when dataset changes
    setIsAnalyzing(true)
    setShowContent(false)

    // Show loading state for 4.0 seconds
    const timer = setTimeout(() => {
      setIsAnalyzing(false)
      setShowContent(true)
    }, 4000)

    return () => clearTimeout(timer)
  }, [dataset.id])

  useEffect(() => {
    // Animate loading dots
    if (isAnalyzing) {
      const dotsInterval = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '...') return '.'
          if (prev === '..') return '...'
          return '..'
        })
      }, 500)

      const dotsInterval2 = setInterval(() => {
        setLoadingDots2(prev => {
          if (prev === '...') return '.'
          if (prev === '..') return '...'
          return '..'
        })
      }, 500)

      const dotsInterval3 = setInterval(() => {
        setLoadingDots3(prev => {
          if (prev === '...') return '.'
          if (prev === '..') return '...'
          return '..'
        })
      }, 500)

      return () => {
        clearInterval(dotsInterval)
        clearInterval(dotsInterval2)
        clearInterval(dotsInterval3)
      }
    }
  }, [isAnalyzing])

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
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              {dataset.description} • {dataset.recordCount}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supported formats: CSV, JSON, and XLSX
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cadence supports .csv files up to ~2 mb or 480,000 data points in a single request (ex. 30,000 Rows x 16 Columns, 15,000 rows x 32 columns)
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
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-blue-800 shadow-lg">
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-3">
                  <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                AI Analysis in Progress{loadingDots}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Processing dataset structure{loadingDots}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
                <span>Identifying patterns and correlations{loadingDots2}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-300"></div>
                <span>Generating insights and recommendations{loadingDots3}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Content Section */}
      {showContent && (
        <>
      {/* AI Analysis Section */}
      <div id="ai-analysis" className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <AnimatedTextAnalysis text={demoData.analysisText} isAnalyzing={isAnalyzing} />
      </div>

          {/* Disabled Chat Interface */}
          <div id="chat-section" className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Chat about your data</h2>
            <div className="relative">
              <ChatBot 
                sessionId=""
                onSessionIdUpdate={() => {}}
                model="demo"
                data={null}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm z-10 flex items-center justify-center p-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Chat is disabled for demos</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign up to unlock the full chat experience</p>
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
                      data={rec.title === "Product Category Revenue Comparison" ? aggregatedCategoryData : demoData.chartData}
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
