import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, DollarSign } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Asset, AssetType } from '@/types'

const assetSchema = z.object({
  name: z.string().min(1, '资产名称不能为空').max(50, '资产名称不能超过50个字符'),
  type: z.enum(['cash', 'investment', 'property', 'vehicle', 'collectible', 'other']),
  amount: z.number().min(0, '金额不能为负数'),
  currency: z.string().default('CNY'),
  description: z.string().max(200, '描述不能超过200个字符').optional(),
})

type AssetFormData = z.infer<typeof assetSchema>

interface AssetFormProps {
  asset?: Asset
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AssetFormData) => void
}

const assetTypes = [
  { value: 'cash', label: '现金储蓄', icon: '💵' },
  { value: 'investment', label: '投资理财', icon: '📈' },
  { value: 'property', label: '房产', icon: '🏠' },
  { value: 'vehicle', label: '车辆', icon: '🚗' },
  { value: 'collectible', label: '收藏品', icon: '💎' },
  { value: 'other', label: '其他', icon: '💼' },
]

const currencies = [
  { value: 'CNY', label: '人民币 (¥)', symbol: '¥' },
  { value: 'USD', label: '美元 ($)', symbol: '$' },
  { value: 'EUR', label: '欧元 (€)', symbol: '€' },
  { value: 'JPY', label: '日元 (¥)', symbol: '¥' },
  { value: 'GBP', label: '英镑 (£)', symbol: '£' },
]

export default function AssetForm({ asset, isOpen, onClose, onSubmit }: AssetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: '',
      type: 'other',
      amount: 0,
      currency: 'CNY',
      description: '',
    },
  })

  const watchedCurrency = watch('currency')

  useEffect(() => {
    if (asset) {
      reset({
        name: asset.name,
        type: asset.type as AssetType,
        amount: asset.amount,
        currency: asset.currency || 'CNY',
        description: asset.description || '',
      })
    } else {
      reset({
        name: '',
        type: 'other',
        amount: 0,
        currency: 'CNY',
        description: '',
      })
    }
  }, [asset, reset])

  const handleFormSubmit = (data: AssetFormData) => {
    onSubmit(data)
    onClose()
  }

  const getCurrencySymbol = (currency: string) => {
    return currencies.find(c => c.value === currency)?.symbol || '¥'
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
            <DollarSign className="w-6 h-6 text-green-400 mr-3" />
            <h2 className="text-xl font-bold text-white">
              {asset ? '编辑资产' : '添加资产'}
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
          {/* 资产名称 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              资产名称 *
            </label>
            <input
              {...register('name')}
              className="input-field"
              placeholder="输入资产名称"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* 资产类型 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              资产类型 *
            </label>
            <select
              {...register('type')}
              className="input-field"
            >
              {assetTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* 金额和货币 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                金额 *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400">
                  {getCurrencySymbol(watchedCurrency)}
                </span>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  className="input-field pl-8"
                  placeholder="0.00"
                  min="0"
                />
              </div>
              {errors.amount && (
                <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                货币
              </label>
              <select
                {...register('currency')}
                className="input-field"
              >
                {currencies.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              资产描述
            </label>
            <textarea
              {...register('description')}
              className="input-field resize-none"
              rows={3}
              placeholder="描述这个资产的详细信息..."
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
              {asset ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}