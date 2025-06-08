import React from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationResponse, ChartRecommendation } from '@/lib/types/visualization';
import { ChartContainer } from './ChartContainer';

interface DataVisualizationProps {
  visualizations: VisualizationResponse;
  data: any[]; // We'll type this properly when we create the data transformation utils
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  visualizations,
  data
}) => {
  if (!visualizations?.recommendations?.length) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Data Visualizations</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visualizations.recommendations.map((recommendation, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-700">{recommendation.title}</h3>
              <p className="text-sm text-gray-600">{recommendation.reason}</p>
              <div className="h-[300px] w-full">
                <ChartContainer
                  recommendation={recommendation}
                  data={data}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}; 