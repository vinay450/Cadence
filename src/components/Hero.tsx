import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Zap, TrendingUp } from "lucide-react"
import CyclingTypingAnimation from "./CyclingTypingAnimation"

export default function Hero() {
  const navigate = useNavigate()

  const scrollToDemo = () => {
    const demoSection = document.querySelector('section:nth-of-type(2)')
    if (demoSection) {
      const headerOffset = 115 // Buffer to account for header height
      const elementPosition = demoSection.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="relative pt-16 pb-10 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgb(31,41,55),rgba(31,41,55,0.6))] -z-10" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Advanced Data Analytics
            <span className="block mt-2">
              <CyclingTypingAnimation />
            </span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Cadence builds your analytics with up to 80% fewer tokens than Claude or OpenAI through our rigorous preprocessing and server-side graph rendering.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Try Analytics Platform
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button onClick={scrollToDemo} variant="outline" size="lg" className="dark:border-gray-600 dark:text-gray-300">
              Try Our Free Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-x-8 text-sm font-semibold text-gray-900 dark:text-white">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Fast Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span>Enterprise Grade</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Real-time Insights</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
