import { Button } from "@/components/ui/button"
import { Menu, Sun, Moon, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "./Logo"
import { supabase } from "@/lib/supabase"

interface HeaderProps {
  session: any
}

export default function Header({ session }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if dark mode is stored in localStorage
    const savedTheme = localStorage.getItem('theme')
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDarkMode(isDark)
    
    // Apply the theme to the document
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = sectionId === 'features' ? 45 : 115 // 45px for Features, 115px for Comparison
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
      <nav className="mx-auto max-w-[98%] px-2 sm:px-4">
        <div className="flex h-28 items-center">
          <div className="flex-shrink-0">
            <div onClick={scrollToTop} className="cursor-pointer">
              <Logo variant={isDarkMode ? 'dark' : 'primary'} className="h-20" />
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6 ml-8 flex-nowrap min-w-0">
            <div className="flex items-center gap-6 flex-shrink-0">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors dark:text-gray-300 dark:hover:text-indigo-400 whitespace-nowrap"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('comparison')}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors dark:text-gray-300 dark:hover:text-indigo-400 whitespace-nowrap"
              >
                Comparison
              </button>
            </div>
            
            {session && (
              <div className="flex items-center gap-4 flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="dark:border-gray-600 dark:text-gray-300 whitespace-nowrap px-3"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
              </div>
            )}
            
            <div className="flex items-center gap-4 flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="dark:border-gray-600 dark:text-gray-300 whitespace-nowrap px-3"
                onClick={() => navigate('/docs')}
              >
                Documentation
              </Button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-gray-700 dark:text-gray-300 p-2 flex-shrink-0"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {session.user.email}
                  </span>
                </div>
                <Button onClick={handleLogout} size="sm" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 whitespace-nowrap px-3 flex-shrink-0">
                  Log Out
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/login')} size="sm" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 whitespace-nowrap px-3 flex-shrink-0">
                Log In
              </Button>
            )}
          </div>
          
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-gray-700 dark:text-gray-300"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
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
          <div className="md:hidden border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <button 
                onClick={() => {
                  scrollToSection('features')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Features
              </button>
              <button 
                onClick={() => {
                  scrollToSection('comparison')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Comparison
              </button>
              {session && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full dark:border-gray-600 dark:text-gray-300"
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </Button>
                </>
              )}
              <Button 
                variant="outline" 
                className="w-full dark:border-gray-600 dark:text-gray-300"
                onClick={() => navigate('/docs')}
              >
                Documentation
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="text-gray-700 dark:text-gray-300"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              {session ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {session.user.email}
                    </span>
                  </div>
                  <Button onClick={handleLogout} className="w-full">
                    Log Out
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate('/login')} className="w-full mt-2">
                  Log In
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
