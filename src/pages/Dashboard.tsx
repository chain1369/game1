import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Target, 
  Trophy,
  Calendar
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { profile } = useAuthStore()
  const { stats, loading, fetchDashboardData } = useDashboardStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const level = profile?.level || 1
  const experience = profile?.experience || 0
  const nextLevelExp = level * 100
  const expInCurrentLevel = experience % 100

  return (
    <div className="space-y-6">
      {/* 欢迎横幅 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-card p-8 bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold neon-text mb-2">
              欢迎回来，游戏者！
            </h1>
            <p className="text-dark-300">
              今天是成长的好日子，让我们查看你的进展吧
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl"
          >
            🎮
          </motion.div>
        </div>
      </motion.div>

      {/* 核心统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="当前等级"
          value={`Lv.${level}`}
          change={5}
          icon={<Trophy className="w-6 h-6" />}
          color="primary"
          loading={loading}
        />
        <StatCard
          title="技能总数"
          value={stats.totalSkills}
          change={stats.totalSkills > 0 ? 12 : 0}
          icon={<Zap className="w-6 h-6" />}
          color="secondary"
          loading={loading}
        />
        <StatCard
          title="总资产"
          value={stats.totalAssets > 0 ? `¥${(stats.totalAssets / 10000).toFixed(1)}万` : '¥0'}
          change={stats.totalAssets > 0 ? 8 : 0}
          icon={<DollarSign className="w-6 h-6" />}
          color="success"
          loading={loading}
        />
        <StatCard
          title="活跃爱好"
          value={stats.totalHobbies}
          change={stats.totalHobbies > 0 ? 2 : 0}
          icon={<Target className="w-6 h-6" />}
          color="warning"
          loading={loading}
        />
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 经验值进度 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 game-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-neon-blue" />
            等级进度
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-300">
                等级 {level} → 等级 {level + 1}
              </span>
              <span className="text-sm text-neon-blue font-medium">
                {experience} / {nextLevelExp} EXP
              </span>
            </div>
            
            <div className="progress-bar h-4">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(expInCurrentLevel / 100) * 100}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            
            <p className="text-sm text-dark-400">
              还需 {100 - expInCurrentLevel} 经验值升级
            </p>
          </div>

          {/* 本周进度 */}
          <div className="mt-6 pt-6 border-t border-dark-600">
            <h4 className="text-lg font-semibold text-white mb-3">本周成长</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-300">完成度</span>
              <span className="text-sm text-neon-green font-medium">
                {stats.weeklyProgress}%
              </span>
            </div>
            <div className="progress-bar h-3 mt-2">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-green to-primary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.weeklyProgress}%` }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
            </div>
          </div>
        </motion.div>

        {/* 快速操作 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="game-card p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-neon-purple" />
            快速操作
          </h3>
          
          <div className="space-y-3">
            <QuickActionButton
              title="添加技能"
              description="记录新掌握的技能"
              emoji="⚡"
              onClick={() => navigate('/skills')}
            />
            <QuickActionButton
              title="更新资产"
              description="记录收入或支出"
              emoji="💰"
              onClick={() => navigate('/assets')}
            />
            <QuickActionButton
              title="记录爱好"
              description="添加新的兴趣爱好"
              emoji="🎯"
              onClick={() => navigate('/hobbies')}
            />
            <QuickActionButton
              title="完善资料"
              description="更新个人信息"
              emoji="👤"
              onClick={() => navigate('/profile')}
            />
          </div>
        </motion.div>
      </div>

      {/* 最近活动 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="game-card p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">最近活动</h3>
        
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center p-3 bg-dark-700/50 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-dark-600 rounded mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-dark-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-dark-600 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-3 bg-dark-600 rounded"></div>
              </div>
            ))
          ) : stats.recentActivities.length > 0 ? (
            stats.recentActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                type={activity.type}
                title={activity.title}
                description={activity.description}
                time={formatRelativeTime(activity.timestamp)}
                icon={activity.icon}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-dark-400">还没有活动记录</p>
              <p className="text-sm text-dark-500 mt-1">开始添加数据来查看活动历史</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// 工具函数
function formatRelativeTime(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now.getTime() - time.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return '刚刚'
  if (diffHours < 24) return `${diffHours} 小时前`
  if (diffDays < 7) return `${diffDays} 天前`
  return time.toLocaleDateString('zh-CN')
}

interface StatCardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'success' | 'warning'
  loading?: boolean
}

function StatCard({ title, value, change, icon, color, loading }: StatCardProps) {
  const colorClasses = {
    primary: 'text-primary-400 bg-primary-500/20',
    secondary: 'text-secondary-400 bg-secondary-500/20',
    success: 'text-green-400 bg-green-500/20',
    warning: 'text-yellow-400 bg-yellow-500/20'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="stat-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${
          change > 0 
            ? 'text-green-400 bg-green-500/20' 
            : 'text-red-400 bg-red-500/20'
        }`}>
          {change > 0 ? '+' : ''}{change}%
        </div>
      </div>
      
      <div>
        {loading ? (
          <>
            <div className="h-6 bg-dark-700 rounded w-16 mb-1 animate-pulse"></div>
            <div className="h-4 bg-dark-700 rounded w-20 animate-pulse"></div>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-sm text-dark-400">{title}</p>
          </>
        )}
      </div>
    </motion.div>
  )
}

interface QuickActionButtonProps {
  title: string
  description: string
  emoji: string
  onClick: () => void
}

function QuickActionButton({ title, description, emoji, onClick }: QuickActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full p-3 bg-dark-700 hover:bg-dark-600 rounded-lg transition-all duration-200 text-left"
    >
      <div className="flex items-center">
        <span className="text-2xl mr-3">{emoji}</span>
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-dark-400">{description}</p>
        </div>
      </div>
    </motion.button>
  )
}

interface ActivityItemProps {
  type: string
  title: string
  description: string
  time: string
  icon: string
}

function ActivityItem({ title, description, time, icon }: ActivityItemProps) {
  return (
    <div className="flex items-center p-3 bg-dark-700/50 rounded-lg">
      <span className="text-2xl mr-4">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-dark-400">{description}</p>
      </div>
      <span className="text-xs text-dark-500">{time}</span>
    </div>
  )
}
