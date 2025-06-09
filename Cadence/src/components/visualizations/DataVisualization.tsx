import { useState } from 'react';
import { VisualizationResponse } from '@/lib/types/visualization';
import { ChartContainer } from './ChartContainer';
import { TechnicalMetrics } from './TechnicalMetrics';

interface DataVisualizationProps {
  visualizations: VisualizationResponse;
  data: any[];
}

export const DataVisualization = ({ visualizations, data }: DataVisualizationProps) => {
  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="space-y-4">
        <ChartContainer
          recommendations={visualizations.recommendations}
          data={data}
        />
      </div>

      {/* Technical Metrics Section */}
      <TechnicalMetrics
        statisticalMetrics={visualizations.recommendations[0]?.statisticalMetrics}
        technicalNotes={visualizations.recommendations[0]?.technicalNotes}
        dataQualityMetrics={visualizations.dataQualityMetrics}
        correlationMatrix={visualizations.correlationMatrix}
        timeSeriesMetrics={visualizations.timeSeriesMetrics}
      />
    </div>
  );
}; 