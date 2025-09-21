export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      hobbies: {
        Row: {
          category: string
          created_at: string
          description: string | null
          enthusiasm: number | null
          goals: string[] | null
          id: string
          name: string
          time_spent: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          enthusiasm?: number | null
          goals?: string[] | null
          id?: string
          name: string
          time_spent?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          enthusiasm?: number | null
          goals?: string[] | null
          id?: string
          name?: string
          time_spent?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          experience: number | null
          height: number | null
          id: string
          level: number | null
          name: string | null
          updated_at: string
          user_id: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: number | null
          height?: number | null
          id?: string
          level?: number | null
          name?: string | null
          updated_at?: string
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: number | null
          height?: number | null
          id?: string
          level?: number | null
          name?: string | null
          updated_at?: string
          user_id?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          description: string | null
          experience: number | null
          icon: string | null
          id: string
          level: number | null
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          experience?: number | null
          icon?: string | null
          id?: string
          level?: number | null
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          experience?: number | null
          icon?: string | null
          id?: string
          level?: number | null
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      traits: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_positive: boolean | null
          level: number | null
          name: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_positive?: boolean | null
          level?: number | null
          name: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_positive?: boolean | null
          level?: number | null
          name?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
