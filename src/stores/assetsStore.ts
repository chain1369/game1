import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Asset, AssetInsert, AssetUpdate } from '@/types'
import { useAuthStore } from './authStore'
import toast from 'react-hot-toast'

interface AssetStats {
  totalValue: number
  byType: Record<string, number>
  monthlyChange: number
  currency: string
}

interface AssetsState {
  assets: Asset[]
  loading: boolean
  stats: AssetStats
  fetchAssets: () => Promise<void>
  addAsset: (asset: Omit<AssetInsert, 'user_id'>) => Promise<boolean>
  updateAsset: (id: string, updates: AssetUpdate) => Promise<boolean>
  deleteAsset: (id: string) => Promise<boolean>
  calculateStats: () => void
}

export const useAssetsStore = create<AssetsState>((set, get) => ({
  assets: [],
  loading: false,
  stats: {
    totalValue: 0,
    byType: {},
    monthlyChange: 0,
    currency: 'CNY',
  },

  fetchAssets: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      set({ assets: data || [] })
      get().calculateStats()
    } catch (error) {
      console.error('Error fetching assets:', error)
      toast.error('获取资产数据失败')
    } finally {
      set({ loading: false })
    }
  },

  addAsset: async (assetData) => {
    const { user } = useAuthStore.getState()
    if (!user) {
      toast.error('用户未登录')
      return false
    }

    try {
      const { data, error } = await supabase
        .from('assets')
        .insert({
          ...assetData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        assets: [data, ...state.assets]
      }))

      get().calculateStats()
      toast.success('资产添加成功！')
      return true
    } catch (error) {
      console.error('Error adding asset:', error)
      toast.error('添加资产失败')
      return false
    }
  },

  updateAsset: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        assets: state.assets.map(asset => 
          asset.id === id ? data : asset
        )
      }))

      get().calculateStats()
      toast.success('资产更新成功！')
      return true
    } catch (error) {
      console.error('Error updating asset:', error)
      toast.error('更新资产失败')
      return false
    }
  },

  deleteAsset: async (id) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        assets: state.assets.filter(asset => asset.id !== id)
      }))

      get().calculateStats()
      toast.success('资产删除成功！')
      return true
    } catch (error) {
      console.error('Error deleting asset:', error)
      toast.error('删除资产失败')
      return false
    }
  },

  calculateStats: () => {
    const { assets } = get()
    
    const totalValue = assets.reduce((sum, asset) => sum + asset.amount, 0)
    
    const byType = assets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + asset.amount
      return acc
    }, {} as Record<string, number>)

    // 模拟月度变化（实际应该从历史数据计算）
    const monthlyChange = Math.round((Math.random() - 0.5) * 20 * 100) / 100

    set({
      stats: {
        totalValue,
        byType,
        monthlyChange,
        currency: 'CNY',
      }
    })
  },
}))

// 实时订阅资产变化
supabase
  .channel('assets_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'assets',
    },
    () => {
      useAssetsStore.getState().fetchAssets()
    }
  )
  .subscribe()

