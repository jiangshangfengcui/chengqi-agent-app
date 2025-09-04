// Cloudflare Workers 适配器
// 这个文件将 Mastra 应用适配到 Workers 运行时

import { mastra } from './src/mastra/index.js';

// 创建 Hono 服务器实例，不启动 Node.js 服务器
async function createWorkerHandler() {
  // 导入 Hono 服务器创建函数（需要从 Mastra 构建输出中提取）
  const { createHonoServer, getToolExports } = await import('./.mastra/output/index.mjs');
  
  // 创建适用于 Workers 的 Hono app
  const app = await createHonoServer(mastra, {
    playground: true,
    isDev: false, // 生产环境
    tools: getToolExports({}),
  });

  return app;
}

// Workers 入口点
export default {
  async fetch(request, env, ctx) {
    try {
      // 设置环境变量
      if (env.DEEPSEEK_API_KEY) {
        globalThis.process = globalThis.process || {};
        globalThis.process.env = globalThis.process.env || {};
        globalThis.process.env.DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
      }
      
      if (env.OPENAI_API_KEY) {
        globalThis.process = globalThis.process || {};
        globalThis.process.env = globalThis.process.env || {};
        globalThis.process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
      }

      // 创建应用实例
      const app = await createWorkerHandler();
      
      // 处理请求
      return await app.fetch(request, env, ctx);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          message: error.message 
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  },
};