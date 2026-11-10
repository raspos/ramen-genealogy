const https = require('https');
const fs = require('fs');
const path = require('path');

const samyangPages = [
  { url: 'https://www.samyangfoods.com/kor/brand/samyangRamen.do', brand: '삼양라면' },
  { url: 'https://www.samyangfoods.com/kor/brand/spicyRamen.do', brand: '불닭볶음면' },
  { url: 'https://www.samyangfoods.com/kor/brand/meptaeng.do', brand: '맵탱' },
  { url: 'https://www.samyangfoods.com/kor/brand/samyang1963.do', brand: '삼양1963' }
];

function fetchPage(p) {
  return new Promise((resolve) => {
    https.get(p.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        // Look for all product images in /upload/product/
        const regex = /<img[^>]+src="(\/upload\/product\/[^"]+)"[^>]*>/gi;
        const matches = [...b.matchAll(regex)].map(m => m[1]);
        resolve({ brand: p.brand, imgs: [...new Set(matches)] });
      });
    }).on('error', () => resolve({ brand: p.brand, imgs: [] }));
  });
}

async function run() {
  const all = [];
  for (const p of samyangPages) {
    const res = await fetchPage(p);
    console.log(res.brand, 'imgs:', res.imgs);
    res.imgs.forEach(img => {
      all.push({
        brand: res.brand,
        imgUrl: `https://www.samyangfoods.com${img}`,
        source: '삼양식품공식브랜드관'
      });
    });
  }
  fs.writeFileSync(path.join(__dirname, 'crawled_samyang.json'), JSON.stringify(all, null, 2));
}

run();
