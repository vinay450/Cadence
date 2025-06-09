import { VisualizationResponse } from './types/visualization';

export const sampleData = [
  { month: 'Jan', sales: 4000, profit: 2400, units: 100 },
  { month: 'Feb', sales: 3000, profit: 1398, units: 80 },
  { month: 'Mar', sales: 2000, profit: 9800, units: 120 },
  { month: 'Apr', sales: 2780, profit: 3908, units: 90 },
  { month: 'May', sales: 1890, profit: 4800, units: 110 },
  { month: 'Jun', sales: 2390, profit: 3800, units: 95 },
];

export const sampleVisualization: VisualizationResponse = {
  recommendations: [
    {
      chartType: 'LineChart' as const,
      reason: 'Shows the trend of sales and profit over time',
      dataPoints: {
        xAxis: 'month',
        yAxis: ['sales', 'profit'],
      },
      title: 'Sales and Profit Trends',
      xAxisLabel: 'Month',
      yAxisLabel: 'Amount ($)'
    },
    {
      chartType: 'BarChart' as const,
      reason: 'Compares units sold across different months',
      dataPoints: {
        xAxis: 'month',
        yAxis: ['units'],
      },
      title: 'Units Sold by Month',
      xAxisLabel: 'Month',
      yAxisLabel: 'Units'
    }
  ]
}; 