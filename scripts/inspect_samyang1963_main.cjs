const https = require('https');

https.get('https://www.samyang1963.com/main.do', {
  headers: { 'User-Agent': 'Mozilla/5.0' },
  rejectUnauthorized: false
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode, 'Length:', b.length);
    const imgs = [...b.matchAll(/src="([^"]+\.(?:png|jpg|jpeg|webp))"/gi)].map(m => m[1]);
    console.log('Images on samyang1963.com/main.do:');
    imgs.forEach(i => console.log(i));
  });
});
