import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Zap, TrendingUp } from "lucide-react"

export default function ComparisonSection() {
  return (
    <section id="comparison" className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Unmatched Efficiency and Performance
          </h2>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-300">
            See how our platform stands above the rest in key performance metrics.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Our Platform */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                Our Platform
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Optimized for efficiency and accuracy.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-900 dark:text-gray-100">
                  <span className="font-semibold">Token Usage:</span> 80% Less
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-900 dark:text-gray-100">
                  <span className="font-semibold">Processing Speed:</span> 5x Faster
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-900 dark:text-gray-100">
                  <span className="font-semibold">Cost Efficiency:</span> Unbeatable
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Claude */}
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                Claude
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                A strong contender in AI analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-gray-900 dark:text-gray-100">
                  Higher token consumption
                </span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-gray-900 dark:text-gray-100">
                  Good analysis speed
                </span>
              </div>
              <div className="flex items-center">
                <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-none">
                  Comparable insights
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* OpenAI */}
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                OpenAI
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Industry-leading AI solutions.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-gray-900 dark:text-gray-100">
                  Significant token usage
                </span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-gray-900 dark:text-gray-100">
                  Fast processing times
                </span>
              </div>
              <div className="flex items-center">
                <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-none">
                  High-quality analysis
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our platform delivers top-tier analysis with unparalleled efficiency,
            making it the smart choice for your business.
          </p>
        </div>
      </div>
    </section>
  )
}
