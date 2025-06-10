
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Zap, DollarSign, Clock, BarChart3 } from "lucide-react"

const comparisonData = [
  {
    metric: "Token Efficiency",
    ourPlatform: "1x tokens",
    claude: "5x tokens",
    openai: "5x tokens",
    advantage: true
  },
  {
    metric: "Processing Speed",
    ourPlatform: "< 2 seconds",
    claude: "8-12 seconds",
    openai: "6-10 seconds",
    advantage: true
  },
  {
    metric: "Cost per Analysis",
    ourPlatform: "$0.02",
    claude: "$0.10",
    openai: "$0.08",
    advantage: true
  },
  {
    metric: "Chart Quality",
    ourPlatform: "High",
    claude: "High",
    openai: "High",
    advantage: false
  },
  {
    metric: "Data Accuracy",
    ourPlatform: "99.8%",
    claude: "99.7%",
    openai: "99.6%",
    advantage: true
  }
]

export default function ComparisonSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
            Competitive Analysis
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Why We're 5x More Efficient
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Direct comparison with industry leaders shows our revolutionary approach to token optimization
            delivers identical quality with unprecedented efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="border-2 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                  Performance Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comparisonData.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100 last:border-b-0">
                      <div className="font-medium text-sm text-gray-900">
                        {item.metric}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-indigo-600">
                          {item.ourPlatform}
                        </span>
                        {item.advantage && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.claude}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.openai}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Revolutionary Token Compression
                </h3>
                <p className="text-gray-600">
                  Our proprietary algorithms achieve 5x token reduction through advanced semantic compression
                  while maintaining 100% analytical accuracy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sub-Second Processing
                </h3>
                <p className="text-gray-600">
                  Optimized data pipelines and intelligent caching deliver results in under 2 seconds,
                  compared to 8-12 seconds with traditional approaches.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  80% Cost Reduction
                </h3>
                <p className="text-gray-600">
                  Direct correlation between token efficiency and cost savings means enterprises
                  can scale analytics without proportional cost increases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
