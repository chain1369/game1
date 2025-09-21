import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Trait, TraitInsert, TraitUpdate } from '@/types'
import { useAuthStore } from './authStore'
import toast from 'react-hot-toast'

interface TraitStats {
  totalTraits: number
  strengthsCount: number
  weaknessesCount: number
  personalityCount: number
  averageLevel: number
}

interface TraitsState {
  traits: Trait[]
  loading: boolean
  stats: TraitStats
  fetchTraits: () => Promise<void>
  addTrait: (trait: Omit<TraitInsert, 'user_id'>) => Promise<boolean>
  updateTrait: (id: string, updates: TraitUpdate) => Promise<boolean>
  deleteTrait: (id: string) => Promise<boolean>
  calculateStats: () => void
}

export const useTraitsStore = create<TraitsState>((set, get) => ({
  traits: [],
  loading: false,
  stats: {
    totalTraits: 0,
    strengthsCount: 0,
    weaknessesCount: 0,
    personalityCount: 0,
    averageLevel: 0,
  },

  fetchTraits: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('traits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      set({ traits: data || [] })
      get().calculateStats()
    } catch (error) {
      console.error('Error fetching traits:', error)
      toast.error('获取特质数据失败')
    } finally {
      set({ loading: false })
    }
  },

  addTrait: async (traitData) => {
    const { user } = useAuthStore.getState()
    if (!user) {
      toast.error('用户未登录')
      return false
    }

    try {
      const { data, error } = await supabase
        .from('traits')
        .insert({
          ...traitData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        traits: [data, ...state.traits]
      }))

      get().calculateStats()
      toast.success('特质添加成功！')
      return true
    } catch (error) {
      console.error('Error adding trait:', error)
      toast.error('添加特质失败')
      return false
    }
  },

  updateTrait: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('traits')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        traits: state.traits.map(trait => 
          trait.id === id ? data : trait
        )
      }))

      get().calculateStats()
      toast.success('特质更新成功！')
      return true
    } catch (error) {
      console.error('Error updating trait:', error)
      toast.error('更新特质失败')
      return false
    }
  },

  deleteTrait: async (id) => {
    try {
      const { error } = await supabase
        .from('traits')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        traits: state.traits.filter(trait => trait.id !== id)
      }))

      get().calculateStats()
      toast.success('特质删除成功！')
      return true
    } catch (error) {
      console.error('Error deleting trait:', error)
      toast.error('删除特质失败')
      return false
    }
  },

  calculateStats: () => {
    const { traits } = get()
    
    const totalTraits = traits.length
    const strengthsCount = traits.filter(trait => trait.type === 'strength').length
    const weaknessesCount = traits.filter(trait => trait.type === 'weakness').length
    const personalityCount = traits.filter(trait => trait.type === 'personality').length
    const averageLevel = totalTraits > 0 
      ? traits.reduce((sum, trait) => sum + (trait.level || 1), 0) / totalTraits
      : 0

    set({
      stats: {
        totalTraits,
        strengthsCount,
        weaknessesCount,
        personalityCount,
        averageLevel: Math.round(averageLevel * 10) / 10,
      }
    })
  },
}))

// 实时订阅特质变化
supabase
  .channel('traits_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'traits',
    },
    () => {
      useTraitsStore.getState().fetchTraits()
    }
  )
  .subscribe()

