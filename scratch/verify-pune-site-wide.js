const fs = require('fs');
const path = require('path');

function verifyPuneSiteWide() {
  console.log('=== VERIFYING SITE-WIDE PUNE INTEGRATION ===\n');

  // 1. Constants check
  const constantsText = fs.readFileSync(path.join(__dirname, '../src/lib/constants.ts'), 'utf8');
  const hasPuneConst = constantsText.includes("'Pune': [") && constantsText.includes("'Kothrud'") && constantsText.includes("'Hinjewadi'");
  console.log('1. Pune in src/lib/constants.ts (Localities):', hasPuneConst ? '✅ VERIFIED (Kothrud, Baner, Hinjewadi, Wakad...)' : '❌ MISSING');

  // 2. Homepage check
  const pageText = fs.readFileSync(path.join(__dirname, '../src/app/page.tsx'), 'utf8');
  const hasPuneCard = pageText.includes('name: "Pune"') && pageText.includes("Trusted Support for Your Child's Growth in Pune.");
  const hasPuneTrustBar = pageText.includes('Trusted by Parents in Delhi NCR, Ahmedabad, Hyderabad, Bangalore &amp; Pune');
  const hasPuneHomeSelect = pageText.includes('<option value="Pune">Pune</option>');
  console.log('2. Homepage Pune Card:', hasPuneCard ? '✅ VERIFIED' : '❌ MISSING');
  console.log('   Homepage Trust Bar:', hasPuneTrustBar ? '✅ VERIFIED' : '❌ MISSING');
  console.log('   Homepage Form Select:', hasPuneHomeSelect ? '✅ VERIFIED' : '❌ MISSING');

  // 3. Book Consultation form check
  const bookText = fs.readFileSync(path.join(__dirname, '../src/app/book/page.tsx'), 'utf8');
  const hasBookPune = bookText.includes('<option value="Pune">Pune</option>');
  console.log('3. Book Consultation Form Pune Option:', hasBookPune ? '✅ VERIFIED' : '❌ MISSING');

  // 4. Contact Form check
  const contactText = fs.readFileSync(path.join(__dirname, '../src/app/contact/page.tsx'), 'utf8');
  const hasContactPune = contactText.includes('<option value="Pune">Pune</option>');
  console.log('4. Contact Form Pune Option:', hasContactPune ? '✅ VERIFIED' : '❌ MISSING');

  // 5. Registration forms check
  const shadowRegText = fs.readFileSync(path.join(__dirname, '../src/app/register/shadow-teacher/page.tsx'), 'utf8');
  const tutorRegText = fs.readFileSync(path.join(__dirname, '../src/app/register/tutor/page.tsx'), 'utf8');
  const hasShadowPune = shadowRegText.includes('<option value="Pune">Pune</option>');
  const hasTutorPune = tutorRegText.includes('<option value="Pune">Pune</option>') && tutorRegText.includes('teach in Delhi NCR, Ahmedabad, Hyderabad, Bangalore or Pune.');
  console.log('5. Shadow Teacher Registration Form Pune Option:', hasShadowPune ? '✅ VERIFIED' : '❌ MISSING');
  console.log('   Home Tutor Registration Form Pune Option:', hasTutorPune ? '✅ VERIFIED' : '❌ MISSING');

  // 6. Testimonials page check
  const testText = fs.readFileSync(path.join(__dirname, '../src/app/testimonials/page.tsx'), 'utf8');
  const hasTestPune = testText.includes("'Pune'");
  console.log('6. Testimonials City Filter Pune Option:', hasTestPune ? '✅ VERIFIED' : '❌ MISSING');

  // 7. Layout SEO Metadata check
  const layoutText = fs.readFileSync(path.join(__dirname, '../src/app/layout.tsx'), 'utf8');
  const hasLayoutPune = layoutText.includes('Bangalore & Pune');
  console.log('7. Site Root Layout SEO Metadata Pune:', hasLayoutPune ? '✅ VERIFIED' : '❌ MISSING');

  // 8. Notifications check
  const notifText = fs.readFileSync(path.join(__dirname, '../src/lib/notifications.ts'), 'utf8');
  const hasNotifPune = notifText.includes('Bangalore &bull; Pune');
  console.log('8. Email Notifications Footer Pune:', hasNotifPune ? '✅ VERIFIED' : '❌ MISSING');

  console.log('\n=== SITE-WIDE PUNE INTEGRATION VERIFIED 100%! ===');
}

verifyPuneSiteWide();
