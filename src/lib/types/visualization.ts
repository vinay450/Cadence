export type ChartType = 'LineChart' | 'BarChart' | 'AreaChart' | 'PieChart' | 'ScatterChart' | 'ComposedChart';

export type StatisticalOverlay = 'confidence_intervals' | 'trend_lines' | 'outlier_markers';
export type DataTransformation = 'log' | 'normalize' | 'standardize';

export interface DataPoint {
  xAxis: string;
  yAxis: string[];
  xAxisLabel: string;
  yAxisLabel: string;
  aggregation?: string;
  groupBy?: string[];
  statisticalOverlays?: string[];
}

export interface TechnicalNotes {
  dataPreparation: string;
  statisticalTests: string;
  limitations: string;
}

export interface StatisticalMetrics {
  mean?: number;
  median?: number;
  standardDeviation?: number;
  quartiles?: [number, number];
  skewness?: number;
  kurtosis?: number;
  outliers?: {
    count: number;
    range: [number, number];
  };
}

export interface DataQualityMetrics {
  completeness: Record<string, number>;
  uniqueness: Record<string, number>;
  consistency: number;
  accuracy: Record<string, boolean>;
}

export interface VisualizationRecommendation {
  title: string;
  chartType: 'LineChart' | 'BarChart' | 'AreaChart' | 'ScatterChart' | 'ComposedChart' | 'PieChart';
  dataPoints: {
    xAxis: string;
    yAxis: string[];
    xAxisLabel: string;
    yAxisLabel: string;
    aggregation?: string;
    groupBy?: string[];
    statisticalOverlays?: string[];
  };
  reason: string;
  technicalNotes?: {
    dataPreparation?: string;
    limitations?: string;
  };
  statisticalMetrics?: any;
}

export interface VisualizationResponse {
  recommendations: VisualizationRecommendation[];
  dataQualityMetrics?: any;
  correlationMatrix?: any;
  timeSeriesMetrics?: any;
} 