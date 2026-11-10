const https = require('https');

function fetchSamyang1963() {
  https.get('https://www.samyang1963.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    rejectUnauthorized: false
  }, (res) => {
    let b = '';
    res.on('data', c => b += c);
    res.on('end', () => {
      console.log('Status:', res.statusCode, 'Length:', b.length);
      const imgs = [...b.matchAll(/src="([^"]+\.(?:png|jpg|jpeg|webp))"/gi)].map(m => m[1]);
      console.log('Found images:', imgs);
    });
  }).on('error', e => console.error(e.message));
}

fetchSamyang1963();
