import React from 'react';
import { Card } from '@/components/ui/card';

interface TechnicalMetricsProps {
  statisticalMetrics?: any;
  technicalNotes?: {
    dataPreparation?: string;
    limitations?: string;
  };
  dataQualityMetrics?: any;
  correlationMatrix?: any;
  timeSeriesMetrics?: any;
}

export const TechnicalMetrics: React.FC<TechnicalMetricsProps> = ({
  statisticalMetrics,
  technicalNotes,
  dataQualityMetrics,
  correlationMatrix,
  timeSeriesMetrics
}) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Technical Analysis</h2>
      <div className="space-y-4">
        {/* Statistical Metrics */}
        {statisticalMetrics && (
          <div>
            <h3 className="text-lg font-medium mb-2">Statistical Metrics</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(statisticalMetrics, null, 2)}
            </pre>
          </div>
        )}

        {/* Technical Notes */}
        {technicalNotes && (
          <div>
            <h3 className="text-lg font-medium mb-2">Technical Notes</h3>
            {technicalNotes.dataPreparation && (
              <div className="mb-2">
                <h4 className="font-medium">Data Preparation:</h4>
                <p className="text-gray-600">{technicalNotes.dataPreparation}</p>
              </div>
            )}
            {technicalNotes.limitations && (
              <div>
                <h4 className="font-medium">Limitations:</h4>
                <p className="text-gray-600">{technicalNotes.limitations}</p>
              </div>
            )}
          </div>
        )}

        {/* Data Quality Metrics */}
        {dataQualityMetrics && (
          <div>
            <h3 className="text-lg font-medium mb-2">Data Quality Metrics</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(dataQualityMetrics, null, 2)}
            </pre>
          </div>
        )}

        {/* Correlation Matrix */}
        {correlationMatrix && (
          <div>
            <h3 className="text-lg font-medium mb-2">Correlation Matrix</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(correlationMatrix, null, 2)}
            </pre>
          </div>
        )}

        {/* Time Series Metrics */}
        {timeSeriesMetrics && (
          <div>
            <h3 className="text-lg font-medium mb-2">Time Series Analysis</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(timeSeriesMetrics, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
}; 