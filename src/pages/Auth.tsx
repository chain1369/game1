import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Mail, Lock, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  
  const { signIn, signUp } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password, name)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      alert('请先输入您的邮箱地址')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      })

      if (error) {
        throw error
      }

      setResetEmailSent(true)
    } catch (error: any) {
      alert(error.message || '发送重置邮件失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gaming-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Gamepad2 className="w-16 h-16 text-neon-blue mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold neon-text">个人游戏面板</h1>
          <p className="text-dark-300 mt-2">记录你的人生数据，解锁无限可能</p>
        </div>

        {/* 认证表单 */}
        <motion.div
          className="game-card p-8"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-l-lg font-medium transition-all duration-200 ${
                isLogin
                  ? 'bg-neon-blue text-dark-900'
                  : 'bg-dark-700 text-dark-300 hover:text-white'
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-r-lg font-medium transition-all duration-200 ${
                !isLogin
                  ? 'bg-neon-blue text-dark-900'
                  : 'bg-dark-700 text-dark-300 hover:text-white'
              }`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="text"
                    placeholder="用户名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="email"
                placeholder="邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                required
                minLength={6}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-neon py-3 mt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-neon-blue border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  {isLogin ? '登录中...' : '注册中...'}
                </div>
              ) : (
                isLogin ? '进入面板' : '创建账户'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center space-y-4">
            {/* 忘记密码 */}
            {isLogin && (
              <div>
                {resetEmailSent ? (
                  <p className="text-green-400 text-sm">
                    重置邮件已发送，请检查您的邮箱
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="text-neon-blue hover:text-neon-purple text-sm transition-colors duration-200 disabled:opacity-50"
                  >
                    忘记密码？
                  </button>
                )}
              </div>
            )}

            {/* 切换登录/注册 */}
            <p className="text-dark-400 text-sm">
              {isLogin ? '还没有账户？' : '已有账户？'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setResetEmailSent(false)
                }}
                className="text-neon-blue hover:text-neon-purple ml-1 transition-colors duration-200"
              >
                {isLogin ? '立即注册' : '立即登录'}
              </button>
            </p>
          </div>
        </motion.div>

        {/* 特性介绍 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          <div className="game-card p-4">
            <div className="text-2xl mb-2">🎮</div>
            <p className="text-sm text-dark-300">游戏化体验</p>
          </div>
          <div className="game-card p-4">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm text-dark-300">数据可视化</p>
          </div>
          <div className="game-card p-4">
            <div className="text-2xl mb-2">🚀</div>
            <p className="text-sm text-dark-300">个人成长</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
