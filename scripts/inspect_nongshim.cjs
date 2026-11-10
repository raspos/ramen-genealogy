const https = require('https');

const url = 'https://brand.nongshim.com/Rabbokguri/main/index';

const req = https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  console.log('Status code:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Body length:', data.length);
    const imgMatches = [...data.matchAll(/src="([^"]+\.(?:png|jpg|jpeg|webp))"/gi)];
    console.log('Found images:');
    imgMatches.forEach(m => console.log(m[1]));

    const bgMatches = [...data.matchAll(/url\(([^)]+\.(?:png|jpg|jpeg|webp))\)/gi)];
    console.log('Found CSS backgrounds:');
    bgMatches.forEach(m => console.log(m[1]));
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});
req.setTimeout(10000, () => {
  console.error('Request timed out');
  req.destroy();
});
