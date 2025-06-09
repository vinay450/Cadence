import React, { useEffect, useState } from 'react';
import BaseChart from './ChartComponents/BaseChart';
import { prepareChartData, type ChartConfiguration } from './utils/dataTransformer';

interface VisualizationContainerProps {
  csvData: string;
  visualizationConfig: {
    recommendations: ChartConfiguration[];
  };
}

const VisualizationContainer: React.FC<VisualizationContainerProps> = ({
  csvData,
  visualizationConfig,
}) => {
  const [chartData, setChartData] = useState<Array<{
    data: any[];
    config: ChartConfiguration;
  }>>([]);

  useEffect(() => {
    if (!csvData || !visualizationConfig?.recommendations) {
      return;
    }

    const preparedData = visualizationConfig.recommendations.map(config => ({
      data: prepareChartData(csvData, config).data,
      config,
    }));

    setChartData(preparedData);
  }, [csvData, visualizationConfig]);

  if (!chartData.length) {
    return <div>No visualization data available</div>;
  }

  return (
    <div className="visualizations-grid">
      {chartData.map((chart, index) => (
        <div key={index} className="visualization-item">
          <BaseChart data={chart.data} config={chart.config} />
        </div>
      ))}
      <style jsx>{`
        .visualizations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 2rem;
          padding: 1rem;
        }
        
        .visualization-item {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default VisualizationContainer; 