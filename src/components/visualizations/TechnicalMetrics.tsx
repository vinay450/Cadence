import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { StatisticalMetrics, TechnicalNotes, DataQualityMetrics } from '@/lib/types/visualization';

interface TechnicalMetricsProps {
  statisticalMetrics?: StatisticalMetrics;
  technicalNotes?: TechnicalNotes;
  dataQualityMetrics?: DataQualityMetrics;
  correlationMatrix?: Record<string, Record<string, number>>;
  timeSeriesMetrics?: {
    seasonality?: {
      pattern: string;
      period: number;
    };
    trend?: {
      direction: 'increasing' | 'decreasing' | 'stable';
      magnitude: number;
    };
    stationarity?: {
      isStationary: boolean;
      pValue: number;
    };
  };
}

export const TechnicalMetrics: React.FC<TechnicalMetricsProps> = ({
  statisticalMetrics,
  technicalNotes,
  dataQualityMetrics,
  correlationMatrix,
  timeSeriesMetrics,
}) => {
  const getBadgeVariant = (value: number) => {
    return value > 0.9 ? "default" : "secondary";
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Technical Analysis</CardTitle>
        <CardDescription>
          Detailed statistical metrics and data quality information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {statisticalMetrics && (
            <AccordionItem value="statistical">
              <AccordionTrigger>Statistical Metrics</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4">
                  {statisticalMetrics.mean !== undefined && (
                    <div>
                      <span className="font-medium">Mean:</span> {statisticalMetrics.mean.toFixed(2)}
                    </div>
                  )}
                  {statisticalMetrics.median !== undefined && (
                    <div>
                      <span className="font-medium">Median:</span> {statisticalMetrics.median.toFixed(2)}
                    </div>
                  )}
                  {statisticalMetrics.standardDeviation !== undefined && (
                    <div>
                      <span className="font-medium">Std Dev:</span> {statisticalMetrics.standardDeviation.toFixed(2)}
                    </div>
                  )}
                  {statisticalMetrics.quartiles && (
                    <div>
                      <span className="font-medium">Quartiles:</span> Q1: {statisticalMetrics.quartiles[0].toFixed(2)}, Q3: {statisticalMetrics.quartiles[1].toFixed(2)}
                    </div>
                  )}
                  {statisticalMetrics.skewness !== undefined && (
                    <div>
                      <span className="font-medium">Skewness:</span> {statisticalMetrics.skewness.toFixed(2)}
                    </div>
                  )}
                  {statisticalMetrics.kurtosis !== undefined && (
                    <div>
                      <span className="font-medium">Kurtosis:</span> {statisticalMetrics.kurtosis.toFixed(2)}
                    </div>
                  )}
                  {statisticalMetrics.outliers && (
                    <div className="col-span-2">
                      <span className="font-medium">Outliers:</span> {statisticalMetrics.outliers.count} points between [{statisticalMetrics.outliers.range[0].toFixed(2)}, {statisticalMetrics.outliers.range[1].toFixed(2)}]
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {technicalNotes && (
            <AccordionItem value="technical">
              <AccordionTrigger>Technical Notes</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Data Preparation</h4>
                    <p className="text-sm text-gray-600">{technicalNotes.dataPreparation}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Statistical Tests</h4>
                    <p className="text-sm text-gray-600">{technicalNotes.statisticalTests}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Limitations</h4>
                    <p className="text-sm text-gray-600">{technicalNotes.limitations}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {dataQualityMetrics && (
            <AccordionItem value="quality">
              <AccordionTrigger>Data Quality</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Completeness</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(dataQualityMetrics.completeness).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm">{key}:</span>
                          <Badge variant={getBadgeVariant(value)}>
                            {(value * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Uniqueness</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(dataQualityMetrics.uniqueness).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm">{key}:</span>
                          <Badge variant="secondary">{(value * 100).toFixed(1)}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Overall Consistency</h4>
                    <Badge variant={getBadgeVariant(dataQualityMetrics.consistency)}>
                      {(dataQualityMetrics.consistency * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {correlationMatrix && (
            <AccordionItem value="correlations">
              <AccordionTrigger>Correlation Matrix</AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-2 py-2 bg-gray-50"></th>
                        {Object.keys(correlationMatrix).map((key) => (
                          <th key={key} className="px-2 py-2 bg-gray-50 text-sm font-medium text-gray-500">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {Object.entries(correlationMatrix).map(([row, cols]) => (
                        <tr key={row}>
                          <td className="px-2 py-2 text-sm font-medium text-gray-500">{row}</td>
                          {Object.entries(cols).map(([col, value]) => (
                            <td key={col} className="px-2 py-2 text-sm text-gray-500">
                              {value.toFixed(2)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {timeSeriesMetrics && (
            <AccordionItem value="timeseries">
              <AccordionTrigger>Time Series Analysis</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {timeSeriesMetrics.seasonality && (
                    <div>
                      <h4 className="font-medium mb-2">Seasonality</h4>
                      <p className="text-sm text-gray-600">
                        Pattern: {timeSeriesMetrics.seasonality.pattern}<br />
                        Period: {timeSeriesMetrics.seasonality.period} units
                      </p>
                    </div>
                  )}
                  {timeSeriesMetrics.trend && (
                    <div>
                      <h4 className="font-medium mb-2">Trend</h4>
                      <Badge variant={timeSeriesMetrics.trend.direction === 'increasing' ? 'default' : timeSeriesMetrics.trend.direction === 'decreasing' ? 'destructive' : 'secondary'}>
                        {timeSeriesMetrics.trend.direction} ({timeSeriesMetrics.trend.magnitude.toFixed(2)})
                      </Badge>
                    </div>
                  )}
                  {timeSeriesMetrics.stationarity && (
                    <div>
                      <h4 className="font-medium mb-2">Stationarity</h4>
                      <Badge variant={timeSeriesMetrics.stationarity.isStationary ? 'default' : 'secondary'}>
                        {timeSeriesMetrics.stationarity.isStationary ? 'Stationary' : 'Non-stationary'} (p={timeSeriesMetrics.stationarity.pValue.toFixed(3)})
                      </Badge>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}; 