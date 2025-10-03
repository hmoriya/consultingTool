#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPERATION_ID = 'cmg7calg2011kz53s98agmixk';
const BASE_URL = 'http://localhost:3000';

const usecases = [
  {
    file: 'login-and-authenticate.md',
    name: 'login-and-authenticate',
    displayName: 'ログインして認証する',
    description: 'ユーザーがメールアドレスとパスワードでログインし、認証を受ける',
    order: 3,
    robustness: 'login-and-authenticate-robustness.md'
  },
  {
    file: 'request-user-account.md',
    name: 'request-user-account',
    displayName: 'ユーザーアカウントを申請する',
    description: '新規メンバーまたはクライアントがシステム利用のためのアカウント発行を申請する',
    order: 1,
    robustness: 'request-user-account-robustness.md'
  },
  {
    file: 'approve-and-create-account.md',
    name: 'approve-and-create-account',
    displayName: 'アカウントを承認・作成する',
    description: '管理者がアカウント申請を審査し、承認してアカウントを作成する',
    order: 2,
    robustness: 'approve-and-create-account-robustness.md'
  },
  {
    file: 'logout.md',
    name: 'logout',
    displayName: 'ログアウトする',
    description: 'ユーザーが安全にシステムからログアウトし、セッションを終了する',
    order: 4,
    robustness: 'logout-robustness.md'
  }
];

const usecasesDir = path.join(
  __dirname,
  '../docs/parasol/services/secure-access-service/capabilities/authenticate-and-manage-users/operations/register-and-authenticate-users/usecases'
);

const robustnessDir = path.join(
  __dirname,
  '../docs/parasol/services/secure-access-service/capabilities/authenticate-and-manage-users/operations/register-and-authenticate-users/robustness'
);

async function importUseCase(usecase) {
  const usecaseFilePath = path.join(usecasesDir, usecase.file);
  const definition = fs.readFileSync(usecaseFilePath, 'utf-8');

  const payload = {
    operationId: OPERATION_ID,
    name: usecase.name,
    displayName: usecase.displayName,
    description: usecase.description,
    definition: definition,
    order: usecase.order
  };

  console.log(`Importing usecase: ${usecase.displayName}...`);

  const response = await fetch(`${BASE_URL}/api/parasol/usecases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (result.success) {
    console.log(`✓ Successfully imported usecase: ${usecase.displayName} (ID: ${result.data.id})`);

    // Import robustness diagram
    if (usecase.robustness) {
      await importRobustness(result.data.id, usecase.robustness, usecase.displayName);
    }

    return result.data;
  } else {
    console.error(`✗ Failed to import usecase: ${usecase.displayName}`);
    console.error('  Error:', result.error);
    if (result.details) {
      console.error('  Details:', JSON.stringify(result.details, null, 2));
    }
    return null;
  }
}

async function importRobustness(usecaseId, robustnessFile, usecaseDisplayName) {
  const robustnessFilePath = path.join(robustnessDir, robustnessFile);

  if (!fs.existsSync(robustnessFilePath)) {
    console.log(`  ⊘ Robustness diagram not found: ${robustnessFile}`);
    return null;
  }

  const content = fs.readFileSync(robustnessFilePath, 'utf-8');

  const payload = {
    useCaseId: usecaseId,
    content: content
  };

  console.log(`  Importing robustness diagram for: ${usecaseDisplayName}...`);

  const response = await fetch(`${BASE_URL}/api/parasol/robustness`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (result.success) {
    console.log(`  ✓ Successfully imported robustness diagram (ID: ${result.data.id})`);
    return result.data;
  } else {
    console.error(`  ✗ Failed to import robustness diagram`, result.error);
    return null;
  }
}

async function main() {
  console.log('Starting usecase and robustness import...\n');

  const results = [];
  for (const usecase of usecases) {
    const result = await importUseCase(usecase);
    if (result) {
      results.push(result);
    }
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n✓ Import completed. Successfully imported ${results.length} usecases with robustness diagrams.`);
}

main().catch(console.error);
