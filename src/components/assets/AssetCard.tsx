import { motion } from 'framer-motion'
import { Edit3, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import type { Asset } from '@/types'

interface AssetCardProps {
  asset: Asset
  onEdit: (asset: Asset) => void
  onDelete: (id: string) => void
}

const assetTypeIcons = {
  cash: '💵',
  investment: '📈',
  property: '🏠',
  vehicle: '🚗',
  collectible: '💎',
  other: '💼',
}

const assetTypeColors = {
  cash: 'from-green-600 to-green-400',
  investment: 'from-blue-600 to-blue-400',
  property: 'from-purple-600 to-purple-400',
  vehicle: 'from-orange-600 to-orange-400',
  collectible: 'from-pink-600 to-pink-400',
  other: 'from-gray-600 to-gray-400',
}

const assetTypeLabels = {
  cash: '现金储蓄',
  investment: '投资理财',
  property: '房产',
  vehicle: '车辆',
  collectible: '收藏品',
  other: '其他',
}

export default function AssetCard({ asset, onEdit, onDelete }: AssetCardProps) {
  const icon = assetTypeIcons[asset.type as keyof typeof assetTypeIcons] || assetTypeIcons.other
  const colorClass = assetTypeColors[asset.type as keyof typeof assetTypeColors] || assetTypeColors.other
  const typeLabel = assetTypeLabels[asset.type as keyof typeof assetTypeLabels] || '其他'

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: asset.currency || 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // 模拟价值变化（实际应该从历史数据计算）
  const changePercentage = Math.random() * 20 - 10 // -10% 到 +10%
  const isPositive = changePercentage >= 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="game-card p-6 group cursor-pointer"
    >
      {/* 头部 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClass} flex items-center justify-center text-2xl shadow-lg`}>
            {icon}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-bold text-white">{asset.name}</h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-dark-700 text-dark-300">
              {typeLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(asset)}
            className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4 text-neon-blue" />
          </button>
          <button
            onClick={() => onDelete(asset.id)}
            className="p-2 bg-dark-700 hover:bg-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400 hover:text-white" />
          </button>
        </div>
      </div>

      {/* 价值显示 */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm text-dark-300">当前价值</span>
          <div className="flex items-center">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
            )}
            <span className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{changePercentage.toFixed(1)}%
            </span>
          </div>
        </div>
        <p className="text-2xl font-bold text-white">
          {formatCurrency(asset.amount)}
        </p>
      </div>

      {/* 描述 */}
      {asset.description && (
        <div className="mb-4">
          <p className="text-sm text-dark-300 line-clamp-2">
            {asset.description}
          </p>
        </div>
      )}

      {/* 底部信息 */}
      <div className="flex items-center justify-between text-xs text-dark-400 pt-4 border-t border-dark-600">
        <span>
          添加时间: {new Date(asset.created_at).toLocaleDateString('zh-CN')}
        </span>
        <span>
          更新: {new Date(asset.updated_at).toLocaleDateString('zh-CN')}
        </span>
      </div>

      {/* 悬停效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  )
}