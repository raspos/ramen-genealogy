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
      console.log(targetUrl, '->', res.statusCode, res.headers.location || '');
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = new URL(res.headers.location, targetUrl).href;
        fetchUrl(next).then(resolve).catch(reject);
        return;
      }
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ url: targetUrl, body, status: res.statusCode }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => req.destroy());
  });
}

async function run() {
  const res = await fetchUrl('https://www.otokimall.com/');
  console.log('Final page length:', res.body.length);
  // Search for ramen category or product links
  const links = [...res.body.matchAll(/href="([^"]+)"/gi)].map(m => m[1]);
  const ramenLinks = links.filter(l => /ramen|noodle|goods|category/i.test(l));
  console.log('Ramen/goods links:', [...new Set(ramenLinks)].slice(0, 30));

  // Search for image links
  const imgMatches = [...res.body.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi)];
  console.log('Sample images:', imgMatches.slice(0, 20).map(m => ({ src: m[1], alt: m[2] })));
}

run().catch(console.error);
