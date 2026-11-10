const https = require('https');

https.get('https://www.otokimall.com/front/product/category/16', {
  rejectUnauthorized: false,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const inputs = [...body.matchAll(/<input[^>]+name="([^"]+)"[^>]*value="([^"]*)"/gi)];
    console.log('Hidden inputs in category 16:');
    inputs.forEach(i => console.log(`${i[1]} = "${i[2]}"`));
  });
});
