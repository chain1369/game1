import type { Database } from './supabase'

// Database types
export type Tables = Database['public']['Tables']
export type Enums = Database['public']['Enums']

// User-related types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Asset types
export type Asset = Database['public']['Tables']['assets']['Row']
export type AssetInsert = Database['public']['Tables']['assets']['Insert']
export type AssetUpdate = Database['public']['Tables']['assets']['Update']
export type AssetType = 'cash' | 'investment' | 'property' | 'vehicle' | 'collectible' | 'other'

// Skill types
export type Skill = Database['public']['Tables']['skills']['Row']
export type SkillInsert = Database['public']['Tables']['skills']['Insert']
export type SkillUpdate = Database['public']['Tables']['skills']['Update']
export type SkillCategory = 'programming' | 'design' | 'language' | 'music' | 'sport' | 'business' | 'creative' | 'other'

// Hobby types
export type Hobby = Database['public']['Tables']['hobbies']['Row']
export type HobbyInsert = Database['public']['Tables']['hobbies']['Insert']
export type HobbyUpdate = Database['public']['Tables']['hobbies']['Update']
export type HobbyCategory = 'sport' | 'art' | 'music' | 'reading' | 'gaming' | 'cooking' | 'travel' | 'technology' | 'other'

// Trait types
export type Trait = Database['public']['Tables']['traits']['Row']
export type TraitInsert = Database['public']['Tables']['traits']['Insert']
export type TraitUpdate = Database['public']['Tables']['traits']['Update']
export type TraitType = 'personality' | 'physical' | 'mental' | 'emotional' | 'social'

// Navigation types
export interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
  description?: string
}

// Form types
export interface FormField {
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea'
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
}

// Chart data types
export interface ChartData {
  name: string
  value: number
  color?: string
}

// Dashboard stats types
export interface DashboardStats {
  totalAssets: number
  totalSkills: number
  totalHobbies: number
  totalTraits: number
  skillsProgress: number
  hobbiesEngagement: number
  assetsGrowth: number
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

// Filter and sort types
export interface FilterOptions {
  category?: string
  type?: string
  level?: number
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}
