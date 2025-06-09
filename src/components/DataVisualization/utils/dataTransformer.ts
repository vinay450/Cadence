import Papa from 'papaparse';

export interface ChartConfiguration {
  chartType: 'LineChart' | 'BarChart' | 'AreaChart' | 'PieChart' | 'ScatterChart' | 'ComposedChart';
  reason: string;
  configuration: {
    xAxis: {
      dataKey: string;
      label: string;
    };
    yAxis: {
      dataKey: string[];
      label: string;
    };
    groupBy?: string;
    aggregation?: 'sum' | 'average' | 'count';
    title: string;
  };
}

export interface TransformedData {
  data: any[];
  columns: string[];
}

export const transformCSVData = (csvContent: string): TransformedData => {
  const parseResult = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true, // Automatically convert numbers
  });

  return {
    data: parseResult.data,
    columns: parseResult.meta.fields || [],
  };
};

export const aggregateData = (
  data: any[],
  config: ChartConfiguration['configuration'],
): any[] => {
  if (!config.groupBy || !config.aggregation) {
    return data;
  }

  const groupedData = data.reduce((acc, row) => {
    const key = row[config.groupBy!];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(row);
    return acc;
  }, {});

  return Object.entries(groupedData).map(([key, group]: [string, any[]]) => {
    const result: any = {
      [config.groupBy!]: key,
    };

    config.yAxis.dataKey.forEach(yKey => {
      switch (config.aggregation) {
        case 'sum':
          result[yKey] = (group as any[]).reduce((sum, row) => sum + (Number(row[yKey]) || 0), 0);
          break;
        case 'average':
          result[yKey] = (group as any[]).reduce((sum, row) => sum + (Number(row[yKey]) || 0), 0) / group.length;
          break;
        case 'count':
          result[yKey] = group.length;
          break;
      }
    });

    return result;
  });
};

export const prepareChartData = (
  rawData: string,
  config: ChartConfiguration,
): TransformedData => {
  const { data, columns } = transformCSVData(rawData);
  const processedData = aggregateData(data, config.configuration);

  return {
    data: processedData,
    columns,
  };
}; 