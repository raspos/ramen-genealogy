const https = require('https');

https.get('https://ko.wikipedia.org/wiki/%EC%82%BC%EC%96%91%EB%9D%BC%EB%A9%B4', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const imgs = [...b.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/gi)].map(m => m[1]);
    console.log('Images:', imgs);
  });
});
