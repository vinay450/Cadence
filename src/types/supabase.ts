export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      analysis_results: {
        Row: {
          id: string
          created_at: string
          user_id: string
          file_name: string
          file_type: string
          dataset_overview: Json
          statistical_summary: Json
          pattern_recognition: Json
          data_quality: Json
          key_insights: Json
          recommendations: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          file_name: string
          file_type: string
          dataset_overview?: Json
          statistical_summary?: Json
          pattern_recognition?: Json
          data_quality?: Json
          key_insights?: Json
          recommendations?: Json
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          file_name?: string
          file_type?: string
          dataset_overview?: Json
          statistical_summary?: Json
          pattern_recognition?: Json
          data_quality?: Json
          key_insights?: Json
          recommendations?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analyze_dataset: {
        Args: {
          file_content: string
          file_type: string
        }
        Returns: Json
      }
    }
  }
} 