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
  variance?: number;
  distributionType?: string;
  skewness?: number;
  kurtosis?: number;
  confidenceIntervals?: {
    lower: number;
    upper: number;
    level: number;
  };
  distributionParameters?: {
    location?: number;
    scale?: number;
    shape?: number;
    degrees_of_freedom?: number;
  };
  goodnessOfFit?: {
    test: string;
    statistic: number;
    pValue: number;
    conclusion: string;
  };
  hypothesisTests?: Array<{
    testName: string;
    statistic: number;
    pValue: number;
    interpretation: string;
  }>;
}

export interface DataQualityMetrics {
  completeness: Record<string, number>;
  validity?: Record<string, {
    validCount: number;
    invalidCount: number;
  }>;
}

export interface TimeSeriesAnalysis {
  trend: {
    direction: string;
    magnitude: number;
  };
  seasonality: {
    pattern: string;
    period: number;
  };
}

export interface AnomalyDetection {
  method: string;
  anomalies: Array<{
    timestamp: string;
    value: number;
    severity_score: number;
    impact_metrics: {
      deviation_from_mean: number;
      statistical_significance: number;
    };
    likely_cause: string;
    recommendations?: string[];
  }>;
  metadata: {
    model_confidence: number;
    detection_timestamp?: string;
    training_period?: string;
    update_frequency?: string;
  };
  status?: {
    hasAnomalies: boolean;
    message: string;
  };
  summary?: {
    total_anomalies: number;
    critical_anomalies: number;
    overall_impact_score: number;
    most_affected_periods: string[];
  };
}

export interface CorrelationAnalysis {
  matrix: Record<string, Record<string, number>>;
  significantPairs: Array<{
    variables: [string, string];
    coefficient: number;
    pValue: number;
    relationship: 'strong positive' | 'moderate positive' | 'weak positive' | 
                 'strong negative' | 'moderate negative' | 'weak negative' | 
                 'no correlation';
  }>;
}

export interface PredictiveInsights {
  features: string[];
  importance: Record<string, number>;
  model: {
    type: string;
    performance: {
      metric: string;
      value: number;
    }[];
  };
  predictions?: Array<{
    scenario: string;
    prediction: number;
    confidence: number;
  }>;
}

export interface Recommendation {
  title: string;
  type: string;
  data: {
    x: string;
    y: string;
    annotations: string[];
  };
  statisticalMetrics: StatisticalMetrics;
}

export interface VisualizationResponse {
  recommendations: Recommendation[];
  dataQualityMetrics: DataQualityMetrics;
  anomalyDetection: AnomalyDetection;
  correlationAnalysis: {
    significantPairs: Array<{
      variables: string[];
      relationship: string;
      coefficient: number;
    }>;
  };
  timeSeriesAnalysis: TimeSeriesAnalysis;
} 