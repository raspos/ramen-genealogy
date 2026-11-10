const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/products');

function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, rejectUnauthorized: false }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
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

const SAMYANG_MAP = [
  { id: 'buldak', terms: ['불닭볶음면 140g', '오리지널 불닭볶음면', '불닭볶음면'] },
  { id: 'buldak-big-cup', terms: ['큰컵 불닭볶음면', '불닭볶음면 큰컵'] },
  { id: 'carbo-buldak', terms: ['까르보불닭볶음면 130g', '까르보불닭볶음면'] },
  { id: 'carbo-buldak-cup', terms: ['큰컵 까르보불닭볶음면', '까르보불닭볶음면 큰컵'] },
  { id: 'cheese-buldak', terms: ['치즈불닭볶음면'] },
  { id: 'samyang-ramen', terms: ['삼양라면 120g', '삼양라면'] },
  { id: 'samyang-ramen-cup', terms: ['큰컵 삼양라면 110g', '큰컵 삼양라면'] },
  { id: 'samyang-spicy', terms: ['삼양라면 매운맛 120g', '삼양라면 매운맛'] },
  { id: 'samyang-spicy-cup', terms: ['큰컵 삼양라면 매운맛'] },
  { id: 'rose-buldak', terms: ['로제불닭볶음면'] },
  { id: 'haek-buldak', terms: ['핵불닭볶음면'] },
  { id: 'jjajang-buldak', terms: ['짜장불닭볶음면'] },
  { id: 'creamy-carbo-buldak', terms: ['크림까르보불닭볶음면'] },
  { id: 'yakisoba-buldak', terms: ['야키소바불닭볶음면'] },
  { id: 'habanero-lime-buldak', terms: ['하바네로라임불닭볶음면'] },
  { id: 'four-cheese-buldak', terms: ['4가지치즈불닭볶음면'] },
  { id: 'nagasaki-jjamppong', terms: ['나가사끼짬뽕'] },
  { id: 'ganjjambbong', terms: ['간짬뽕'] },
  { id: 'ganjjambbong-big-cup', terms: ['간짬뽕 큰사발', '간짬뽕 큰컵'] },
  { id: 'map-tang-black', terms: ['맵탱 흑후추', '맵탱'] },
  { id: 'map-tang-garlic', terms: ['맵탱 마늘', '맵탱'] },
  { id: 'map-tang-cheongyang', terms: ['맵탱 청양', '맵탱'] },
  { id: 'bibim-myeon', terms: ['열무비빔면'] }
];

async function main() {
  const codes = ['0002', '0003', '0004', '0005', '0006'];
  const allFound = new Map();

  // Also include main page
  const pages = ['https://samyangfoods.co.kr', ...codes.map(c => `https://samyangfoods.co.kr/goods/catalog?code=${c}`)];

  for (const pUrl of pages) {
    const html = await fetchPage(pUrl);
    const imgRegex = /<img[^>]+src="([^"]*\/data\/goods\/[^"]+)"[^>]*alt="([^"]+)"/gi;
    let m;
    while ((m = imgRegex.exec(html)) !== null) {
      if (m[2] && !m[2].includes('찜') && !m[2].includes('icon')) {
        let src = m[1];
        if (!src.startsWith('http')) src = 'https://samyangfoods.co.kr' + src;
        allFound.set(m[2], src);
      }
    }
  }

  console.log(`Found ${allFound.size} Samyang items total:`);
  for (const [title, imgUrl] of allFound.entries()) {
    console.log(`- ${title} => ${imgUrl}`);
    for (const mapping of SAMYANG_MAP) {
      const match = mapping.terms.some(t => title.includes(t));
      if (match) {
        const dest = path.join(outDir, `${mapping.id}.jpg`);
        if (!fs.existsSync(dest)) {
          const ok = await downloadImage(imgUrl, dest);
          if (ok) console.log(`[DOWNLOADED] ${mapping.id} from Samyang Mall! (${fs.statSync(dest).size} bytes)`);
        }
      }
    }
  }
}

main();
