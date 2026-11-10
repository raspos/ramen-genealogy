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
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      rejectUnauthorized: false
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) loc = 'https://www.otokimall.com' + loc;
        return resolve(fetchPage(loc));
      }
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
    https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' }, rejectUnauthorized: false }, res => {
      if (res.statusCode !== 200) return resolve(false);
      const f = fs.createWriteStream(dest);
      res.pipe(f);
      f.on('finish', () => f.close(() => resolve(true)));
    }).on('error', () => resolve(false));
  });
}

const OTTOGI_MAP = [
  { id: 'jin-spicy', terms: ['진라면 매운맛', '진라면(매운맛)'] },
  { id: 'jin-mild', terms: ['진라면 순한맛', '진라면(순한맛)'] },
  { id: 'jin-cup-spicy', terms: ['진라면 매운맛 컵', '진라면 컵 매운맛', '진라면 매운맛(용기)'] },
  { id: 'jin-cup-mild', terms: ['진라면 순한맛 컵', '진라면 컵 순한맛', '진라면 순한맛(용기)'] },
  { id: 'jin-big-cup-spicy', terms: ['진라면 매운맛 큰컵', '진라면 큰컵 매운맛'] },
  { id: 'yeol-ramyun', terms: ['열라면'] },
  { id: 'yeol-cup', terms: ['열라면 컵', '열라면 큰컵', '열라면(용기)'] },
  { id: 'chamkkae', terms: ['참깨라면'] },
  { id: 'chamkkae-cup', terms: ['참깨라면 컵', '참깨라면(용기)'] },
  { id: 'snack-myeon', terms: ['스낵면'] },
  { id: 'jin-jjamppong', terms: ['진짬뽕'] },
  { id: 'jin-jjamppong-cup', terms: ['진짬뽕 컵', '진짬뽕 큰컵'] },
  { id: 'jin-jjajang', terms: ['진짜장'] },
  { id: 'odongtong', terms: ['오동통면'] },
  { id: 'ottogi-spaghetti', terms: ['스파게티'] },
  { id: 'beef-seaweed-ramen', terms: ['쇠고기미역국라면', '미역국라면'] },
  { id: 'cup-noodle-spicy', terms: ['컵누들 매콤한맛', '컵누들 매콤'] },
  { id: 'cup-noodle-udong', terms: ['컵누들 우동맛'] },
  { id: 'cup-noodle-rose', terms: ['컵누들 로제'] },
  { id: 'cup-noodle-jjambbong', terms: ['컵누들 짬뽕'] },
  { id: 'ramen-sari', terms: ['라면사리'] }
];

async function main() {
  // Let's test categories
  const cats = [1, 2, 3, 4, 5, 139, 140, 146, 154, 156, 157, 166, 168, 169];
  const items = new Map();

  for (const c of cats) {
    const html = await fetchPage(`https://www.otokimall.com/front/product/category/${c}`);
    // regex for img with cdn.otokimall.com/data/product/
    const imgRegex = /<img[^>]+src="([^"]*cdn\.otokimall\.com\/data\/product\/[^"]+)"[^>]*alt="([^"]*)"/gi;
    let m;
    while ((m = imgRegex.exec(html)) !== null) {
      if (m[2] && m[2].trim()) {
        items.set(m[2].trim(), m[1]);
      }
    }
  }

  console.log(`Found ${items.size} Ottogi items from category scan.`);
  for (const [title, imgUrl] of items.entries()) {
    console.log(`- ${title} => ${imgUrl}`);
    for (const mapping of OTTOGI_MAP) {
      const match = mapping.terms.some(t => title.includes(t));
      if (match) {
        const dest = path.join(outDir, `${mapping.id}.jpg`);
        if (!fs.existsSync(dest)) {
          const ok = await downloadImage(imgUrl, dest);
          if (ok) console.log(`>>> [OTTOGI DOWNLOADED] ${mapping.id} (${title}) -> ${fs.statSync(dest).size} bytes`);
        }
      }
    }
  }
}

main();
