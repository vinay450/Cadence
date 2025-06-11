import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import Header from "@/components/Header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart2, FileText, MessageSquare, Upload, ChevronDown, ChevronUp } from "lucide-react"

interface AnalysisResult {
  id: string
  dataset_overview: any
  statistical_summary: any
  pattern_recognition: any
  data_quality: any
  key_insights: any
  recommendations: any
  created_at: string
}

interface Project {
  id: string
  title: string
  description: string
  file_name: string
  created_at: string
  analysis_results: AnalysisResult[]
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
    getSession()
  }, [])

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
      return
    }
    setSession(session)
    await fetchDashboardData(session)
  }

  const fetchDashboardData = async (session: Session) => {
    try {
      console.log('Fetching dashboard data for user:', session.user.id)

      // Fetch total projects
      const { count: projectsCount, error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)

      if (projectsError) {
        console.error('Error fetching projects count:', projectsError)
        throw projectsError
      }

      console.log('Total projects:', projectsCount)

      // First get all project IDs for the user
      const { data: userProjects, error: userProjectsError } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', session.user.id)

      if (userProjectsError) {
        console.error('Error fetching user projects:', userProjectsError)
        throw userProjectsError
      }

      const projectIds = userProjects?.map(p => p.id) || []

      // Fetch total analyses through projects
      const { count: analysesCount, error: analysesError } = await supabase
        .from('analysis_results')
        .select('*', { count: 'exact', head: true })
        .in('project_id', projectIds)

      if (analysesError) {
        console.error('Error fetching analyses count:', analysesError)
        throw analysesError
      }

      console.log('Total analyses:', analysesCount)

      // Fetch total messages through projects
      const { count: messagesCount, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .in('project_id', projectIds)

      if (messagesError) {
        console.error('Error fetching messages count:', messagesError)
        throw messagesError
      }

      console.log('Total messages:', messagesCount)

      // Fetch projects with their analysis results
      const { data: projects, error: projectsDataError } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          description,
          file_name,
          created_at,
          analysis_results (
            id,
            dataset_overview,
            statistical_summary,
            pattern_recognition,
            data_quality,
            key_insights,
            recommendations,
            created_at
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (projectsDataError) {
        console.error('Error fetching projects data:', projectsDataError)
        throw projectsDataError
      }

      console.log('Fetched projects:', projects)

      setStats({
        totalProjects: projectsCount || 0,
        totalAnalyses: analysesCount || 0,
        totalMessages: messagesCount || 0,
        projects: projects || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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
      <main className="pt-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
                          <div key={analysis.id} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card className="p-4">
                                <h4 className="font-medium mb-2">Dataset Overview</h4>
                                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {JSON.stringify(analysis.dataset_overview, null, 2)}
                                </pre>
                              </Card>
                              <Card className="p-4">
                                <h4 className="font-medium mb-2">Statistical Summary</h4>
                                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {JSON.stringify(analysis.statistical_summary, null, 2)}
                                </pre>
                              </Card>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card className="p-4">
                                <h4 className="font-medium mb-2">Pattern Recognition</h4>
                                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {JSON.stringify(analysis.pattern_recognition, null, 2)}
                                </pre>
                              </Card>
                              <Card className="p-4">
                                <h4 className="font-medium mb-2">Data Quality</h4>
                                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {JSON.stringify(analysis.data_quality, null, 2)}
                                </pre>
                              </Card>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card className="p-4">
                                <h4 className="font-medium mb-2">Key Insights</h4>
                                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {JSON.stringify(analysis.key_insights, null, 2)}
                                </pre>
                              </Card>
                              <Card className="p-4">
                                <h4 className="font-medium mb-2">Recommendations</h4>
                                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {JSON.stringify(analysis.recommendations, null, 2)}
                                </pre>
                              </Card>
                            </div>
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