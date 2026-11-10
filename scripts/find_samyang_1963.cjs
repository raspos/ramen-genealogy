const https = require('https');

function fetchImages(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      rejectUnauthorized: false
    }, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        const imgs = [...b.matchAll(/src="([^"]+\.(?:png|jpg|jpeg|webp))"/gi)].map(m => m[1]);
        resolve({ url, status: res.statusCode, imgs });
      });
    }).on('error', e => resolve({ url, error: e.message }));
  });
}

async function run() {
  const r1 = await fetchImages('https://www.samyangfoods.com/kor/company/history.do');
  console.log('samyangfoods history:', r1.status, r1.imgs);

  const r2 = await fetchImages('https://www.samyangfoods.com/kor/brand/samyang1963.do');
  console.log('samyang1963 brand page:', r2.status, r2.imgs);
}

run();
