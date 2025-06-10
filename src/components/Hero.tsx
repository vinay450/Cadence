
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Zap, TrendingUp } from "lucide-react"

export default function Hero() {
  const scrollToApp = () => {
    const appSection = document.getElementById('try-app')
    appSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 sm:py-32">
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgb(31,41,55),rgba(31,41,55,0.6))] -z-10" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 dark:text-gray-300 ring-1 ring-gray-900/10 dark:ring-gray-100/20 hover:ring-gray-900/20 dark:hover:ring-gray-100/30">
              5x More Efficient Than Claude & OpenAI{' '}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <ArrowRight className="inline h-4 w-4" />
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Advanced Data Analytics
            <span className="text-indigo-600 dark:text-indigo-400 block">Using 80% Fewer Tokens</span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Revolutionary AI-powered analytics platform that delivers the same high-quality insights as industry leaders while consuming only 1/5th of the computational resources. Built for enterprises that demand efficiency without compromise.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button onClick={scrollToApp} size="lg" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
              Try Analytics Platform
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="dark:border-gray-600 dark:text-gray-300">
              View Documentation
            </Button>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-x-8 text-sm font-semibold text-gray-900 dark:text-white">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>5x Faster Processing</span>
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
