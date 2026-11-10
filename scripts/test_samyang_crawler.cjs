const https = require('https');

function fetchSamyang(cate) {
  return new Promise((resolve) => {
    https.get(`https://www.samyangfoods.com/kor/brand/list.do?searchCateCd1=${cate}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        // Find products and images
        // <img src=".../upload/product/..." alt="..."
        const imgs = [...b.matchAll(/<img[^>]+src="([^"]*(?:upload|product)[^"]*)"[^>]*alt="([^"]*)"/gi)];
        const titles = [...b.matchAll(/<strong[^>]*class="tit"[^>]*>([\s\S]*?)<\/strong>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
        resolve({ cate, status: res.statusCode, imgs: imgs.map(m => ({ src: m[1], alt: m[2] })), titles });
      });
    }).on('error', e => resolve({ cate, error: e.message }));
  });
}

async function run() {
  for (const c of [45, 46]) {
    const r = await fetchSamyang(c);
    console.log(`Samyang Cate ${c} status:`, r.status, 'imgs:', r.imgs.length, 'titles:', r.titles.length);
    console.log('Sample titles:', r.titles.slice(0, 10));
    console.log('Sample images:', r.imgs.slice(0, 5));
  }
}

run();
