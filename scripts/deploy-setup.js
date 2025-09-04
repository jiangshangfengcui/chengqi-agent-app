#!/usr/bin/env node

/**
 * 快速设置 Cloudflare Workers 部署脚本
 * 这个脚本将帮助用户快速配置和部署应用到 Cloudflare Workers
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import chalk from 'chalk';

console.log(chalk.blue.bold('🚀 Cloudflare Workers 部署助手'));
console.log(chalk.gray('═══════════════════════════════════'));

async function main() {
  try {
    // 1. 检查依赖
    console.log(chalk.yellow('\n📋 检查部署依赖...'));
    await checkDependencies();
    
    // 2. 验证构建
    console.log(chalk.yellow('\n🔨 验证项目构建...'));
    await validateBuild();
    
    // 3. 检查配置
    console.log(chalk.yellow('\n⚙️  检查配置文件...'));
    await checkConfiguration();
    
    // 4. 提供下一步指导
    console.log(chalk.green.bold('\n✅ 部署准备完成！'));
    showNextSteps();
    
  } catch (error) {
    console.error(chalk.red.bold('\n❌ 部署准备失败:'), error.message);
    console.log(chalk.yellow('\n💡 解决方案:'));
    console.log('   - 检查网络连接');
    console.log('   - 确保已安装所有依赖: npm install');
    console.log('   - 查看详细错误信息并修复');
    process.exit(1);
  }
}

async function checkDependencies() {
  // 检查 Wrangler 是否安装
  try {
    execSync('npx wrangler --version', { stdio: 'ignore' });
    console.log(chalk.green('   ✓ Wrangler CLI 已安装'));
  } catch (error) {
    console.log(chalk.red('   ✗ Wrangler CLI 未安装'));
    throw new Error('请运行 npm install 安装依赖');
  }
  
  // 检查必要文件
  const requiredFiles = [
    'wrangler.toml',
    'worker.js',
    'src/mastra/index.ts',
    'scripts/prepare-worker.js'
  ];
  
  for (const file of requiredFiles) {
    if (existsSync(file)) {
      console.log(chalk.green(`   ✓ ${file}`));
    } else {
      console.log(chalk.red(`   ✗ ${file}`));
      throw new Error(`缺少必要文件: ${file}`);
    }
  }
}

async function validateBuild() {
  try {
    console.log(chalk.blue('   正在构建项目...'));
    execSync('npm run build', { stdio: 'ignore' });
    console.log(chalk.green('   ✓ 项目构建成功'));
    
    console.log(chalk.blue('   正在准备 Worker 文件...'));
    execSync('node scripts/prepare-worker.js', { stdio: 'ignore' });
    console.log(chalk.green('   ✓ Worker 文件准备完成'));
    
  } catch (error) {
    throw new Error('构建失败，请检查代码是否有错误');
  }
}

async function checkConfiguration() {
  // 检查 wrangler.toml
  if (existsSync('wrangler.toml')) {
    const config = readFileSync('wrangler.toml', 'utf-8');
    console.log(chalk.green('   ✓ wrangler.toml 配置文件存在'));
    
    // 检查关键配置
    if (config.includes('nodejs_compat')) {
      console.log(chalk.green('   ✓ Node.js 兼容性已启用'));
    } else {
      console.log(chalk.yellow('   ⚠ 建议启用 Node.js 兼容性'));
    }
  }
  
  // 检查环境变量文件
  if (existsSync('.env')) {
    console.log(chalk.green('   ✓ 环境变量文件存在'));
  } else {
    console.log(chalk.yellow('   ⚠ 本地 .env 文件不存在（部署时需要设置远程密钥）'));
  }
}

function showNextSteps() {
  console.log(chalk.cyan('\n📝 接下来的步骤:\n'));
  
  console.log(chalk.white.bold('1. 登录 Cloudflare (首次部署):'));
  console.log(chalk.gray('   npx wrangler auth login\n'));
  
  console.log(chalk.white.bold('2. 设置 API 密钥:'));
  console.log(chalk.gray('   npx wrangler secret put DEEPSEEK_API_KEY'));
  console.log(chalk.gray('   # 然后输入你的 DeepSeek API Key\n'));
  
  console.log(chalk.white.bold('3. 部署到开发环境:'));
  console.log(chalk.gray('   npm run deploy:dev\n'));
  
  console.log(chalk.white.bold('4. 部署到生产环境:'));
  console.log(chalk.gray('   npm run deploy\n'));
  
  console.log(chalk.white.bold('5. 本地测试 (可选):'));
  console.log(chalk.gray('   npm run preview\n'));
  
  console.log(chalk.green.bold('🎉 你的 Code Review Agent 即将上线！'));
  console.log(chalk.gray('   部署后可通过 *.workers.dev 域名访问'));
  
  console.log(chalk.blue('\n📚 更多信息请查看 DEPLOYMENT.md 文件'));
}

// 运行主函数
main().catch(console.error);