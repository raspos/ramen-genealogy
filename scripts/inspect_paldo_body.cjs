const http = require('http');

http.get('http://www.paldofood.co.kr/product/ramen.asp', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    // Find all images or links
    const imgs = [...b.matchAll(/src="([^"]+\.(?:jpg|png|gif))"/gi)].map(m => m[1]);
    console.log('Paldo imgs:', imgs.slice(0, 25));

    // Also look for product names or titles
    const links = [...b.matchAll(/href="([^"]*(?:ramen|view|detail)[^"]*)"/gi)].map(m => m[1]);
    console.log('Paldo ramen links:', [...new Set(links)]);
  });
});
