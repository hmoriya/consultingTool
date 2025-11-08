const fs = require('fs');
const http = require('http');

// database-design.mdの内容を読み込み
const content = fs.readFileSync('docs/parasol/services/secure-access-service/database-design.md', 'utf-8');

// サービスIDを取得（データベースから確認が必要だが、仮定）
const serviceSlug = 'secure-access-service';

const data = JSON.stringify({
  content: content
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: `/api/parasol/services/${serviceSlug}/database-design`,
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('Updating database design via API...');
console.log('Path:', options.path);
console.log('Content length:', Buffer.byteLength(data), 'bytes');

const req = http.request(options, (res) => {
  let responseData = '';
  
  console.log('Status:', res.statusCode);
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
    if (res.statusCode === 200) {
      console.log('\n✅ Database design updated successfully!');
    } else {
      console.log('\n❌ Update failed');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
});

req.write(data);
req.end();