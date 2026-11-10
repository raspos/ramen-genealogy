const https = require('https');

https.get('https://www.samyang1963.com/main.do', {
  headers: { 'User-Agent': 'Mozilla/5.0' },
  rejectUnauthorized: false
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const items = [...b.matchAll(/<div[^>]*class="[^"]*hs_item[^"]*"[^>]*data-year="([^"]*)"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[\s\S]*?<div>([^<]+)<\/div>/gi)];
    console.log('History items found:', items.length);
    items.forEach(it => {
      console.log(`Year: ${it[1]} | Img: ${it[2]} | Label: ${it[3]}`);
    });
  });
});
