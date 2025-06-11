import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Send, MessageCircle, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatBotProps {
  data?: string
  sessionId?: string
  onSessionIdUpdate?: (sessionId: string) => void // Callback to update parent with session ID
}

export default function ChatBot({ data, sessionId: initialSessionId, onSessionIdUpdate }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(initialSessionId)
  const [hasDataset, setHasDataset] = useState(!!data)
  const { toast } = useToast()

  // Update session ID when it changes from parent
  useEffect(() => {
    setCurrentSessionId(initialSessionId)
  }, [initialSessionId])

  // Update dataset availability when data changes
  useEffect(() => {
    setHasDataset(!!data)
  }, [data])

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

    try {
      // Determine if this is the first message with a dataset
      const isFirstMessageWithData = !currentSessionId && data && messages.length === 0
      
      console.log('Sending message to chat function:', {
        messages: [...messages, newMessage].map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        })),
        hasData: isFirstMessageWithData,
        sessionId: currentSessionId,
        isNewAnalysis: isFirstMessageWithData
      })

      const requestBody = {
        messages: [...messages, newMessage].map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        })),
        sessionId: currentSessionId,
        isNewAnalysis: isFirstMessageWithData
      }

      // Only include data in the first message if we have a dataset
      if (isFirstMessageWithData) {
        requestBody.data = data
      }

      const { data: result, error } = await supabase.functions.invoke('chat', {
        body: requestBody
      })

      if (error) {
        console.error('Supabase function error:', error)
        throw error
      }

      if (!result) {
        console.error('No result received from function')
        throw new Error('No response received')
      }

      if (!result.analysis) {
        console.error('Invalid response format:', result)
        throw new Error('Invalid response format')
      }

      // Update session ID if we got a new one
      if (result.sessionId && result.sessionId !== currentSessionId) {
        setCurrentSessionId(result.sessionId)
        onSessionIdUpdate?.(result.sessionId)
        console.log('Session ID updated:', result.sessionId)
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: result.analysis,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Show success message for first analysis
      if (isFirstMessageWithData) {
        toast({
          title: 'Analysis Complete',
          description: 'Your dataset has been analyzed and stored. You can now ask follow-up questions.',
        })
      }

    } catch (error: any) {
      console.error('Error sending message:', error)
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
    <Card className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-semibold dark:text-white">Chat about your data</h2>
        {currentSessionId && (
          <span className="text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
            Session Active
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Messages Container */}
        <div className="h-80 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                {!hasDataset && !currentSessionId ? (
                  <div>
                    <p className="font-medium">No dataset loaded</p>
                    <p className="text-sm">Upload a CSV file to start analyzing your data</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">Ready to analyze your data</p>
                    <p className="text-sm">Ask any question about your dataset</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-600 text-gray-900 dark:text-white border rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Container */}
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholderText()}
            className="flex-1 px-3 py-2 border rounded-lg resize-none h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
            disabled={isInputDisabled}
          />
          <Button
            onClick={handleSendMessage}
            disabled={inputMessage.trim() === '' || isInputDisabled}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Status Information */}
        {hasDataset && !currentSessionId && (
          <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 p-2 rounded">
            💡 Dataset loaded! Send your first message to begin analysis and create a session.
          </div>
        )}
        {currentSessionId && (
          <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 p-2 rounded">
            ✅ Session active - I can reference your dataset for any follow-up questions.
          </div>
        )}
      </div>
    </Card>
  )
}