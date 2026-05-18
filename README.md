# Subtitle Flow - YouTube视频文章生成器

## 1. 项目功能

Subtitle Flow 是一个基于 AI 的全栈 Web 应用，采用前后端一体化架构，将 YouTube 视频内容快速转化为结构化的中文文章。通过使用 Cloudflare Workers 同时托管前端界面和后端 API，简化了部署流程，提升了应用性能。

### 核心功能

- **视频链接解析**: 支持多种 YouTube 链接格式，包括标准链接（youtube.com/watch?v=）、短链接（youtu.be/）、嵌入链接（youtube.com/embed/）等
- **AI智能文章生成**: 利用 Google Gemini AI 将视频内容自动转化为结构化的中文文章
- **流式输出**: 实时展示文章生成过程，通过 SSE 技术实现边生成边显示
- **一键复制**: 生成完成后可快速复制完整文章内容
- **响应式设计**: 完美支持桌面端、平板和移动端设备

### 技术特点

- **前后端一体化**：前端界面与后端 API 部署于同一个 Worker，简化部署和维护
- **自动化字幕获取**：无需手动提取字幕，系统自动获取 YouTube 视频字幕
- **AI 文本优化**：生成的文本经过智能处理
  - 去除口语化和重复内容
  - 保持核心观点和专业表述
  - 统一的问答格式（主持人/嘉宾）
  - 结构化为清晰的文章段落
- **优雅的 UI/UX**：现代化的用户界面和流畅的交互体验

## 2. 技术栈

### 前端技术

- **React 19**: 现代 React 框架（2024年发布），用于构建用户界面
- **Vite 6**: 快速的构建工具和开发服务器，提升开发体验
- **Tailwind CSS 3**: 实用优先的 CSS 框架，用于快速样式开发
- **Lucide React**: 轻量级、像素完美的图标库

### 后端技术

- **Cloudflare Workers**: 边缘计算平台，用于部署无服务器函数，全球低延迟
- **Google Gemini AI**: 强大的 AI 模型（gemini-3-flash-preview），用于生成文章内容
- **SSE (Server-Sent Events)**: 服务器推送技术，实现流式响应和实时更新

### 开发工具

- **ESLint**: 代码质量检查，确保代码风格统一
- **PostCSS**: CSS 转换工具，处理 Tailwind CSS 等
- **Wrangler**: Cloudflare Workers 官方部署工具和开发服务器

## 3. 目录结构

```
subtitle-flow/
├── public/                      # 静态资源目录
│   ├── _routes.json            # 路由配置文件
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
├── worker/                      # Cloudflare Worker 后端服务（包含前端和 API）
│   ├── public/                 # Worker 静态资源（构建输出）
│   │   ├── assets/             # 编译后的前端资源
│   │   ├── _routes.json        # Worker 路由配置
│   │   ├── index.html          # Worker 入口页面
│   │   └── vite.svg            # Vite 图标
│   ├── src/
│   │   ├── assets.js           # 打包的前端静态资源
│   │   └── index.js            # Worker 入口（处理 API 请求、调用 Gemini AI）
│   ├── build-assets.js         # 前端资源打包脚本
│   ├── package.json            # Worker 依赖配置
│   ├── test-server.js          # 本地测试服务器
│   └── wrangler.toml           # Wrangler 配置文件
├── .env                        # 环境变量配置
├── .gitignore                  # Git 忽略文件配置
├── eslint.config.js            # ESLint 配置
├── index.html                  # HTML 入口文件
├── package.json                # 项目依赖和脚本配置
├── postcss.config.js           # PostCSS 配置
├── README.md                   # 项目说明文档（本文件）
├── tailwind.config.js          # Tailwind CSS 配置
├── TEST_REPORT.md              # 测试报告
└── vite.config.js              # Vite 构建配置
```

### 关键文件说明

- **`src/App.jsx`**: 主应用组件，协调各个子组件，处理核心逻辑
- **`src/components/UrlInput.jsx`**: 处理用户输入的 YouTube 链接，包含验证逻辑
- **`src/components/ArticleDisplay.jsx`**: 负责文章内容的渲染展示，支持 Markdown 解析
- **`src/services/api.js`**: 封装 API 调用，处理与后端 Worker 的通信
- **`worker/src/index.js`**: Cloudflare Worker 处理函数，同时托管前端路由和 API 端点，调用 Gemini AI 进行文章生成

## 4. 安装和部署

### 快速开始

如果你是新用户，可以按照以下步骤快速启动项目：

1. **克隆并安装**

```bash
git clone <repository-url>
cd subtitle-flow
npm install
cd worker && npm install && cd ..
```

1. **配置 API Key**

```bash
cd worker
npx wrangler secret put GEMINI_API_KEY
# 输入你的 Gemini API Key
```

1. **启动开发**

```bash
# 终端 1：启动前端
npm run dev

# 终端 2：启动 Worker
npm run dev:worker
```

1. **访问应用**

- 前端：<http://localhost:5173>
- 复制 YouTube 视频链接并粘贴
- 等待文章生成完成

### 前置要求

- **Node.js**: 版本 18.x 或更高
- **npm**: 版本 9.x 或更高
- **Cloudflare 账号**: 用于部署 Worker（可选）
- **Gemini API Key**: 从 [Google AI Studio](https://aistudio.google.com/) 获取

### 本地开发

#### 安装步骤

```bash
# 克隆项目
git clone <repository-url>
cd subtitle-flow

# 安装前端依赖
npm install

# 安装 Worker 依赖
cd worker && npm install && cd ..
```

> **提示**：首次克隆项目后，需要同时安装根目录和 worker 目录的依赖。

#### 启动开发服务器

项目支持前后端分离开发：

```bash
# 终端 1：启动前端开发服务器
npm run dev

# 终端 2：启动后端 Worker 开发服务器
npm run dev:worker
```

- 前端访问：<http://localhost:5173>
- Worker 访问：<http://localhost:8787>

#### 环境变量配置

在项目根目录创建 `.env` 文件（如果不存在）：

```bash
# 本地开发时配置 Worker 地址
VITE_API_URL=http://localhost:8787
```

> **重要提示**：
>
> - 生产环境部署时不需要此配置，API 请求会使用相对路径
> - 确保 `.env` 文件已添加到 `.gitignore` 中，不要提交到代码仓库
> - `.env` 文件已包含在项目根目录，如需修改直接编辑即可

### 生产环境部署

项目采用前后端一体化架构，只需一个命令即可完成构建和部署。

#### 步骤 1: 配置 Gemini API Key

> ⚠️ **安全提示**: 请勿将 API Key 直接提交到代码仓库中！

方式一（推荐）：使用 wrangler secret

```bash
cd worker
npx wrangler secret put GEMINI_API_KEY
# 输入你的 Gemini API Key
```

方式二：在 `worker/wrangler.toml` 中配置（仅用于测试环境）

```toml
[vars]
GEMINI_API_KEY = "your-api-key-here"
```

#### 步骤 2: 部署

```bash
# 从项目根目录执行
npm run deploy
```

这将自动完成以下操作：

1. 构建前端到 `worker/public/`
2. 打包静态资源到 `worker/src/assets.js`
3. 部署整个 Worker 到 Cloudflare

#### 步骤 3: 访问应用

部署成功后，访问：`https://subtitle-flow.<your-account-id>.workers.dev`

> **提示**：部署后会在终端显示实际的访问 URL，请使用该 URL 访问应用。

### 手动构建和预览

```bash
# 构建前端
npm run build

# 预览（使用测试服务器）
cd worker && node test-server.js
```

### Worker 配置说明

`worker/wrangler.toml` 主要配置：

| 配置项                 | 说明               |
| ------------------- | ---------------- |
| name                | Worker 名称        |
| main                | 入口文件             |
| compatibility\_date | Cloudflare 兼容性日期 |
| \[vars]             | 环境变量配置           |
| \[env.production]   | 生产环境配置           |
| \[observability]    | 可观测性配置（日志、追踪）    |
| \[placement]        | 部署区域配置           |

可通过 `wrangler secret put <KEY>` 管理敏感配置。

### 环境变量参考

#### 前端环境变量（.env）

| 变量名            | 必需 | 默认值       | 说明                |
| -------------- | -- | --------- | ----------------- |
| VITE\_API\_URL | 否  | Worker 地址 | API 请求地址（仅本地开发需要） |

#### Worker 环境变量（wrangler.toml 或 secrets）

| 变量名              | 必需 | 说明                      |
| ---------------- | -- | ----------------------- |
| GEMINI\_API\_KEY | 是  | Google Gemini AI API 密钥 |

### 常见问题

**Q: API 请求失败怎么解决？**

A: 检查以下几点：

- Gemini API Key 是否正确配置（使用 `wrangler secret put GEMINI_API_KEY`）
- 服务器调用 Gemini 的网络是否正常，特别是大陆地区可能需要代理
- API Key 是否有足够的调用额度
- 查看 Cloudflare Worker 日志排查具体错误

**Q: 如何自定义 AI 生成的文本风格？**

A: 编辑 `worker/src/index.js` 中的提示词（prompt），可以根据需求调整生成规则。提示词位于 `handleGenerate` 函数中，控制文章的结构、格式和风格。修改后需要重新部署 Worker。

**Q: 为什么选择全栈 Worker 架构？**

A: 全栈 Worker 架构有以下优势：

- **简化部署**：只需部署一个 Worker，无需分别管理前端和后端
- **统一域名**：前端和 API 在同一域名下，避免 CORS 问题
- **成本优化**：只需支付 Worker 的计算费用，无需额外的 Pages 费用
- **性能提升**：边缘计算，全球低延迟访问

**Q: 本地开发时前端无法连接 API？**

A: 确保以下几点：

- Worker 开发服务器已启动（`npm run dev:worker`）
- .env 文件中配置了正确的 VITE\_API\_URL（本地开发需要）
- 检查浏览器控制台是否有错误信息
- 尝试使用 `http://localhost:8787` 而非 `127.0.0.1:8787`

**Q: 如何查看 Worker 的运行日志？**

A: 有以下几种方式：

- 使用 `wrangler logstream` 命令实时查看日志
- 在 Cloudflare Dashboard 的 Workers & Pages 中查看
- 使用 `wrangler tail` 命令查看最近的请求日志

**Q: 支持哪些类型的 YouTube 视频？**

A: 目前支持：

- 公开可访问的 YouTube 视频

**Q: 大陆地区访问 Cloudflare Worker 速度慢或无法访问？**

A: 这通常是由于 DNS 解析到了大陆无法访问的 Cloudflare IP 导致的。可以按照以下步骤解决：

**步骤 1：获取可用的 Cloudflare IP**

使用 AI 工具（如豆包、GPT 等）查询域名对应的可用 IP 地址：

```
请帮我查询域名 "subtitle-flow-worker.1392729514.workers.dev" 的 DNS 记录，
找出可用的 Cloudflare IP，特别是新加坡（ap-southeast-1）或亚太地区的 IP。
```

**步骤 2：测试并配置 hosts**

找到可用的 IP 后（如 `172.67.192.35`），配置本机 hosts 文件：

```bash
# macOS/Linux 编辑 /etc/hosts
sudo nano /etc/hosts

# 添加以下行（将 IP 和域名替换为实际值）
172.67.192.35 subtitle-flow-worker.1392729514.workers.dev

# 保存后刷新 DNS 缓存
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

**步骤 3：验证配置**

```bash
# 测试是否生效
ping subtitle-flow-worker.1392729514.workers.dev

# 或使用 curl 测试
curl -I https://subtitle-flow-worker.1392729514.workers.dev
```

> **提示**：
>
> - 如果某个 IP 不可用，可以尝试 AI 返回的其他 IP
> - Cloudflare 会自动选择最优路径，新加坡 IP 通常对大陆访问较友好
> - 如果 Worker 部署到新的区域，可能需要重新查询可用 IP

## 技术架构

```
┌─────────────────┐
│   用户浏览器     │
│  (React App)     │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│ Cloudflare      │
│   Worker        │  ← 前后端一体化部署
│                 │
│  ┌───────────┐  │
│  │  前端资源  │  │  ← 静态文件在 worker/public/
│  └───────────┘  │
│  ┌───────────┐  │
│  │  API 处理  │  │  ← 处理请求，调用 Gemini
│  └───────────┘  │
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

如有问题或建议，请通过以下方式联系我们：

- **GitHub Issues**: 报告 Bug 或提交功能建议
- **Pull Requests**: 欢迎提交代码改进

我们非常感谢任何形式的贡献和反馈！
