import { supabase } from './supabase'

export interface VisualizationRecommendation {
  title: string
  chartType: 'LineChart' | 'BarChart' | 'ScatterChart' | 'AreaChart' | 'PieChart' | 'ComposedChart'
  dataPoints: {
    xAxis: string
    yAxis: string[]
    xAxisLabel: string
    yAxisLabel: string
  }
  insights: string
  priority: string
}

export interface DataQualityMetrics {
  completeness: Record<string, number>
  outlierCount: number
  anomalies: string[]
}

export interface StatisticalSummary {
  correlations: string[]
  trends: string[]
}

export interface BusinessInsights {
  keyFindings: string[]
  recommendations: string[]
  riskFactors: string[]
}

export interface AnalysisResult {
  analysis: string
  visualizations: {
    recommendations: VisualizationRecommendation[]
    dataQualityMetrics: DataQualityMetrics
    statisticalSummary: StatisticalSummary
    businessInsights: BusinessInsights
  }
}

export async function analyzeDataset(file: File): Promise<AnalysisResult> {
  try {
    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError

    // Convert file to base64
    const fileContent = await readFileAsBase64(file)
    
    // Prepare the analysis request
    const messages = [{
      role: 'user',
      content: 'You are a data analysis expert. Please analyze this dataset.'
    }]

    // Call the chat function with authorization header
    const { data, error } = await supabase.functions.invoke('chat', {
      body: {
        messages,
        data: fileContent,
        isNewAnalysis: true
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      }
    })

    if (error) throw error

    if (!data || !data.analysis) {
      throw new Error('No analysis received from API')
    }

    // First, create a project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: session?.user?.id,
        title: file.name,
        description: 'Dataset analysis',
        file_name: file.name,
        file_type: file.type
      })
      .select()
      .single()

    if (projectError) throw projectError

    // Then save the analysis results with the project_id
    const { error: saveError } = await supabase
      .from('analysis_results')
      .insert({
        project_id: project.id,
        dataset_overview: data.visualizations?.dataQualityMetrics || {},
        statistical_summary: data.visualizations?.statisticalSummary || {},
        pattern_recognition: data.visualizations?.recommendations || [],
        data_quality: data.visualizations?.dataQualityMetrics || {},
        key_insights: data.visualizations?.businessInsights?.keyFindings || [],
        recommendations: data.visualizations?.businessInsights?.recommendations || []
      })

    if (saveError) throw saveError

    return data as AnalysisResult
  } catch (error) {
    console.error('Error analyzing dataset:', error)
    throw error
  }
}

async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:application/json;base64,")
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      } else {
        reject(new Error('Failed to read file as base64'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
