import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { BarChart3, TrendingUp } from 'lucide-react'

interface AssetChartProps {
  data: Record<string, number>
  loading?: boolean
}

const assetTypeLabels = {
  cash: '现金储蓄',
  investment: '投资理财',
  property: '房产',
  vehicle: '车辆',
  collectible: '收藏品',
  other: '其他',
}

const COLORS = [
  '#00D4FF', // neon-blue
  '#A855F7', // neon-purple
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#06B6D4', // cyan
  '#F97316', // orange
]

export default function AssetChart({ data, loading }: AssetChartProps) {
  // 转换数据格式
  const chartData = Object.entries(data).map(([type, value], index) => ({
    name: assetTypeLabels[type as keyof typeof assetTypeLabels] || type,
    value,
    color: COLORS[index % COLORS.length],
  })).filter(item => item.value > 0)

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = ((data.value / totalValue) * 100).toFixed(1)
      return (
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-neon-blue">
            {formatCurrency(data.value)} ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-dark-300">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="game-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-5 h-5 text-neon-blue mr-2" />
          <h3 className="text-lg font-bold text-white">资产分布</h3>
        </div>
        <div className="flex items-center text-sm text-dark-300">
          <TrendingUp className="w-4 h-4 mr-1" />
          总计: {formatCurrency(totalValue)}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-32 h-32 bg-dark-700 rounded-full mx-auto mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-dark-700 rounded w-24 mx-auto"></div>
              <div className="h-3 bg-dark-700 rounded w-16 mx-auto"></div>
            </div>
          </div>
        </div>
      ) : chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-center">
          <div className="text-4xl mb-4">📊</div>
          <h4 className="text-lg font-medium text-white mb-2">暂无数据</h4>
          <p className="text-dark-400 text-sm">
            添加资产后，这里将显示资产分布图表
          </p>
        </div>
      )}

      {/* 统计信息 */}
      {chartData.length > 0 && (
        <div className="mt-6 pt-4 border-t border-dark-600">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-dark-400">资产类型</p>
              <p className="text-lg font-bold text-white">{chartData.length}</p>
            </div>
            <div>
              <p className="text-sm text-dark-400">最大占比</p>
              <p className="text-lg font-bold text-white">
                {chartData.length > 0 
                  ? `${((Math.max(...chartData.map(d => d.value)) / totalValue) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}