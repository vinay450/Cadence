export type ChartType = 'LineChart' | 'BarChart' | 'AreaChart' | 'PieChart' | 'ScatterChart' | 'ComposedChart';

export interface DataPoint {
  xAxis: string;
  yAxis: string[];
  groupBy?: string;
  aggregation?: 'sum' | 'average' | 'count';
}

export interface VisualizationRecommendation {
  chartType: ChartType;
  reason: string;
  dataPoints: DataPoint;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
}

export interface VisualizationResponse {
  recommendations: VisualizationRecommendation[];
} 