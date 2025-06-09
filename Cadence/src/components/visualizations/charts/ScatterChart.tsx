import React from 'react';
import { DataPoint } from '@/lib/types/visualization';

interface ScatterChartComponentProps {
  data: any[];
  dataPoints: DataPoint;
  xAxisLabel: string;
  yAxisLabel: string;
  title: string;
}

export const ScatterChartComponent: React.FC<ScatterChartComponentProps> = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">Scatter Chart - Coming Soon</p>
    </div>
  );
}; 