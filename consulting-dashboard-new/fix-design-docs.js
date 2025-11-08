// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const http = require('http');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

const services = [
  'secure-access-service',
  'collaboration-facilitation-service'
];

const docTypes = [
  { file: 'api-specification.md', endpoint: 'api-specification' },
  { file: 'database-design.md', endpoint: 'database-design' },
  { file: 'integration-specification.md', endpoint: 'integration-specification' }
];

async function uploadDoc(serviceName, docType) {
  const filePath = path.join(__dirname, 'docs/parasol/services', serviceName, docType.file);

  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.stringify({ content });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/parasol/services/${serviceName}/${docType.endpoint}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 400) {
          console.log(`❌ ${serviceName}/${docType.file}: ${res.statusCode}`);
          console.log(`   Full Response: ${responseData}`);
        } else {
          console.log(`✅ ${serviceName}/${docType.file}: ${res.statusCode}`);
        }
        resolve(responseData);
      });
    });

    req.on('error', (e) => {
      console.error(`❌ ${serviceName}/${docType.file}: ${e.message}`);
      reject(e);
    });

    req.write(data);
    req.end();
  }).catch(err => {
    console.error(`❌ Error uploading ${serviceName}/${docType.file}:`, err);
    return null;
  });
}

async function main() {
  for (const service of services) {
    console.log(`\n=== ${service} ===`);
    for (const docType of docTypes) {
      await uploadDoc(service, docType);
    }
  }
  console.log('\n✅ All documents uploaded successfully!');
}

main().catch(console.error);
