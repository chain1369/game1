import { motion } from 'framer-motion'
import { Heart, Clock, Target, Edit3, Trash2 } from 'lucide-react'
import type { Hobby } from '@/types'

interface HobbyCardProps {
  hobby: Hobby
  onEdit: (hobby: Hobby) => void
  onDelete: (id: string) => void
}

const categoryColors = {
  sport: 'from-red-600 to-red-400',
  reading: 'from-blue-600 to-blue-400',
  music: 'from-purple-600 to-purple-400',
  gaming: 'from-green-600 to-green-400',
  travel: 'from-yellow-600 to-yellow-400',
  cooking: 'from-orange-600 to-orange-400',
  art: 'from-pink-600 to-pink-400',
  technology: 'from-indigo-600 to-indigo-400',
  other: 'from-gray-600 to-gray-400',
}

const categoryIcons = {
  sport: '🏃',
  reading: '📚',
  music: '🎵',
  gaming: '🎮',
  travel: '✈️',
  cooking: '👨‍🍳',
  art: '🎨',
  technology: '💻',
  other: '🔧',
}

const categoryLabels = {
  sport: '运动健身',
  reading: '阅读写作',
  music: '音乐艺术',
  gaming: '游戏娱乐',
  travel: '旅行探索',
  cooking: '烹饪美食',
  art: '艺术创作',
  technology: '科技数码',
  other: '其他',
}

export default function HobbyCard({ hobby, onEdit, onDelete }: HobbyCardProps) {
  const colorClass = categoryColors[hobby.category as keyof typeof categoryColors] || categoryColors.other
  const icon = categoryIcons[hobby.category as keyof typeof categoryIcons] || categoryIcons.other
  const categoryLabel = categoryLabels[hobby.category as keyof typeof categoryLabels] || '其他'
  
  const enthusiasm = hobby.enthusiasm || 5
  const timeSpent = hobby.time_spent || 0
  
  // 热情度颜色
  const getEnthusiasmColor = (level: number) => {
    if (level >= 8) return 'text-green-400'
    if (level >= 6) return 'text-yellow-400'
    if (level >= 4) return 'text-orange-400'
    return 'text-red-400'
  }

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
            <h3 className="text-lg font-bold text-white">{hobby.name}</h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-dark-700 text-dark-300">
              {categoryLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(hobby)}
            className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4 text-neon-blue" />
          </button>
          <button
            onClick={() => onDelete(hobby.id)}
            className="p-2 bg-dark-700 hover:bg-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400 hover:text-white" />
          </button>
        </div>
      </div>

      {/* 热情度显示 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Heart className="w-4 h-4 text-red-400 mr-2" />
            <span className="text-sm text-dark-300">热情度</span>
          </div>
          <span className={`text-lg font-bold ${getEnthusiasmColor(enthusiasm)}`}>
            {enthusiasm}/10
          </span>
        </div>
        
        <div className="flex space-x-1">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full ${
                index < enthusiasm
                  ? enthusiasm >= 8
                    ? 'bg-green-400'
                    : enthusiasm >= 6
                    ? 'bg-yellow-400'
                    : enthusiasm >= 4
                    ? 'bg-orange-400'
                    : 'bg-red-400'
                  : 'bg-dark-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 时间投入 */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-sm text-dark-300">每周投入</span>
          </div>
          <span className="text-sm font-medium text-white">
            {timeSpent} 小时
          </span>
        </div>
      </div>

      {/* 描述 */}
      {hobby.description && (
        <div className="mb-4">
          <p className="text-sm text-dark-300 line-clamp-2">
            {hobby.description}
          </p>
        </div>
      )}

      {/* 目标 */}
      {hobby.goals && hobby.goals.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Target className="w-4 h-4 text-neon-purple mr-2" />
            <span className="text-sm font-medium text-white">目标</span>
          </div>
          <div className="space-y-1">
            {hobby.goals.slice(0, 2).map((goal, index) => (
              <div key={index} className="flex items-center text-sm text-dark-300">
                <div className="w-1.5 h-1.5 bg-neon-purple rounded-full mr-2" />
                {goal}
              </div>
            ))}
            {hobby.goals.length > 2 && (
              <div className="text-xs text-dark-500">
                +{hobby.goals.length - 2} 个目标
              </div>
            )}
          </div>
        </div>
      )}

      {/* 底部信息 */}
      <div className="flex items-center justify-between text-xs text-dark-400 pt-4 border-t border-dark-600">
        <span>
          开始时间: {new Date(hobby.created_at).toLocaleDateString('zh-CN')}
        </span>
        <div className="flex items-center">
          <span>
            {timeSpent > 0 
              ? `每月约 ${Math.round(timeSpent * 4.33)} 小时`
              : '未设置时间'
            }
          </span>
        </div>
      </div>
    </motion.div>
  )
}