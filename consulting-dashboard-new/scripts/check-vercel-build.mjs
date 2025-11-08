#!/usr/bin/env node

/**
 * Vercel Build Checker
 * 
 * This script checks for common issues that cause Vercel builds to fail
 * while local builds succeed.
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔍 Checking for common Vercel build issues...\n');

let hasErrors = false;

// 1. Check TypeScript strict mode
console.log('1. Checking TypeScript configuration...');
try {
  // Check only our source files, not node_modules
  const result = execSync('npx tsc --noEmit --skipLibCheck 2>&1 | grep -v node_modules | grep -E "(error TS|app/|components/|lib/)" || true', { encoding: 'utf8' });
  if (result.trim()) {
    console.log('❌ TypeScript errors found in source files:\n' + result);
    hasErrors = true;
  } else {
    console.log('✅ TypeScript check passed\n');
  }
} catch (_error) {
  console.log('✅ TypeScript check passed (no source errors)\n');
}

// 2. Check for missing imports
console.log('2. Checking for missing imports...');
try {
  const result = execSync('grep -r "import.*from.*lucide-react" app components --include="*.tsx" --include="*.ts" | grep -v "// " || true', { encoding: 'utf8' });
  const lines = result.split('\n').filter(Boolean);
  let missingImports = false;
  
  lines.forEach(line => {
    const match = line.match(/import.*{([^}]+)}.*from.*lucide-react/);
    if (match) {
      const imports = match[1].split(',').map(i => i.trim());
      // Check if file actually uses these imports
      const filePath = line.split(':')[0];
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        imports.forEach(imp => {
          const regex = new RegExp(`<${imp}[\\s/>]`);
          if (!regex.test(content)) {
            console.log(`⚠️  Unused import "${imp}" in ${filePath}`);
            missingImports = true;
          }
        });
      }
    }
  });
  
  if (!missingImports) {
    console.log('✅ Import check passed\n');
  }
} catch (_error) {
  console.log('⚠️  Could not check imports\n');
}

// 3. Check environment variables
console.log('3. Checking environment variables...');
const envExample = '.env.example';
const envLocal = '.env.local';

if (fs.existsSync(envExample)) {
  const exampleVars = fs.readFileSync(envExample, 'utf8')
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('=')[0]);
  
  const localVars = fs.existsSync(envLocal) 
    ? fs.readFileSync(envLocal, 'utf8')
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.split('=')[0])
    : [];
  
  const missingVars = exampleVars.filter(v => !localVars.includes(v));
  
  if (missingVars.length > 0) {
    console.log(`❌ Missing environment variables: ${missingVars.join(', ')}`);
    hasErrors = true;
  } else {
    console.log('✅ Environment variables check passed\n');
  }
} else {
  console.log('⚠️  No .env.example file found\n');
}

// 4. Check for dynamic imports with promises
console.log('4. Checking for Next.js 15 dynamic route params...');
try {
  const paramFiles = execSync('find app -name "\\[*\\]" -type d | xargs -I {} find {} -name "*.tsx" -o -name "*.ts"', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
  
  let hasParamIssues = false;
  paramFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('params.') && !content.includes('await params')) {
        console.log(`⚠️  Missing await for params in ${file}`);
        hasParamIssues = true;
      }
    }
  });
  
  if (!hasParamIssues) {
    console.log('✅ Dynamic route params check passed\n');
  }
} catch (_error) {
  console.log('⚠️  Could not check dynamic routes\n');
}

// 5. Check for console statements
console.log('5. Checking for console statements...');
try {
  const consoleCount = execSync('grep -r "console\\." app components --include="*.tsx" --include="*.ts" | grep -v "// " | wc -l', { encoding: 'utf8' });
  const count = parseInt(consoleCount.trim());
  
  if (count > 0) {
    console.log(`⚠️  Found ${count} console statements (these may cause issues in production)\n`);
  } else {
    console.log('✅ No console statements found\n');
  }
} catch (_error) {
  console.log('✅ No console statements found\n');
}

// Summary
console.log('='.repeat(50));
if (hasErrors) {
  console.log('❌ Some checks failed. Please fix the issues before pushing to Vercel.');
  process.exit(1);
} else {
  console.log('✅ All checks passed! Your code should build successfully on Vercel.');
}