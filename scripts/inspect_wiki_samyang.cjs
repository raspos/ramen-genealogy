const https = require('https');

https.get('https://ko.wikipedia.org/wiki/%EC%82%BC%EC%96%91%EB%9D%BC%EB%A9%B4', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const imgs = [...b.matchAll(/upload\.wikimedia\.org\/wikipedia\/[^\s"'>]+/gi)].map(m => m[0]);
    console.log('Wikimedia images count:', imgs.length);
    console.log('Sample images:', [...new Set(imgs)]);
  });
});
