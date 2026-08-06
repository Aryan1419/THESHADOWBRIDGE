const https = require('https');

const urls = [
  'https://oggzposjudhbpnasymzn.supabase.co/storage/v1/object/public/documents/shadow-teachers/WIN_20250118_14_33_38_Pro.jpg',
  'https://oggzposjudhbpnasymzn.supabase.co/storage/v1/object/public/documents/shadow-teachers/WIN_20260504_01_15_09_Pro.jpg',
  'https://oggzposjudhbpnasymzn.supabase.co/storage/v1/object/public/documents/shadow-teachers/WIN_20260504_01_15_14_Pro.jpg'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`URL: ${url}`);
      console.log(`HTTP Status: ${res.statusCode} ${res.statusMessage}`);
      console.log(`Content-Type: ${res.headers['content-type']}`);
      console.log('--------------------------------------------------');
      resolve(res.statusCode);
    }).on('error', (e) => {
      console.error(`Fetch error for ${url}:`, e.message);
      resolve(500);
    });
  });
}

async function main() {
  console.log('=== Verifying HTTP status of document URLs ===\n');
  for (const url of urls) {
    await checkUrl(url);
  }
}

main();
