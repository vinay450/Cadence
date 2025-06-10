
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Send, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-semibold dark:text-white">Chat about your data</h2>
      </div>

      <div className="space-y-4">
        {/* Messages Container */}
        <div className="h-80 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Start a conversation about your data</p>
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
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Container */}
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask questions about your data..."
            className="flex-1 px-3 py-2 border rounded-lg resize-none h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={inputMessage.trim() === ''}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
