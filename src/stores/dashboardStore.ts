import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './authStore'
import type { Skill, Asset, Trait, Hobby } from '@/types'

interface DashboardStats {
  totalSkills: number
  averageSkillLevel: number
  totalAssets: number
  totalHobbies: number
  totalTraits: number
  strengthsCount: number
  weaknessesCount: number
  weeklyProgress: number
  recentActivities: ActivityItem[]
}

interface ActivityItem {
  id: string
  type: 'skill' | 'asset' | 'hobby' | 'trait'
  title: string
  description: string
  timestamp: string
  icon: string
}

interface DashboardState {
  stats: DashboardStats
  loading: boolean
  fetchDashboardData: () => Promise<void>
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: {
    totalSkills: 0,
    averageSkillLevel: 0,
    totalAssets: 0,
    totalHobbies: 0,
    totalTraits: 0,
    strengthsCount: 0,
    weaknessesCount: 0,
    weeklyProgress: 0,
    recentActivities: [],
  },
  loading: false,

  fetchDashboardData: async () => {
    const { user, profile } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      // 并行获取所有数据
      const [skillsResult, assetsResult, traitsResult, hobbiesResult] = await Promise.all([
        supabase.from('skills').select('*').eq('user_id', user.id),
        supabase.from('assets').select('*').eq('user_id', user.id),
        supabase.from('traits').select('*').eq('user_id', user.id),
        supabase.from('hobbies').select('*').eq('user_id', user.id),
      ])

      const skills: Skill[] = skillsResult.data || []
      const assets: Asset[] = assetsResult.data || []
      const traits: Trait[] = traitsResult.data || []
      const hobbies: Hobby[] = hobbiesResult.data || []

      // 计算统计数据
      const totalSkills = skills.length
      const averageSkillLevel = totalSkills > 0 
        ? skills.reduce((sum, skill) => sum + (skill.level || 1), 0) / totalSkills
        : 0

      const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0)
      const totalHobbies = hobbies.length
      const totalTraits = traits.length
      const strengthsCount = traits.filter(trait => trait.type === 'strength').length
      const weaknessesCount = traits.filter(trait => trait.type === 'weakness').length

      // 计算本周进度（基于用户等级和经验值）
      const weeklyProgress = Math.min(
        ((profile?.experience || 0) % 100), 
        100
      )

      // 生成最近活动（模拟数据，实际应该从数据库获取）
      const recentActivities: ActivityItem[] = [
        ...skills.slice(0, 2).map(skill => ({
          id: skill.id,
          type: 'skill' as const,
          title: `${skill.name} 技能更新`,
          description: `当前等级 ${skill.level}`,
          timestamp: skill.updated_at,
          icon: '⚡',
        })),
        ...assets.slice(0, 2).map(asset => ({
          id: asset.id,
          type: 'asset' as const,
          title: `${asset.name} 资产记录`,
          description: `金额 ¥${asset.amount.toLocaleString()}`,
          timestamp: asset.updated_at,
          icon: '💰',
        })),
        ...hobbies.slice(0, 1).map(hobby => ({
          id: hobby.id,
          type: 'hobby' as const,
          title: `${hobby.name} 爱好更新`,
          description: `热情度 ${hobby.enthusiasm}/10`,
          timestamp: hobby.updated_at,
          icon: '🎯',
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)

      set({
        stats: {
          totalSkills,
          averageSkillLevel: Math.round(averageSkillLevel * 10) / 10,
          totalAssets,
          totalHobbies,
          totalTraits,
          strengthsCount,
          weaknessesCount,
          weeklyProgress,
          recentActivities,
        },
        loading: false,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      set({ loading: false })
    }
  },
}))
