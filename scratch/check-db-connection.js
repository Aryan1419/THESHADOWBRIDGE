const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
console.log('Environment variables in .env.local:');
envFile.split('\n').forEach(line => {
  const [k] = line.split('=');
  if (k) console.log(' -', k.trim());
});
