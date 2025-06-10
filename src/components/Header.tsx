
import { Button } from "@/components/ui/button"
import { BarChart3, Menu } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToApp = () => {
    const appSection = document.getElementById('analytics-app')
    appSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">DataOptima</span>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
              5x Efficient
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#technology" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
              Technology
            </a>
            <a href="#comparison" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
              Comparison
            </a>
            <Button variant="outline" size="sm">
              Documentation
            </Button>
            <Button onClick={scrollToApp} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              Try Platform
            </Button>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <a href="#features" className="block px-3 py-2 text-sm font-medium text-gray-700">
                Features
              </a>
              <a href="#technology" className="block px-3 py-2 text-sm font-medium text-gray-700">
                Technology
              </a>
              <a href="#comparison" className="block px-3 py-2 text-sm font-medium text-gray-700">
                Comparison
              </a>
              <Button onClick={scrollToApp} className="w-full mt-2">
                Try Platform
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
