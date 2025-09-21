import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Filter, Search, BarChart3, Zap } from 'lucide-react'
import { useSkillsStore } from '@/stores/skillsStore'
import SkillCard from '@/components/skills/SkillCard'
import SkillForm from '@/components/skills/SkillForm'
import type { Skill } from '@/types'

const categories = [
  { value: 'all', label: '全部', icon: '🔄' },
  { value: 'programming', label: '编程开发', icon: '💻' },
  { value: 'design', label: '设计创意', icon: '🎨' },
  { value: 'language', label: '语言文字', icon: '🌐' },
  { value: 'sport', label: '运动健身', icon: '⚽' },
  { value: 'music', label: '音乐艺术', icon: '🎵' },
  { value: 'business', label: '商业管理', icon: '💼' },
  { value: 'creative', label: '创意写作', icon: '✨' },
  { value: 'other', label: '其他', icon: '🔧' },
]

export default function Skills() {
  const { skills, loading, fetchSkills, addSkill, updateSkill, deleteSkill, addExperience } = useSkillsStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  const filteredSkills = skills.filter(skill => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const stats = {
    totalSkills: skills.length,
    totalLevels: skills.reduce((sum, skill) => sum + (skill.level || 1), 0),
    totalExperience: skills.reduce((sum, skill) => sum + (skill.experience || 0), 0),
    averageLevel: skills.length > 0 ? (skills.reduce((sum, skill) => sum + (skill.level || 1), 0) / skills.length).toFixed(1) : '0',
  }

  const handleFormSubmit = async (data: any) => {
    if (editingSkill) {
      await updateSkill(editingSkill.id, data)
    } else {
      await addSkill(data)
    }
    setEditingSkill(undefined)
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个技能吗？')) {
      await deleteSkill(id)
    }
  }

  const handleAddNew = () => {
    setEditingSkill(undefined)
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
            <Zap className="w-8 h-8 mr-3" />
            技能树
          </h1>
          <p className="text-dark-300 mt-2">记录和管理你的技能发展历程</p>
        </div>
        
        <motion.button
          onClick={handleAddNew}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          添加技能
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
            <div className="p-3 bg-primary-500/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalSkills}</p>
            <p className="text-sm text-dark-400">总技能数</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-secondary-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-secondary-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.averageLevel}</p>
            <p className="text-sm text-dark-400">平均等级</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <div className="w-6 h-6 text-green-400 flex items-center justify-center font-bold">
                Σ
              </div>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalLevels}</p>
            <p className="text-sm text-dark-400">总等级数</p>
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
              <div className="w-6 h-6 text-yellow-400 flex items-center justify-center font-bold">
                EXP
              </div>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalExperience.toLocaleString()}</p>
            <p className="text-sm text-dark-400">总经验值</p>
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
                placeholder="搜索技能名称或描述..."
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
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* 技能卡片网格 */}
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
                <div className="bg-dark-700 h-12 w-12 rounded-lg mb-4"></div>
                <div className="bg-dark-700 h-4 w-3/4 rounded mb-2"></div>
                <div className="bg-dark-700 h-3 w-1/2 rounded mb-4"></div>
                <div className="bg-dark-700 h-2 w-full rounded mb-2"></div>
                <div className="bg-dark-700 h-8 w-full rounded mt-4"></div>
              </motion.div>
            ))
          ) : filteredSkills.length > 0 ? (
            filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onAddExp={addExperience}
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
                {searchQuery || selectedCategory !== 'all' ? '没有找到匹配的技能' : '还没有技能记录'}
              </h3>
              <p className="text-dark-400 mb-6">
                {searchQuery || selectedCategory !== 'all' ? '尝试调整搜索条件' : '开始添加你的第一个技能吧！'}
              </p>
              {(!searchQuery && selectedCategory === 'all') && (
                <button
                  onClick={handleAddNew}
                  className="btn-primary"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  添加技能
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 技能表单模态框 */}
      <SkillForm
        skill={editingSkill}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
