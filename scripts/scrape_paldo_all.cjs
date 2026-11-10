const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/products');

function fetchPage(p) {
  return new Promise((resolve) => {
    https.get({
      hostname: 'paldofood.co.kr',
      path: '/product/noodle?page=' + p,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      rejectUnauthorized: false
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) return resolve(true);
    let u = url;
    if (u.startsWith('//')) u = 'https:' + u;
    else if (u.startsWith('/')) u = 'https://paldofood.co.kr' + u;
    https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' }, rejectUnauthorized: false }, res => {
      if (res.statusCode !== 200) return resolve(false);
      const f = fs.createWriteStream(dest);
      res.pipe(f);
      f.on('finish', () => f.close(() => resolve(true)));
    }).on('error', () => resolve(false));
  });
}

const PALDO_MAP = [
  { id: 'paldo-bibim', terms: ['팔도비빔면'] },
  { id: 'paldo-bibim-cup', terms: ['비빔면 컵', '비빔면컵'] },
  { id: 'wang-ttukkeong', terms: ['왕뚜껑'] },
  { id: 'kimchi-wang-ttukkeong', terms: ['김치 왕뚜껑', '김치왕뚜껑'] },
  { id: 'jjambbong-wang-ttukkeong', terms: ['짬뽕 왕뚜껑', '짬뽕왕뚜껑'] },
  { id: 'udong-wang-ttukkeong', terms: ['우동 왕뚜껑', '우동왕뚜껑'] },
  { id: 'paldo-doshirak', terms: ['도시락'] },
  { id: 'teumsae-bbalggyettok', terms: ['빨계떡', '틈새라면'] },
  { id: 'teumsae-cup', terms: ['틈새라면 컵'] },
  { id: 'kkokko-myeon', terms: ['꼬꼬면'] },
  { id: 'ilpum-jjajang', terms: ['일품 짜장', '일품짜장면'] },
  { id: 'ilpum-seafood', terms: ['일품 해물', '일품해물라면'] },
  { id: 'namja-ramen', terms: ['남자라면', '상남자라면'] },
  { id: 'bibim-jjol-men', terms: ['비빔쫄면'] },
  { id: 'the-king-ttukkeong', terms: ['킹뚜껑'] },
  { id: 'maun-wang-ttukkeong', terms: ['매운 왕뚜껑'] }
];

async function main() {
  for (let page = 1; page <= 6; page++) {
    const html = await fetchPage(page);
    const regex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi;
    let m;
    let foundThisPage = 0;
    while ((m = regex.exec(html)) !== null) {
      const src = m[1];
      const alt = m[2];
      if (src.includes('data/product')) {
        foundThisPage++;
        console.log(`Page ${page}: ${alt} -> ${src}`);
        for (const mapping of PALDO_MAP) {
          const match = mapping.terms.some(t => alt.includes(t));
          if (match) {
            const dest = path.join(outDir, `${mapping.id}.jpg`);
            if (!fs.existsSync(dest)) {
              const ok = await downloadImage(src, dest);
              if (ok) console.log(`>>> [PALDO SAVED] ${mapping.id} (${alt}) -> ${fs.statSync(dest).size} bytes`);
            }
          }
        }
      }
    }
    console.log(`Page ${page} total items: ${foundThisPage}`);
    if (foundThisPage === 0) break;
  }
}

main();
