const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

const redirectingPatterns = [
  { name: '/our-story', regex: /['"`]\/our-story['"`]/g, replaceWith: "'/founder-story'" },
  { name: '/collaboration-schools', regex: /['"`]\/collaboration-schools['"`]/g, replaceWith: "'/schools'" },
  { name: '/register/shadow', regex: /['"`]\/register\/shadow['"`]/g, replaceWith: "'/register/shadow-teacher'" },
  { name: 'non-www https://theshadowbridge.com', regex: /https:\/\/theshadowbridge\.com/g, replaceWith: 'https://www.theshadowbridge.com' },
  { name: 'http://', regex: /http:\/\/(www\.)?theshadowbridge\.com/g, replaceWith: 'https://www.theshadowbridge.com' }
];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'scratch'].includes(file)) {
        getAllFiles(fullPath, fileList);
      }
    } else if (/\.(tsx|ts|js|mjs|json|html|txt|xml|md)$/.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(projectRoot);
console.log(`Auditing ${allFiles.length} files across project...\n`);

const occurrences = [];

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(projectRoot, filePath);

  // Check each pattern
  for (const pattern of redirectingPatterns) {
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      // Exclude next.config.ts redirect definitions themselves
      if (relativePath === 'next.config.ts' && (line.includes('source:') || line.includes('destination:'))) {
        return;
      }
      if (pattern.regex.test(line)) {
        occurrences.push({
          file: relativePath,
          lineNum: index + 1,
          line: line.trim(),
          issue: pattern.name
        });
      }
    });
  }
}

console.log(`Found ${occurrences.length} occurrences of redirecting, non-www, or http links:\n`);
occurrences.forEach((occ, i) => {
  console.log(`[${i + 1}] ${occ.file}:${occ.lineNum}`);
  console.log(`    Issue: ${occ.issue}`);
  console.log(`    Code:  ${occ.line}`);
  console.log('');
});
