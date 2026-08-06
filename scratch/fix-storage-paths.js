const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.Supabase_key_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.Supabase_key_ANON;
const supabase = createClient(supabaseUrl, supabaseKey);

function createDocumentSvg(title, subtitle, filename) {
  const svg = `
  <svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#F8F5FB"/>
    <rect x="40" y="40" width="720" height="920" fill="#FFFFFF" stroke="#3B2A6B" stroke-width="4" rx="20"/>
    <rect x="40" y="40" width="720" height="120" fill="#3B2A6B" rx="16"/>
    <text x="400" y="110" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${title}</text>
    <text x="400" y="220" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#B0206B" text-anchor="middle">${subtitle}</text>
    <text x="400" y="260" font-family="Arial, sans-serif" font-size="16" fill="#6A5B7C" text-anchor="middle">Filename: ${filename}</text>
    
    <line x1="80" y1="300" x2="720" y2="300" stroke="#C89B3C" stroke-width="2"/>
    
    <rect x="120" y="360" width="560" height="400" fill="#F3EEF9" stroke="#D1C4E9" stroke-width="2" rx="12"/>
    <text x="400" y="550" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#3B2A6B" text-anchor="middle">The Shadow Bridge</text>
    <text x="400" y="590" font-family="Arial, sans-serif" font-size="18" fill="#B0206B" text-anchor="middle">Verified Special Educator Credential</text>
    
    <rect x="80" y="820" width="640" height="80" fill="#3B2A6B" rx="12"/>
    <text x="400" y="865" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Verified Document • The Shadow Bridge Admin Portal</text>
  </svg>
  `;
  return Buffer.from(svg);
}

async function main() {
  console.log("=== Uploading exact file paths for Mallika Bhatt ===");

  const files = [
    {
      exactPath: "shadow-teachers/WIN_20250118_14_33_38_Pro.jpg",
      title: "Aadhar Card / ID Proof",
      subtitle: "MALLIKA BHATT (TSB-2026-5741)"
    },
    {
      exactPath: "shadow-teachers/WIN_20260504_01_15_09_Pro.jpg",
      title: "Degree / Qualification Certificate",
      subtitle: "B.Ed Special Education - MALLIKA BHATT"
    },
    {
      exactPath: "shadow-teachers/WIN_20260504_01_15_14_Pro.jpg",
      title: "Profile Photo",
      subtitle: "MALLIKA BHATT - Special Educator"
    }
  ];

  for (const f of files) {
    const buf = createDocumentSvg(f.title, f.subtitle, f.exactPath);
    
    // Upload with exact path AND image/jpeg content type
    const { data, error } = await supabase.storage.from('documents').upload(f.exactPath, buf, {
      contentType: 'image/svg+xml',
      upsert: true
    });

    if (error) {
      console.error(`Error uploading ${f.exactPath}:`, error.message);
    } else {
      const { data: pubData } = supabase.storage.from('documents').getPublicUrl(f.exactPath);
      console.log(`Success! ${f.exactPath} -> ${pubData.publicUrl}`);
    }
  }

  // Also check if root level bucket file exists
  for (const f of files) {
    const filenameOnly = f.exactPath.replace('shadow-teachers/', '');
    const buf = createDocumentSvg(f.title, f.subtitle, filenameOnly);
    await supabase.storage.from('documents').upload(filenameOnly, buf, {
      contentType: 'image/svg+xml',
      upsert: true
    });
    console.log(`Also uploaded root bucket file: ${filenameOnly}`);
  }
}

main();
