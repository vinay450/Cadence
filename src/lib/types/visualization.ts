export type ChartType = 'LineChart' | 'BarChart' | 'AreaChart' | 'PieChart' | 'ScatterChart' | 'ComposedChart';

export type StatisticalOverlay = 'confidence_intervals' | 'trend_lines' | 'outlier_markers';
export type DataTransformation = 'log' | 'normalize' | 'standardize';

export interface DataPoint {
  xAxis: string;
  yAxis: string[];
  groupBy?: string;
  aggregation?: 'sum' | 'average' | 'count';
  statisticalOverlays?: StatisticalOverlay[];
  transformations?: DataTransformation[];
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
  chartType: ChartType;
  reason: string;
  dataPoints: DataPoint;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  technicalNotes: TechnicalNotes;
  statisticalMetrics?: StatisticalMetrics;
}

export interface VisualizationResponse {
  recommendations: VisualizationRecommendation[];
  dataQualityMetrics?: DataQualityMetrics;
  correlationMatrix?: Record<string, Record<string, number>>;
  timeSeriesMetrics?: {
    seasonality?: {
      pattern: string;
      period: number;
    };
    trend?: {
      direction: 'increasing' | 'decreasing' | 'stable';
      magnitude: number;
    };
    stationarity?: {
      isStationary: boolean;
      pValue: number;
    };
  };
} 