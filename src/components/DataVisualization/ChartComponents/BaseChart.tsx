import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ChartConfiguration } from '../utils/dataTransformer';

interface BaseChartProps {
  data: any[];
  config: ChartConfiguration;
}

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#0088FE',
  '#00C49F',
];

const BaseChart: React.FC<BaseChartProps> = ({ data, config }) => {
  const renderChart = () => {
    const { chartType, configuration } = config;
    const { xAxis, yAxis, title } = configuration;

    const commonProps = {
      width: 500,
      height: 300,
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    const commonCartesianProps = {
      ...commonProps,
      children: [
        <CartesianGrid strokeDasharray="3 3" key="grid" />,
        <XAxis
          dataKey={xAxis.dataKey}
          label={{ value: xAxis.label, position: 'bottom' }}
          key="xAxis"
        />,
        <YAxis
          label={{ value: yAxis.label, angle: -90, position: 'left' }}
          key="yAxis"
        />,
        <Tooltip key="tooltip" />,
        <Legend key="legend" />,
      ],
    };

    switch (chartType) {
      case 'LineChart':
        return (
          <LineChart {...commonCartesianProps}>
            {yAxis.dataKey.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
              />
            ))}
          </LineChart>
        );

      case 'BarChart':
        return (
          <BarChart {...commonCartesianProps}>
            {yAxis.dataKey.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </BarChart>
        );

      case 'AreaChart':
        return (
          <AreaChart {...commonCartesianProps}>
            {yAxis.dataKey.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
                stroke={COLORS[index % COLORS.length]}
              />
            ))}
          </AreaChart>
        );

      case 'PieChart':
        return (
          <PieChart {...commonProps}>
            <Pie
              data={data}
              dataKey={yAxis.dataKey[0]}
              nameKey={xAxis.dataKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      case 'ScatterChart':
        return (
          <ScatterChart {...commonCartesianProps}>
            {yAxis.dataKey.map((key, index) => (
              <Scatter
                key={key}
                name={key}
                data={data}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </ScatterChart>
        );

      case 'ComposedChart':
        return (
          <ComposedChart {...commonCartesianProps}>
            {yAxis.dataKey.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
              />
            ))}
            <Bar
              dataKey={yAxis.dataKey[0]}
              fill={COLORS[COLORS.length - 1]}
              opacity={0.3}
            />
          </ComposedChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="chart-container">
      <h3>{config.configuration.title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
      <p className="chart-reason">{config.reason}</p>
    </div>
  );
};

export default BaseChart; 