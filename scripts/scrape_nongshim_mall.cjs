const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/products');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
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
    https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode !== 200) return resolve(false);
      const f = fs.createWriteStream(dest);
      res.pipe(f);
      f.on('finish', () => f.close(() => resolve(true)));
    }).on('error', () => resolve(false));
  });
}

const ID_MAP = [
  { id: 'shin-ramyun', terms: ['신라면'] },
  { id: 'shin-red', terms: ['신라면 더레드', '더레드'] },
  { id: 'shin-toomba', terms: ['신라면 툼바', '툼바'] },
  { id: 'shin-gold', terms: ['신라면 골드', '골드'] },
  { id: 'shin-black', terms: ['신라면 블랙', '블랙'] },
  { id: 'shin-dry', terms: ['신라면 건면'] },
  { id: 'shin-cup', terms: ['신라면 컵', '신라면컵'] },
  { id: 'shin-big-cup', terms: ['신라면 큰사발'] },
  { id: 'shin-black-sabal', terms: ['신라면 블랙 사발', '블랙 두부'] },
  { id: 'shin-toomba-big-cup', terms: ['신라면 툼바 큰사발', '툼바 큰사발'] },
  { id: 'neoguri', terms: ['얼큰한 너구리', '너구리'] },
  { id: 'neoguri-mild', terms: ['순한 너구리'] },
  { id: 'angry-neoguri', terms: ['앵그리 너구리'] },
  { id: 'neoguri-big-cup', terms: ['너구리 큰사발'] },
  { id: 'neoguri-cup', terms: ['너구리 컵', '너구리컵'] },
  { id: 'chapagetti', terms: ['짜파게티'] },
  { id: 'chapagetti-spicy', terms: ['사천 짜파게티'] },
  { id: 'the-black-chapagetti', terms: ['짜파게티 더 블랙'] },
  { id: 'chapagetti-big-cup', terms: ['짜파게티 큰사발'] },
  { id: 'chapagetti-cup', terms: ['짜파게티 범벅', '짜파게티 컵', '짜파게티 소컵'] },
  { id: 'anseongtangmyeon', terms: ['안성탕면'] },
  { id: 'soonha-anseongtangmyeon', terms: ['순하군 안성탕면'] },
  { id: 'yukgaejang-sabal', terms: ['육개장 사발면', '육개장사발면'] },
  { id: 'yukgaejang-big-sabal', terms: ['육개장 큰사발면'] },
  { id: 'yukgaejang-bag', terms: ['육개장 봉지'] },
  { id: 'kimchi-sabal', terms: ['김치 사발면', '김치사발면'] },
  { id: 'myeolchi-kalguksu', terms: ['멸치칼국수'] },
  { id: 'myeolchi-kalguksu-sabal', terms: ['멸치칼국수 사발'] },
  { id: 'sarigomtang', terms: ['사리곰탕면', '사리곰탕'] },
  { id: 'sarigomtang-cup', terms: ['사리곰탕 큰사발', '사리곰탕 컵'] },
  { id: 'ojingeo-jjamppong', terms: ['오징어짬뽕'] },
  { id: 'ojingeo-jjamppong-big-cup', terms: ['오징어짬뽕 큰사발'] },
  { id: 'twiggim-udong', terms: ['튀김우동 큰사발', '튀김우동'] },
  { id: 'mu-pama', terms: ['무파마탕면', '무파마'] },
  { id: 'baehongdong-bibim', terms: ['배홍동 비빔면', '배홍동'] },
  { id: 'baehongdong-chal-jjol', terms: ['배홍동 쫄쫄면'] },
  { id: 'salad-noodle', terms: ['샐러드누들'] },
  { id: 'pasta-rang', terms: ['파스타랑'] },
  { id: 'chal-bibimmyeon', terms: ['찰비빔면'] }
];

async function main() {
  console.log('Scraping Nongshim Mall...');
  const pages = [
    'https://nongshimmall.com/product/list.html?cate_no=43', // 봉지
    'https://nongshimmall.com/product/list.html?cate_no=44', // 용기
    'https://nongshimmall.com/product/list.html?cate_no=43&page=2',
    'https://nongshimmall.com/product/list.html?cate_no=44&page=2'
  ];

  const found = new Map();

  for (const pageUrl of pages) {
    const html = await fetchPage(pageUrl);
    // Find products: regex for img with cafe24img.poxo.com and alt or name
    // Format: <img src="//cafe24img.poxo.com/..." ... alt="[농심] ..." />
    const regex = /<img[^>]+src="([^"]*cafe24img\.poxo\.com\/nsmall2022\/web\/product\/medium\/[^"]+)"[^>]*alt="([^"]*)"/gi;
    let m;
    while ((m = regex.exec(html)) !== null) {
      const imgUrl = m[1];
      const title = m[2];
      found.set(title, imgUrl);
    }
  }

  console.log(`Found ${found.size} products from Nongshim Mall.`);

  for (const [title, imgUrl] of found.entries()) {
    for (const mapping of ID_MAP) {
      const match = mapping.terms.some(t => title.includes(t));
      if (match) {
        const dest = path.join(outDir, `${mapping.id}.jpg`);
        if (!fs.existsSync(dest)) {
          const ok = await downloadImage(imgUrl, dest);
          if (ok) console.log(`[NONGSHIM] ${mapping.id} (${title}) -> ${fs.statSync(dest).size} bytes`);
        }
      }
    }
  }
}

main();
