import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, Bell, Search, Settings } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { profile } = useAuthStore()

  const currentTime = new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <header className="bg-dark-800/50 backdrop-blur-sm border-b border-dark-600 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-6">
        {/* 左侧 */}
        <div className="flex items-center">
          {/* 移动端菜单按钮 */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-dark-700 transition-colors mr-4"
          >
            <Menu className="w-5 h-5 text-dark-300" />
          </button>

          {/* 搜索框 */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="搜索技能、资产、爱好..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white placeholder-dark-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all duration-200"
            />
          </div>
        </div>

        {/* 中间 - 时间显示 */}
        <div className="hidden lg:block text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-mono text-neon-blue"
          >
            {currentTime}
          </motion.div>
          <div className="text-xs text-dark-400">
            {currentDate}
          </div>
        </div>

        {/* 右侧 */}
        <div className="flex items-center space-x-4">
          {/* 等级信息 */}
          {profile && (
            <motion.div 
              className="hidden sm:flex items-center space-x-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {profile.name}
                </p>
                <p className="text-xs text-dark-400">
                  等级 {profile.level} • {profile.experience} EXP
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {profile.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            </motion.div>
          )}

          {/* 通知按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <Bell className="w-5 h-5 text-dark-300" />
            {/* 通知红点 */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          {/* 设置按钮 */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <Settings className="w-5 h-5 text-dark-300" />
          </motion.button>
        </div>
      </div>

      {/* 移动端搜索框 */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-white placeholder-dark-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all duration-200"
          />
        </div>
      </div>
    </header>
  )
}

