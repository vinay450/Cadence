
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, MessageCircle, FileText, Table } from 'lucide-react'

export default function DataNavigationSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const navigationItems = [
    {
      id: 'ai-analysis',
      title: 'AI Analysis',
      description: 'View detailed insights and analysis',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'chat-section',
      title: 'Chat',
      description: 'Ask questions about your data',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'data-preview',
      title: 'Data Preview',
      description: 'Browse your raw data',
      icon: Table,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'visualizations',
      title: 'Charts & Graphs',
      description: 'Explore visual representations',
      icon: BarChart3,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ]

  return (
    <Card className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold dark:text-white mb-2">Explore Your Data</h2>
        <p className="text-gray-600 dark:text-gray-300">Jump to different sections to analyze your dataset</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2 border-2 hover:border-current transition-all"
          >
            <div className={`p-3 rounded-full text-white ${item.color}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  )
}
