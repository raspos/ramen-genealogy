const https = require('https');

https.get('https://www.otokimall.com/static/jscript/front/ui.pager.product.js?v=1', {
  rejectUnauthorized: false,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    console.log(body.slice(1000, 3000));
  });
});
