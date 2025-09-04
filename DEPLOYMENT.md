# Cloudflare Workers 部署指南

## 📋 部署准备清单

### 1. **Cloudflare 账户设置**
- [ ] 注册/登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [ ] 获取 Account ID 和 API Token

### 2. **本地环境配置**

```bash
# 1. 安装 Wrangler CLI（如果全局安装）
npm install -g wrangler

# 2. 登录 Cloudflare 账户
wrangler auth login

# 3. 验证登录状态
wrangler whoami
```

### 3. **环境变量配置**

```bash
# 设置 DeepSeek API Key
wrangler secret put DEEPSEEK_API_KEY

# 设置 OpenAI API Key（可选）
wrangler secret put OPENAI_API_KEY
```

## 🚀 部署命令

### **开发环境部署**
```bash
npm run deploy:dev
```

### **生产环境部署**
```bash
npm run deploy
```

### **本地预览**
```bash
npm run preview
```

## 📝 wrangler.toml 配置说明

```toml
name = "chengqi-agent-app"                    # Worker 名称
main = "worker.js"                           # 入口文件
compatibility_date = "2024-09-03"           # 兼容性日期
compatibility_flags = ["nodejs_compat"]      # Node.js 兼容模式

[limits]
cpu_ms = 30000                              # CPU 时间限制（AI 调用需要）

[[secrets]]
name = "DEEPSEEK_API_KEY"                   # 加密环境变量

# 可选：D1 数据库配置
[[d1_databases]]
binding = "DB"                              # 数据库绑定名
database_name = "mastra-db"                 # 数据库名称
```

## 🔧 项目结构变化

```
├── worker.js                    # Cloudflare Workers 入口文件
├── worker-optimized.js         # 构建生成的优化版本（自动生成）
├── wrangler.toml               # Cloudflare Workers 配置
├── scripts/
│   └── prepare-worker.js       # 构建脚本
└── src/mastra/
    ├── index.ts               # ✅ 已适配 Workers 运行时
    └── agents/                # ✅ 存储配置已优化
```

## ⚡ 性能优化

### **内存使用优化**
- 使用内存存储 (`:memory:`) 替代文件存储
- 自动检测运行环境并切换存储模式

### **冷启动优化**
- 移除 Node.js 特定的服务器启动逻辑
- 使用 Hono 框架的轻量级路由

### **错误处理**
- 完整的错误捕获和日志记录
- 用户友好的错误响应

## 🌍 访问你的应用

部署成功后，你的应用将可以通过以下 URL 访问：

- **开发环境**: `https://chengqi-agent-app-dev.your-subdomain.workers.dev`
- **生产环境**: `https://chengqi-agent-app-prod.your-subdomain.workers.dev`

### **API 端点**
- 代理 API: `/api/*`
- Playground: `/` (根路径)
- Agent 交互: `/api/agents/{agent-name}/chat`

## 🚨 常见问题

### **1. 部署失败**
```bash
# 检查配置
wrangler deploy --dry-run

# 查看详细日志
wrangler deploy --compatibility-date=2024-09-03 --verbose
```

### **2. API Key 设置问题**
```bash
# 列出所有 secrets
wrangler secret list

# 删除并重新设置
wrangler secret delete DEEPSEEK_API_KEY
wrangler secret put DEEPSEEK_API_KEY
```

### **3. 运行时错误**
```bash
# 查看实时日志
wrangler tail

# 查看部署状态
wrangler deployments list
```

## 📊 监控和调试

### **查看日志**
```bash
# 实时日志
wrangler tail

# 过滤错误日志
wrangler tail --format=pretty --filter=error
```

### **性能监控**
在 Cloudflare Dashboard 中监控：
- 请求数量和响应时间
- 错误率和状态码分布
- CPU 使用情况

## 🔄 更新和回滚

### **更新应用**
```bash
# 构建并部署最新版本
npm run deploy
```

### **回滚到之前版本**
```bash
# 查看部署历史
wrangler deployments list

# 回滚到特定版本
wrangler rollback --deployment-id <DEPLOYMENT_ID>
```

## 💡 最佳实践

1. **环境分离**: 使用不同的环境 (dev/prod) 进行测试
2. **监控设置**: 启用 Cloudflare Analytics 监控性能
3. **缓存策略**: 利用 Cloudflare 的边缘缓存优化响应速度
4. **安全配置**: 定期轮换 API Keys
5. **备份策略**: 定期备份重要的 Agent 配置