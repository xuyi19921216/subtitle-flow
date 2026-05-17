# Subtitle Flow - YouTube字幕文章生成器

## 1. 项目功能

Subtitle Flow 是一个基于 AI 的 Web 应用，旨在将 YouTube 视频内容快速转化为结构化的中文文章。

### 核心功能

- **视频链接解析**: 支持多种 YouTube 链接格式（标准链接、短链接、嵌入链接等）
- **智能文章生成**: 利用 Gemini AI 将视频自动转化为专业的中文文章
- **流式输出**: 实时展示文章生成过程，无需等待全部完成后才显示
- **一键复制**: 生成完成后可快速复制文章内容
- **响应式设计**: 完美支持桌面端和移动端设备

### 技术特点

- 无需手动提取字幕，系统自动获取
- AI 生成的文本经过优化：
  - 去除口语化和重复内容
  - 保持核心观点和专业表述
  - 统一的问答格式（主持人/嘉宾）
- 优雅的用户界面和流畅的交互体验

## 2. 技术栈

### 前端技术

- **React 19**: 现代 React 框架，用于构建用户界面
- **Vite 6**: 快速的构建工具和开发服务器
- **Tailwind CSS 3**: 实用的 CSS 框架，用于样式设计
- **Lucide React**: 现代化的图标库

### 后端技术

- **Cloudflare Workers**: 边缘计算平台，用于部署无服务器函数
- **Google Gemini AI**: 强大的 AI 模型，用于生成文章内容
- **SSE (Server-Sent Events)**: 服务器推送技术，实现流式响应

### 开发工具

- **ESLint**: 代码质量检查
- **PostCSS**: CSS 转换工具
- **Wrangler**: Cloudflare Workers 部署工具

## 3. 目录结构

```
subtitle-flow/
├── public/                      # 静态资源目录
│   ├── _routes.json            # Cloudflare Pages 路由配置
│   └── vite.svg                # Vite 图标
├── src/                         # React 应用源代码
│   ├── assets/                 # 静态资源
│   │   └── react.svg           # React 图标
│   ├── components/             # React 组件
│   │   ├── ArticleDisplay.jsx  # 文章展示组件（Markdown 解析、复制功能）
│   │   └── UrlInput.jsx        # URL 输入组件（验证、提交）
│   ├── services/               # 服务层
│   │   └── api.js              # API 调用服务
│   ├── App.jsx                 # 主应用组件
│   ├── main.jsx                # React 应用入口
│   └── index.css               # 全局样式文件
├── worker/                     # Cloudflare Worker 后端服务
│   ├── src/
│   │   └── index.js            # Worker 入口（处理 API 请求、调用 Gemini AI）
│   ├── package.json            # Worker 依赖配置
│   ├── wrangler.toml           # Wrangler 配置文件
│   └── package-lock.json       # 依赖锁定文件
├── .gitignore                  # Git 忽略文件配置
├── eslint.config.js            # ESLint 配置
├── index.html                  # HTML 入口文件
├── package.json                # 项目依赖和脚本配置
├── postcss.config.js           # PostCSS 配置
├── README.md                   # 项目说明文档（本文件）
├── tailwind.config.js          # Tailwind CSS 配置
└── vite.config.js              # Vite 构建配置

```

### 关键文件说明

- **`src/App.jsx`**: 主应用组件，协调各个子组件，处理核心逻辑
- **`src/components/UrlInput.jsx`**: 处理用户输入的 YouTube 链接，包含验证逻辑
- **`src/components/ArticleDisplay.jsx`**: 负责文章内容的渲染展示，支持 Markdown 解析
- **`src/services/api.js`**: 封装 API 调用，处理与后端 Worker 的通信
- **`worker/src/index.js`**: Cloudflare Worker 处理函数，调用 Gemini AI 进行文章生成

## 4. 安装和部署

### 前置要求

- **Node.js**: 版本 18.x 或更高
- **npm**: 版本 9.x 或更高
- **Cloudflare 账号**: 用于部署 Worker（可选）
- **Gemini API Key**: 从 Google AI Studio 获取（免费额度）

### 本地开发

#### 1. 克隆项目

```bash
git clone <repository-url>
cd subtitle-flow
```

#### 2. 安装前端依赖

```bash
npm install
```

#### 3. 配置环境变量

创建 `.env` 文件（如果不存在）：

```bash
# 可选：指定后端 API 地址
# 默认使用 Cloudflare Worker 公共服务
VITE_API_URL=http://localhost:8787
```

#### 4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 后端 Worker 本地开发

#### 1. 进入 Worker 目录

```bash
cd worker
```

#### 2. 安装 Worker 依赖

```bash
npm install
```

#### 3. 配置 Wrangler

编辑 `wrangler.toml`：

```toml
name = "subtitle-flow-worker"
main = "src/index.js"

[vars]
# 在此处设置你的 Gemini API Key
# GEMINI_API_KEY = "your-api-key-here"
```

或者在 Cloudflare Dashboard 中设置环境变量。

#### 4. 本地启动 Worker

```bash
npm run dev
```

Worker 将在 `http://localhost:8787` 运行。

### 生产环境部署

#### 前端部署到 Cloudflare Pages

1. 在 Cloudflare Dashboard 中创建新的 Pages 项目
2. 连接你的 GitHub 仓库
3. 配置构建设置：
   - **构建命令**: `npm run build`
   - **构建输出目录**: `dist`
4. 点击"部署"完成部署

#### 后端部署 Cloudflare Worker

1. 进入 Worker 目录：

```bash
cd worker
```

1. 确保在 `wrangler.toml` 中配置了正确的 API Key：

```bash
wrangler secret put GEMINI_API_KEY
```

1. 部署 Worker：

```bash
npm run deploy
```

1. 获取 Worker 的 URL 并更新前端 `.env` 文件：

```bash
VITE_API_URL=https://subtitle-flow-worker.<your-subdomain>.workers.dev
```

#### 手动构建和预览

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 获取 Gemini API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 登录 Google 账号
3. 在"Get API Key"页面创建新的 API Key
4. 复制并配置到 Worker 环境变量中

> 注意：Gemini API 有免费使用额度限制，请参考 Google 官方文档了解具体限制。

### 常见问题

**Q: API 请求失败怎么解决？**

A: 检查以下几点：

- Gemini API Key 是否正确配置
- 服务端掉用Gemini的网络是否正常，特别是大陆地区
- API Key 是否有足够的调用额度

**Q: 如何自定义 AI 生成的文本风格？**

A: 编辑 `worker/src/index.js` 中的提示词（prompt），可以根据需求调整生成规则。

### 环境变量参考

| 变量名              | 必需 | 默认值                   | 说明                      |
| ---------------- | -- | --------------------- | ----------------------- |
| `VITE_API_URL`   | 否  | Cloudflare Worker URL | 前端 API 地址               |
| `GEMINI_API_KEY` | 是  | -                     | Google Gemini AI API 密钥 |

## 技术架构

```
┌─────────────────┐
│   用户浏览器     │
│  (React App)     │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│ Cloudflare CDN  │
│   (Pages)       │
└─────────────────┘
         │
         ▼ HTTPS
┌─────────────────┐
│ Cloudflare      │
│   Worker        │
└────────┬────────┘
         │ API 请求
         ▼
┌─────────────────┐
│ Google Gemini   │
│   AI API        │
└─────────────────┘
```

## License

MIT License

## 联系方式

如有问题或建议，请通过 GitHub Issues 联系我们。
