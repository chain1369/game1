import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Heart, AlertTriangle, User, BarChart3 } from 'lucide-react'
import { useTraitsStore } from '@/stores/traitsStore'

const traitTypes = [
  { value: 'strength', label: '优点', icon: '💪', color: 'text-green-400' },
  { value: 'weakness', label: '缺点', icon: '⚠️', color: 'text-red-400' },
  { value: 'personality', label: '性格', icon: '👤', color: 'text-blue-400' },
]

export default function Traits() {
  const { traits, loading, stats, fetchTraits } = useTraitsStore()
  const [selectedType, setSelectedType] = useState<string>('all')

  useEffect(() => {
    fetchTraits()
  }, [fetchTraits])

  const filteredTraits = selectedType === 'all' 
    ? traits 
    : traits.filter(trait => trait.type === selectedType)

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
            <Heart className="w-8 h-8 mr-3" />
            属性面板
          </h1>
          <p className="text-dark-300 mt-2">管理你的个人特质和性格分析</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加特质
        </motion.button>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalTraits}</p>
            <p className="text-sm text-dark-400">总特质数</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Heart className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.strengthsCount}</p>
            <p className="text-sm text-dark-400">优点特质</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.weaknessesCount}</p>
            <p className="text-sm text-dark-400">缺点特质</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <User className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.personalityCount}</p>
            <p className="text-sm text-dark-400">性格特质</p>
          </div>
        </motion.div>
      </div>

      {/* 分类筛选 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="game-card p-6"
      >
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedType === 'all'
                ? 'bg-neon-blue text-dark-900 font-medium'
                : 'bg-dark-700 text-dark-300 hover:text-white hover:bg-dark-600'
            }`}
          >
            🔄 全部 ({stats.totalTraits})
          </button>
          {traitTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedType === type.value
                  ? 'bg-neon-blue text-dark-900 font-medium'
                  : 'bg-dark-700 text-dark-300 hover:text-white hover:bg-dark-600'
              }`}
            >
              {type.icon} {type.label} ({
                type.value === 'strength' ? stats.strengthsCount :
                type.value === 'weakness' ? stats.weaknessesCount :
                stats.personalityCount
              })
            </button>
          ))}
        </div>
      </motion.div>

      {/* 特质列表 */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="game-card p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-dark-700 rounded mr-3"></div>
                  <div>
                    <div className="h-4 bg-dark-700 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-dark-700 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-8 bg-dark-700 rounded w-16"></div>
              </div>
            </div>
          ))
        ) : filteredTraits.length > 0 ? (
          filteredTraits.map((trait) => (
            <motion.div
              key={trait.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="game-card p-6 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {trait.type === 'strength' ? '💪' : 
                     trait.type === 'weakness' ? '⚠️' : '👤'}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{trait.name}</h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className={`${
                        trait.type === 'strength' ? 'text-green-400' :
                        trait.type === 'weakness' ? 'text-red-400' :
                        'text-blue-400'
                      }`}>
                        {traitTypes.find(t => t.value === trait.type)?.label}
                      </span>
                      <span className="text-dark-400">•</span>
                      <span className="text-dark-300">等级 {trait.level || 1}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm text-dark-400">影响度</div>
                    <div className="text-lg font-bold text-white">{trait.level || 1}/10</div>
                  </div>
                  <div className="w-16 h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        trait.type === 'strength' ? 'bg-green-400' :
                        trait.type === 'weakness' ? 'bg-red-400' :
                        'bg-blue-400'
                      }`}
                      style={{ width: `${((trait.level || 1) / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {trait.description && (
                <p className="text-dark-300 mt-3 text-sm leading-relaxed">
                  {trait.description}
                </p>
              )}
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">
              {selectedType === 'strength' ? '💪' :
               selectedType === 'weakness' ? '⚠️' :
               selectedType === 'personality' ? '👤' : '🎭'}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {selectedType !== 'all' ? `还没有${traitTypes.find(t => t.value === selectedType)?.label}记录` : '还没有特质记录'}
            </h3>
            <p className="text-dark-400 mb-6">
              开始记录你的个人特质，更好地了解自己
            </p>
            <button className="btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              添加特质
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
