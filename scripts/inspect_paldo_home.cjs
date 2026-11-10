const http = require('http');

http.get('http://www.paldofood.co.kr/', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const links = [...b.matchAll(/href="([^"]+)"/gi)].map(m => m[1]);
    console.log('Home links:', [...new Set(links)].slice(0, 30));
  });
});
