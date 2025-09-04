import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { extname, resolve, join } from 'path';

export const codeReviewTool = createTool({
  id: 'code-review',
  description: 'Analyze code file for quality, bugs, security issues, and provide improvement suggestions',
  inputSchema: z.object({
    filePath: z.string().describe('Path to the code file to review'),
    reviewType: z.enum(['full', 'security', 'performance', 'style']).default('full').describe('Type of code review to perform'),
  }),
  outputSchema: z.object({
    filePath: z.string(),
    language: z.string(),
    issues: z.array(z.object({
      type: z.enum(['bug', 'security', 'performance', 'style', 'maintainability']),
      severity: z.enum(['high', 'medium', 'low']),
      line: z.number().optional(),
      description: z.string(),
      suggestion: z.string(),
    })),
    summary: z.string(),
    rating: z.number().min(1).max(10),
  }),
  execute: async ({ context }) => {
    return await reviewCodeFile(context.filePath, context.reviewType);
  },
});

export const projectScanTool = createTool({
  id: 'project-scan',
  description: 'Scan a project directory for code files and provide an overview of code quality',
  inputSchema: z.object({
    projectPath: z.string().describe('Path to the project directory to scan'),
    extensions: z.array(z.string()).default(['.js', '.ts', '.jsx', '.tsx', '.py', '.java']).describe('File extensions to scan'),
    maxFiles: z.number().default(20).describe('Maximum number of files to scan'),
  }),
  outputSchema: z.object({
    projectPath: z.string(),
    filesScanned: z.number(),
    totalFiles: z.number(),
    overview: z.string(),
    fileResults: z.array(z.object({
      filePath: z.string(),
      language: z.string(),
      rating: z.number(),
      issueCount: z.number(),
      highSeverityIssues: z.number(),
    })),
    recommendations: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    return await scanProject(context.projectPath, context.extensions, context.maxFiles);
  },
});

const reviewCodeFile = async (filePath: string, reviewType: string = 'full') => {
  try {
    // 解析为绝对路径
    const absolutePath = resolve(filePath);
    
    // 检查文件是否存在
    if (!existsSync(absolutePath)) {
      throw new Error(`File does not exist: ${absolutePath}`);
    }

    // 检查是否是文件而不是目录
    if (!statSync(absolutePath).isFile()) {
      throw new Error(`Path is not a file: ${absolutePath}`);
    }

    const codeContent = readFileSync(absolutePath, 'utf-8');
    const fileExtension = extname(absolutePath).toLowerCase();
    const language = getLanguageFromExtension(fileExtension);
    
    const analysis = analyzeCode(codeContent, language, reviewType);
    
    return {
      filePath: absolutePath,
      language,
      issues: analysis.issues,
      summary: analysis.summary,
      rating: analysis.rating,
    };
  } catch (error) {
    throw new Error(`Failed to read or analyze file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const getLanguageFromExtension = (extension: string): string => {
  const languageMap: Record<string, string> = {
    '.js': 'JavaScript',
    '.jsx': 'JavaScript (React)',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript (React)',
    '.py': 'Python',
    '.java': 'Java',
    '.cpp': 'C++',
    '.c': 'C',
    '.cs': 'C#',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.go': 'Go',
    '.rs': 'Rust',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.scala': 'Scala',
    '.sh': 'Shell Script',
    '.sql': 'SQL',
    '.json': 'JSON',
    '.yaml': 'YAML',
    '.yml': 'YAML',
  };
  
  return languageMap[extension] || 'Unknown';
};

const analyzeCode = (code: string, language: string, reviewType: string) => {
  const issues: any[] = [];
  const lines = code.split('\n');
  let rating = 10;

  // Basic static analysis patterns
  const patterns = {
    security: [
      { regex: /eval\s*\(/, type: 'security', severity: 'high' as const, description: 'Use of eval() is dangerous', suggestion: 'Avoid eval() and use safer alternatives' },
      { regex: /innerHTML\s*=/, type: 'security', severity: 'medium' as const, description: 'innerHTML can lead to XSS', suggestion: 'Use textContent or sanitize HTML input' },
      { regex: /document\.write/, type: 'security', severity: 'medium' as const, description: 'document.write can be unsafe', suggestion: 'Use modern DOM manipulation methods' },
      { regex: /console\.(log|debug|info|warn|error)/, type: 'security', severity: 'low' as const, description: 'Console statements in production code', suggestion: 'Remove console statements or use proper logging' },
    ],
    performance: [
      { regex: /for\s*\(\s*var\s+\w+\s*=\s*0.*\.length/g, type: 'performance', severity: 'low' as const, description: 'Loop accessing length property repeatedly', suggestion: 'Cache the length property outside the loop' },
      { regex: /document\.getElementById.*getElementById/g, type: 'performance', severity: 'medium' as const, description: 'Multiple DOM queries', suggestion: 'Cache DOM elements in variables' },
    ],
    style: [
      { regex: /var\s+/, type: 'style', severity: 'low' as const, description: 'Use of var instead of let/const', suggestion: 'Use let or const instead of var' },
      { regex: /==(?!=)/g, type: 'style', severity: 'low' as const, description: 'Use of loose equality', suggestion: 'Use strict equality (===) instead' },
      { regex: /function\s*\([^)]*\)\s*\{[^}]*\}/, type: 'style', severity: 'low' as const, description: 'Consider using arrow functions', suggestion: 'Use arrow functions for cleaner syntax' },
    ],
    bug: [
      { regex: /if\s*\([^)]*=(?!=)/g, type: 'bug', severity: 'high' as const, description: 'Assignment in if condition', suggestion: 'Use comparison (==) instead of assignment (=)' },
      { regex: /\+\+|\-\-/, type: 'bug', severity: 'low' as const, description: 'Increment/decrement operators can be confusing', suggestion: 'Consider using explicit assignment for clarity' },
    ],
    maintainability: [
      { regex: /\/\/\s*TODO/, type: 'maintainability', severity: 'low' as const, description: 'TODO comment found', suggestion: 'Address TODO items for better maintainability' },
      { regex: /\/\/\s*FIXME/, type: 'maintainability', severity: 'medium' as const, description: 'FIXME comment found', suggestion: 'Address FIXME items as they indicate known issues' },
    ]
  };

  // Apply patterns based on review type
  const patternsToCheck = reviewType === 'full' 
    ? Object.values(patterns).flat()
    : patterns[reviewType as keyof typeof patterns] || [];

  lines.forEach((line, index) => {
    patternsToCheck.forEach(pattern => {
      if (pattern.regex.test(line)) {
        issues.push({
          type: pattern.type,
          severity: pattern.severity,
          line: index + 1,
          description: pattern.description,
          suggestion: pattern.suggestion,
        });
        
        // Reduce rating based on severity
        if (pattern.severity === 'high') rating -= 2;
        else if (pattern.severity === 'medium') rating -= 1;
        else rating -= 0.5;
      }
    });
  });

  // Code complexity analysis
  const complexity = analyzeComplexity(code);
  if (complexity.cyclomaticComplexity > 10) {
    issues.push({
      type: 'maintainability',
      severity: 'medium',
      description: `High cyclomatic complexity: ${complexity.cyclomaticComplexity}`,
      suggestion: 'Consider breaking down complex functions into smaller ones',
    });
    rating -= 1;
  }

  // Code length analysis
  if (lines.length > 500) {
    issues.push({
      type: 'maintainability',
      severity: 'low',
      description: `Long file: ${lines.length} lines`,
      suggestion: 'Consider splitting large files into smaller modules',
    });
    rating -= 0.5;
  }

  rating = Math.max(1, Math.min(10, rating));

  const summary = generateSummary(issues, rating, language);

  return { issues, rating: Math.round(rating * 10) / 10, summary };
};

const analyzeComplexity = (code: string) => {
  // Simple cyclomatic complexity calculation
  const complexityPatterns = [
    /if\s*\(/g,
    /else\s*if\s*\(/g,
    /while\s*\(/g,
    /for\s*\(/g,
    /switch\s*\(/g,
    /case\s+/g,
    /catch\s*\(/g,
    /&&/g,
    /\|\|/g,
  ];

  let cyclomaticComplexity = 1; // Base complexity

  complexityPatterns.forEach(pattern => {
    const matches = code.match(pattern);
    if (matches) {
      cyclomaticComplexity += matches.length;
    }
  });

  return { cyclomaticComplexity };
};

const generateSummary = (issues: any[], rating: number, language: string) => {
  const severityCount = issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let summary = `Code review completed for ${language} file. `;
  summary += `Overall rating: ${rating}/10. `;
  
  if (issues.length === 0) {
    summary += 'No issues found - excellent code quality!';
  } else {
    summary += `Found ${issues.length} issue(s): `;
    if (severityCount.high) summary += `${severityCount.high} high severity, `;
    if (severityCount.medium) summary += `${severityCount.medium} medium severity, `;
    if (severityCount.low) summary += `${severityCount.low} low severity`;
    summary = summary.replace(/, $/, '');
  }

  return summary;
};

const scanProject = async (projectPath: string, extensions: string[], maxFiles: number) => {
  try {
    const absoluteProjectPath = resolve(projectPath);
    
    if (!existsSync(absoluteProjectPath)) {
      throw new Error(`Project directory does not exist: ${absoluteProjectPath}`);
    }

    if (!statSync(absoluteProjectPath).isDirectory()) {
      throw new Error(`Path is not a directory: ${absoluteProjectPath}`);
    }

    // 递归查找代码文件
    const codeFiles = findCodeFiles(absoluteProjectPath, extensions);
    const filesToScan = codeFiles.slice(0, maxFiles);
    
    const fileResults = [];
    const recommendations = [];
    
    for (const filePath of filesToScan) {
      try {
        const result = await reviewCodeFile(filePath, 'full');
        const highSeverityIssues = result.issues.filter(issue => issue.severity === 'high').length;
        
        fileResults.push({
          filePath: result.filePath,
          language: result.language,
          rating: result.rating,
          issueCount: result.issues.length,
          highSeverityIssues,
        });
      } catch (error) {
        // 跳过无法读取的文件
        console.warn(`Skipping file due to error: ${filePath}`, error);
      }
    }

    // 生成项目级别的建议
    const avgRating = fileResults.reduce((sum, file) => sum + file.rating, 0) / fileResults.length;
    const totalHighIssues = fileResults.reduce((sum, file) => sum + file.highSeverityIssues, 0);
    const totalIssues = fileResults.reduce((sum, file) => sum + file.issueCount, 0);

    if (avgRating < 7) {
      recommendations.push('项目整体代码质量需要改进，建议重构关键文件');
    }
    if (totalHighIssues > 0) {
      recommendations.push(`发现 ${totalHighIssues} 个高严重性问题，需要优先处理`);
    }
    if (totalIssues > fileResults.length * 5) {
      recommendations.push('项目存在较多代码质量问题，建议制定代码规范和review流程');
    }

    const overview = `扫描了 ${fileResults.length} 个文件（共 ${codeFiles.length} 个代码文件）。平均代码质量评分：${avgRating.toFixed(1)}/10。发现 ${totalIssues} 个问题，其中 ${totalHighIssues} 个高严重性问题。`;

    return {
      projectPath: absoluteProjectPath,
      filesScanned: fileResults.length,
      totalFiles: codeFiles.length,
      overview,
      fileResults,
      recommendations,
    };
  } catch (error) {
    throw new Error(`Failed to scan project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const findCodeFiles = (dirPath: string, extensions: string[]): string[] => {
  const codeFiles: string[] = [];
  const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.next', '.vscode', '.idea'];
  
  const scanDirectory = (currentPath: string) => {
    try {
      const items = readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = join(currentPath, item);
        const stats = statSync(itemPath);
        
        if (stats.isDirectory()) {
          // 跳过排除的目录
          if (!excludeDirs.includes(item)) {
            scanDirectory(itemPath);
          }
        } else if (stats.isFile()) {
          const ext = extname(item).toLowerCase();
          if (extensions.includes(ext)) {
            codeFiles.push(itemPath);
          }
        }
      }
    } catch (error) {
      // 跳过无法访问的目录
      console.warn(`Cannot access directory: ${currentPath}`);
    }
  };
  
  scanDirectory(dirPath);
  return codeFiles;
};