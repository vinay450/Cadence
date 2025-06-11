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
  projectId: string
  analysis: string
  visualizations: any
}

export async function analyzeDataset(file: File): Promise<AnalysisResult> {
  try {
    console.log('=== API DEBUG ===')
    console.log('1. Getting session...')
    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('Session error:', sessionError)
      throw sessionError
    }

    console.log('2. Session info:', {
      hasSession: !!session,
      userId: session?.user?.id,
      accessToken: !!session?.access_token
    })

    // Convert file to base64
    console.log('3. Converting file to base64...')
    const fileContent = await readFileAsBase64(file)
    
    // Prepare the analysis request
    const messages = [{
      role: 'user',
      content: 'You are a data analysis expert. Please analyze this dataset.'
    }]

    console.log('4. Calling chat function...')
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

    if (error) {
      console.error('5. Chat function error:', error)
      throw error
    }

    console.log('6. Chat function response:', {
      hasData: !!data,
      hasAnalysis: !!data?.analysis,
      hasVisualizations: !!data?.visualizations,
      analysisPreview: data?.analysis?.substring(0, 100),
      visualizationsKeys: data?.visualizations ? Object.keys(data.visualizations) : []
    })

    if (!data || !data.analysis) {
      throw new Error('No analysis received from API')
    }

    console.log('7. Creating project...')
    // First, create a project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: session?.user?.id,
        title: file.name,
        description: 'Dataset analysis',
        file_name: file.name,
        file_type: file.type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (projectError) {
      console.error('8. Project creation error:', projectError)
      throw projectError
    }

    console.log('9. Project created:', {
      projectId: project.id,
      title: project.title
    })

    console.log('10. Saving analysis results...')
    // Then save the analysis results with the project_id
    const { error: saveError } = await supabase
      .from('analysis_results')
      .insert({
        project_id: project.id,
        dataset_overview: {
          total_rows: data.visualizations?.dataQualityMetrics?.totalRows || 0,
          total_columns: data.visualizations?.dataQualityMetrics?.totalColumns || 0,
          column_names: data.visualizations?.dataQualityMetrics?.columnNames || [],
          data_types: data.visualizations?.dataQualityMetrics?.dataTypes || {}
        },
        statistical_summary: {
          summary_stats: data.visualizations?.statisticalSummary?.summaryStats || {},
          correlations: data.visualizations?.statisticalSummary?.correlations || []
        },
        pattern_recognition: {
          trends: data.visualizations?.statisticalSummary?.trends || [],
          anomalies: data.visualizations?.dataQualityMetrics?.anomalies || [],
          seasonality: data.visualizations?.statisticalSummary?.seasonality || []
        },
        data_quality: {
          missing_values: data.visualizations?.dataQualityMetrics?.completeness || {},
          outliers: data.visualizations?.dataQualityMetrics?.outlierCount || {},
          data_quality_score: data.visualizations?.dataQualityMetrics?.qualityScore || 0
        },
        key_insights: data.visualizations?.businessInsights?.keyFindings || [],
        recommendations: data.visualizations?.businessInsights?.recommendations || []
      })

    if (saveError) {
      console.error('11. Analysis results save error:', saveError)
      throw saveError
    }

    console.log('12. Saving chat message...')
    // Save the chat message
    const { error: chatError } = await supabase
      .from('chat_messages')
      .insert({
        project_id: project.id,
        role: 'assistant',
        content: data.analysis
      })

    if (chatError) {
      console.error('13. Chat message save error:', chatError)
      throw chatError
    }

    console.log('14. Analysis complete!')
    return {
      projectId: project.id,
      analysis: data.analysis,
      visualizations: data.visualizations
    }
  } catch (error) {
    console.error('15. Error in analyzeDataset:', error)
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
