import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, Sparkles } from 'lucide-react'
import FileUpload from './FileUpload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

const MODEL_OPTIONS = [
  { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', cost: 'Low' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', cost: 'Medium' },
  { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', cost: 'Medium' },
  { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', cost: 'Very High' }
]

interface DataAnalysisDashboardProps {
  onAnalysis: (data: string, model: string) => void
  isAnalyzing: boolean
}

export default function DataAnalysisDashboard({ onAnalysis, isAnalyzing }: DataAnalysisDashboardProps) {
  const [data, setData] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[1].id) // Default to Sonnet

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setData(content)
    }
    reader.readAsText(file)
  }

  const handleAnalysis = () => {
    if (data) {
      onAnalysis(data, selectedModel)
    }
  }

  const getModelCostWarning = (modelId: string) => {
    const model = MODEL_OPTIONS.find(m => m.id === modelId)
    if (!model) return null

    if (model.cost === 'Very High') {
      return (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>
            ⚠️ This model has very high token costs. Consider using a more cost-effective model for initial analysis.
          </AlertDescription>
        </Alert>
      )
    }
    return null
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <Upload className="h-4 w-4 absolute -top-1 -right-1 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Data Analysis</h2>
            <p className="text-gray-500 dark:text-gray-400">Upload your dataset to begin analysis</p>
          </div>
        </div>

        <div className="space-y-4">
          <FileUpload onUpload={handleFileUpload} loading={isAnalyzing} />
          
          <div className="flex items-center gap-4">
            <div className="w-64">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {MODEL_OPTIONS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{model.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({model.cost} cost)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleAnalysis}
              disabled={!data || isAnalyzing}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Analysis
                </>
              )}
            </Button>
          </div>

          {getModelCostWarning(selectedModel)}
        </div>
      </div>
    </Card>
  )
}
