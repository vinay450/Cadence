import { useState } from 'react';
import { VisualizationResponse } from '@/lib/types/visualization';
import { ChartContainer } from './ChartContainer';
import { TechnicalMetrics } from './TechnicalMetrics';

interface DataVisualizationProps {
  visualizations: VisualizationResponse;
  data: any[];
}

export const DataVisualization = ({ visualizations, data }: DataVisualizationProps) => {
  const [selectedChartIndex, setSelectedChartIndex] = useState(0);
  const currentRecommendation = visualizations.recommendations[selectedChartIndex];

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="space-y-4">
        <ChartContainer
          recommendation={currentRecommendation}
          data={data}
          onChartChange={(index) => setSelectedChartIndex(index)}
          totalCharts={visualizations.recommendations.length}
          currentChart={selectedChartIndex}
        />
      </div>

      {/* Technical Metrics Section */}
      <TechnicalMetrics
        statisticalMetrics={currentRecommendation.statisticalMetrics}
        technicalNotes={currentRecommendation.technicalNotes}
        dataQualityMetrics={visualizations.dataQualityMetrics}
        correlationMatrix={visualizations.correlationMatrix}
        timeSeriesMetrics={visualizations.timeSeriesMetrics}
      />
    </div>
  );
}; 