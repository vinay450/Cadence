import { useState } from 'react';
import { VisualizationResponse } from '@/lib/types/visualization';
import { ChartContainer } from './ChartContainer';

interface DataVisualizationProps {
  visualizations: VisualizationResponse;
  data: any[];
}

export const DataVisualization = ({ visualizations, data }: DataVisualizationProps) => {
  const [selectedChartIndex, setSelectedChartIndex] = useState(0);

  return (
    <div className="space-y-4">
      <ChartContainer
        recommendation={visualizations.recommendations[selectedChartIndex]}
        data={data}
        onChartChange={(index) => setSelectedChartIndex(index)}
        totalCharts={visualizations.recommendations.length}
        currentChart={selectedChartIndex}
      />
    </div>
  );
}; 