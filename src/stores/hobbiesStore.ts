import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Hobby, HobbyInsert, HobbyUpdate } from '@/types'
import { useAuthStore } from './authStore'
import toast from 'react-hot-toast'

interface HobbyStats {
  totalHobbies: number
  averageEnthusiasm: number
  totalTimeSpent: number
  byCategory: Record<string, number>
}

interface HobbiesState {
  hobbies: Hobby[]
  loading: boolean
  stats: HobbyStats
  fetchHobbies: () => Promise<void>
  addHobby: (hobby: Omit<HobbyInsert, 'user_id'>) => Promise<boolean>
  updateHobby: (id: string, updates: HobbyUpdate) => Promise<boolean>
  deleteHobby: (id: string) => Promise<boolean>
  calculateStats: () => void
}

export const useHobbiesStore = create<HobbiesState>((set, get) => ({
  hobbies: [],
  loading: false,
  stats: {
    totalHobbies: 0,
    averageEnthusiasm: 0,
    totalTimeSpent: 0,
    byCategory: {},
  },

  fetchHobbies: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('hobbies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      set({ hobbies: data || [] })
      get().calculateStats()
    } catch (error) {
      console.error('Error fetching hobbies:', error)
      toast.error('获取爱好数据失败')
    } finally {
      set({ loading: false })
    }
  },

  addHobby: async (hobbyData) => {
    const { user } = useAuthStore.getState()
    if (!user) {
      toast.error('用户未登录')
      return false
    }

    try {
      const { data, error } = await supabase
        .from('hobbies')
        .insert({
          ...hobbyData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        hobbies: [data, ...state.hobbies]
      }))

      get().calculateStats()
      toast.success('爱好添加成功！')
      return true
    } catch (error) {
      console.error('Error adding hobby:', error)
      toast.error('添加爱好失败')
      return false
    }
  },

  updateHobby: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('hobbies')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        hobbies: state.hobbies.map(hobby => 
          hobby.id === id ? data : hobby
        )
      }))

      get().calculateStats()
      toast.success('爱好更新成功！')
      return true
    } catch (error) {
      console.error('Error updating hobby:', error)
      toast.error('更新爱好失败')
      return false
    }
  },

  deleteHobby: async (id) => {
    try {
      const { error } = await supabase
        .from('hobbies')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        hobbies: state.hobbies.filter(hobby => hobby.id !== id)
      }))

      get().calculateStats()
      toast.success('爱好删除成功！')
      return true
    } catch (error) {
      console.error('Error deleting hobby:', error)
      toast.error('删除爱好失败')
      return false
    }
  },

  calculateStats: () => {
    const { hobbies } = get()
    
    const totalHobbies = hobbies.length
    const averageEnthusiasm = totalHobbies > 0 
      ? hobbies.reduce((sum, hobby) => sum + (hobby.enthusiasm || 5), 0) / totalHobbies
      : 0
    const totalTimeSpent = hobbies.reduce((sum, hobby) => sum + (hobby.time_spent || 0), 0)
    
    const byCategory = hobbies.reduce((acc, hobby) => {
      acc[hobby.category] = (acc[hobby.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    set({
      stats: {
        totalHobbies,
        averageEnthusiasm: Math.round(averageEnthusiasm * 10) / 10,
        totalTimeSpent,
        byCategory,
      }
    })
  },
}))

// 实时订阅爱好变化
supabase
  .channel('hobbies_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'hobbies',
    },
    () => {
      useHobbiesStore.getState().fetchHobbies()
    }
  )
  .subscribe()

