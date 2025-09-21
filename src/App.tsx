import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Skills from '@/pages/Skills'
import Assets from '@/pages/Assets'
import Traits from '@/pages/Traits'
import Hobbies from '@/pages/Hobbies'
import Analytics from '@/pages/Analytics'
import Profile from '@/pages/Profile'
import Auth from '@/pages/Auth'
import AuthCallback from '@/pages/AuthCallback'
import ResetPassword from '@/pages/ResetPassword'
import LoadingScreen from '@/components/ui/LoadingScreen'

function App() {
  const { user, loading, initialize } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return <LoadingScreen />
  }

  // 特殊路由不需要认证
  const publicRoutes = ['/auth', '/auth/callback', '/reset-password']
  const isPublicRoute = publicRoutes.includes(location.pathname)

  if (!user && !isPublicRoute) {
    return <Auth />
  }

  // 认证相关页面不需要 Layout
  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/traits" element={<Traits />} />
        <Route path="/hobbies" element={<Hobbies />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  )
}

export default App
