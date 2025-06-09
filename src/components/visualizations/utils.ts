export const detectDataType = (data: Record<string, any>[], key: string): 'number' | 'date' | 'category' => {
  const sample = data.find(item => item[key] !== undefined && item[key] !== null)?.[key];
  if (!isNaN(Number(sample))) return 'number';
  if (!isNaN(Date.parse(sample))) return 'date';
  return 'category';
};

export const formatValue = (value: any): string => {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === 'number') {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
  return String(value);
};

export const aggregateData = (
  data: Record<string, any>[],
  xAxis: string,
  yAxis: string[],
  aggregation: 'sum' | 'average' | 'count' = 'average'
): Record<string, any>[] => {
  // Group data by x-axis value
  const groupedData = data.reduce<Record<string, Record<string, any>[]>>((acc, item) => {
    const key = item[xAxis];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  // Aggregate each group
  return Object.entries(groupedData).map(([key, group]) => {
    const result: Record<string, any> = {
      [xAxis]: key
    };

    yAxis.forEach(yKey => {
      switch (aggregation) {
        case 'sum':
          result[yKey] = group.reduce((sum: number, item: Record<string, any>) => sum + (Number(item[yKey]) || 0), 0);
          break;
        case 'average':
          result[yKey] = group.reduce((sum: number, item: Record<string, any>) => sum + (Number(item[yKey]) || 0), 0) / group.length;
          break;
        case 'count':
          result[yKey] = group.length;
          break;
      }
    });

    return result;
  });
}; 