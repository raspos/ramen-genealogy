const https = require('https');

https.get('https://www.otokimall.com/static/jscript/front/ui.cw.product.js?v=2026', {
  rejectUnauthorized: false,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    console.log('Script length:', body.length);
    // Find url ajax calls in js
    const urls = [...body.matchAll(/url\s*:\s*['"]([^'"]+)['"]/gi)].map(m => m[1]);
    console.log('URLs in script:', [...new Set(urls)]);
  });
});
