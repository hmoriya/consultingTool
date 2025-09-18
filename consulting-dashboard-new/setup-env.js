#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the project root directory
const projectRoot = __dirname;

// Read the template
const templatePath = path.join(projectRoot, '.env.template');
const envPath = path.join(projectRoot, '.env');

// Check if .env already exists and has PROJECT_ROOT
if (fs.existsSync(envPath)) {
  let content = fs.readFileSync(envPath, 'utf8');

  // Check if it still has PROJECT_ROOT placeholder or needs update
  if (content.includes('PROJECT_ROOT') || !content.includes(projectRoot)) {
    console.log('Updating .env file with current project root...');
    // Read fresh from template
    content = fs.readFileSync(templatePath, 'utf8');
    // Replace PROJECT_ROOT with actual absolute path
    content = content.replace(/PROJECT_ROOT/g, projectRoot);
    fs.writeFileSync(envPath, content);
    console.log(`✅ .env file updated with project root: ${projectRoot}`);
  } else {
    console.log('✅ .env file already configured for this machine');
  }
} else {
  console.log('Creating .env file from template...');
  let content = fs.readFileSync(templatePath, 'utf8');
  // Replace PROJECT_ROOT with actual absolute path
  content = content.replace(/PROJECT_ROOT/g, projectRoot);
  fs.writeFileSync(envPath, content);
  console.log(`✅ .env file created with project root: ${projectRoot}`);
}

console.log('');
console.log('Database paths (absolute for this machine):');
console.log(`- Auth DB: ${projectRoot}/dev.db`);
console.log(`- Project DB: ${projectRoot}/prisma/project-service/data/project.db`);
console.log(`- Resource DB: ${projectRoot}/prisma/resource-service/data/resource.db`);
console.log(`- Timesheet DB: ${projectRoot}/prisma/timesheet-service/data/timesheet.db`);
console.log(`- Notification DB: ${projectRoot}/prisma/notification-service/data/notification.db`);
console.log('');
console.log('✅ Environment setup complete. Run this script on each machine to configure paths.');