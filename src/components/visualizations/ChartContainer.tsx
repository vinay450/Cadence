import React from 'react';
import { ChartRecommendation } from '@/lib/types/visualization';
import { LineChartComponent } from './charts/LineChart';
import { BarChartComponent } from './charts/BarChart';
import { AreaChartComponent } from './charts/AreaChart';
import { PieChartComponent } from './charts/PieChart';
import { ScatterChartComponent } from './charts/ScatterChart';
import { ComposedChartComponent } from './charts/ComposedChart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VisualizationRecommendation } from '@/lib/types/visualization';
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

interface ChartContainerProps {
  recommendation: VisualizationRecommendation;
  data: any[];
  onChartChange: (index: number) => void;
  totalCharts: number;
  currentChart: number;
}

export const ChartContainer = ({
  recommendation,
  data,
  onChartChange,
  totalCharts,
  currentChart,
}: ChartContainerProps) => {
  const renderChart = () => {
    const { chartType, dataPoints, xAxisLabel, yAxisLabel } = recommendation;

    // Convert numeric string values to numbers
    const processedData = data.map(item => ({
      ...item,
      [dataPoints.xAxis]: Number(item[dataPoints.xAxis]) || item[dataPoints.xAxis],
      ...dataPoints.yAxis.reduce((acc, key) => ({
        ...acc,
        [key]: Number(item[key]) || item[key]
      }), {})
    }));

    console.log('Chart Rendering:', {
      type: chartType,
      data: processedData,
      xAxis: dataPoints.xAxis,
      yAxis: dataPoints.yAxis,
      sampleDataPoint: processedData[0]
    });

    const chartProps = {
      data: processedData,
      margin: { top: 30, right: 50, left: 50, bottom: 50 },
      height: 400,
    };

    switch (chartType) {
      case 'LineChart':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={dataPoints.xAxis} 
              label={{ value: xAxisLabel, position: 'bottom', offset: 20 }}
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              label={{ value: yAxisLabel, angle: -90, position: 'left', offset: 20 }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', padding: '10px' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ paddingTop: '10px' }}
            />
            {dataPoints.yAxis.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`hsl(${(index * 360) / dataPoints.yAxis.length}, 70%, 50%)`}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );

      case 'BarChart':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={dataPoints.xAxis} 
              label={{ value: xAxisLabel, position: 'bottom', offset: 20 }}
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              label={{ value: yAxisLabel, angle: -90, position: 'left', offset: 20 }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', padding: '10px' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ paddingTop: '10px' }}
            />
            {dataPoints.yAxis.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`hsl(${(index * 360) / dataPoints.yAxis.length}, 70%, 50%)`}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'AreaChart':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataPoints.xAxis} label={{ value: xAxisLabel, position: 'bottom' }} />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'left' }} />
            <Tooltip />
            <Legend />
            {dataPoints.yAxis.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                fill={`hsl(${(index * 360) / dataPoints.yAxis.length}, 70%, 50%)`}
                stroke={`hsl(${(index * 360) / dataPoints.yAxis.length}, 70%, 40%)`}
              />
            ))}
          </AreaChart>
        );

      case 'PieChart':
        return (
          <PieChart {...chartProps}>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey={dataPoints.yAxis[0]}
              nameKey={dataPoints.xAxis}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            />
          </PieChart>
        );

      case 'ScatterChart':
        return (
          <ScatterChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataPoints.xAxis} label={{ value: xAxisLabel, position: 'bottom' }} />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'left' }} />
            <Tooltip />
            <Legend />
            {dataPoints.yAxis.map((key, index) => (
              <Scatter
                key={key}
                name={key}
                data={data}
                fill={`hsl(${(index * 360) / dataPoints.yAxis.length}, 70%, 50%)`}
              />
            ))}
          </ScatterChart>
        );

      case 'ComposedChart':
        return (
          <ComposedChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataPoints.xAxis} label={{ value: xAxisLabel, position: 'bottom' }} />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'left' }} />
            <Tooltip />
            <Legend />
            {dataPoints.yAxis.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`hsl(${(index * 360) / dataPoints.yAxis.length}, 70%, 50%)`}
              />
            ))}
          </ComposedChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Unsupported chart type</p>
          </div>
        );
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">{recommendation.title}</h3>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChartChange((currentChart - 1 + totalCharts) % totalCharts)}
            disabled={totalCharts <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 min-w-[80px] text-center">
            {currentChart + 1} of {totalCharts}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChartChange((currentChart + 1) % totalCharts)}
            disabled={totalCharts <= 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      <p className="mt-6 text-sm text-gray-600">{recommendation.reason}</p>
    </Card>
  );
}; 