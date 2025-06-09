import React, { useState, useMemo, useContext } from 'react';
import { ThemeContext } from '@/lib/theme';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LineChartComponent } from './charts/LineChart';
import { BarChartComponent } from './charts/BarChart';
import { AreaChartComponent } from './charts/AreaChart';
import { PieChartComponent } from './charts/PieChart';
import { ScatterChartComponent } from './charts/ScatterChart';
import { ComposedChartComponent } from './charts/ComposedChart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
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
  ReferenceArea,
  Label,
  ReferenceLine,
  Brush,
  Cell,
} from 'recharts';
import { detectDataType, formatValue, aggregateData } from './utils';

interface VisualizationRecommendation {
  title: string;
  chartType: 'LineChart' | 'BarChart' | 'AreaChart' | 'ScatterChart' | 'ComposedChart' | 'PieChart';
  dataPoints: {
    xAxis: string;
    yAxis: string[];
    xAxisLabel: string;
    yAxisLabel: string;
    aggregation?: string;
    groupBy?: string[];
    statisticalOverlays?: string[];
  };
  reason: string;
  technicalNotes?: {
    dataPreparation?: string;
    limitations?: string;
  };
}

interface ZoomState {
  domain?: {
    x: [number, number];
    y: [number, number];
  };
}

interface GroupedData {
  [key: string]: {
    [key: string]: any;
    _count: number;
    _sum: { [key: string]: number };
    _min: { [key: string]: number };
    _max: { [key: string]: number };
    _values: { [key: string]: number[] };
  }
}

interface ChartContainerProps {
  recommendations: VisualizationRecommendation[];
  data: any[];
}

const calculateDataRange = (data: any[], key: string): { min: number; max: number } => {
  const values = data.map(item => Number(item[key])).filter(val => !isNaN(val));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.1; // Add 10% padding
  return {
    min: min - padding,
    max: max + padding
  };
};

const getAxisDomain = (data: any[], key: string): [number, number] => {
  const range = calculateDataRange(data, key);
  return [range.min, range.max] as [number, number];
};

export const ChartContainer = ({
  recommendations = [],
  data = [],
}: ChartContainerProps) => {
  const { theme } = useContext(ThemeContext);
  console.log('ChartContainer received props:', { 
    recommendationsCount: recommendations.length,
    dataCount: data.length,
    firstRecommendation: recommendations[0],
    sampleData: data.slice(0, 2)
  });

  const [zoomStates, setZoomStates] = useState<{[key: string]: ZoomState}>({});

  // Early return if no recommendations
  if (!recommendations || recommendations.length === 0) {
    console.log('No recommendations available');
    return (
      <div className="flex items-center justify-center p-6 text-gray-500">
        No visualization recommendations available
      </div>
    );
  }

  // Early return if no data
  if (!data || data.length === 0) {
    console.log('No data available');
    return (
      <div className="flex items-center justify-center p-6 text-gray-500">
        No data available for visualization
      </div>
    );
  }

  const processData = (data: any[], recommendation: VisualizationRecommendation) => {
    if (!recommendation || !recommendation.dataPoints) {
      console.log('Invalid recommendation format:', recommendation);
      return [];
    }

    const { dataPoints } = recommendation;
    if (!dataPoints.xAxis || !dataPoints.yAxis || dataPoints.yAxis.length === 0) {
      console.log('Missing required data points:', dataPoints);
      return [];
    }

    const xAxisType = detectDataType(data, dataPoints.xAxis);
    console.log('Processing chart data:', {
      chartType: recommendation.chartType,
      xAxis: dataPoints.xAxis,
      yAxis: dataPoints.yAxis,
      xAxisType,
      sampleData: data.slice(0, 2)
    });
    
    // Process the raw data
    const processedRawData = data.map((item: Record<string, any>) => {
      const processed: Record<string, any> = {};
      
      // Process X-axis data
      if (xAxisType === 'date') {
        processed[dataPoints.xAxis] = new Date(item[dataPoints.xAxis]);
      } else if (xAxisType === 'number') {
        processed[dataPoints.xAxis] = Number(item[dataPoints.xAxis]) || 0;
      } else {
        processed[dataPoints.xAxis] = item[dataPoints.xAxis];
      }
      
      // Process Y-axis data
      dataPoints.yAxis.forEach(key => {
        const value = Number(item[key]);
        processed[key] = isNaN(value) ? 0 : value;
      });
      
      return processed;
    });

    // Filter out any invalid data points
    const validData = processedRawData.filter(item => 
      item[dataPoints.xAxis] !== undefined && 
      item[dataPoints.xAxis] !== null &&
      dataPoints.yAxis.every(key => 
        item[key] !== undefined && 
        item[key] !== null && 
        !isNaN(item[key])
      )
    );

    console.log('Processed data sample:', validData.slice(0, 2));

    // Aggregate if needed
    if (xAxisType === 'category' || dataPoints.groupBy) {
      const aggregated = aggregateData(
        validData,
        dataPoints.xAxis,
        dataPoints.yAxis,
        dataPoints.aggregation as 'sum' | 'average' | 'count'
      );
      console.log('Aggregated data sample:', aggregated.slice(0, 2));
      return aggregated;
    }

    return validData;
  };

  const handleZoom = (chartId: string, domain: { x: [number, number]; y: [number, number] }) => {
    setZoomStates(prev => ({
      ...prev,
      [chartId]: { domain }
    }));
  };

  const handleResetZoom = (chartId: string) => {
    setZoomStates(prev => ({
      ...prev,
      [chartId]: { domain: undefined }
    }));
  };

  const renderChart = (recommendation: VisualizationRecommendation, index: number) => {
    if (!recommendation || !recommendation.dataPoints) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Invalid chart configuration
        </div>
      );
    }

    const chartData = processData(data, recommendation);
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          No data available for this chart
        </div>
      );
    }

    const chartId = `chart-${index}`;
    const zoomState = zoomStates[chartId] || {};

    const commonAxisProps = {
      xAxis: <XAxis 
        dataKey={recommendation.dataPoints.xAxis}
        type={detectDataType(data, recommendation.dataPoints.xAxis) === 'category' ? 'category' : 'number'}
        domain={zoomState.domain?.x || ['auto', 'auto']}
        tickFormatter={formatValue}
        height={60}
        tick={(props) => {
          const { x, y, payload } = props;
          return (
            <g transform={`translate(${x},${y})`}>
              <text
                x={0}
                y={0}
                dy={10}
                textAnchor="end"
                fill={theme === 'dark' ? '#e5e5e5' : '#666'}
                transform="rotate(-45)"
                style={{ fontSize: '11px' }}
              >
                {formatValue(payload.value)}
              </text>
            </g>
          );
        }}
        label={{ 
          value: recommendation.dataPoints.xAxisLabel,
          position: 'bottom',
          offset: 45,
          style: {
            fontSize: 12,
            fill: theme === 'dark' ? '#e5e5e5' : '#666'
          }
        }}
      />,
      yAxis: <YAxis 
        type={detectDataType(data, recommendation.dataPoints.yAxis[0]) === 'category' ? 'category' : 'number'}
        domain={zoomState.domain?.y || ['auto', 'auto']}
        tickFormatter={formatValue}
        width={70}
        tick={(props) => {
          const { x, y, payload } = props;
          return (
            <g transform={`translate(${x},${y})`}>
              <text
                x={0}
                y={0}
                textAnchor="end"
                fill={theme === 'dark' ? '#e5e5e5' : '#666'}
                style={{ fontSize: '11px' }}
              >
                {formatValue(payload.value)}
              </text>
            </g>
          );
        }}
        label={{ 
          value: recommendation.dataPoints.yAxisLabel,
          angle: -90,
          position: 'left',
          offset: 55,
          style: {
            fontSize: 12,
            fill: theme === 'dark' ? '#e5e5e5' : '#666'
          }
        }}
      />,
      cartesianGrid: <CartesianGrid 
        strokeDasharray="3 3" 
        stroke={theme === 'dark' ? '#404040' : '#f0f0f0'}
      />,
      tooltip: <Tooltip 
        formatter={formatValue}
        contentStyle={{ 
          backgroundColor: theme === 'dark' ? '#1f1f1f' : 'white',
          borderRadius: '8px',
          padding: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: 11,
          color: theme === 'dark' ? '#e5e5e5' : 'inherit'
        }}
      />,
      legend: <Legend 
        verticalAlign="top"
        height={36}
        wrapperStyle={{
          fontSize: 11,
          paddingBottom: 10,
          color: theme === 'dark' ? '#e5e5e5' : 'inherit'
        }}
      />
    };

    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 80, bottom: 100 },
      height: 450
    };

    switch (recommendation.chartType) {
      case 'LineChart':
        return (
          <LineChart {...commonProps}>
            {commonAxisProps.cartesianGrid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            {recommendation.dataPoints.yAxis.map((key: string, index: number) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`hsl(${(index * 360) / recommendation.dataPoints.yAxis.length}, 70%, 50%)`}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name={key.split(/(?=[A-Z])/).join(' ')}
                isAnimationActive={true}
              />
            ))}
            <Brush 
              dataKey={recommendation.dataPoints.xAxis} 
              height={30} 
              stroke="#8884d8"
              travellerWidth={10}
              startIndex={0}
              endIndex={chartData.length > 10 ? 9 : chartData.length - 1}
              y={400}
              fill="#fff"
            />
          </LineChart>
        );

      case 'BarChart':
        return (
          <BarChart {...commonProps}>
            {commonAxisProps.cartesianGrid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            {recommendation.dataPoints.yAxis.map((key: string, index: number) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`hsl(${(index * 360) / recommendation.dataPoints.yAxis.length}, 70%, 50%)`}
                radius={[4, 4, 0, 0]}
                name={key.split(/(?=[A-Z])/).join(' ')}
                isAnimationActive={true}
              />
            ))}
            <Brush 
              dataKey={recommendation.dataPoints.xAxis} 
              height={30} 
              stroke="#8884d8"
              travellerWidth={10}
              startIndex={0}
              endIndex={chartData.length > 10 ? 9 : chartData.length - 1}
              y={400}
              fill="#fff"
            />
          </BarChart>
        );

      case 'AreaChart':
        return (
          <AreaChart {...commonProps}>
            {commonAxisProps.cartesianGrid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            {recommendation.dataPoints.yAxis.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                fill={`hsl(${(index * 360) / recommendation.dataPoints.yAxis.length}, 70%, 50%)`}
                stroke={`hsl(${(index * 360) / recommendation.dataPoints.yAxis.length}, 70%, 40%)`}
                name={key.split(/(?=[A-Z])/).join(' ')}
                isAnimationActive={true}
              />
            ))}
            <Brush 
              dataKey={recommendation.dataPoints.xAxis} 
              height={30} 
              stroke="#8884d8"
              travellerWidth={10}
              startIndex={0}
              endIndex={chartData.length > 10 ? 9 : chartData.length - 1}
              y={400}
              fill="#fff"
            />
          </AreaChart>
        );

      case 'ScatterChart':
        return (
          <ScatterChart {...commonProps}>
            {commonAxisProps.cartesianGrid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            {recommendation.dataPoints.yAxis.map((key, index) => (
              <Scatter
                key={key}
                name={key}
                data={chartData}
                fill={`hsl(${(index * 360) / recommendation.dataPoints.yAxis.length}, 70%, 50%)`}
                isAnimationActive={true}
              />
            ))}
          </ScatterChart>
        );

      case 'ComposedChart':
        return (
          <ComposedChart {...commonProps}>
            {commonAxisProps.cartesianGrid}
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            {recommendation.dataPoints.yAxis.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`hsl(${(index * 360) / recommendation.dataPoints.yAxis.length}, 70%, 50%)`}
                name={key.split(/(?=[A-Z])/).join(' ')}
                isAnimationActive={true}
              />
            ))}
            <Brush 
              dataKey={recommendation.dataPoints.xAxis} 
              height={30} 
              stroke="#8884d8"
              travellerWidth={10}
              startIndex={0}
              endIndex={chartData.length > 10 ? 9 : chartData.length - 1}
              y={400}
              fill="#fff"
            />
          </ComposedChart>
        );

      case 'PieChart':
        return (
          <PieChart {...commonProps}>
            {commonAxisProps.tooltip}
            {commonAxisProps.legend}
            <Pie
              data={chartData}
              dataKey={recommendation.dataPoints.yAxis[0]}
              nameKey={recommendation.dataPoints.xAxis}
              cx="50%"
              cy="50%"
              outerRadius={200}
              label
              isAnimationActive={true}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`hsl(${(index * 360) / chartData.length}, 70%, 50%)`}
                />
              ))}
            </Pie>
          </PieChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            Unsupported chart type
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 p-6 relative bg-background text-foreground min-h-screen">
      <ThemeToggle />
      {recommendations.map((recommendation, index) => (
        recommendation && (
          <Card 
            key={`chart-${index}`} 
            className="p-6 bg-card text-card-foreground border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  {recommendation.title || 'Untitled Chart'}
                </h3>
                {recommendation.technicalNotes?.dataPreparation && (
                  <p className="text-sm text-muted-foreground">
                    {recommendation.technicalNotes.dataPreparation}
                  </p>
                )}
              </div>
            </div>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height={500}>
                {renderChart(recommendation, index)}
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                {recommendation.reason || 'No description available'}
              </p>
              {recommendation.technicalNotes?.limitations && (
                <p className="text-xs text-muted-foreground/80">
                  {recommendation.technicalNotes.limitations}
                </p>
              )}
            </div>
          </Card>
        )
      ))}
    </div>
  );
}; 