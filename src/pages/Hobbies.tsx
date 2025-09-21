import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Filter, Search, Heart, Clock, Target, BarChart3 } from 'lucide-react'
import { useHobbiesStore } from '@/stores/hobbiesStore'
import HobbyCard from '@/components/hobbies/HobbyCard'
import HobbyForm from '@/components/hobbies/HobbyForm'
import type { Hobby } from '@/types'

const hobbyCategories = [
  { value: 'all', label: '全部', icon: '🔄' },
  { value: 'sport', label: '运动健身', icon: '🏃' },
  { value: 'reading', label: '阅读写作', icon: '📚' },
  { value: 'music', label: '音乐艺术', icon: '🎵' },
  { value: 'gaming', label: '游戏娱乐', icon: '🎮' },
  { value: 'travel', label: '旅行探索', icon: '✈️' },
  { value: 'cooking', label: '烹饪美食', icon: '👨‍🍳' },
  { value: 'art', label: '艺术创作', icon: '🎨' },
  { value: 'technology', label: '科技数码', icon: '💻' },
  { value: 'other', label: '其他', icon: '🔧' },
]

export default function Hobbies() {
  const { hobbies, loading, stats, fetchHobbies, addHobby, updateHobby, deleteHobby } = useHobbiesStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHobby, setEditingHobby] = useState<Hobby | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchHobbies()
  }, [fetchHobbies])

  const filteredHobbies = hobbies.filter(hobby => {
    const matchesCategory = selectedCategory === 'all' || hobby.category === selectedCategory
    const matchesSearch = hobby.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hobby.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleFormSubmit = async (data: any) => {
    if (editingHobby) {
      await updateHobby(editingHobby.id, data)
    } else {
      await addHobby(data)
    }
    setEditingHobby(undefined)
  }

  const handleEdit = (hobby: Hobby) => {
    setEditingHobby(hobby)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个爱好吗？')) {
      await deleteHobby(id)
    }
  }

  const handleAddNew = () => {
    setEditingHobby(undefined)
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
            <Target className="w-8 h-8 mr-3" />
            兴趣爱好
          </h1>
          <p className="text-dark-300 mt-2">记录和管理你的兴趣爱好</p>
        </div>
        
        <motion.button
          onClick={handleAddNew}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加爱好
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
            <p className="text-2xl font-bold text-white">{stats.totalHobbies}</p>
            <p className="text-sm text-dark-400">总爱好数</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.averageEnthusiasm}/10</p>
            <p className="text-sm text-dark-400">平均热情度</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalTimeSpent}</p>
            <p className="text-sm text-dark-400">周投入时间</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <div className="w-6 h-6 text-green-400 flex items-center justify-center font-bold text-sm">
                CAT
              </div>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{Object.keys(stats.byCategory).length}</p>
            <p className="text-sm text-dark-400">涉及领域</p>
          </div>
        </motion.div>
      </div>

      {/* 搜索和筛选 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="game-card p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="搜索爱好名称或描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* 分类筛选 */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-dark-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field min-w-[150px]"
            >
              {hobbyCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* 爱好卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="game-card p-6 h-80 animate-pulse"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-dark-700 h-12 w-12 rounded-lg mr-3"></div>
                  <div>
                    <div className="bg-dark-700 h-4 w-24 rounded mb-2"></div>
                    <div className="bg-dark-700 h-3 w-16 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-dark-700 h-4 w-full rounded"></div>
                  <div className="bg-dark-700 h-2 w-full rounded"></div>
                  <div className="bg-dark-700 h-4 w-3/4 rounded"></div>
                  <div className="bg-dark-700 h-16 w-full rounded"></div>
                </div>
              </motion.div>
            ))
          ) : filteredHobbies.length > 0 ? (
            filteredHobbies.map((hobby) => (
              <HobbyCard
                key={hobby.id}
                hobby={hobby}
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
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {searchQuery || selectedCategory !== 'all' ? '没有找到匹配的爱好' : '还没有爱好记录'}
              </h3>
              <p className="text-dark-400 mb-6">
                {searchQuery || selectedCategory !== 'all' ? '尝试调整搜索条件' : '开始添加你的第一个爱好吧！'}
              </p>
              {(!searchQuery && selectedCategory === 'all') && (
                <button
                  onClick={handleAddNew}
                  className="btn-primary"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  添加爱好
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 爱好表单模态框 */}
      <HobbyForm
        hobby={editingHobby}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}