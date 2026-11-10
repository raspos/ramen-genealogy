const https = require('https');

https.get('https://www.samyangfoods.com/kor/index.do', {
  rejectUnauthorized: false,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    // Find all links containing brand or product
    const links = [...body.matchAll(/href="([^"]*(?:brand|product|goods|item)[^"]*)"/gi)].map(m => m[1]);
    console.log('Samyang brand/product links:', [...new Set(links)]);
  });
});
