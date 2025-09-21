import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Filter, Search, TrendingUp, DollarSign, PieChart } from 'lucide-react'
import { useAssetsStore } from '@/stores/assetsStore'
import AssetCard from '@/components/assets/AssetCard'
import AssetForm from '@/components/assets/AssetForm'
import AssetChart from '@/components/assets/AssetChart'
import type { Asset } from '@/types'

const assetTypes = [
  { value: 'all', label: '全部', icon: '🔄' },
  { value: 'cash', label: '现金储蓄', icon: '💵' },
  { value: 'investment', label: '投资理财', icon: '📈' },
  { value: 'property', label: '房产', icon: '🏠' },
  { value: 'vehicle', label: '车辆', icon: '🚗' },
  { value: 'collectible', label: '收藏品', icon: '💎' },
  { value: 'other', label: '其他', icon: '💼' },
]

export default function Assets() {
  const { assets, loading, stats, fetchAssets, addAsset, updateAsset, deleteAsset } = useAssetsStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>()
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  const filteredAssets = assets.filter(asset => {
    const matchesType = selectedType === 'all' || asset.type === selectedType
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleFormSubmit = async (data: any) => {
    if (editingAsset) {
      await updateAsset(editingAsset.id, data)
    } else {
      await addAsset(data)
    }
    setEditingAsset(undefined)
  }

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个资产吗？')) {
      await deleteAsset(id)
    }
  }

  const handleAddNew = () => {
    setEditingAsset(undefined)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold neon-text flex items-center">
            <DollarSign className="w-8 h-8 mr-3" />
            资产管理
          </h1>
          <p className="text-dark-300 mt-2">管理和追踪你的财务资产</p>
        </div>
        
        <motion.button
          onClick={handleAddNew}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加资产
        </motion.button>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              stats.monthlyChange >= 0 
                ? 'text-green-400 bg-green-500/20' 
                : 'text-red-400 bg-red-500/20'
            }`}>
              {stats.monthlyChange >= 0 ? '+' : ''}{stats.monthlyChange}%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalValue)}</p>
            <p className="text-sm text-dark-400">总资产</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <PieChart className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{Object.keys(stats.byType).length}</p>
            <p className="text-sm text-dark-400">资产类型</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{assets.length}</p>
            <p className="text-sm text-dark-400">资产项目</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <div className="w-6 h-6 text-yellow-400 flex items-center justify-center font-bold text-sm">
                AVG
              </div>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {assets.length > 0 ? formatCurrency(stats.totalValue / assets.length) : formatCurrency(0)}
            </p>
            <p className="text-sm text-dark-400">平均价值</p>
          </div>
        </motion.div>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 资产图表 */}
        <div className="lg:col-span-1">
          <AssetChart data={stats.byType} loading={loading} />
        </div>

        {/* 搜索和筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 game-card p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">筛选和搜索</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  placeholder="搜索资产名称或描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* 类型筛选 */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-dark-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-field min-w-[150px]"
              >
                {assetTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 资产卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="game-card p-6 h-64 animate-pulse"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-dark-700 h-12 w-12 rounded-lg mr-3"></div>
                  <div>
                    <div className="bg-dark-700 h-4 w-24 rounded mb-2"></div>
                    <div className="bg-dark-700 h-3 w-16 rounded"></div>
                  </div>
                </div>
                <div className="bg-dark-700 h-8 w-32 rounded mb-4"></div>
                <div className="bg-dark-700 h-16 w-full rounded"></div>
              </motion.div>
            ))
          ) : filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {searchQuery || selectedType !== 'all' ? '没有找到匹配的资产' : '还没有资产记录'}
              </h3>
              <p className="text-dark-400 mb-6">
                {searchQuery || selectedType !== 'all' ? '尝试调整搜索条件' : '开始添加你的第一个资产吧！'}
              </p>
              {(!searchQuery && selectedType === 'all') && (
                <button
                  onClick={handleAddNew}
                  className="btn-primary"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  添加资产
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 资产表单模态框 */}
      <AssetForm
        asset={editingAsset}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
