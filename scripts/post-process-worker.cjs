#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Creating Cloudflare Workers compatible entry point...');

try {
  // Read the original Mastra output to see what we have available
  const mastraOutputPath = '.mastra/output/index.mjs';
  
  // Check if Mastra output exists
  if (!fs.existsSync(mastraOutputPath)) {
    throw new Error('Mastra build output not found. Please run "npm run build" first.');
  }

  // Create a completely standalone Workers-compatible entry point
  // This avoids importing any Mastra code that might cause database issues
  const workerContent = `// Cloudflare Workers Entry Point
// Standalone version to avoid Mastra/LibSQL compatibility issues

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Health check endpoint
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({ 
          status: 'ok',
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // API info endpoint
      if (url.pathname === '/api' || url.pathname === '/') {
        return new Response(JSON.stringify({ 
          name: 'Chengqi Agent App',
          version: '1.0.0',
          status: 'running',
          timestamp: new Date().toISOString(),
          message: 'Agent app is successfully deployed on Cloudflare Workers',
          availableEndpoints: [
            '/ - This info',
            '/health - Health check',
            '/api - API info'
          ],
          note: 'Mastra agents are being configured for full Cloudflare Workers compatibility'
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // Handle OPTIONS requests for CORS
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
      
      // 404 for other paths
      return new Response(JSON.stringify({ 
        error: 'Not found',
        path: url.pathname,
        message: 'Endpoint not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      }), { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  },
};`;

  fs.writeFileSync('worker.js', workerContent);
  console.log('✅ Standalone Cloudflare Workers entry point created successfully!');
  console.log('📄 File: worker.js');
  console.log('🚀 This provides basic API functionality without Mastra dependencies');
  console.log('💡 Next steps: Configure Mastra for full Workers compatibility');
  
} catch (error) {
  console.error('❌ Error creating worker file:', error.message);
  process.exit(1);
}