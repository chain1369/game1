import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 获取 URL 参数
        const type = searchParams.get('type')
        const tokenHash = searchParams.get('token_hash')
        const next = searchParams.get('next') || '/'

        if (type && tokenHash) {
          // 处理认证回调
          const { error } = await supabase.auth.verifyOtp({
            type: type as any,
            token_hash: tokenHash,
          })

          if (error) {
            throw error
          }

          // 处理不同类型的认证
          switch (type) {
            case 'email':
              setMessage('邮箱验证成功！正在跳转...')
              break
            case 'recovery':
              setMessage('密码重置链接验证成功！请设置新密码')
              // 可以在这里添加密码重置表单或跳转到密码重置页面
              break
            case 'signup':
              setMessage('注册验证成功！正在跳转到仪表板...')
              break
            default:
              setMessage('验证成功！正在跳转...')
          }

          setStatus('success')

          // 延迟跳转
          setTimeout(() => {
            if (type === 'recovery') {
              // 跳转到密码重置页面
              navigate('/reset-password')
            } else {
              // 跳转到目标页面或仪表板
              navigate(next)
            }
          }, 2000)

        } else {
          // 处理普通的 OAuth 回调
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            throw error
          }

          if (data.session) {
            setMessage('登录成功！正在跳转到仪表板...')
            setStatus('success')
            
            setTimeout(() => {
              navigate('/')
            }, 1500)
          } else {
            throw new Error('未找到有效的会话')
          }
        }

      } catch (error: any) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage(error.message || '认证失败，请重试')
        
        // 3秒后跳转到登录页
        setTimeout(() => {
          navigate('/auth')
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen bg-gaming-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto"
      >
        <div className="game-card p-8">
          {status === 'loading' && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-4"
              >
                <Loader2 className="w-12 h-12 text-neon-blue" />
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">正在验证...</h2>
              <p className="text-dark-300">请稍候，我们正在处理您的请求</p>
            </>
          )}

          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-block mb-4"
              >
                <CheckCircle className="w-12 h-12 text-green-400" />
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">验证成功！</h2>
              <p className="text-dark-300">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-block mb-4"
              >
                <XCircle className="w-12 h-12 text-red-400" />
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">验证失败</h2>
              <p className="text-dark-300 mb-4">{message}</p>
              <button
                onClick={() => navigate('/auth')}
                className="btn-primary"
              >
                返回登录
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

