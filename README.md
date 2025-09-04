# 🤖 Chengqi Agent App - Code Review & Weather Assistant

基于 Mastra 框架开发的智能 Agent 应用，支持代码审查和天气查询功能，使用 DeepSeek 大模型驱动。

## ✨ 功能特性

### 🔍 Code Review Agent
- **单文件审查**: 分析代码质量、安全漏洞、性能问题
- **项目扫描**: 批量分析项目中的代码文件
- **多语言支持**: JavaScript、TypeScript、Python、Java 等
- **智能建议**: 提供具体的修复建议和最佳实践

### 🌤️ Weather Agent
- **实时天气**: 获取任意城市的当前天气信息
- **活动建议**: 基于天气条件推荐合适的活动
- **多语言查询**: 支持中英文城市名称

## 🚀 快速开始

### 本地开发
```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env .env.local
# 编辑 .env 文件，添加你的 DEEPSEEK_API_KEY

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
open http://localhost:4111
```

### Cloudflare Workers 部署

```bash
# 1. 检查部署准备
npm run deploy:setup

# 2. 登录 Cloudflare
npx wrangler auth login

# 3. 设置 API 密钥
npx wrangler secret put DEEPSEEK_API_KEY

# 4. 部署到生产环境
npm run deploy
```

## 📖 使用指南

### Code Review Agent 使用方法

**单文件审查:**
```
请审查这个文件：/path/to/your/project/src/app.js
```

**项目扫描:**
```
扫描项目目录：/Users/username/my-react-app
```

**指定审查类型:**
```
对文件 ./src/components/Header.jsx 进行安全审查
检查性能问题：../backend/api/users.py
```

### Weather Agent 使用方法

**天气查询:**
```
北京的天气怎么样？
What's the weather in New York?
```

**活动建议:**
```
上海今天适合做什么运动？
```

## 🏗️ 项目结构

```
├── src/mastra/
│   ├── index.ts                 # Mastra 主配置
│   ├── agents/                  # Agent 定义
│   │   ├── code-review-agent.ts # 代码审查 Agent
│   │   └── weather-agent.ts     # 天气 Agent
│   ├── tools/                   # 工具实现
│   │   ├── code-review-tool.ts  # 代码审查工具
│   │   └── weather-tool.ts      # 天气查询工具
│   └── workflows/               # 工作流定义
├── worker.js                    # Cloudflare Workers 入口
├── wrangler.toml               # Workers 配置
└── scripts/                    # 构建和部署脚本
```

## 🛠️ 可用脚本

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建项目 |
| `npm run deploy:setup` | 检查部署准备状态 |
| `npm run deploy` | 部署到生产环境 |
| `npm run deploy:dev` | 部署到开发环境 |
| `npm run preview` | 本地预览 Workers |

## 🔧 配置说明

### 环境变量
```bash
DEEPSEEK_API_KEY=your-deepseek-api-key  # 必需
OPENAI_API_KEY=your-openai-api-key      # 可选
```

### 审查类型
- `full`: 完整审查（默认）
- `security`: 安全检查
- `performance`: 性能分析
- `style`: 代码风格

## 📚 技术栈

- **框架**: [Mastra](https://mastra.ai/) - AI Agent 开发框架
- **AI 模型**: [DeepSeek](https://www.deepseek.com/) - 智能对话和代码分析
- **部署**: [Cloudflare Workers](https://workers.cloudflare.com/) - 边缘计算平台
- **工具构建**: [Zod](https://zod.dev/) - TypeScript 优先的模式验证
- **UI**: Web Playground - 内置交互界面

## 📄 相关文档

- [部署指南](./DEPLOYMENT.md) - 详细的 Cloudflare Workers 部署说明
- [Mastra 文档](https://docs.mastra.ai/) - 框架官方文档
- [DeepSeek API](https://platform.deepseek.com/api-docs/) - 模型 API 文档

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

ISC License