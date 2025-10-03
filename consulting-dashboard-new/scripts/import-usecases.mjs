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
    order: 3
  },
  {
    file: 'request-user-account.md',
    name: 'request-user-account',
    displayName: 'ユーザーアカウントを申請する',
    order: 1
  },
  {
    file: 'approve-and-create-account.md',
    name: 'approve-and-create-account',
    displayName: 'アカウントを承認・作成する',
    order: 2
  },
  {
    file: 'logout.md',
    name: 'logout',
    displayName: 'ログアウトする',
    order: 4
  }
];

const usecasesDir = path.join(
  __dirname,
  '../docs/parasol/services/secure-access-service/capabilities/authenticate-and-manage-users/operations/register-and-authenticate-users/usecases'
);

async function importUseCase(usecase) {
  const filePath = path.join(usecasesDir, usecase.file);
  const definition = fs.readFileSync(filePath, 'utf-8');

  const payload = {
    operationId: OPERATION_ID,
    name: usecase.name,
    displayName: usecase.displayName,
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
    console.log(`✓ Successfully imported: ${usecase.displayName} (ID: ${result.data.id})`);
    return result.data;
  } else {
    console.error(`✗ Failed to import: ${usecase.displayName}`, result.error);
    return null;
  }
}

async function main() {
  console.log('Starting usecase import...\n');

  const results = [];
  for (const usecase of usecases) {
    const result = await importUseCase(usecase);
    if (result) {
      results.push(result);
    }
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✓ Import completed. Successfully imported ${results.length} usecases.`);
}

main().catch(console.error);
