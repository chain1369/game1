import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Skill, SkillInsert, SkillUpdate } from '@/types'
import { useAuthStore } from './authStore'
import toast from 'react-hot-toast'

interface SkillsState {
  skills: Skill[]
  loading: boolean
  fetchSkills: () => Promise<void>
  addSkill: (skill: Omit<SkillInsert, 'user_id'>) => Promise<boolean>
  updateSkill: (id: string, updates: SkillUpdate) => Promise<boolean>
  deleteSkill: (id: string) => Promise<boolean>
  addExperience: (id: string, exp: number) => Promise<boolean>
}

export const useSkillsStore = create<SkillsState>((set, get) => ({
  skills: [],
  loading: false,

  fetchSkills: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ skills: data || [] })
    } catch (error) {
      console.error('Error fetching skills:', error)
      toast.error('获取技能数据失败')
    } finally {
      set({ loading: false })
    }
  },

  addSkill: async (skillData) => {
    const { user } = useAuthStore.getState()
    if (!user) {
      toast.error('用户未登录')
      return false
    }

    try {
      const { data, error } = await supabase
        .from('skills')
        .insert({
          ...skillData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        skills: [data, ...state.skills]
      }))

      toast.success('技能添加成功！')
      return true
    } catch (error) {
      console.error('Error adding skill:', error)
      toast.error('添加技能失败')
      return false
    }
  },

  updateSkill: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        skills: state.skills.map(skill => 
          skill.id === id ? data : skill
        )
      }))

      toast.success('技能更新成功！')
      return true
    } catch (error) {
      console.error('Error updating skill:', error)
      toast.error('更新技能失败')
      return false
    }
  },

  deleteSkill: async (id) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        skills: state.skills.filter(skill => skill.id !== id)
      }))

      toast.success('技能删除成功！')
      return true
    } catch (error) {
      console.error('Error deleting skill:', error)
      toast.error('删除技能失败')
      return false
    }
  },

  addExperience: async (id, exp) => {
    const { skills } = get()
    const skill = skills.find(s => s.id === id)
    if (!skill) return false

    const newExp = (skill.experience || 0) + exp
    const newLevel = Math.floor(newExp / 100) + 1

    return get().updateSkill(id, {
      experience: newExp,
      level: newLevel
    })
  },
}))

// 实时订阅技能变化
supabase
  .channel('skills_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'skills',
    },
    () => {
      useSkillsStore.getState().fetchSkills()
    }
  )
  .subscribe()

