#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

console.log('🔧 Preparing Cloudflare Worker...');

try {
  // 1. 检查构建输出是否存在
  const mastraOutputPath = resolve('.mastra/output/index.mjs');
  if (!existsSync(mastraOutputPath)) {
    throw new Error('Mastra build output not found. Please run "npm run build" first.');
  }

  // 2. 读取 Mastra 构建输出
  const mastraOutput = readFileSync(mastraOutputPath, 'utf-8');
  
  // 3. 读取 worker 模板
  const workerTemplate = readFileSync('worker.js', 'utf-8');
  
  // 4. 提取必要的函数和导出
  // 找到创建服务器的函数定义
  const createHonoServerMatch = mastraOutput.match(/(async function createHonoServer[\s\S]*?^})/m);
  const getToolExportsMatch = mastraOutput.match(/(function getToolExports[\s\S]*?^})/m);
  
  if (!createHonoServerMatch || !getToolExportsMatch) {
    console.warn('⚠️  Could not extract all necessary functions. Using original worker template.');
    process.exit(0);
  }

  // 5. 创建优化后的 worker 文件
  const optimizedWorker = `
// Cloudflare Workers 优化版本
// Auto-generated from Mastra build output

// === 导入必要的依赖 ===
${extractImports(mastraOutput)}

// === 核心函数 ===
${createHonoServerMatch[1]}

${getToolExportsMatch[1]}

// === Worker 入口点 ===
export default {
  async fetch(request, env, ctx) {
    try {
      // 设置环境变量
      setupEnvironmentVariables(env);
      
      // 创建应用实例
      const app = await createWorkerHandler();
      
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

// === 辅助函数 ===
function setupEnvironmentVariables(env) {
  globalThis.process = globalThis.process || {};
  globalThis.process.env = globalThis.process.env || {};
  
  if (env.DEEPSEEK_API_KEY) {
    globalThis.process.env.DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
  }
  if (env.OPENAI_API_KEY) {
    globalThis.process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
  }
}

async function createWorkerHandler() {
  const { mastra } = await import('./src/mastra/index.js');
  
  return await createHonoServer(mastra, {
    playground: true,
    isDev: false,
    tools: getToolExports({}),
  });
}
`;

  // 6. 写入优化后的 worker 文件
  writeFileSync('worker-optimized.js', optimizedWorker);
  
  console.log('✅ Worker prepared successfully!');
  console.log('📄 Files created:');
  console.log('   - worker-optimized.js (optimized version)');
  console.log('   - worker.js (original template)');
  
} catch (error) {
  console.error('❌ Error preparing worker:', error.message);
  process.exit(1);
}

// 提取导入语句
function extractImports(content) {
  const importRegex = /^import\s+.*?;$/gm;
  const imports = content.match(importRegex) || [];
  
  // 过滤掉一些 Node.js 特定的导入
  const filteredImports = imports.filter(imp => 
    !imp.includes('node:') &&
    !imp.includes('createServer') &&
    !imp.includes('Http2ServerRequest') &&
    !imp.includes('createReadStream')
  );
  
  return filteredImports.join('\n');
}