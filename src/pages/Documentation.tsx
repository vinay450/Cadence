import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, MessageCircle, BarChart3, Table, Brain, Zap, Shield, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Session } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function Documentation() {
  const [session, setSession] = useState<Session | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <Header session={session} />
      <main className="pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Documentation
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Learn how to use Cadence AI to analyze your data and generate insights
            </p>
          </div>

          {/* Getting Started Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Getting Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-500" />
                    Uploading Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="space-y-4">
                    <p>Cadence AI supports CSV files with the following specifications:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Maximum file size: ~2 MB</li>
                      <li>Maximum data points: 480,000</li>
                      <li>Example dimensions: 30,000 rows × 16 columns or 15,000 rows × 32 columns</li>
                    </ul>
                    <p>To upload your data:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Click the upload area or drag and drop your CSV file</li>
                      <li>Wait for the file to be processed</li>
                      <li>Select your preferred AI model for analysis</li>
                    </ol>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    AI Models
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="space-y-4">
                    <p>Choose from our selection of AI models:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span>Claude 3.5 Haiku</span>
                        <Badge variant="secondary">Low Cost</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Claude 3.5 Sonnet</span>
                        <Badge variant="secondary">Medium Cost</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Claude 3.7 Sonnet</span>
                        <Badge variant="secondary">Medium Cost</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Claude Opus 4</span>
                        <Badge variant="secondary">Very High Cost</Badge>
                      </li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get comprehensive analysis of your data with detailed insights, patterns, and recommendations. The AI will:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Identify key trends and patterns</li>
                      <li>Generate statistical insights</li>
                      <li>Provide actionable recommendations</li>
                      <li>Highlight anomalies and correlations</li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    Interactive Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Ask questions about your data and get instant responses. The chat interface allows you to:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Ask specific questions about your data</li>
                      <li>Request additional analysis</li>
                      <li>Get clarification on insights</li>
                      <li>Explore different aspects of your data</li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    Visualizations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Explore your data through various chart types:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Line charts for trends</li>
                      <li>Bar charts for comparisons</li>
                      <li>Scatter plots for correlations</li>
                      <li>Composed charts for multi-metric analysis</li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Table className="h-5 w-5 text-purple-500" />
                    Data Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    View and interact with your raw data:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Sort columns in ascending/descending order</li>
                      <li>Scroll through large datasets</li>
                      <li>View all columns and rows</li>
                      <li>Export data to CSV format</li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Experience fast and efficient data processing:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>80% reduction in token usage</li>
                      <li>Sub-second response times</li>
                      <li>Optimized data processing</li>
                      <li>Efficient resource utilization</li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Your data is protected with industry-standard security measures:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Secure authentication via Supabase Auth</li>
                      <li>HTTPS encryption for data in transit</li>
                      <li>Data encryption at rest in Supabase</li>
                      <li>JWT-based API security</li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Best Practices Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Best Practices</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Data Preparation</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Clean your data before uploading to remove duplicates and errors</li>
                      <li>Ensure consistent formatting across all columns</li>
                      <li>Use clear, descriptive column headers</li>
                      <li>Remove any sensitive or unnecessary information</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Analysis Tips</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Start with the AI analysis to get an overview of your data</li>
                      <li>Use the chat interface to ask specific questions</li>
                      <li>Explore different visualizations to understand patterns</li>
                      <li>Export insights and charts for sharing or further analysis</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Model Selection</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                      <li>Use Haiku for quick, basic analysis</li>
                      <li>Choose Sonnet for detailed insights and complex patterns</li>
                      <li>Select Opus for the most comprehensive analysis</li>
                      <li>Consider cost vs. depth of analysis when choosing a model</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </>
  )
} 