const https = require('https');

function get(url) {
  https.get(url, {
    rejectUnauthorized: false,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  }, (res) => {
    console.log(url, '-> status:', res.statusCode, 'location:', res.headers.location);
    if (res.headers.location) {
      const nextUrl = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
      get(nextUrl);
    } else {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        console.log('Final URL:', url, 'Length:', data.length);
        // Find category links or ramen items
        const links = [...data.matchAll(/href="([^"]+)"/gi)].map(m => m[1]);
        const goodsLinks = links.filter(l => l.includes('goods') || l.includes('category') || l.includes('display'));
        console.log('Goods/category links:', [...new Set(goodsLinks)].slice(0, 20));
      });
    }
  }).on('error', e => console.error('Error:', e.message));
}

get('https://www.ottogimall.co.kr');
