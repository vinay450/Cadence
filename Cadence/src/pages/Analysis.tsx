import DataAnalysisDashboard from '@/components/DataAnalysisDashboard'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LineChart } from '@/components/visualizations/LineChart'
import { ComposedChart } from '@/components/visualizations/ComposedChart'

// Helper: get chart component by type
const chartComponentMap: Record<string, any> = {
  LineChart,
  ComposedChart,
}

export default function Analysis() {
  const [analysisData, setAnalysisData] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [tableData, setTableData] = useState<{ headers: string[], rows: string[][] } | null>(null)
  const [claudeLog, setClaudeLog] = useState<any>(null)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [isLogMinimized, setIsLogMinimized] = useState(false)
  const [tableSearch, setTableSearch] = useState('')

  const handleAnalysis = async (data: string) => {
    setIsAnalyzing(true)
    try {
      // Parse CSV data for table display
      const rows = data.split('\n').map(row => row.split(','))
      const headers = rows[0]
      const dataRows = rows.slice(1)
      setTableData({ headers, rows: dataRows })
      // Parse CSV into array of objects for charting
      const objects = dataRows.map(row => {
        const obj: any = {}
        headers.forEach((header, i) => {
          obj[header] = row[i]
        })
        return obj
      })
      setParsedData(objects)

      const response = await fetch('https://awuibcrmituuaailkrdl.supabase.co/functions/v1/bright-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3dWliY3JtaXR1dWFhaWxrcmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MjA0NzcsImV4cCI6MjAyNTQ5NjQ3N30.RqOyoXZ_1UoFnYwsOAJeqNwFNe_z_5YlDO-_h0JQZL4',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3dWliY3JtaXR1dWFhaWxrcmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MjA0NzcsImV4cCI6MjAyNTQ5NjQ3N30.RqOyoXZ_1UoFnYwsOAJeqNwFNe_z_5YlDO-_h0JQZL4'
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: 'You are a data analysis expert. Please analyze this dataset.'
          }],
          data: data
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setClaudeLog(result)
      console.log('Claude analysis text:', result.analysis)
      setAnalysisData(result.analysis || 'No analysis available')
    } catch (error) {
      console.error('Error during analysis:', error)
      setAnalysisData('Error performing analysis')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Data Analysis Made Simple
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your datasets and get instant insights through our AI-powered analysis platform.
          </p>
        </div>

        <DataAnalysisDashboard onAnalysis={handleAnalysis} isAnalyzing={isAnalyzing} />

        {analysisData && (
          <div className="mt-8 space-y-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {analysisData}
              </pre>
            </div>

            {tableData && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Data Preview</h2>
                <input
                  type="text"
                  placeholder="Search table..."
                  value={tableSearch}
                  onChange={e => setTableSearch(e.target.value)}
                  className="mb-4 px-3 py-2 border rounded w-full max-w-xs text-sm"
                />
                <div className="overflow-x-auto">
                  <div className="max-h-[400px] overflow-y-auto border rounded">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {tableData.headers.map((header, index) => (
                            <TableHead
                              key={index}
                              className="font-semibold sticky top-0 bg-white z-10"
                            >
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.rows
                          .filter(row =>
                            tableSearch.trim() === '' ||
                            row.some(cell =>
                              cell && cell.toString().toLowerCase().includes(tableSearch.toLowerCase())
                            )
                          )
                          .map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex}>
                                  {cell}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}

            {/* Chart Recommendations Section */}
            {claudeLog?.visualizations?.recommendations && parsedData.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6 mt-8">
                <h2 className="text-2xl font-semibold mb-4">Recommended Visualizations</h2>
                <div className="grid grid-cols-1 gap-8">
                  {claudeLog.visualizations.recommendations.slice(0, 2).map((rec: any, idx: number) => {
                    const ChartComponent = chartComponentMap[rec.chartType]
                    return (
                      <div key={idx} className="flex flex-col">
                        <h3 className="text-lg font-bold mb-2">{rec.title}</h3>
                        <p className="mb-2 text-gray-600">{rec.insights}</p>
                        {ChartComponent ? (
                          <div className="h-80 min-w-[600px]">
                            <ChartComponent
                              data={parsedData}
                              dataPoints={rec.dataPoints}
                              xAxisLabel={rec.dataPoints.xAxisLabel}
                              yAxisLabel={rec.dataPoints.yAxisLabel}
                            />
                          </div>
                        ) : (
                          <div className="text-red-500">Chart type {rec.chartType} not supported.</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Claude Log Section */}
        {claudeLog && !isLogMinimized && (
          <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-gray-100 p-4 border-t border-gray-700 z-50 max-h-72 overflow-y-auto transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Claude Full Response Log</span>
              <button
                className="text-gray-400 hover:text-gray-200 text-xs px-2 py-1 border border-gray-700 rounded"
                onClick={() => setIsLogMinimized(true)}
                aria-label="Minimize log"
              >
                Minimize
              </button>
            </div>
            <pre className="text-xs whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
              {JSON.stringify(claudeLog, null, 2)}
            </pre>
          </div>
        )}
        {claudeLog && isLogMinimized && (
          <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-gray-100 px-4 py-2 border-t border-gray-700 z-50 flex items-center justify-between cursor-pointer transition-all">
            <span className="font-semibold text-xs">Claude Full Response Log (minimized)</span>
            <button
              className="text-gray-400 hover:text-gray-200 text-xs px-2 py-1 border border-gray-700 rounded ml-2"
              onClick={() => setIsLogMinimized(false)}
              aria-label="Restore log"
            >
              Restore
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 