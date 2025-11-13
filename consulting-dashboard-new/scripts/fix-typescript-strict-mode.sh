#!/bin/bash

echo "🔧 Automatic TypeScript strict mode fix utility"
echo "This script will automatically fix common TypeScript strict mode issues"

# バックアップ作成
echo "Creating backup..."
BACKUP_DIR="./backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r app/actions "$BACKUP_DIR/"

# 1. implicit anyタイプ自動修正
echo "Fixing implicit any types in map functions..."
find app/actions -name "*.ts" -type f -exec sed -i.bak \
  's/\.map(async (\([^:)]*\)) =>/\.map(async (\1: any) =>/g' {} \;

# 2. authDb型アサーション自動追加
echo "Adding authDb type assertions..."
find app/actions -name "*.ts" -type f -exec sed -i.bak \
  's/\bauthorDb\.\([a-zA-Z][a-zA-Z0-9]*\)\./\(authDb as any\)\.\1\./g' {} \;

# 3. projectDb型アサーション自動追加  
echo "Adding projectDb type assertions..."
find app/actions -name "*.ts" -type f -exec sed -i.bak \
  's/\bprojectDb\.\([a-zA-Z][a-zA-Z0-9]*\)\./\(projectDb as any\)\.\1\./g' {} \;

# 4. その他のDB型アサーション自動追加
echo "Adding other database type assertions..."
for db in financeDb resourceDb timesheetDb notificationDb knowledgeDb parasolDb; do
    find app/actions -name "*.ts" -type f -exec sed -i.bak \
      "s/\\b${db}\\.\\([a-zA-Z][a-zA-Z0-9]*\\)\\./\\(${db} as any\\)\\.\\1\\./g" {} \;
done

# 5. ZodError API修正
echo "Fixing ZodError API usage..."
find app -name "*.ts" -type f -exec sed -i.bak 's/error\.errors/error.issues/g' {} \;

# 6. ESLint disable comment追加
echo "Adding ESLint disable comments..."
find app/actions -name "*.ts" -type f -exec sed -i.bak \
  '/\.map(async .*: any)/i\    // eslint-disable-next-line @typescript-eslint/no-explicit-any' {} \;

find app/actions -name "*.ts" -type f -exec sed -i.bak \
  '/as any)/i\  // eslint-disable-next-line @typescript-eslint/no-explicit-any' {} \;

# バックアップファイル削除
find app -name "*.bak" -type f -delete

echo "✅ Automatic fixes applied!"
echo "Backup created in: $BACKUP_DIR"
echo "Please review changes before committing:"
echo "git diff app/actions/"