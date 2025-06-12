import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import Header from "@/components/Header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart2, FileText, MessageSquare, Upload, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AnalysisResult {
  id: string
  dataset_overview: {
    total_rows: number
    total_columns: number
    column_names: string[]
    data_types: Record<string, string>
  }
  statistical_summary: {
    summary_stats: Record<string, any>
    correlations: Record<string, number>
  }
  pattern_recognition: {
    trends: string[]
    anomalies: string[]
    seasonality: string[]
  }
  data_quality: {
    missing_values: Record<string, number>
    outliers: Record<string, number>
    data_quality_score: number
  }
  key_insights: string[]
  recommendations: string[]
  created_at: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface Project {
  id: string
  title: string
  description: string
  file_name: string
  created_at: string
  analysis_results: AnalysisResult[]
  chat_messages: ChatMessage[]
}

interface DashboardStats {
  totalProjects: number
  totalAnalyses: number
  totalMessages: number
  projects: Project[]
}

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalAnalyses: 0,
    totalMessages: 0,
    projects: []
  })
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true

    const initializeDashboard = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        console.log('Initial session check:', currentSession?.user?.id)
        
        if (!currentSession) {
          console.log('No session found, redirecting to login')
          navigate('/login')
          return
        }
        
        if (mounted) {
          setSession(currentSession)
          await fetchDashboardData(currentSession)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeDashboard()

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      console.log('Auth state changed:', _event, 'User ID:', currentSession?.user?.id)
      
      if (!currentSession) {
        console.log('Session lost, redirecting to login')
        navigate('/login')
        return
      }
      
      if (mounted) {
        setSession(currentSession)
        await fetchDashboardData(currentSession)
        setLoading(false)
      }
    })

    return () => {
      console.log('Cleaning up dashboard subscription')
      mounted = false
      subscription.unsubscribe()
    }
  }, [navigate])

  const fetchDashboardData = async (currentSession: Session) => {
    try {
      console.log('Fetching dashboard data for user:', currentSession.user.id)
      
      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', currentSession.user.id)
        .order('created_at', { ascending: false })

      if (projectsError) {
        console.error('Error fetching projects:', projectsError)
        throw projectsError
      }

      console.log('Total projects:', projects?.length || 0)

      // Fetch analysis results
      const { data: analyses, error: analysesError } = await supabase
        .from('analysis_results')
        .select('*')
        .in('project_id', projects?.map(p => p.id) || [])

      if (analysesError) {
        console.error('Error fetching analyses:', analysesError)
        throw analysesError
      }

      console.log('Total analyses:', analyses?.length || 0)

      // Fetch chat messages
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .in('project_id', projects?.map(p => p.id) || [])

      if (messagesError) {
        console.error('Error fetching messages:', messagesError)
        throw messagesError
      }

      console.log('Total messages:', messages?.length || 0)

      // Update stats
      setStats({
        totalProjects: projects?.length || 0,
        totalAnalyses: analyses?.length || 0,
        totalMessages: messages?.length || 0,
        projects: projects || []
      })

      console.log('Fetched projects:', projects)
    } catch (error) {
      console.error('Error in fetchDashboardData:', error)
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try refreshing the page.',
        variant: 'destructive'
      })
    }
  }

  const toggleProject = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header session={session} />
        <main className="pt-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-[calc(100vh-7rem)]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header session={session} />
      <main className="pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center mb-8">
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/docs')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Documentation
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-8 mt-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <Button onClick={() => navigate('/analysis')}>
              <Upload className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalProjects}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Analyses</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalAnalyses}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Messages</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalMessages}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Previous Analyses */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Previous Analyses</h2>
            {stats.projects.length > 0 ? (
              <div className="space-y-4">
                {stats.projects.map((project) => (
                  <div key={project.id} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <BarChart2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-foreground">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">{project.file_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(project.created_at)}
                        </span>
                        {expandedProject === project.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                    
                    {expandedProject === project.id && (
                      <div className="p-4 border-t bg-muted/30">
                        {project.analysis_results.map((analysis) => (
                          <div key={analysis.id} className="space-y-6">
                            {/* Dataset Overview */}
                            <Card className="p-4">
                              <h4 className="font-medium mb-4">Dataset Overview</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Total Rows: {analysis.dataset_overview.total_rows}</p>
                                  <p className="text-sm text-muted-foreground">Total Columns: {analysis.dataset_overview.total_columns}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Data Types:</p>
                                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                                    {Object.entries(analysis.dataset_overview.data_types).map(([column, type]) => (
                                      <li key={column}>{column}: {type}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </Card>

                            {/* Statistical Summary */}
                            <Card className="p-4">
                              <h4 className="font-medium mb-4">Statistical Summary</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium mb-2">Summary Statistics</p>
                                  <div className="space-y-2">
                                    {Object.entries(analysis.statistical_summary.summary_stats).map(([stat, value]) => (
                                      <p key={stat} className="text-sm text-muted-foreground">
                                        {stat}: {typeof value === 'number' ? value.toFixed(2) : value}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-2">Correlations</p>
                                  <div className="space-y-2">
                                    {Object.entries(analysis.statistical_summary.correlations).map(([pair, value]) => (
                                      <p key={pair} className="text-sm text-muted-foreground">
                                        {pair}: {value.toFixed(2)}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </Card>

                            {/* Pattern Recognition */}
                            <Card className="p-4">
                              <h4 className="font-medium mb-4">Pattern Recognition</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm font-medium mb-2">Trends</p>
                                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                                    {analysis.pattern_recognition.trends.map((trend, index) => (
                                      <li key={index}>{trend}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-2">Anomalies</p>
                                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                                    {analysis.pattern_recognition.anomalies.map((anomaly, index) => (
                                      <li key={index}>{anomaly}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-2">Seasonality</p>
                                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                                    {analysis.pattern_recognition.seasonality.map((season, index) => (
                                      <li key={index}>{season}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </Card>

                            {/* Data Quality */}
                            <Card className="p-4">
                              <h4 className="font-medium mb-4">Data Quality</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium mb-2">Missing Values</p>
                                  <div className="space-y-2">
                                    {Object.entries(analysis.data_quality.missing_values).map(([column, count]) => (
                                      <p key={column} className="text-sm text-muted-foreground">
                                        {column}: {count} missing
                                      </p>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-2">Outliers</p>
                                  <div className="space-y-2">
                                    {Object.entries(analysis.data_quality.outliers).map(([column, count]) => (
                                      <p key={column} className="text-sm text-muted-foreground">
                                        {column}: {count} outliers
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4">
                                <p className="text-sm font-medium">Data Quality Score: {analysis.data_quality.data_quality_score}%</p>
                              </div>
                            </Card>

                            {/* Key Insights */}
                            <Card className="p-4">
                              <h4 className="font-medium mb-4">Key Insights</h4>
                              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2">
                                {analysis.key_insights.map((insight, index) => (
                                  <li key={index}>{insight}</li>
                                ))}
                              </ul>
                            </Card>

                            {/* Recommendations */}
                            <Card className="p-4">
                              <h4 className="font-medium mb-4">Recommendations</h4>
                              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2">
                                {analysis.recommendations.map((recommendation, index) => (
                                  <li key={index}>{recommendation}</li>
                                ))}
                              </ul>
                            </Card>

                            {/* Chat History */}
                            {project.chat_messages && project.chat_messages.length > 0 && (
                              <Card className="p-4">
                                <h4 className="font-medium mb-4">Chat History</h4>
                                <div className="space-y-4">
                                  {project.chat_messages.map((message) => (
                                    <div
                                      key={message.id}
                                      className={`p-3 rounded-lg ${
                                        message.role === 'user'
                                          ? 'bg-primary/10 ml-8'
                                          : 'bg-muted mr-8'
                                      }`}
                                    >
                                      <div className="flex items-start gap-2">
                                        <div className="flex-1">
                                          <p className="text-sm font-medium mb-1">
                                            {message.role === 'user' ? 'You' : 'Assistant'}
                                          </p>
                                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                            {message.content}
                                          </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                          {formatDate(message.created_at)}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </Card>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No previous analyses found</p>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
} 