const https = require('https');
const http = require('http');

async function fetchUrl(url, maxRedirects = 10) {
  let currentUrl = url;
  let redirects = 0;
  let initialStatus = null;
  const chain = [];

  while (redirects <= maxRedirects) {
    const res = await new Promise((resolve, reject) => {
      const parsed = new URL(currentUrl);
      const req = https.request(parsed, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      }, (response) => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers
        });
      });
      req.on('error', reject);
      req.setTimeout(15000, () => {
        req.destroy(new Error('Timeout'));
      });
      req.end();
    });

    if (initialStatus === null) {
      initialStatus = res.statusCode;
    }

    if ([301, 302, 307, 308].includes(res.statusCode)) {
      redirects++;
      const location = res.headers.location;
      const nextUrl = new URL(location, currentUrl).href;
      chain.push(`${res.statusCode} -> ${nextUrl}`);
      currentUrl = nextUrl;
    } else {
      return {
        originalUrl: url,
        initialStatus,
        finalStatus: res.statusCode,
        redirects,
        finalUrl: currentUrl,
        chain
      };
    }
  }

  return {
    originalUrl: url,
    initialStatus,
    finalStatus: 0,
    redirects,
    finalUrl: currentUrl,
    chain: ['Too many redirects']
  };
}

async function getLiveSitemapXml() {
  return new Promise((resolve, reject) => {
    https.get('https://www.theshadowbridge.com/sitemap.xml', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (r2) => {
          let data = '';
          r2.on('data', chunk => data += chunk);
          r2.on('end', () => resolve(data));
        }).on('error', reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching live sitemap from https://www.theshadowbridge.com/sitemap.xml ...');
  let xml = '';
  try {
    xml = await getLiveSitemapXml();
    console.log(`Live sitemap fetched successfully (${xml.length} bytes).`);
  } catch (err) {
    console.error('Failed to fetch live sitemap:', err.message);
    process.exit(1);
  }

  // Extract <loc> tags
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }

  console.log(`Found ${urls.length} URLs in live sitemap.xml.\n`);

  console.log('| # | URL | Status Code | Redirects | Final Status | Chain / Note |');
  console.log('|---|---|---|---|---|---|');

  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    try {
      const res = await fetchUrl(u);
      results.push(res);
      const chainNote = res.redirects > 0 ? res.chain.join(' ; ') : 'OK';
      console.log(`| ${i + 1} | ${res.originalUrl} | ${res.initialStatus} | ${res.redirects} | ${res.finalStatus} | ${chainNote} |`);
    } catch (err) {
      console.log(`| ${i + 1} | ${u} | ERROR | - | - | ${err.message} |`);
      results.push({ originalUrl: u, initialStatus: 'ERROR', redirects: -1, finalStatus: 'ERROR', chain: [err.message] });
    }
  }

  const badUrls = results.filter(r => r.initialStatus !== 200 || r.redirects !== 0);
  console.log(`\nSummary: ${results.length} total URLs audited.`);
  console.log(`Compliant (200, 0 redirects): ${results.length - badUrls.length}`);
  console.log(`Non-compliant (redirects or non-200): ${badUrls.length}`);
  if (badUrls.length > 0) {
    console.log('\nURLs needing attention:');
    badUrls.forEach(b => console.log(` - ${b.originalUrl} -> ${b.initialStatus} (${b.redirects} redirects)`));
  }
}

main();
