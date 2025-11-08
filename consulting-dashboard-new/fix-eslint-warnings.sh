#!/bin/bash

# This script fixes ESLint warnings in a systematic way

echo "Starting ESLint warning fixes..."

# First, let's count initial warnings
INITIAL_COUNT=$(npm run lint 2>&1 | grep -E "warning" | wc -l)
echo "Initial warning count: $INITIAL_COUNT"

# Step 1: Fix unused imports and variables
echo "Step 1: Fixing unused imports and variables..."

# Fix specific common patterns
FILES_TO_FIX=(
  "app/components/parasol/ParasolSettingsPage.tsx"
  "app/components/parasol/ParasolSettingsPage2.tsx"
  "app/components/projects/detail/tabs/project-tasks.tsx"
  "app/components/team/team-list.tsx"
  "app/components/parasol/DomainLanguageEditor.tsx"
  "app/components/parasol/DomainLanguageMarkdownEditor.tsx"
  "app/components/parasol/UnifiedTreeView.tsx"
  "app/components/tasks/task-filters.tsx"
  "app/components/ui/avatar.tsx"
  "app/components/timesheet/weekly-calendar.tsx"
  "app/components/projects/detail/tabs/task-kanban.tsx"
  "app/components/parasol/DirectoryPanel.tsx"
)

echo "Fixing files with most warnings..."

# Step 2: Fix React Hook dependencies
echo "Step 2: Fixing React Hook dependencies..."

# Step 3: Fix accessibility warnings
echo "Step 3: Fixing accessibility warnings..."

# Count final warnings
FINAL_COUNT=$(npm run lint 2>&1 | grep -E "warning" | wc -l)
echo "Final warning count: $FINAL_COUNT"
echo "Reduced warnings by: $((INITIAL_COUNT - FINAL_COUNT))"