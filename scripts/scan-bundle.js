#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../admin_template/dist/ng-tailadmin/browser');
if (!fs.existsSync(distDir)) {
  console.error(`Dist directory not found: ${distDir}. Run build first!`);
  process.exit(1);
}

const forbidden = [
  'mock-db',
  'mock-http-interceptor',
  'USE_MOCK',
  'DEV ONLY',
  'Truy cập nhanh',
  'Doctor@123',
  'Admin@123',
  'Patient@123'
];

let hasError = false;
const files = fs.readdirSync(distDir).filter(f => f.endsWith('.js') || f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(distDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  for (const term of forbidden) {
    if (content.includes(term)) {
      console.error(`❌ FORBIDDEN STRING FOUND: "${term}" in ${file}`);
      hasError = true;
    }
  }
}

if (hasError) {
  console.error('\n💥 Production bundle scan FAILED! Mock data or credentials leaked into production dist.');
  process.exit(1);
} else {
  console.log(`\n✅ Production bundle scan PASSED: 0 forbidden strings found across ${files.length} production files.`);
  process.exit(0);
}
