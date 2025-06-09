import { AnomalyDetection } from '../types/visualization';

interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
}

export class AnomalyDetectionService {
  private data: TimeSeriesDataPoint[];
  private mean: number;
  private stdDev: number;
  private zScoreThreshold: number;

  constructor(data: TimeSeriesDataPoint[], zScoreThreshold: number = 3) {
    this.data = data;
    this.zScoreThreshold = zScoreThreshold;
    
    // Calculate basic statistics
    this.mean = this.calculateMean();
    this.stdDev = this.calculateStdDev();
  }

  private calculateMean(): number {
    return this.data.reduce((sum, point) => sum + point.value, 0) / this.data.length;
  }

  private calculateStdDev(): number {
    const squaredDiffs = this.data.map(point => 
      Math.pow(point.value - this.mean, 2)
    );
    return Math.sqrt(squaredDiffs.reduce((sum, diff) => sum + diff, 0) / this.data.length);
  }

  private calculateZScore(value: number): number {
    return (value - this.mean) / this.stdDev;
  }

  private calculateStatisticalSignificance(zScore: number): number {
    // Using the complementary error function to calculate p-value
    const pValue = 2 * (1 - this.normalCDF(Math.abs(zScore)));
    return pValue;
  }

  private normalCDF(x: number): number {
    // Approximation of the normal cumulative distribution function
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  }

  private detectSeasonalPattern(): string | undefined {
    // Simple seasonal pattern detection using autocorrelation
    // This is a basic implementation - in practice, you'd want more sophisticated methods
    const values = this.data.map(point => point.value);
    const maxLag = Math.floor(values.length / 4);
    let bestCorrelation = 0;
    let bestLag = 0;

    for (let lag = 1; lag <= maxLag; lag++) {
      let correlation = 0;
      let n = 0;
      for (let i = 0; i < values.length - lag; i++) {
        correlation += (values[i] - this.mean) * (values[i + lag] - this.mean);
        n++;
      }
      correlation /= (n * Math.pow(this.stdDev, 2));

      if (Math.abs(correlation) > Math.abs(bestCorrelation)) {
        bestCorrelation = correlation;
        bestLag = lag;
      }
    }

    if (Math.abs(bestCorrelation) > 0.7) {
      return `${bestLag} periods`;
    }
    return undefined;
  }

  private inferLikelyCause(value: number, zScore: number, timestamp: string): string {
    const deviation = Math.abs(zScore);
    const direction = value > this.mean ? 'increase' : 'decrease';
    
    if (deviation > 5) {
      return `Extreme ${direction} suggesting significant event or possible data error`;
    } else if (deviation > 3) {
      return `Substantial ${direction} indicating notable anomaly`;
    } else {
      return `Moderate ${direction} from expected values`;
    }
  }

  private generateRecommendations(severity: number, zScore: number): string[] {
    const recommendations: string[] = [];
    
    if (severity > 0.8) {
      recommendations.push('Immediate investigation recommended');
      recommendations.push('Consider alerting relevant stakeholders');
    }
    if (Math.abs(zScore) > 5) {
      recommendations.push('Verify data collection process');
      recommendations.push('Check for external factors or events');
    }
    if (severity > 0.5) {
      recommendations.push('Monitor for pattern development');
    }

    return recommendations;
  }

  public detectAnomalies(): AnomalyDetection {
    const anomalies = this.data
      .map(point => {
        const zScore = this.calculateZScore(point.value);
        const severity_score = Math.min(Math.abs(zScore) / (2 * this.zScoreThreshold), 1);
        
        if (Math.abs(zScore) > this.zScoreThreshold) {
          const statistical_significance = this.calculateStatisticalSignificance(zScore);
          const likely_cause = this.inferLikelyCause(point.value, zScore, point.timestamp);
          
          return {
            timestamp: point.timestamp,
            value: point.value,
            score: Math.abs(zScore),
            type: 'point' as const,
            severity_score,
            likely_cause,
            impact_metrics: {
              deviation_from_mean: zScore,
              statistical_significance,
              z_score: zScore,
              percentile: (1 - this.normalCDF(zScore)) * 100
            },
            context: {
              historical_range: [this.mean - 2 * this.stdDev, this.mean + 2 * this.stdDev],
              seasonal_pattern: this.detectSeasonalPattern()
            },
            recommendations: this.generateRecommendations(severity_score, zScore)
          };
        }
        return null;
      })
      .filter((anomaly): anomaly is NonNullable<typeof anomaly> => anomaly !== null);

    const criticalAnomalies = anomalies.filter(a => a.severity_score > 0.8);
    const overallImpactScore = anomalies.reduce((sum, a) => sum + a.severity_score, 0) / anomalies.length;

    // Find most affected periods
    const mostAffectedPeriods = this.findMostAffectedPeriods(anomalies);

    return {
      anomalies,
      method: 'Z-Score with Dynamic Thresholding',
      threshold: this.zScoreThreshold,
      summary: {
        total_anomalies: anomalies.length,
        critical_anomalies: criticalAnomalies.length,
        most_affected_periods: mostAffectedPeriods,
        overall_impact_score: overallImpactScore
      },
      metadata: {
        detection_timestamp: new Date().toISOString(),
        model_confidence: this.calculateModelConfidence(anomalies),
        training_period: `${this.data.length} points`,
        update_frequency: 'Real-time'
      }
    };
  }

  private findMostAffectedPeriods(anomalies: AnomalyDetection['anomalies']): string[] {
    // Group anomalies by some time period (e.g., day, week, month)
    const periodCounts = new Map<string, number>();
    
    anomalies.forEach(anomaly => {
      const date = new Date(anomaly.timestamp);
      const period = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      periodCounts.set(period, (periodCounts.get(period) || 0) + 1);
    });

    // Sort periods by anomaly count and return top 3
    return Array.from(periodCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([period]) => period);
  }

  private calculateModelConfidence(anomalies: AnomalyDetection['anomalies']): number {
    // This is a simplified confidence calculation
    // In practice, you'd want to use cross-validation or other validation methods
    const averageSeverity = anomalies.reduce((sum, a) => sum + a.severity_score, 0) / anomalies.length;
    const averageSignificance = anomalies.reduce((sum, a) => sum + (1 - a.impact_metrics.statistical_significance), 0) / anomalies.length;
    
    return (averageSeverity + averageSignificance) / 2;
  }
} 