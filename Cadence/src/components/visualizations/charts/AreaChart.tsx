import React from 'react';
import { DataPoint } from '@/lib/types/visualization';

interface AreaChartComponentProps {
  data: any[];
  dataPoints: DataPoint;
  xAxisLabel: string;
  yAxisLabel: string;
  title: string;
}

export const AreaChartComponent: React.FC<AreaChartComponentProps> = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">Area Chart - Coming Soon</p>
    </div>
  );
}; 