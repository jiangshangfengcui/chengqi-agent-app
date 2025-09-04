// Cloudflare Workers 入口文件
import { mastra } from './src/mastra/index.js';

export default {
  async fetch(request, env, ctx) {
    try {
      // 设置环境变量
      if (!globalThis.process) {
        globalThis.process = {};
      }
      if (!globalThis.process.env) {
        globalThis.process.env = {};
      }
      
      // 从 Cloudflare 环境变量中设置 API 密钥
      if (env.DEEPSEEK_API_KEY) {
        globalThis.process.env.DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
      }
      if (env.OPENAI_API_KEY) {
        globalThis.process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
      }
      
      // 创建 Mastra 应用实例
      const app = mastra.createApplication();
      
      // 处理请求
      return await app.fetch(request, env, ctx);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          message: error.message,
          stack: error.stack 
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  },
};