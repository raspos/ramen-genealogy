const http = require('http');
const https = require('https');

function fetchUrl(targetUrl) {
  return new Promise((resolve, reject) => {
    const isHttps = targetUrl.startsWith('https:');
    const client = isHttps ? https : http;
    const req = client.get(targetUrl, {
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ body, status: res.statusCode }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => req.destroy());
  });
}

async function findRamenCategory() {
  const home = await fetchUrl('https://www.otokimall.com/');
  // Match category links with text: <a href="([^"]*category\/[^"]*)">([^<]+)<\/a>
  const catMatches = [...home.body.matchAll(/<a[^>]+href="([^"]*category\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)];
  for (const m of catMatches) {
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (text) {
      console.log(`Category: ${m[1]} -> "${text}"`);
    }
  }
}

findRamenCategory().catch(console.error);
