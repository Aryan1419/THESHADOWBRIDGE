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
    } else if (/\.(tsx|ts)$/.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(srcDir);
const issues = [];

const REDIRECT_TARGETS = [
  { match: /href=["']\/our-story["']/g, reason: '/our-story redirects to /founder-story', fix: 'href="/founder-story"' },
  { match: /href=["']\/collaboration-schools["']/g, reason: '/collaboration-schools redirects to /schools', fix: 'href="/schools"' },
  { match: /href=["']\/register\/shadow["']/g, reason: '/register/shadow redirects to /register/shadow-teacher', fix: 'href="/register/shadow-teacher"' },
  { match: /link:\s*["']\/register\/shadow["']/g, reason: '/register/shadow redirects to /register/shadow-teacher', fix: 'link: "/register/shadow-teacher"' },
  { match: /link:\s*["']\/our-story["']/g, reason: '/our-story redirects to /founder-story', fix: 'link: "/founder-story"' },
  { match: /link:\s*["']\/collaboration-schools["']/g, reason: '/collaboration-schools redirects to /schools', fix: 'link: "/schools"' },
  { match: /router\.(push|replace)\(["']\/our-story["']\)/g, reason: '/our-story redirects to /founder-story', fix: "router.$1('/founder-story')" },
  { match: /router\.(push|replace)\(["']\/collaboration-schools["']\)/g, reason: '/collaboration-schools redirects to /schools', fix: "router.$1('/schools')" },
  { match: /router\.(push|replace)\(["']\/register\/shadow["']\)/g, reason: '/register/shadow redirects to /register/shadow-teacher', fix: "router.$1('/register/shadow-teacher')" },
  { match: /http:\/\/www\.theshadowbridge\.com/g, reason: 'Insecure http://', fix: 'https://www.theshadowbridge.com' },
  { match: /https:\/\/theshadowbridge\.com(?=[/'"]|$)/g, reason: 'Non-www domain redirects to www', fix: 'https://www.theshadowbridge.com' },
  { match: /http:\/\/theshadowbridge\.com(?=[/'"]|$)/g, reason: 'Insecure non-www http://', fix: 'https://www.theshadowbridge.com' }
];

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(projectRoot, file);

  // Skip next.config.ts redirect definitions
  if (rel === 'next.config.ts') return;

  const lines = content.split('\n');
  lines.forEach((line, index) => {
    REDIRECT_TARGETS.forEach(target => {
      if (target.match.test(line)) {
        issues.push({
          file: rel,
          line: index + 1,
          code: line.trim(),
          reason: target.reason,
          fix: target.fix
        });
      }
    });
  });
});

console.log(`Audited ${allFiles.length} source files.`);
console.log(`Found ${issues.length} problematic internal links or references:\n`);

issues.forEach((issue, idx) => {
  console.log(`[${idx + 1}] ${issue.file}:${issue.line}`);
  console.log(`    Issue: ${issue.reason}`);
  console.log(`    Code:  ${issue.code}`);
  console.log(`    Fix:   ${issue.fix}`);
  console.log('');
});
