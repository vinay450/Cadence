import DataAnalysisDashboard from '@/components/DataAnalysisDashboard'
import AnimatedTextAnalysis from '@/components/AnimatedTextAnalysis'
import ChatBot from '@/components/ChatBot'
import DataNavigationSection from '@/components/DataNavigationSection'
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
import { ArrowUpDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Helper: get chart component by type
const chartComponentMap: Record<string, any> = {
  LineChart,
  ComposedChart,
  ScatterChart,
  BarChart,
}

type SortDirection = 'asc' | 'desc' | null

interface TableRow {
  [key: string]: string | number;
}

export default function AnalysisApp() {
  const [analysisData, setAnalysisData] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [tableData, setTableData] = useState<TableRow[]>([])
  const [claudeLog, setClaudeLog] = useState<any>(null)
  const [isLogMinimized, setIsLogMinimized] = useState(false)
  const [tableSearch, setTableSearch] = useState('')
  const [sortColumn, setSortColumn] = useState<number | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentData, setCurrentData] = useState<string | null>(null)

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      // Toggle direction if clicking the same column
      setSortDirection(current => {
        if (current === 'asc') return 'desc'
        if (current === 'desc') return null
        return 'asc'
      })
    } else {
      // Set new column and default to ascending
      setSortColumn(columnIndex)
      setSortDirection('asc')
    }
  }

  const getSortedRows = () => {
    if (!tableData || sortColumn === null || sortDirection === null) return tableData || []

    return [...tableData].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]
      
      // Check if values are numeric
      const aNum = Number(aVal)
      const bNum = Number(bVal)
      const isNumeric = !isNaN(aNum) && !isNaN(bNum)

      if (isNumeric) {
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum
      } else {
        return sortDirection === 'asc' 
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal))
      }
    })
  }

  const handleAnalysis = async (data: string) => {
    setIsAnalyzing(true)
    setCurrentData(data)
    setSessionId(null) // Reset session for new analysis

    // Wait for the next render cycle to ensure the loading section is rendered
    setTimeout(() => {
      const analysisSection = document.getElementById('ai-analysis')
      if (analysisSection) {
        const yOffset = -20 // Smaller offset to show the loading section
        const y = analysisSection.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }, 100)

    try {
      const { data: result, error } = await supabase.functions.invoke('chat', {
        body: {
          messages: [{
            role: 'user',
            content: 'Analyze this data'
          }],
          data,
          isNewAnalysis: true
        }
      })

      if (error) {
        throw error
      }

      if (!result || !result.analysis) {
        throw new Error('No analysis received from API')
      }

      setAnalysisData(result.analysis)
      
      // Parse CSV data for the data preview table
      if (data) {
        const lines = data.split('\n')
          .filter(line => line.trim() && !line.trim().startsWith('//') && !line.includes('const '))
          .map(line => line.trim())
        
        if (lines.length > 0) {
          const headers = lines[0].split(',').map(header => header.trim())
          const rows = lines.slice(1).map(line => {
            const values = line.split(',')
            return headers.reduce((obj: any, header: string, index: number) => {
              obj[header] = values[index]?.trim() || ''
              return obj
            }, {})
          }).filter(row => Object.values(row).some(value => value !== ''))
          
          setTableData(rows)
        }
      }

      // Store visualization recommendations
      if (result.visualizations?.recommendations) {
        setClaudeLog(result)
      }

      // Store session ID for future chat messages
      if (result.sessionId) {
        setSessionId(result.sessionId)
      }
    } catch (error) {
      console.error('Error getting analysis:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8">
      <DataAnalysisDashboard onAnalysis={handleAnalysis} isAnalyzing={isAnalyzing} />

      {(analysisData || isAnalyzing) && (
        <div className="space-y-8">
          {/* Navigation Section */}
          <DataNavigationSection />

          {/* AI Analysis Section */}
          <div id="ai-analysis">
            <AnimatedTextAnalysis text={analysisData} isAnalyzing={isAnalyzing} />
          </div>

          {/* ChatBot Section */}
          <div id="chat-section">
            <ChatBot 
              data={currentData || undefined}
              sessionId={sessionId || undefined}
              onSessionIdUpdate={setSessionId}
            />
          </div>

          {/* Data Preview Section */}
          {tableData && tableData.length > 0 && (
            <div id="data-preview" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold dark:text-white">Data Preview</h2>
                <input
                  type="text"
                  placeholder="Search table..."
                  value={tableSearch}
                  onChange={e => setTableSearch(e.target.value)}
                  className="px-3 py-2 border rounded w-64 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="relative">
                <div className="overflow-x-auto">
                  <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <TableRow>
                          {Object.keys(tableData[0]).map((header, index) => (
                            <TableHead
                              key={header}
                              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap"
                              onClick={() => handleSort(index)}
                            >
                              <div className="flex items-center gap-2">
                                {header}
                                {sortColumn === index && (
                                  <ArrowUpDown className="h-4 w-4" />
                                )}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getSortedRows()
                          .filter(row => 
                            Object.values(row).some(cell => 
                              String(cell).toLowerCase().includes(tableSearch.toLowerCase())
                            )
                          )
                          .map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {Object.entries(row).map(([key, value]) => (
                                <TableCell key={`${rowIndex}-${key}`} className="whitespace-nowrap">
                                  {value}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chart Recommendations Section */}
          {claudeLog?.visualizations?.recommendations && (
            <div id="visualizations" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
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
