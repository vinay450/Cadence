import DataAnalysisDashboard from '@/components/DataAnalysisDashboard'
import AnimatedTextAnalysis from '@/components/AnimatedTextAnalysis'
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
import { ScatterChart } from '@/components/visualizations/ScatterChart'
import { BarChart } from '@/components/visualizations/BarChart'

// Helper: get chart component by type
const chartComponentMap: Record<string, any> = {
  LineChart,
  ComposedChart,
  ScatterChart,
  BarChart,
}

export default function AnalysisApp() {
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
          // Convert numeric strings to numbers
          const value = row[i]
          obj[header] = !isNaN(Number(value)) ? Number(value) : value
        })
        return obj
      })
      
      console.log('Parsed Objects:', objects)
      
      // If we have a recommendation, sort by its x-axis key
      let sortedObjects = objects
      if (claudeLog?.visualizations?.recommendations?.[0]?.dataPoints?.xAxis) {
        const xKey = claudeLog.visualizations.recommendations[0].dataPoints.xAxis
        sortedObjects = [...objects].sort((a, b) => {
          // Try to parse as number, fallback to string
          const aVal = isNaN(Number(a[xKey])) ? a[xKey] : Number(a[xKey])
          const bVal = isNaN(Number(b[xKey])) ? b[xKey] : Number(b[xKey])
          if (aVal < bVal) return -1
          if (aVal > bVal) return 1
          return 0
        })
      }
      
      console.log('Sorted Objects:', sortedObjects)
      setParsedData(sortedObjects)

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
    <div className="space-y-8">
      <DataAnalysisDashboard onAnalysis={handleAnalysis} isAnalyzing={isAnalyzing} />

      {(analysisData || isAnalyzing) && (
        <div className="space-y-8">
          <AnimatedTextAnalysis text={analysisData} isAnalyzing={isAnalyzing} />

          {tableData && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Data Preview</h2>
              <input
                type="text"
                placeholder="Search table..."
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
                className="mb-4 px-3 py-2 border rounded w-full max-w-xs text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <div className="overflow-x-auto">
                <div className="max-h-[400px] overflow-y-auto border rounded">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {tableData.headers.map((header, index) => (
                          <TableHead
                            key={index}
                            className="font-semibold sticky top-0 bg-white z-10 dark:bg-gray-800"
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
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Recommended Visualizations</h2>
              <div className="grid grid-cols-1 gap-8">
                {claudeLog.visualizations.recommendations.slice(0, 2).map((rec: any, idx: number) => {
                  const ChartComponent = chartComponentMap[rec.chartType]
                  console.log('Chart Recommendation:', rec)
                  console.log('Chart Data:', parsedData)
                  
                  // Sort data by the x-axis key for this chart, handling numbers as numbers
                  let sortedData = parsedData
                  if (rec.dataPoints?.xAxis) {
                    const xKey = rec.dataPoints.xAxis
                    // Check if all x values are numeric
                    const allNumeric = parsedData.every(row => !isNaN(Number(row[xKey])))
                    sortedData = [...parsedData].sort((a, b) => {
                      if (allNumeric) {
                        return Number(a[xKey]) - Number(b[xKey])
                      } else {
                        return String(a[xKey]).localeCompare(String(b[xKey]))
                      }
                    })
                    // If numeric, convert xKey values to numbers for the chart
                    if (allNumeric) {
                      sortedData = sortedData.map(row => ({ ...row, [xKey]: Number(row[xKey]) }))
                    }
                  }
                  
                  console.log('Final Chart Data:', sortedData)
                  console.log('Chart DataPoints:', rec.dataPoints)
                  
                  return (
                    <div key={idx} className="flex flex-col">
                      <h3 className="text-lg font-bold mb-2 dark:text-white">{rec.title}</h3>
                      <p className="mb-2 text-gray-600 dark:text-gray-300">{rec.insights}</p>
                      {ChartComponent ? (
                        <div className="h-80 min-w-[600px]">
                          <ChartComponent
                            data={sortedData}
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
  )
}
