# Supabase 配置信息

## 环境变量配置

请创建 `.env.local` 文件并添加以下内容：

```env
# Supabase 配置
VITE_SUPABASE_URL=https://vutypzsznwtzllyvuqal.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dHlwenN6bnd0emxseXZ1cWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDg4NjEsImV4cCI6MjA3MzgyNDg2MX0.BR3DHqIGmb7N5jVW4a9IqlYeJhkZxIMu197yxUAyY6g

# 应用配置
VITE_APP_NAME=个人游戏面板
VITE_APP_VERSION=1.0.0
```

## 数据库状态

✅ 所有数据库表已成功创建：
- profiles (用户资料)
- skills (技能)
- assets (资产)
- traits (特质)
- hobbies (爱好)

✅ 行级安全策略 (RLS) 已启用
✅ 自动更新时间戳触发器已创建

## 下一步

1. 复制上面的环境变量到 `.env.local` 文件
2. 运行 `pnpm install` 安装依赖
3. 运行 `pnpm dev` 启动开发服务器
4. 访问 http://localhost:3000 查看应用

