import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DataPoint } from '@/lib/types/visualization';

interface LineChartComponentProps {
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

export const LineChartComponent: React.FC<LineChartComponentProps> = ({
  data,
  dataPoints,
  xAxisLabel,
  yAxisLabel
}) => {
  const { xAxis, yAxis } = dataPoints;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
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
          <Line
            key={y}
            type="monotone"
            dataKey={y}
            stroke={COLORS[index % COLORS.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}; 