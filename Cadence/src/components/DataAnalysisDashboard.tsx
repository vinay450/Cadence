import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import FileUpload from './FileUpload'
import { analyzeDataset, AnalysisResult } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import { LineChart } from './visualizations/LineChart'
import { BarChart } from './visualizations/BarChart'
import { ScatterChart } from './visualizations/ScatterChart'
import { AreaChart } from './visualizations/AreaChart'
import { PieChart } from './visualizations/PieChart'
import { ComposedChart } from './visualizations/ComposedChart'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, FileText, Upload } from 'lucide-react'

const ChartComponents = {
  LineChart,
  BarChart,
  ScatterChart,
  AreaChart,
  PieChart,
  ComposedChart
}

interface DataAnalysisDashboardProps {
  onAnalysis: (data: string) => void;
  isAnalyzing: boolean;
}

export default function DataAnalysisDashboard({ onAnalysis, isAnalyzing }: DataAnalysisDashboardProps) {
  const [loading, setLoading] = useState(false)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const { toast } = useToast()

  const handleFileUpload = async (file: File) => {
    setLoading(true)
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result as string
        if (text) {
          setFileContent(text)
          setFileName(file.name)
          toast({
            title: 'Success',
            description: 'File uploaded successfully. Click "Start Analysis" to begin.',
            variant: 'default'
          })
        }
      }
      reader.readAsText(file)
    } catch (error) {
      console.error('Upload failed:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStartAnalysis = () => {
    if (fileContent) {
      onAnalysis(fileContent)
    }
  }

  const handleReplaceFile = () => {
    setFileContent(null)
    setFileName(null)
  }

  return (
    <div className="p-6 space-y-6">
      {!fileName ? (
        <FileUpload onUpload={handleFileUpload} loading={loading} />
      ) : (
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileName}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                File uploaded successfully
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleReplaceFile}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Replace File</span>
              </Button>
              <Button
                onClick={handleStartAnalysis}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={loading || isAnalyzing}
              >
                {(loading || isAnalyzing) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Start Analysis'
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dataset Overview */}
          <Card className="col-span-2">
            <h2 className="text-2xl font-bold mb-4">Dataset Overview</h2>
            <div className="prose dark:prose-invert">
              <p>{result.analysis}</p>
            </div>
          </Card>

          {/* Data Quality */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Data Quality</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Completeness</h3>
                <ul className="list-disc list-inside">
                  {Object.entries(result.visualizations.dataQualityMetrics.completeness).map(([column, value]) => (
                    <li key={column}>{column}: {value}%</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Outliers</h3>
                <p>Total outliers found: {result.visualizations.dataQualityMetrics.outlierCount}</p>
              </div>
              {result.visualizations.dataQualityMetrics.anomalies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Anomalies</h3>
                  <ul className="list-disc list-inside">
                    {result.visualizations.dataQualityMetrics.anomalies.map((anomaly, index) => (
                      <li key={index}>{anomaly}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>

          {/* Statistical Summary */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Statistical Summary</h2>
            <div className="space-y-4">
              {result.visualizations.statisticalSummary.correlations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Correlations</h3>
                  <ul className="list-disc list-inside">
                    {result.visualizations.statisticalSummary.correlations.map((correlation, index) => (
                      <li key={index}>{correlation}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.visualizations.statisticalSummary.trends.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Trends</h3>
                  <ul className="list-disc list-inside">
                    {result.visualizations.statisticalSummary.trends.map((trend, index) => (
                      <li key={index}>{trend}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>

          {/* Visualizations */}
          {result.visualizations.recommendations.map((recommendation, index) => {
            const ChartComponent = ChartComponents[recommendation.chartType]
            return (
              <Card key={index}>
                <h2 className="text-2xl font-bold mb-4">{recommendation.title}</h2>
                <p className="mb-4">{recommendation.insights}</p>
                {ChartComponent && (
                  <div className="h-64">
                    <ChartComponent
                      dataPoints={recommendation.dataPoints}
                      xAxisLabel={recommendation.dataPoints.xAxisLabel}
                      yAxisLabel={recommendation.dataPoints.yAxisLabel}
                    />
                  </div>
                )}
              </Card>
            )
          })}

          {/* Key Insights */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Key Insights</h2>
            <ul className="list-disc list-inside space-y-2">
              {result.visualizations.businessInsights.keyFindings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>
          </Card>

          {/* Recommendations */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Actions</h3>
                <ul className="list-disc list-inside">
                  {result.visualizations.businessInsights.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
              {result.visualizations.businessInsights.riskFactors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Risk Factors</h3>
                  <ul className="list-disc list-inside">
                    {result.visualizations.businessInsights.riskFactors.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
} 