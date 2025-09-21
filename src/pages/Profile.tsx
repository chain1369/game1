import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Ruler, Weight, Save, Camera } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export default function Profile() {
  const { user, profile, updateProfile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    age: profile?.age || '',
    height: profile?.height || '',
    weight: profile?.weight || '',
    bio: profile?.bio || '',
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age || '',
        height: profile.height || '',
        weight: profile.weight || '',
        bio: profile.bio || '',
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updates = {
        name: formData.name,
        age: formData.age ? parseInt(formData.age.toString()) : null,
        height: formData.height ? parseInt(formData.height.toString()) : null,
        weight: formData.weight ? parseInt(formData.weight.toString()) : null,
        bio: formData.bio,
        updated_at: new Date().toISOString(),
      }

      await updateProfile(updates)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
            <User className="w-8 h-8 mr-3" />
            个人资料
          </h1>
          <p className="text-dark-300 mt-2">管理你的个人信息和偏好设置</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 头像和基本信息 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="game-card p-6"
        >
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center text-3xl font-bold text-white">
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-neon-blue rounded-full hover:bg-blue-600 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">
              {formData.name || '未设置姓名'}
            </h3>
            
            <div className="flex items-center justify-center text-sm text-dark-300 mb-4">
              <Mail className="w-4 h-4 mr-2" />
              {user?.email}
            </div>

            {/* 等级信息 */}
            <div className="bg-dark-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-dark-300">等级</span>
                <span className="text-lg font-bold text-neon-blue">
                  Lv.{profile?.level || 1}
                </span>
              </div>
              <div className="w-full bg-dark-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full"
                  style={{ width: `${((profile?.experience || 0) % 100)}%` }}
                />
              </div>
              <div className="text-xs text-dark-400 mt-1">
                {profile?.experience || 0} / {((Math.floor((profile?.experience || 0) / 100) + 1) * 100)} EXP
              </div>
            </div>
          </div>
        </motion.div>

        {/* 个人信息表单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 game-card p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6">个人信息</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 姓名 */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                姓名
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="input-field"
                placeholder="输入你的姓名"
              />
            </div>

            {/* 基础信息 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  年龄
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="input-field"
                  placeholder="年龄"
                  min="1"
                  max="150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Ruler className="w-4 h-4 inline mr-1" />
                  身高 (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  className="input-field"
                  placeholder="身高"
                  min="50"
                  max="300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Weight className="w-4 h-4 inline mr-1" />
                  体重 (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  className="input-field"
                  placeholder="体重"
                  min="1"
                  max="1000"
                />
              </div>
            </div>

            {/* 个人简介 */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                个人简介
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="input-field resize-none"
                rows={4}
                placeholder="写一些关于你自己的介绍..."
                maxLength={500}
              />
              <div className="text-xs text-dark-400 mt-1">
                {formData.bio.length}/500 字符
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    保存更改
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* 账户设置 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="game-card p-6"
      >
        <h3 className="text-lg font-bold text-white mb-6">账户设置</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-white mb-2">邮箱地址</h4>
            <p className="text-dark-300 text-sm mb-4">
              当前邮箱：{user?.email}
            </p>
            <button className="btn-secondary text-sm">
              更改邮箱
            </button>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-2">密码</h4>
            <p className="text-dark-300 text-sm mb-4">
              定期更新密码以保护账户安全
            </p>
            <button className="btn-secondary text-sm">
              更改密码
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
