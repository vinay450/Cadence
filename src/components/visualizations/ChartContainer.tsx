import React from 'react';
import { ChartRecommendation } from '@/lib/types/visualization';
import { LineChartComponent } from './charts/LineChart';
import { BarChartComponent } from './charts/BarChart';
import { AreaChartComponent } from './charts/AreaChart';
import { PieChartComponent } from './charts/PieChart';
import { ScatterChartComponent } from './charts/ScatterChart';
import { ComposedChartComponent } from './charts/ComposedChart';

interface ChartContainerProps {
  recommendation: ChartRecommendation;
  data: any[]; // Will be typed properly with data transformation utils
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  recommendation,
  data
}) => {
  const { chartType, dataPoints, xAxisLabel, yAxisLabel, title } = recommendation;

  // Select the appropriate chart component based on the recommendation
  const renderChart = () => {
    switch (chartType) {
      case 'LineChart':
        return (
          <LineChartComponent
            data={data}
            dataPoints={dataPoints}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
            title={title}
          />
        );
      case 'BarChart':
        return (
          <BarChartComponent
            data={data}
            dataPoints={dataPoints}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
            title={title}
          />
        );
      case 'AreaChart':
        return (
          <AreaChartComponent
            data={data}
            dataPoints={dataPoints}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
            title={title}
          />
        );
      case 'PieChart':
        return (
          <PieChartComponent
            data={data}
            dataPoints={dataPoints}
            title={title}
          />
        );
      case 'ScatterChart':
        return (
          <ScatterChartComponent
            data={data}
            dataPoints={dataPoints}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
            title={title}
          />
        );
      case 'ComposedChart':
        return (
          <ComposedChartComponent
            data={data}
            dataPoints={dataPoints}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
            title={title}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Unsupported chart type: {chartType}</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full">
      {renderChart()}
    </div>
  );
}; 