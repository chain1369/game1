import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Zap, 
  DollarSign, 
  Heart, 
  Gamepad2, 
  BarChart3, 
  User,
  X
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import type { NavItem } from '@/types'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navigation: NavItem[] = [
  { name: '仪表板', href: '/', icon: Home, description: '总览面板' },
  { name: '技能树', href: '/skills', icon: Zap, description: '技能管理' },
  { name: '资产管理', href: '/assets', icon: DollarSign, description: '财务数据' },
  { name: '属性面板', href: '/traits', icon: Heart, description: '个人特质' },
  { name: '兴趣爱好', href: '/hobbies', icon: Gamepad2, description: '爱好记录' },
  { name: '数据分析', href: '/analytics', icon: BarChart3, description: '成长分析' },
  { name: '个人资料', href: '/profile', icon: User, description: '资料设置' },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()
  const { profile, signOut } = useAuthStore()

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  return (
    <>
      {/* 桌面端固定侧边栏 */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <SidebarContent 
          profile={profile}
          navigation={navigation}
          currentPath={location.pathname}
          onSignOut={handleSignOut}
        />
      </div>

      {/* 移动端滑出侧边栏 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="lg:hidden fixed inset-y-0 left-0 w-64 z-50"
          >
            <SidebarContent 
              profile={profile}
              navigation={navigation}
              currentPath={location.pathname}
              onSignOut={handleSignOut}
              onClose={onClose}
              showCloseButton
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface SidebarContentProps {
  profile: any
  navigation: NavItem[]
  currentPath: string
  onSignOut: () => void
  onClose?: () => void
  showCloseButton?: boolean
}

function SidebarContent({ 
  profile, 
  navigation, 
  currentPath, 
  onSignOut: handleSignOut, 
  onClose,
  showCloseButton 
}: SidebarContentProps) {
  return (
    <div className="flex flex-col flex-grow bg-dark-800 border-r border-dark-600 shadow-xl">
      {/* 头部 */}
      <div className="flex items-center justify-between p-6 border-b border-dark-600">
        <div className="flex items-center">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Gamepad2 className="w-8 h-8 text-neon-blue mr-3" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold text-white">游戏面板</h1>
            <p className="text-xs text-dark-300">Personal Panel</p>
          </div>
        </div>
        
        {showCloseButton && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5 text-dark-400" />
          </button>
        )}
      </div>

      {/* 用户信息 */}
      {profile && (
        <motion.div 
          className="p-6 border-b border-dark-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {profile.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{profile.name || '未命名用户'}</p>
              <div className="flex items-center mt-1">
                <span className="level-badge">
                  Lv.{profile.level}
                </span>
                <span className="text-xs text-dark-300 ml-2">
                  {profile.experience} EXP
                </span>
              </div>
            </div>
          </div>
          
          {/* 经验值进度条 */}
          <div className="mt-3">
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(profile.experience % 100)}%` 
                }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-dark-400 mt-1">
              距离下一级还需 {100 - (profile.experience % 100)} EXP
            </p>
          </div>
        </motion.div>
      )}

      {/* 导航菜单 */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item, index) => {
          const isActive = currentPath === item.href
          
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.href}
                onClick={onClose}
                className={`nav-link group ${isActive ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5 mr-3 transition-colors" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-dark-400 group-hover:text-dark-300">
                    {item.description}
                  </p>
                </div>
                
                {/* 活跃指示器 */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-2 h-2 bg-neon-blue rounded-full shadow-neon"
                  />
                )}
              </NavLink>
            </motion.div>
          )
        })}
      </nav>

      {/* 底部操作 */}
      <div className="p-4 border-t border-dark-600">
        <motion.button
          onClick={handleSignOut}
          className="w-full text-left px-4 py-3 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          退出登录
        </motion.button>
      </div>
    </div>
  )
}
