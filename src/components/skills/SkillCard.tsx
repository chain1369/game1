import { motion } from 'framer-motion'
import { Star, Plus, Trash2, Edit3 } from 'lucide-react'
import type { Skill } from '@/types'

interface SkillCardProps {
  skill: Skill
  onAddExp: (id: string, exp: number) => void
  onEdit: (skill: Skill) => void
  onDelete: (id: string) => void
}

const categoryColors = {
  programming: 'from-blue-600 to-blue-400',
  design: 'from-purple-600 to-purple-400',
  language: 'from-green-600 to-green-400',
  sport: 'from-red-600 to-red-400',
  music: 'from-yellow-600 to-yellow-400',
  business: 'from-indigo-600 to-indigo-400',
  creative: 'from-pink-600 to-pink-400',
  other: 'from-gray-600 to-gray-400',
}

const categoryIcons = {
  programming: '💻',
  design: '🎨',
  language: '🌐',
  sport: '⚽',
  music: '🎵',
  business: '💼',
  creative: '✨',
  other: '🔧',
}

export default function SkillCard({ skill, onAddExp, onEdit, onDelete }: SkillCardProps) {
  const level = skill.level || 1
  const experience = skill.experience || 0
  const expInCurrentLevel = experience % 100
  const expToNextLevel = 100 - expInCurrentLevel
  
  const colorClass = categoryColors[skill.category as keyof typeof categoryColors] || categoryColors.other
  const icon = categoryIcons[skill.category as keyof typeof categoryIcons] || categoryIcons.other

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
            {skill.icon || icon}
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-bold text-white">{skill.name}</h3>
            <span className="skill-tag text-xs">
              {skill.category}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(skill)}
            className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4 text-neon-blue" />
          </button>
          <button
            onClick={() => onDelete(skill.id)}
            className="p-2 bg-dark-700 hover:bg-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400 hover:text-white" />
          </button>
        </div>
      </div>

      {/* 等级显示 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Star className="w-5 h-5 text-yellow-400 mr-2" />
          <span className="level-badge">
            等级 {level}
          </span>
        </div>
        <span className="text-sm text-dark-300">
          {experience} 总经验值
        </span>
      </div>

      {/* 经验值进度条 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-dark-300 mb-2">
          <span>本级进度</span>
          <span>{expInCurrentLevel}/100</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${expInCurrentLevel}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
        <p className="text-xs text-dark-400 mt-1">
          距离 {level + 1} 级还需 {expToNextLevel} 经验值
        </p>
      </div>

      {/* 描述 */}
      {skill.description && (
        <p className="text-sm text-dark-300 mb-4 line-clamp-2">
          {skill.description}
        </p>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddExp(skill.id, 10)}
          className="flex-1 btn-neon text-sm py-2"
        >
          <Plus className="w-4 h-4 mr-1" />
          +10 EXP
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddExp(skill.id, 25)}
          className="flex-1 btn-primary text-sm py-2"
        >
          <Plus className="w-4 h-4 mr-1" />
          +25 EXP
        </motion.button>
      </div>
    </motion.div>
  )
}

