import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DataPoint } from '@/lib/types/visualization';

interface BarChartComponentProps {
  data: any[];
  dataPoints: DataPoint;
  xAxisLabel: string;
  yAxisLabel: string;
  title: string;
}

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#a4de6c',
  '#d0ed57'
];

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  dataPoints,
  xAxisLabel,
  yAxisLabel
}) => {
  const { xAxis, yAxis } = dataPoints;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxis}
          label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
        />
        <YAxis
          label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Legend />
        {yAxis.map((y, index) => (
          <Bar
            key={y}
            dataKey={y}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}; 