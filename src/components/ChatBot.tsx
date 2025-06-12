import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Send, MessageCircle, Loader2, Sparkles, Bot, User } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatBotProps {
  sessionId: string
  onSessionIdUpdate: (sessionId: string | null) => void
  model: string
  data?: string | null
}

const suggestionPrompts = [
  "What are the main trends in this dataset?",
  "Can you identify any outliers or anomalies?",
  "What correlations exist between the variables?",
  "Summarize the key statistics",
  "What insights can you draw from this data?",
  "Are there any seasonal patterns?",
  "Which variables have the strongest relationships?",
  "What would you recommend based on this analysis?"
]

export default function ChatBot({ sessionId, onSessionIdUpdate, model, data }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(sessionId)
  const [hasDataset, setHasDataset] = useState(!!data)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const { toast } = useToast()

  // Update session ID when it changes from parent
  useEffect(() => {
    setCurrentSessionId(sessionId)
  }, [sessionId])

  // Update dataset availability when data changes
  useEffect(() => {
    setHasDataset(!!data)
    setShowSuggestions(!!data) // Reset suggestions when new data is loaded
  }, [data])

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')
    setIsLoading(true)
    setShowSuggestions(false)

    try {
      const requestBody: any = {
        message: inputMessage,
        sessionId: currentSessionId,
        model
      }

      // Only include dataset if we don't have a session ID yet
      if (!currentSessionId && data) {
        requestBody.data = data
        requestBody.isNewAnalysis = true
      }

      const { data: result, error } = await supabase.functions.invoke('chat', {
        body: requestBody
      })

      if (error) {
        throw error
      }

      if (!result || !result.analysis) {
        throw new Error('Invalid response format')
      }

      // Update session ID if we got a new one (initial analysis)
      if (result.sessionId && result.sessionId !== currentSessionId) {
        setCurrentSessionId(result.sessionId)
        onSessionIdUpdate(result.sessionId)
        
        toast({
          title: 'Analysis Complete',
          description: 'Your dataset has been analyzed and stored. You can now ask follow-up questions.',
        })
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: result.analysis,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getPlaceholderText = () => {
    if (!hasDataset && !currentSessionId) {
      return "Upload a dataset first to start analyzing..."
    } else if (hasDataset && !currentSessionId) {
      return "Ask a question about your dataset to begin analysis..."
    } else {
      return "Ask follow-up questions about your data..."
    }
  }

  const isInputDisabled = isLoading || (!hasDataset && !currentSessionId)

  return (
    <div className="relative">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-t-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <Bot className="h-8 w-8" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Data Assistant</h2>
            <p className="text-blue-100 text-sm">Powered by {model}</p>
          </div>
        </div>
        {currentSessionId && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-100 font-medium">
              Active Session
            </span>
          </div>
        )}
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 rounded-t-none">
        <div className="p-6 space-y-4">
          {/* Suggestion Prompts */}
          {showSuggestions && hasDataset && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Try asking one of these questions:
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestionPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(prompt)}
                    className="text-xs px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 rounded-full hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800 dark:hover:to-purple-800 transition-all duration-200 cursor-pointer border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transform hover:scale-105"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Messages Container */}
          <div className="h-96 overflow-y-auto border-2 border-gray-100 dark:border-gray-700 rounded-xl p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-center">
                  <div className="relative mb-4">
                    <MessageCircle className="h-16 w-16 mx-auto opacity-30" />
                    <Sparkles className="h-6 w-6 absolute top-0 right-1/2 transform translate-x-1/2 text-purple-400 animate-pulse" />
                  </div>
                  {!hasDataset && !currentSessionId ? (
                    <div>
                      <p className="font-semibold text-lg mb-2">Ready to analyze your data</p>
                      <p className="text-sm">Upload a CSV file to start your analysis journey</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-lg mb-2">Your AI assistant is ready</p>
                      <p className="text-sm">Ask any question about your dataset or use the suggestions above</p>
                    </div>
                  )}
              </div>
            </div>
          ) : (
              <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`flex items-start gap-3 max-w-xs lg:max-w-md ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isUser 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                          : 'bg-gradient-to-r from-green-500 to-teal-500'
                      }`}>
                        {message.isUser ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      
                      {/* Message bubble */}
                      <div className={`px-4 py-3 rounded-2xl relative ${
                      message.isUser
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
                          : 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-500 rounded-bl-md shadow-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                      </div>
                  </div>
                </div>
              ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Input Container */}
          <div className="relative">
            <div className="flex gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 rounded-xl border border-gray-200 dark:border-gray-600">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
                placeholder={getPlaceholderText()}
                className="flex-1 px-4 py-3 border-0 rounded-lg resize-none h-12 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            rows={1}
                disabled={isInputDisabled}
          />
          <Button
            onClick={handleSendMessage}
                disabled={inputMessage.trim() === '' || isInputDisabled}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
          </Button>
        </div>
          </div>

          {/* Status Information */}
          {hasDataset && !currentSessionId && (
            <div className="flex items-center gap-2 text-sm p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg border border-blue-200 dark:border-blue-700">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-blue-700 dark:text-blue-300">
                Dataset loaded! Send your first message to begin chat session (will process dataset for context).
              </span>
            </div>
          )}
          {currentSessionId && (
            <div className="flex items-center gap-2 text-sm p-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 rounded-lg border border-green-200 dark:border-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 dark:text-green-300">
                Session active - I can reference your dataset for any follow-up questions.
              </span>
            </div>
          )}
      </div>
    </Card>
    </div>
  )
}