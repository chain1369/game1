import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Zap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Skill, SkillCategory } from '@/types'

const skillSchema = z.object({
  name: z.string().min(1, '技能名称不能为空').max(50, '技能名称不能超过50个字符'),
  category: z.enum(['programming', 'design', 'language', 'sport', 'music', 'business', 'creative', 'other']),
  level: z.number().min(1, '等级至少为1').max(100, '等级不能超过100'),
  experience: z.number().min(0, '经验值不能为负数'),
  description: z.string().max(200, '描述不能超过200个字符').optional(),
  icon: z.string().optional(),
})

type SkillFormData = z.infer<typeof skillSchema>

interface SkillFormProps {
  skill?: Skill
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: SkillFormData) => void
}

const categories = [
  { value: 'programming', label: '编程开发', icon: '💻' },
  { value: 'design', label: '设计创意', icon: '🎨' },
  { value: 'language', label: '语言文字', icon: '🌐' },
  { value: 'sport', label: '运动健身', icon: '⚽' },
  { value: 'music', label: '音乐艺术', icon: '🎵' },
  { value: 'business', label: '商业管理', icon: '💼' },
  { value: 'creative', label: '创意写作', icon: '✨' },
  { value: 'other', label: '其他', icon: '🔧' },
]

export default function SkillForm({ skill, isOpen, onClose, onSubmit }: SkillFormProps) {
  const [selectedIcon, setSelectedIcon] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      category: 'other',
      level: 1,
      experience: 0,
      description: '',
      icon: '',
    },
  })

  const watchedCategory = watch('category')

  useEffect(() => {
    if (skill) {
      reset({
        name: skill.name,
        category: skill.category as SkillCategory,
        level: skill.level || 1,
        experience: skill.experience || 0,
        description: skill.description || '',
        icon: skill.icon || '',
      })
      setSelectedIcon(skill.icon || '')
    } else {
      reset({
        name: '',
        category: 'other',
        level: 1,
        experience: 0,
        description: '',
        icon: '',
      })
      setSelectedIcon('')
    }
  }, [skill, reset])

  const handleFormSubmit = (data: SkillFormData) => {
    onSubmit({
      ...data,
      icon: selectedIcon || categories.find(c => c.value === data.category)?.icon || '🔧',
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-800 rounded-xl border border-dark-600 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600">
          <div className="flex items-center">
            <Zap className="w-6 h-6 text-neon-blue mr-3" />
            <h2 className="text-xl font-bold text-white">
              {skill ? '编辑技能' : '添加技能'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-400" />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          {/* 技能名称 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              技能名称 *
            </label>
            <input
              {...register('name')}
              className="input-field"
              placeholder="输入技能名称"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* 技能分类 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              技能分类 *
            </label>
            <select
              {...register('category')}
              className="input-field"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* 图标选择 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              自定义图标
            </label>
            <div className="flex items-center space-x-2">
              <input
                value={selectedIcon}
                onChange={(e) => {
                  setSelectedIcon(e.target.value)
                  setValue('icon', e.target.value)
                }}
                className="input-field flex-1"
                placeholder="输入 emoji 或留空使用默认"
              />
              <div className="w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center text-xl">
                {selectedIcon || categories.find(c => c.value === watchedCategory)?.icon || '🔧'}
              </div>
            </div>
          </div>

          {/* 等级和经验值 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                当前等级
              </label>
              <input
                type="number"
                {...register('level', { valueAsNumber: true })}
                className="input-field"
                min="1"
                max="100"
              />
              {errors.level && (
                <p className="text-red-400 text-sm mt-1">{errors.level.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                经验值
              </label>
              <input
                type="number"
                {...register('experience', { valueAsNumber: true })}
                className="input-field"
                min="0"
              />
              {errors.experience && (
                <p className="text-red-400 text-sm mt-1">{errors.experience.message}</p>
              )}
            </div>
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              技能描述
            </label>
            <textarea
              {...register('description')}
              className="input-field resize-none"
              rows={3}
              placeholder="描述你在这个技能上的经验和成就..."
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {skill ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

