const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function fetchWithDetails(url, maxRedirects = 5) {
  return new Promise((resolve) => {
    const chain = [];
    let currentUrl = url;
    let redirects = 0;
    const start = Date.now();

    function step() {
      const parsed = new URL(currentUrl);
      const mod = parsed.protocol === 'https:' ? https : http;
      const reqStart = Date.now();
      const req = mod.request(parsed, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ClaudeSEOAuditBot/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Encoding': 'identity'
        }
      }, (res) => {
        const ttfb = Date.now() - reqStart;
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects < maxRedirects) {
          const next = new URL(res.headers.location, currentUrl).href;
          chain.push({ status: res.statusCode, from: currentUrl, to: next });
          res.resume();
          currentUrl = next;
          redirects++;
          step();
          return;
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          resolve({
            originalUrl: url,
            finalUrl: currentUrl,
            status: res.statusCode,
            redirects,
            chain,
            ttfbMs: ttfb,
            totalMs: Date.now() - start,
            headers: res.headers,
            bytes: Buffer.byteLength(body, 'utf8'),
            body
          });
        });
      });
      req.on('error', (err) => {
        resolve({ originalUrl: url, finalUrl: currentUrl, status: 0, error: err.message, chain, redirects });
      });
      req.setTimeout(25000, () => {
        req.destroy(new Error('Timeout'));
      });
      req.end();
    }
    step();
  });
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePage(url, html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';

  const getMeta = (attr, val) => {
    const re1 = new RegExp(`<meta[^>]*${attr}=["']${val}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
    const re2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${val}["'][^>]*>`, 'i');
    const m = html.match(re1) || html.match(re2);
    return m ? m[1].trim() : null;
  };

  const description = getMeta('name', 'description');
  const robotsMeta = getMeta('name', 'robots');
  const viewport = getMeta('name', 'viewport');
  const ogTitle = getMeta('property', 'og:title');
  const ogDesc = getMeta('property', 'og:description');
  const ogUrl = getMeta('property', 'og:url');
  const ogImage = getMeta('property', 'og:image');
  const ogType = getMeta('property', 'og:type');
  const twitterCard = getMeta('name', 'twitter:card');

  const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i)
    || html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["'][^>]*>/i);
  const canonical = canonMatch ? canonMatch[1].trim() : null;

  const langMatch = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
  const lang = langMatch ? langMatch[1] : null;

  // Headings
  const headings = [];
  const headingRe = /<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let hm;
  while ((hm = headingRe.exec(html)) !== null) {
    headings.push({ tag: hm[1].toLowerCase(), text: stripTags(hm[2]).slice(0, 120) });
  }
  const h1s = headings.filter(h => h.tag === 'h1');

  // Check skipped heading levels
  let prevLevel = 0;
  const skippedLevels = [];
  for (const h of headings) {
    const lvl = parseInt(h.tag[1], 10);
    if (prevLevel > 0 && lvl > prevLevel + 1) {
      skippedLevels.push(`h${prevLevel}->h${lvl}`);
    }
    prevLevel = lvl;
  }

  // Body word count (excluding nav/footer approximately by also measuring main if present)
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const fullText = stripTags(html);
  const mainText = mainMatch ? stripTags(mainMatch[1]) : null;
  const wordCount = fullText ? fullText.split(/\s+/).filter(Boolean).length : 0;
  const mainWordCount = mainText ? mainText.split(/\s+/).filter(Boolean).length : null;

  // Images
  const imgs = [];
  const imgRe = /<img\b([^>]*)>/gi;
  let im;
  while ((im = imgRe.exec(html)) !== null) {
    const attrs = im[1];
    const srcM = attrs.match(/\bsrc=["']([^"']*)["']/i);
    const altM = attrs.match(/\balt=["']([^"']*)["']/i);
    const widthM = attrs.match(/\bwidth=["']?(\d+)["']?/i);
    const heightM = attrs.match(/\bheight=["']?(\d+)["']?/i);
    const loadingM = attrs.match(/\bloading=["']([^"']*)["']/i);
    imgs.push({
      src: srcM ? srcM[1] : null,
      hasAlt: altM !== null,
      alt: altM ? altM[1] : null,
      hasDimensions: Boolean(widthM && heightM),
      loading: loadingM ? loadingM[1] : null,
      isNextImage: Boolean(srcM && srcM[1].includes('/_next/image'))
    });
  }

  // Links
  const internalLinks = new Set();
  const externalLinks = new Set();
  const linkRe = /<a\b[^>]*href=["']([^"'#][^"']*)["'][^>]*>/gi;
  let lm;
  while ((lm = linkRe.exec(html)) !== null) {
    const href = lm[1].trim();
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    try {
      const resolved = new URL(href, url);
      if (resolved.hostname === 'www.theshadowbridge.com' || resolved.hostname === 'theshadowbridge.com') {
        internalLinks.add(resolved.pathname + resolved.search);
      } else {
        externalLinks.add(resolved.href);
      }
    } catch {}
  }

  // JSON-LD
  const jsonLdBlocks = [];
  const ldRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ldm;
  while ((ldm = ldRe.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(ldm[1]);
      const types = [];
      const collectTypes = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) { obj.forEach(collectTypes); return; }
        if (obj['@type']) {
          if (Array.isArray(obj['@type'])) types.push(...obj['@type']);
          else types.push(obj['@type']);
        }
        for (const k of Object.keys(obj)) {
          if (k !== '@type') collectTypes(obj[k]);
        }
      };
      collectTypes(parsed);
      jsonLdBlocks.push({ valid: true, types: [...new Set(types)], rawLength: ldm[1].length });
    } catch (e) {
      jsonLdBlocks.push({ valid: false, error: e.message });
    }
  }

  // Scripts
  const scripts = (html.match(/<script\b/gi) || []).length;

  return {
    title,
    titleLen: title.length,
    description,
    descLen: description ? description.length : 0,
    canonical,
    robotsMeta,
    viewport,
    lang,
    og: { ogTitle, ogDesc, ogUrl, ogImage, ogType, twitterCard },
    h1Count: h1s.length,
    h1Text: h1s.map(h => h.text),
    headingCount: headings.length,
    skippedLevels: [...new Set(skippedLevels)],
    wordCount,
    mainWordCount,
    images: {
      total: imgs.length,
      missingAlt: imgs.filter(i => !i.hasAlt).length,
      emptyAlt: imgs.filter(i => i.hasAlt && i.alt === '').length,
      missingDimensions: imgs.filter(i => !i.hasDimensions).length,
      rawUnoptimized: imgs.filter(i => !i.isNextImage && i.src && !i.src.endsWith('.svg')).map(i => i.src)
    },
    internalLinksCount: internalLinks.size,
    internalLinks: [...internalLinks],
    externalLinks: [...externalLinks],
    jsonLdBlocks,
    scripts
  };
}

async function main() {
  const outDir = path.join(__dirname, '..', 'theshadowbridge.com-audit', 'raw');
  fs.mkdirSync(outDir, { recursive: true });

  // 1. Fetch sitemap.xml
  const sitemapRes = await fetchWithDetails('https://www.theshadowbridge.com/sitemap.xml');
  const locRe = /<loc>([^<]+)<\/loc>/g;
  const sitemapUrls = [];
  let m;
  while ((m = locRe.exec(sitemapRes.body || '')) !== null) {
    sitemapUrls.push(m[1].trim());
  }

  // 2. Check special URLs (redirects, robots, llms, 404, non-www, http, well-known)
  const specialUrls = [
    'http://theshadowbridge.com/',
    'http://www.theshadowbridge.com/',
    'https://theshadowbridge.com/',
    'https://www.theshadowbridge.com/robots.txt',
    'https://www.theshadowbridge.com/llms.txt',
    'https://www.theshadowbridge.com/sitemap.xml',
    'https://www.theshadowbridge.com/our-story',
    'https://www.theshadowbridge.com/collaboration-schools',
    'https://www.theshadowbridge.com/register/shadow',
    'https://www.theshadowbridge.com/admin',
    'https://www.theshadowbridge.com/this-page-does-not-exist-404-check',
    'https://www.theshadowbridge.com/.well-known/security.txt',
    'https://www.theshadowbridge.com/ai-catalog.json',
    'https://www.theshadowbridge.com/index.md'
  ];

  const specialResults = [];
  for (const u of specialUrls) {
    const r = await fetchWithDetails(u);
    specialResults.push({
      url: u,
      status: r.status,
      redirects: r.redirects,
      chain: r.chain,
      finalUrl: r.finalUrl,
      ttfbMs: r.ttfbMs,
      contentType: r.headers?.['content-type'] || null,
      bytes: r.bytes
    });
  }

  // 3. Crawl all sitemap URLs in batches of 5
  const pageResults = [];
  const batchSize = 5;
  for (let i = 0; i < sitemapUrls.length; i += batchSize) {
    const batch = sitemapUrls.slice(i, i + batchSize);
    const resList = await Promise.all(batch.map(async (u) => {
      const r = await fetchWithDetails(u);
      const parsed = r.body ? parsePage(u, r.body) : null;
      return {
        url: u,
        status: r.status,
        redirects: r.redirects,
        chain: r.chain,
        ttfbMs: r.ttfbMs,
        totalMs: r.totalMs,
        bytes: r.bytes,
        securityHeaders: {
          hsts: r.headers?.['strict-transport-security'] || null,
          csp: r.headers?.['content-security-policy'] || null,
          xFrameOptions: r.headers?.['x-frame-options'] || null,
          xContentTypeOptions: r.headers?.['x-content-type-options'] || null,
          referrerPolicy: r.headers?.['referrer-policy'] || null,
          permissionsPolicy: r.headers?.['permissions-policy'] || null,
          cacheControl: r.headers?.['cache-control'] || null,
          xVercelCache: r.headers?.['x-vercel-cache'] || null
        },
        parsed
      };
    }));
    pageResults.push(...resList);
    await new Promise(r => setTimeout(r, 300));
  }

  // Compute incoming internal link counts (orphan detection)
  const inboundCounts = {};
  for (const u of sitemapUrls) {
    const p = new URL(u).pathname;
    inboundCounts[p] = 0;
  }
  for (const pr of pageResults) {
    if (!pr.parsed) continue;
    for (const link of pr.parsed.internalLinks) {
      const cleanPath = link.split('?')[0].replace(/\/$/, '') || '/';
      if (inboundCounts[cleanPath] !== undefined) {
        inboundCounts[cleanPath]++;
      }
    }
  }

  const output = {
    crawledAt: new Date().toISOString(),
    sitemapCount: sitemapUrls.length,
    specialChecks: specialResults,
    inboundLinkCounts: inboundCounts,
    pages: pageResults
  };

  fs.writeFileSync(path.join(outDir, 'crawl-results.json'), JSON.stringify(output, null, 2));

  // Print concise summary
  console.log(`Crawled ${pageResults.length} sitemap pages + ${specialResults.length} special URLs.`);
  console.log('Non-200 sitemap pages:', pageResults.filter(p => p.status !== 200).length);
  console.log('Redirecting sitemap pages:', pageResults.filter(p => p.redirects > 0).length);
  console.log('Average TTFB:', Math.round(pageResults.reduce((a, b) => a + (b.ttfbMs || 0), 0) / pageResults.length), 'ms');
  console.log('Security headers on homepage:', JSON.stringify(pageResults[0]?.securityHeaders));
  console.log('Orphan pages (0-1 inbound links):', Object.entries(inboundCounts).filter(([, c]) => c <= 1));
  console.log('Pages missing H1 or multiple H1:', pageResults.filter(p => !p.parsed || p.parsed.h1Count !== 1).map(p => ({ url: p.url, h1Count: p.parsed?.h1Count })));
  console.log('Pages with duplicate titles:', (() => {
    const map = {};
    pageResults.forEach(p => { const t = p.parsed?.title; if (t) map[t] = (map[t] || []).concat(p.url); });
    return Object.entries(map).filter(([, urls]) => urls.length > 1);
  })());
  console.log('Pages with missing/short/long meta descriptions:', pageResults.filter(p => !p.parsed?.description || p.parsed.descLen < 70 || p.parsed.descLen > 165).map(p => ({ url: p.url, len: p.parsed?.descLen })));
  console.log('Pages with < 300 words:', pageResults.filter(p => (p.parsed?.wordCount || 0) < 300).map(p => ({ url: p.url, words: p.parsed?.wordCount })));
  console.log('Special URLs:', specialResults.map(s => `${s.url} -> ${s.status} (${s.redirects} redir -> ${s.finalUrl})`));
}

main();
