import fs from 'fs';
import path from 'path';
import { parasolDb } from '../lib/db';

const OPERATION_ID = 'cmg7calg2011kz53s98agmixk';

const usecases = [
  {
    file: 'request-user-account.md',
    name: 'request-user-account',
    displayName: 'ユーザーアカウントを申請する',
    description: '新規メンバーまたはクライアントがシステム利用のためのアカウント発行を申請する',
    order: 1
  },
  {
    file: 'approve-and-create-account.md',
    name: 'approve-and-create-account',
    displayName: 'アカウントを承認・作成する',
    description: '管理者がアカウント申請を審査し、承認してアカウントを作成する',
    order: 2
  },
  {
    file: 'login-and-authenticate.md',
    name: 'login-and-authenticate',
    displayName: 'ログインして認証する',
    description: 'ユーザーがメールアドレスとパスワードでログインし、認証を受ける',
    order: 3
  },
  {
    file: 'logout.md',
    name: 'logout',
    displayName: 'ログアウトする',
    description: 'ユーザーが安全にシステムからログアウトし、セッションを終了する',
    order: 4
  }
];

const usecasesDir = path.join(
  __dirname,
  '../docs/parasol/services/secure-access-service/capabilities/authenticate-and-manage-users/operations/register-and-authenticate-users/usecases'
);

async function importUseCase(usecase: typeof usecases[0]) {
  const filePath = path.join(usecasesDir, usecase.file);
  const definition = fs.readFileSync(filePath, 'utf-8');

  console.log(`Importing usecase: ${usecase.displayName}...`);

  try {
    const result = await parasolDb.useCase.create({
      data: {
        operationId: OPERATION_ID,
        name: usecase.name,
        displayName: usecase.displayName,
        description: usecase.description,
        definition: definition,
        order: usecase.order
      }
    });

    console.log(`✓ Successfully imported: ${usecase.displayName} (ID: ${result.id})`);
    return result;
  } catch (_error) {
    console.error(`✗ Failed to import: ${usecase.displayName}`, error);
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
  }

  console.log(`\n✓ Import completed. Successfully imported ${results.length} usecases.`);
  process.exit(0);
}

main().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
