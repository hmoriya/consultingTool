import fs from 'fs';
import http from 'http';

const OPERATION_ID = 'cmg7calg2011kz53s98agmixk';

const usecases = [
  {
    file: 'docs/parasol/services/secure-access-service/capabilities/authenticate-and-manage-users/operations/register-and-authenticate-users/usecases/login-and-authenticate.md',
    name: 'login-and-authenticate',
    displayName: 'ログインして認証する',
    description: '組織メンバーが自身のアカウント情報を使用してシステムにログインし、身元を確認されることで、システムの機能とデータに安全にアクセスできるようにする。',
    order: 3
  },
  {
    file: 'docs/parasol/services/secure-access-service/capabilities/authenticate-and-manage-users/operations/register-and-authenticate-users/usecases/request-user-account.md',
    name: 'request-user-account',
    displayName: 'ユーザーアカウントを申請する',
    description: '新しい組織メンバーまたはクライアントが、システム利用のためのアカウント発行を申請し、承認者の審査を経てアカウントを取得する。',
    order: 1
  }
];

async function updateUseCase(usecase) {
  return new Promise((resolve, reject) => {
    const definition = fs.readFileSync(usecase.file, 'utf-8');

    const data = JSON.stringify({
      operationId: OPERATION_ID,
      name: usecase.name,
      displayName: usecase.displayName,
      description: usecase.description,
      definition: definition,
      order: usecase.order
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/parasol/usecases',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    console.log(`Updating ${usecase.displayName}...`);

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log(`Success ${usecase.displayName}: ${res.statusCode}`);
          resolve();
        } else {
          console.error(`Failed ${usecase.displayName}: ${res.statusCode}`);
          console.error('Response:', responseData);
          reject(new Error(`Failed: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error(`Error ${usecase.displayName}:`, e.message);
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

console.log('Starting usecase updates...');
console.log('');

for (const usecase of usecases) {
  try {
    await updateUseCase(usecase);
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error(`Failed to update ${usecase.displayName}`);
  }
}

console.log('');
console.log('Update complete!');
