#!/usr/bin/env node

/**
 * 全PrismaスキーマファイルをVercel対応設定に更新
 */

const fs = require('fs');
const path = require('path');

const services = [
  'auth-service',
  'project-service', 
  'resource-service',
  'timesheet-service',
  'notification-service',
  'finance-service',
  'knowledge-service',
  'parasol-service'
];

const vercelGeneratorConfig = `generator client {
  provider = "prisma-client-js"
  // Vercel最適化設定
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
  previewFeatures = ["strictUndefinedChecks"]
}`;

function updateSchema(serviceName) {
  const schemaPath = path.join(__dirname, '..', 'prisma', serviceName, 'schema.prisma');
  
  if (!fs.existsSync(schemaPath)) {
    console.log(`⚠️  Schema not found: ${schemaPath}`);
    return;
  }

  let content = fs.readFileSync(schemaPath, 'utf8');
  
  // 既存のgenerator clientセクションを置換
  const generatorRegex = /generator client \{[\s\S]*?\}/;
  
  if (generatorRegex.test(content)) {
    content = content.replace(generatorRegex, vercelGeneratorConfig);
    console.log(`✅ Updated ${serviceName}/schema.prisma`);
  } else {
    console.log(`⚠️  No generator client found in ${serviceName}/schema.prisma`);
    return;
  }
  
  fs.writeFileSync(schemaPath, content);
}

console.log('🚀 Updating Prisma schemas for Vercel...\n');

services.forEach(updateSchema);

console.log('\n✨ All schemas updated!');
console.log('\n📝 Next steps:');
console.log('1. npm run db:generate');
console.log('2. npm run build');
console.log('3. Test deployment');