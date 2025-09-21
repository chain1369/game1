# 个人游戏面板 🎮

一个游戏化的个人数据管理系统，让你以有趣的方式记录、管理和可视化个人信息。

![项目预览](https://via.placeholder.com/800x400/0f172a/00f5ff?text=Personal+Game+Panel)

## ✨ 特性

- 🎮 **游戏化体验** - 等级系统、经验值、成就徽章
- 📊 **数据可视化** - 技能雷达图、资产趋势、成长分析
- 🚀 **现代技术栈** - React 18、TypeScript、Supabase
- 🎨 **炫酷界面** - 深色主题、霓虹效果、流畅动画
- 📱 **响应式设计** - 完美适配桌面、平板、手机
- ⚡ **实时同步** - 基于 Supabase 的实时数据更新

## 🛠️ 技术栈

### 前端
- **React 18** + **TypeScript** - 现代前端框架
- **Vite** - 快速构建工具
- **Tailwind CSS** - 原子化 CSS 框架
- **Framer Motion** - 动画库
- **Zustand** - 轻量级状态管理
- **React Router** - 路由管理
- **Recharts** - 图表库

### 后端
- **Supabase** - 开源的 Firebase 替代品
  - PostgreSQL 数据库
  - 实时订阅
  - 用户认证
  - 文件存储
  - Edge Functions

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- pnpm (推荐) 或 npm
- Supabase 账户

### 1. 克隆项目

```bash
git clone <repository-url>
cd personal-game-panel
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

复制环境变量模板：

```bash
cp env.example .env.local
```

在 `.env.local` 中填入你的 Supabase 配置：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 设置 Supabase

#### 4.1 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 获取项目 URL 和 API Key

#### 4.2 执行数据库迁移

在 Supabase 控制台的 SQL 编辑器中执行以下 SQL：

```sql
-- 创建用户资料表
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  age INTEGER,
  height INTEGER,
  weight INTEGER,
  bio TEXT,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 创建技能表
CREATE TABLE skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 创建资产表
CREATE TABLE assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'CNY',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 创建特质表
CREATE TABLE traits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  description TEXT,
  is_positive BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 创建爱好表
CREATE TABLE hobbies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  enthusiasm INTEGER DEFAULT 5 CHECK (enthusiasm >= 1 AND enthusiasm <= 10),
  time_spent INTEGER DEFAULT 0,
  description TEXT,
  goals TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 设置行级安全策略 (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE hobbies ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own skills" ON skills FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own assets" ON assets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own traits" ON traits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own hobbies" ON hobbies FOR ALL USING (auth.uid() = user_id);

-- 创建触发器自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_traits_updated_at BEFORE UPDATE ON traits FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_hobbies_updated_at BEFORE UPDATE ON hobbies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```

### 5. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
src/
├── components/           # 可复用组件
│   ├── layout/          # 布局组件
│   └── ui/              # UI 组件
├── pages/               # 页面组件
├── stores/              # 状态管理 (Zustand)
├── lib/                 # 工具库
├── types/               # TypeScript 类型定义
├── hooks/               # 自定义 Hooks
└── styles/              # 样式文件
```

## 🎮 功能模块

### 📊 仪表板
- 等级和经验值显示
- 核心数据统计
- 最近活动时间线
- 快速操作入口

### ⚡ 技能系统
- 技能分类管理
- 等级和经验值追踪
- 技能树可视化
- 学习目标设定

### 💰 资产管理
- 多种资产类型支持
- 收支记录
- 资产分布图表
- 财务目标跟踪

### 💪 属性面板
- 优点缺点管理
- 性格特质分析
- 改进计划制定
- 成长记录

### 🎯 兴趣爱好
- 爱好分类展示
- 投入度统计
- 目标管理
- 时间分配分析

### 📈 数据分析
- 个人成长趋势
- 多维度数据分析
- 可视化图表
- 洞察报告

## 🔧 开发指南

### 代码规范

项目使用 ESLint 和 Prettier 进行代码规范化：

```bash
# 检查代码规范
pnpm lint

# 自动修复
pnpm lint --fix
```

### 构建部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 类型生成

从 Supabase 生成 TypeScript 类型：

```bash
pnpm supabase:gen-types
```

## 🎨 设计系统

### 配色方案

- **主色调**: 深空蓝 (#0f172a)
- **强调色**: 霓虹蓝 (#00f5ff)
- **次要色**: 霓虹紫 (#bf00ff)
- **成功色**: 霓虹绿 (#39ff14)

### 动画效果

- 页面过渡动画
- 悬停效果
- 数据加载动画
- 霓虹光效

## 🚀 部署

### Vercel (推荐)

1. Fork 此仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 自动部署

### Netlify

1. 构建项目：`pnpm build`
2. 上传 `dist` 目录到 Netlify
3. 配置环境变量

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🎯 路线图

- [ ] 移动端 PWA 支持
- [ ] 数据导入导出功能
- [ ] AI 智能建议
- [ ] 社交功能
- [ ] 多语言支持
- [ ] 主题定制

## 📞 联系

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](../../issues)
- 发送邮件至开发团队

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

# game
