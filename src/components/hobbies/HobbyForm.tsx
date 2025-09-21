import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Target, Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Hobby, HobbyCategory } from '@/types'

const hobbySchema = z.object({
  name: z.string().min(1, '爱好名称不能为空').max(50, '爱好名称不能超过50个字符'),
  category: z.enum(['sport', 'reading', 'music', 'gaming', 'travel', 'cooking', 'art', 'technology', 'other']),
  enthusiasm: z.number().min(1, '热情度至少为1').max(10, '热情度最大为10'),
  time_spent: z.number().min(0, '时间投入不能为负数'),
  description: z.string().max(200, '描述不能超过200个字符').optional(),
})

type HobbyFormData = z.infer<typeof hobbySchema>

interface HobbyFormProps {
  hobby?: Hobby
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: HobbyFormData & { goals?: string[] }) => void
}

const hobbyCategories = [
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

export default function HobbyForm({ hobby, isOpen, onClose, onSubmit }: HobbyFormProps) {
  const [goals, setGoals] = useState<string[]>([])
  const [newGoal, setNewGoal] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<HobbyFormData>({
    resolver: zodResolver(hobbySchema),
    defaultValues: {
      name: '',
      category: 'other',
      enthusiasm: 5,
      time_spent: 0,
      description: '',
    },
  })

  const watchedEnthusiasm = watch('enthusiasm')

  useEffect(() => {
    if (hobby) {
      reset({
        name: hobby.name,
        category: hobby.category as HobbyCategory,
        enthusiasm: hobby.enthusiasm || 5,
        time_spent: hobby.time_spent || 0,
        description: hobby.description || '',
      })
      setGoals(hobby.goals || [])
    } else {
      reset({
        name: '',
        category: 'other',
        enthusiasm: 5,
        time_spent: 0,
        description: '',
      })
      setGoals([])
    }
    setNewGoal('')
  }, [hobby, reset])

  const handleFormSubmit = (data: HobbyFormData) => {
    onSubmit({
      ...data,
      goals: goals.length > 0 ? goals : undefined,
    })
    onClose()
  }

  const addGoal = () => {
    if (newGoal.trim() && goals.length < 5) {
      setGoals([...goals, newGoal.trim()])
      setNewGoal('')
    }
  }

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index))
  }

  const getEnthusiasmLabel = (level: number) => {
    if (level >= 9) return '非常热爱'
    if (level >= 7) return '很喜欢'
    if (level >= 5) return '一般喜欢'
    if (level >= 3) return '有点兴趣'
    return '不太感兴趣'
  }

  const getEnthusiasmColor = (level: number) => {
    if (level >= 8) return 'text-green-400'
    if (level >= 6) return 'text-yellow-400'
    if (level >= 4) return 'text-orange-400'
    return 'text-red-400'
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
        className="bg-dark-800 rounded-xl border border-dark-600 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600">
          <div className="flex items-center">
            <Target className="w-6 h-6 text-neon-purple mr-3" />
            <h2 className="text-xl font-bold text-white">
              {hobby ? '编辑爱好' : '添加爱好'}
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
          {/* 爱好名称 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              爱好名称 *
            </label>
            <input
              {...register('name')}
              className="input-field"
              placeholder="输入爱好名称"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* 爱好分类 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              爱好分类 *
            </label>
            <select
              {...register('category')}
              className="input-field"
            >
              {hobbyCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* 热情度 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              热情度 ({watchedEnthusiasm}/10)
              <span className={`ml-2 text-sm ${getEnthusiasmColor(watchedEnthusiasm)}`}>
                {getEnthusiasmLabel(watchedEnthusiasm)}
              </span>
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                {...register('enthusiasm', { valueAsNumber: true })}
                className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex space-x-1">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full ${
                      index < watchedEnthusiasm
                        ? watchedEnthusiasm >= 8
                          ? 'bg-green-400'
                          : watchedEnthusiasm >= 6
                          ? 'bg-yellow-400'
                          : watchedEnthusiasm >= 4
                          ? 'bg-orange-400'
                          : 'bg-red-400'
                        : 'bg-dark-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            {errors.enthusiasm && (
              <p className="text-red-400 text-sm mt-1">{errors.enthusiasm.message}</p>
            )}
          </div>

          {/* 时间投入 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              每周投入时间 (小时)
            </label>
            <input
              type="number"
              step="0.5"
              {...register('time_spent', { valueAsNumber: true })}
              className="input-field"
              placeholder="0"
              min="0"
            />
            {errors.time_spent && (
              <p className="text-red-400 text-sm mt-1">{errors.time_spent.message}</p>
            )}
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              爱好描述
            </label>
            <textarea
              {...register('description')}
              className="input-field resize-none"
              rows={3}
              placeholder="描述你对这个爱好的感受和经历..."
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* 目标设定 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              目标设定 (可选)
            </label>
            
            {/* 已有目标列表 */}
            {goals.length > 0 && (
              <div className="space-y-2 mb-3">
                {goals.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between bg-dark-700 rounded-lg p-3">
                    <span className="text-sm text-white flex-1">{goal}</span>
                    <button
                      type="button"
                      onClick={() => removeGoal(index)}
                      className="ml-2 p-1 hover:bg-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 添加新目标 */}
            {goals.length < 5 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="input-field flex-1"
                  placeholder="输入一个目标..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                />
                <button
                  type="button"
                  onClick={addGoal}
                  disabled={!newGoal.trim()}
                  className="px-4 py-2 bg-neon-purple hover:bg-purple-600 disabled:bg-dark-600 disabled:text-dark-400 text-white rounded-lg transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {goals.length >= 5 && (
              <p className="text-dark-400 text-sm">最多可设置 5 个目标</p>
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
              {hobby ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

