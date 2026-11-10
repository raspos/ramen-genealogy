const https = require('https');

const options = {
  hostname: 'paldofood.co.kr',
  path: '/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
  },
  rejectUnauthorized: false
};

https.get(options, res => {
  console.log('Paldo home status:', res.statusCode, res.headers.location);
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('Length:', d.length);
    const links = d.match(/href="([^"]*(?:product|noodle|brand)[^"]*)"/gi) || [];
    console.log('Links:', [...new Set(links)].slice(0, 10));
  });
}).on('error', e => console.error(e));
