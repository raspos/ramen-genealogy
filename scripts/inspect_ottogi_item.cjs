const https = require('https');

https.get('https://www.otokimall.com/front/main', {
  rejectUnauthorized: false,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const prodMatches = [...body.matchAll(/\{[^{}]*"PROD_NAME"[^{}]*\}/gi)];
    if (prodMatches[4]) {
      console.log('Object 4:', prodMatches[4][0]);
    }
  });
});
