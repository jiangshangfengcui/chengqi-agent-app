
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { codeReviewAgent } from './agents/code-review-agent';

// 检测运行环境
const isCloudflareWorkers = typeof globalThis.caches !== 'undefined';

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent, codeReviewAgent },
  storage: new LibSQLStore({
    // Cloudflare Workers 使用内存存储，或者可以配置 D1 数据库
    url: isCloudflareWorkers ? ":memory:" : "file:../mastra.db",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
