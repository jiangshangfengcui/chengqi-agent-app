// Cloudflare Workers 优化版本 - 修复版
// Auto-generated and fixed for proper Mastra integration

export default {
  async fetch(request, env, ctx) {
    try {
      // 设置环境变量
      setupEnvironmentVariables(env);
      
      // 先尝试提供基本的API服务，然后再尝试加载Mastra
      const url = new URL(request.url);
      
      // 健康检查端点
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({ 
          status: 'ok',
          timestamp: new Date().toISOString()
        }), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // API信息端点
      if (url.pathname === '/api' || url.pathname === '/') {
        return new Response(JSON.stringify({ 
          name: 'Chengqi Agent App',
          version: '1.0.0',
          status: 'running with Mastra integration',
          timestamp: new Date().toISOString(),
          message: 'Agent app is successfully deployed on Cloudflare Workers',
          availableEndpoints: [
            '/ - This info',
            '/health - Health check',
            '/api - API info',
            '/mastra/* - Mastra endpoints (if loaded)'
          ],
          framework: 'Mastra AI Framework',
          deployment: 'Cloudflare Workers'
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // 处理 OPTIONS 请求用于 CORS
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        });
      }
      
      // 尝试加载 Mastra 应用（如果路径以 /mastra 开头）
      if (url.pathname.startsWith('/mastra/')) {
        try {
          // 动态导入 Mastra 构建输出
          const { createHonoServer } = await import('./.mastra/output/index.mjs');
          const { mastra } = await import('./src/mastra/index.js');
          
          // 创建 Hono 应用实例
          const app = await createHonoServer(mastra, {
            playground: true,
            isDev: false,
            tools: {},
          });
          
          // 处理请求
          return await app.fetch(request, env, ctx);
        } catch (mastraError) {
          console.error('Mastra loading error:', mastraError);
          return new Response(
            JSON.stringify({ 
              error: 'Mastra module unavailable',
              message: mastraError.message,
              note: 'Falling back to basic API mode',
              timestamp: new Date().toISOString()
            }), 
            { 
              status: 503,
              headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              }
            }
          );
        }
      }
      
      // 404 for other paths
      return new Response(JSON.stringify({ 
        error: 'Not found',
        path: url.pathname,
        message: 'Endpoint not found. Try / for API info or /health for health check.',
        availableEndpoints: ['/', '/health', '/api', '/mastra/*']
      }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      
    } catch (error) {
      console.error('Worker error:', error);
      
      // 如果是导入错误，返回更详细的信息
      if (error.message.includes('import') || error.message.includes('module')) {
        return new Response(
          JSON.stringify({ 
            error: 'Module import failed',
            message: error.message,
            note: 'Mastra build may not be properly configured for Cloudflare Workers',
            timestamp: new Date().toISOString()
          }), 
          { 
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error',
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
  },
};

// === 辅助函数 ===
function setupEnvironmentVariables(env) {
  // 设置全局 process 对象
  globalThis.process = globalThis.process || {};
  globalThis.process.env = globalThis.process.env || {};
  
  // 复制环境变量
  if (env.DEEPSEEK_API_KEY) {
    globalThis.process.env.DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
  }
  if (env.OPENAI_API_KEY) {
    globalThis.process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
  }
  if (env.NODE_ENV) {
    globalThis.process.env.NODE_ENV = env.NODE_ENV;
  } else {
    globalThis.process.env.NODE_ENV = 'production';
  }
  
  // 设置其他必要的全局变量
  if (!globalThis.crypto) {
    globalThis.crypto = crypto;
  }
}