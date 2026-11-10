const https = require('https');

https.get('https://www.otokimall.com/front/product/category/16', {
  rejectUnauthorized: false,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const bindMatches = [...body.matchAll(/prodSearchPager\.bind\s*\(\s*\{[\s\S]*?\}\s*\)/gi)];
    console.log('prodSearchPager.bind matches:', bindMatches.map(m => m[0]));

    // Also search for any urlProduct
    const urlMatches = [...body.matchAll(/urlProduct\s*:\s*['"]([^'"]+)['"]/gi)];
    console.log('urlProduct matches:', urlMatches.map(m => m[1]));
  });
});
