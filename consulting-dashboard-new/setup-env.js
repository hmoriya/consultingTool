#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the project root directory
const projectRoot = __dirname;

// Read the template
const templatePath = path.join(projectRoot, '.env.template');
const envPath = path.join(projectRoot, '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('.env file already exists. Updating PROJECT_ROOT paths...');
} else {
  console.log('Creating .env file from template...');
}

// Read template or existing .env
const sourceFile = fs.existsSync(envPath) ? envPath : templatePath;
let content = fs.readFileSync(sourceFile, 'utf8');

// Replace PROJECT_ROOT with actual path
content = content.replace(/PROJECT_ROOT/g, projectRoot);

// Write the .env file
fs.writeFileSync(envPath, content);

console.log(`✅ .env file configured with project root: ${projectRoot}`);
console.log('');
console.log('Database paths:');
console.log(`- Auth DB: ${projectRoot}/prisma/dev.db`);
console.log(`- Project DB: ${projectRoot}/prisma/project-service/data/project.db`);
console.log(`- Resource DB: ${projectRoot}/prisma/resource-service/data/resource.db`);
console.log(`- Timesheet DB: ${projectRoot}/prisma/timesheet-service/data/timesheet.db`);
console.log(`- Notification DB: ${projectRoot}/prisma/notification-service/data/notification.db`);