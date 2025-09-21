import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Calendar, Target, Award, Clock } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useSkillsStore } from '@/stores/skillsStore'
import { useAssetsStore } from '@/stores/assetsStore'
import { useHobbiesStore } from '@/stores/hobbiesStore'
import { useTraitsStore } from '@/stores/traitsStore'

const COLORS = ['#00D4FF', '#A855F7', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function Analytics() {
  const { skills, fetchSkills } = useSkillsStore()
  const { assets, fetchAssets } = useAssetsStore()
  const { hobbies, fetchHobbies } = useHobbiesStore()
  const { traits, fetchTraits } = useTraitsStore()
  
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchSkills()
    fetchAssets()
    fetchHobbies()
    fetchTraits()
  }, [fetchSkills, fetchAssets, fetchHobbies, fetchTraits])

  // 生成模拟的趋势数据
  const generateTrendData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    return Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      return {
        date: date.toISOString().split('T')[0],
        skills: Math.floor(Math.random() * 50) + 20,
        assets: Math.floor(Math.random() * 10000) + 5000,
        hobbies: Math.floor(Math.random() * 20) + 10,
        experience: Math.floor(Math.random() * 100) + 50,
      }
    })
  }

  const trendData = generateTrendData()

  // 技能分类分布
  const skillCategoryData = skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const skillChartData = Object.entries(skillCategoryData).map(([category, count]) => ({
    name: category,
    value: count,
  }))

  // 资产类型分布 - 暂时注释掉未使用的代码
  // const assetTypeData = assets.reduce((acc, asset) => {
  //   acc[asset.type] = (acc[asset.type] || 0) + asset.amount
  //   return acc
  // }, {} as Record<string, number>)

  // const assetChartData = Object.entries(assetTypeData).map(([type, amount]) => ({
  //   name: type,
  //   value: amount,
  // }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-neon-blue">
              {entry.name}: {entry.name === 'assets' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
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
            <BarChart3 className="w-8 h-8 mr-3" />
            数据分析
          </h1>
          <p className="text-dark-300 mt-2">深入了解你的成长趋势和数据洞察</p>
        </div>

        {/* 时间范围选择 */}
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-dark-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field min-w-[120px]"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
          </select>
        </div>
      </motion.div>

      {/* 总览统计 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{skills.length}</p>
            <p className="text-sm text-dark-400">技能总数</p>
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
              <Award className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(assets.reduce((sum, asset) => sum + asset.amount, 0))}
            </p>
            <p className="text-sm text-dark-400">总资产</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {hobbies.reduce((sum, hobby) => sum + (hobby.time_spent || 0), 0)}h
            </p>
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
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-yellow-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{traits.length}</p>
            <p className="text-sm text-dark-400">个人特质</p>
          </div>
        </motion.div>
      </div>

      {/* 趋势图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 成长趋势 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="game-card p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6">成长趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="experienceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="experience"
                  stroke="#00D4FF"
                  fillOpacity={1}
                  fill="url(#experienceGradient)"
                  name="经验值"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 技能分布 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="game-card p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6">技能分布</h3>
          <div className="h-64">
            {skillChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {skillChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-dark-400">
                暂无技能数据
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* 详细数据对比 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="game-card p-6"
      >
        <h3 className="text-lg font-bold text-white mb-6">数据对比</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('zh-CN')}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="skills"
                stroke="#00D4FF"
                strokeWidth={2}
                name="技能"
                dot={{ fill: '#00D4FF', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="hobbies"
                stroke="#A855F7"
                strokeWidth={2}
                name="爱好"
                dot={{ fill: '#A855F7', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="experience"
                stroke="#10B981"
                strokeWidth={2}
                name="经验"
                dot={{ fill: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}
