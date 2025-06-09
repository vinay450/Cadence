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
      bright_api: {
        Row: {
          id: string
          api_key: string
          created_at: string
        }
        Insert: {
          id?: string
          api_key: string
          created_at?: string
        }
        Update: {
          id?: string
          api_key?: string
          created_at?: string
        }
      }
      user_files: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_type: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_type: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_type?: string
          content?: string
          created_at?: string
        }
      }
      analysis_results: {
        Row: {
          id: string
          user_id: string
          file_id: string
          analysis: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_id: string
          analysis: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_id?: string
          analysis?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 