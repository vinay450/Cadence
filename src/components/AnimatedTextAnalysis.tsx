import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Loader2, Brain, TrendingUp, BarChart3 } from 'lucide-react'

interface AnimatedTextAnalysisProps {
  text: string
  isAnalyzing: boolean
}

export default function AnimatedTextAnalysis({ text, isAnalyzing }: AnimatedTextAnalysisProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (text && !isAnalyzing) {
      setIsTyping(true)
      setDisplayText('')
      setCurrentIndex(0)
    }
  }, [text, isAnalyzing])

  useEffect(() => {
    if (isTyping && text && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 27) // Set to 27ms for faster typing

      return () => clearTimeout(timer)
    } else if (currentIndex >= text.length) {
      setIsTyping(false)
    }
  }, [currentIndex, text, isTyping])

  if (isAnalyzing) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-blue-800 shadow-lg">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative">
              <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div className="absolute -top-1 -right-1">
                <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              AI Analysis in Progress
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Processing dataset structure...</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
              <span>Identifying patterns and correlations...</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-300"></div>
              <span>Generating insights and recommendations...</span>
            </div>
          </div>

          <div className="mt-6 bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Advanced Analytics Processing</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Our AI is delivering comprehensive analysis with optimized computational efficiency
            </p>
          </div>
        </div>
      </Card>
    )
  }

  if (!text) return null

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-emerald-200 dark:border-emerald-800 shadow-lg">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="relative">
            <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            {isTyping && (
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
            AI Analysis Complete
          </h2>
          {!isTyping && (
            <div className="ml-auto">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                ✓ Analysis Ready
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              {displayText}
              {isTyping && (
                <span className="inline-block w-2 h-5 bg-emerald-500 animate-pulse ml-1"></span>
              )}
            </div>
          </div>
        </div>

        {!isTyping && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center space-x-2 text-sm text-emerald-700 dark:text-emerald-300">
                <Brain className="h-4 w-4" />
                <span className="font-medium">Smart Processing</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Optimized computational efficiency
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center space-x-2 text-sm text-emerald-700 dark:text-emerald-300">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Fast Analysis</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Rapid insights generation
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center space-x-2 text-sm text-emerald-700 dark:text-emerald-300">
                <BarChart3 className="h-4 w-4" />
                <span className="font-medium">Quality Insights</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Enterprise-grade analysis precision
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
