const https = require('https');

const pages = [
  '/kor/brand/samyangRamen.do',
  '/kor/brand/spicyRamen.do',
  '/kor/brand/meptaeng.do',
  '/kor/brand/samyang1963.do'
];

async function checkPage(p) {
  return new Promise((resolve) => {
    https.get(`https://www.samyangfoods.com${p}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        const imgs = [...b.matchAll(/<img[^>]+src="([^"]*(?:upload|product)[^"]*)"[^>]*alt="([^"]*)"/gi)];
        const allUploadImgs = [...b.matchAll(/(https?:\/\/[^\s"'>]*upload[^\s"'>]*\.(?:jpg|png|webp))/gi)].map(m => m[1]);
        resolve({ p, status: res.statusCode, imgs: imgs.map(m => ({ src: m[1], alt: m[2] })), allUploadImgs });
      });
    }).on('error', e => resolve({ p, error: e.message }));
  });
}

async function run() {
  for (const p of pages) {
    const r = await checkPage(p);
    console.log(`Page: ${r.p} (status: ${r.status})`);
    console.log('Imgs with alt:', r.imgs);
    console.log('Upload imgs:', r.allUploadImgs.slice(0, 5));
  }
}

run();
