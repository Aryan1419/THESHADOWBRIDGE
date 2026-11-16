const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'scratch'].includes(file)) {
        getAllFiles(fullPath, fileList);
      }
    } else if (/\.(tsx|ts|js|mjs)$/.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(srcDir);
console.log(`Scanning metadata in ${allFiles.length} files...\n`);

const nonWwwMatches = [];
const httpMatches = [];
const canonicals = [];
const ogUrls = [];

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(projectRoot, filePath);
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Check canonical
    if (line.includes('canonical:') || line.includes('canonical =') || line.includes('rel="canonical"')) {
      canonicals.push({ file: rel, lineNum: idx + 1, text: line.trim() });
    }
    // Check Open Graph URL
    if (line.includes('url:') && (line.includes('openGraph') || lines.slice(Math.max(0, idx - 5), idx).some(l => l.includes('openGraph')))) {
      ogUrls.push({ file: rel, lineNum: idx + 1, text: line.trim() });
    }
    // Check non-www shadowbridge
    if (/https:\/\/theshadowbridge\.com(?![a-zA-Z0-9_\-\.])/i.test(line) || /https:\/\/theshadowbridge\.com\//i.test(line)) {
      nonWwwMatches.push({ file: rel, lineNum: idx + 1, text: line.trim() });
    }
    // Check http
    if (/http:\/\/([^w]|w[^w]|ww[^w]|www\.)?theshadowbridge\.com/i.test(line)) {
      httpMatches.push({ file: rel, lineNum: idx + 1, text: line.trim() });
    }
  });
}

console.log(`=== Non-www theshadowbridge.com found: ${nonWwwMatches.length} ===`);
nonWwwMatches.forEach(m => console.log(`  ${m.file}:${m.lineNum} -> ${m.text}`));

console.log(`\n=== HTTP (unencrypted) theshadowbridge.com found: ${httpMatches.length} ===`);
httpMatches.forEach(m => console.log(`  ${m.file}:${m.lineNum} -> ${m.text}`));

console.log(`\n=== Total Canonical tags found: ${canonicals.length} ===`);
canonicals.forEach(c => {
  const isWww = c.text.includes('https://www.theshadowbridge.com');
  console.log(`  ${isWww ? '✅' : '❌'} ${c.file}:${c.lineNum} -> ${c.text}`);
});
