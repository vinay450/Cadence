import React from 'react';
import { DataPoint } from '@/lib/types/visualization';

interface PieChartComponentProps {
  data: any[];
  dataPoints: DataPoint;
  title: string;
}

export const PieChartComponent: React.FC<PieChartComponentProps> = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">Pie Chart - Coming Soon</p>
    </div>
  );
}; 