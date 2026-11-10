const http = require('http');

function fetchPaldo(path) {
  return new Promise((resolve) => {
    http.get(`http://www.paldofood.co.kr${path}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        // Find product images
        // <img src=".../upload/..." alt="..."
        const imgs = [...b.matchAll(/<img[^>]+src="([^"]*(?:upload|product)[^"]*)"[^>]*alt="([^"]*)"/gi)];
        resolve({ path, status: res.statusCode, length: b.length, imgs: imgs.map(m => ({ src: m[1], alt: m[2] })) });
      });
    }).on('error', e => resolve({ path, error: e.message }));
  });
}

async function run() {
  const r1 = await fetchPaldo('/');
  console.log('Paldo home imgs:', r1.imgs.slice(0, 10));

  const r2 = await fetchPaldo('/product/ramen.asp');
  console.log('Paldo /product/ramen.asp:', r2.status, 'length:', r2.length, 'imgs:', r2.imgs.length);
  if (r2.imgs.length > 0) {
    console.log('Sample Paldo ramen:', r2.imgs.slice(0, 15));
  }
}

run();
