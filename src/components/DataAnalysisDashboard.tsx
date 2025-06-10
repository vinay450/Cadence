import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FileUpload from './FileUpload'
import { Upload, Brain, Zap } from 'lucide-react'

interface DataAnalysisDashboardProps {
  onAnalysis: (data: string) => void
  isAnalyzing: boolean
}

export default function DataAnalysisDashboard({ onAnalysis, isAnalyzing }: DataAnalysisDashboardProps) {
  const [data, setData] = useState('')

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileData = e.target?.result as string
      setData(fileData)
      onAnalysis(fileData)
    }
    reader.readAsText(file)
  }

  const handleAnalyze = () => {
    if (data) {
      onAnalysis(data)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-blue-800 shadow-lg">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              AI Data Analytics Platform
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload your CSV data and get comprehensive analysis with automated insights and visualizations.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Upload Your Dataset
            </h3>
            <FileUpload onUpload={handleFileUpload} loading={isAnalyzing} />
          </div>

          {data && (
            <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Dataset loaded successfully
                  </span>
                </div>
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Data'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
