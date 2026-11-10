const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/products');

function fetchPage(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
    https.get({
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
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
  { id: 'paldo-bibim', terms: ['팔도비빔면(봉지)', '팔도비빔면'] },
  { id: 'paldo-bibim-cup', terms: ['팔도비빔면 컵', '팔도비빔면(용기)'] },
  { id: 'wang-ttukkeong', terms: ['왕뚜껑', '오리지널 왕뚜껑'] },
  { id: 'kimchi-wang-ttukkeong', terms: ['김치왕뚜껑', '김치 왕뚜껑'] },
  { id: 'jjambbong-wang-ttukkeong', terms: ['짬뽕왕뚜껑', '짬뽕 왕뚜껑'] },
  { id: 'udong-wang-ttukkeong', terms: ['우동왕뚜껑', '우동 왕뚜껑'] },
  { id: 'paldo-doshirak', terms: ['도시락'] },
  { id: 'teumsae-bbalggyettok', terms: ['틈새라면 빨계떡', '틈새라면'] },
  { id: 'teumsae-cup', terms: ['틈새라면 컵', '틈새라면(용기)'] },
  { id: 'kkokko-myeon', terms: ['꼬꼬면'] },
  { id: 'ilpum-jjajang', terms: ['일품짜장면', '일품 삼선짜장'] },
  { id: 'ilpum-seafood', terms: ['일품해물라면', '해물라면'] },
  { id: 'namja-ramen', terms: ['남자라면'] },
  { id: 'bibim-jjol-men', terms: ['비빔쫄면', '팔도비빔쫄면'] },
  { id: 'the-king-ttukkeong', terms: ['킹뚜껑'] },
  { id: 'maun-wang-ttukkeong', terms: ['매운왕뚜껑'] }
];

async function main() {
  const html = await fetchPage('https://paldofood.co.kr/product/noodle');
  console.log('Paldo noodle page length:', html.length);

  // Look for items: images with alt or title
  const regex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi;
  let m;
  const items = new Map();
  while ((m = regex.exec(html)) !== null) {
    if (m[1].includes('product') || m[1].includes('upload') || m[2].includes('라면') || m[2].includes('뚜껑') || m[2].includes('면') || m[2].includes('도시락')) {
      items.set(m[2], m[1]);
    }
  }

  console.log(`Found ${items.size} Paldo product items:`);
  for (const [title, imgUrl] of items.entries()) {
    console.log(`- ${title} => ${imgUrl}`);
    for (const mapping of PALDO_MAP) {
      const match = mapping.terms.some(t => title.includes(t));
      if (match) {
        const dest = path.join(outDir, `${mapping.id}.jpg`);
        if (!fs.existsSync(dest)) {
          const ok = await downloadImage(imgUrl, dest);
          if (ok) console.log(`[PALDO DOWNLOADED] ${mapping.id} (${title}) -> ${fs.statSync(dest).size} bytes`);
        }
      }
    }
  }
}

main();
