const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const publicDir = path.join(__dirname, '../public/images/products');

const ottogi = JSON.parse(fs.readFileSync(path.join(__dirname, 'crawled_ottogi.json'), 'utf8'));
const nongshim = JSON.parse(fs.readFileSync(path.join(__dirname, 'crawled_nongshim.json'), 'utf8'));
const samyang = JSON.parse(fs.readFileSync(path.join(__dirname, 'crawled_samyang.json'), 'utf8'));

// Helper to download
function download(url, dest) {
  return new Promise((resolve) => {
    const isHttps = url.startsWith('https:');
    const client = isHttps ? https : http;
    const req = client.get(url, {
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = new URL(res.headers.location, url).href;
        download(next, dest).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        resolve({ success: false, status: res.statusCode });
        return;
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        const stat = fs.statSync(dest);
        if (stat.size < 1000) {
          fs.unlinkSync(dest);
          resolve({ success: false, reason: 'Too small: ' + stat.size });
        } else {
          resolve({ success: true, size: stat.size });
        }
      });
    });
    req.on('error', e => resolve({ success: false, error: e.message }));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ success: false, reason: 'Timeout' });
    });
  });
}

// Map exact product names from crawled data
const ottogiMap = new Map();
ottogi.forEach(o => {
  if (!ottogiMap.has(o.name)) {
    // Keep /list/ url for Ottogi
    const listUrl = o.imgUrl.replace('/detail/', '/list/');
    ottogiMap.set(o.name, listUrl);
  }
});

const nongshimMap = new Map();
nongshim.forEach(n => {
  if (!nongshimMap.has(n.name)) {
    nongshimMap.set(n.name, n.imgUrl);
  }
});

// Explicit verified mappings (ID -> { sourceUrl, sourceName, ext })
const officialMappings = {
  // === OTTOGI (오뚜기 공식몰) ===
  'jin-ramen-spicy': { url: ottogiMap.get('진라면 매운맛 (120GX5)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'jin-ramen-mild': { url: ottogiMap.get('진라면 순한맛 (120GX5)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'yeol-ramyun': { url: ottogiMap.get('열라면 (120GX5)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'ma-yeol': { url: ottogiMap.get('마열라면 (120GX4)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'chamkkae': { url: ottogiMap.get('참깨라면 (115GX4)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'snack-myeon': { url: ottogiMap.get('스낵면 (108GX5)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'jin-jjamppong': { url: ottogiMap.get('진짬뽕 (130GX4)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'jin-jjajang': { url: ottogiMap.get('진짜장 (135GX4)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'odongtong': { url: ottogiMap.get('오동통면(다시마2) (120GX5)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'ottogi-spaghetti': { url: ottogiMap.get('스파게티 (150GX4)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'jin-bibimmyeon': { url: ottogiMap.get('진비빔면 (156GX4)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'beef-seaweed-ramen': { url: ottogiMap.get('쇠고기미역국라면 (115GX4)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'bukeotguk-ramen': { url: ottogiMap.get('북엇국라면 (110GX4)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'jin-ramen-spicy-cup': { url: ottogiMap.get('진라면 매운맛 용기 110G'), src: '오뚜기 공식몰', ext: 'jpg' },
  'jin-ramen-mild-cup': { url: ottogiMap.get('진라면 순한맛 컵 65G') || ottogiMap.get('진라면 순한맛 용기 110G'), src: '오뚜기 공식몰', ext: 'jpg' },
  'yeol-ramyun-cup': { url: ottogiMap.get('열라면 용기 105G'), src: '오뚜기 공식몰', ext: 'jpg' },
  'chamkkae-cup': { url: ottogiMap.get('참깨라면 용기 110G'), src: '오뚜기 공식몰', ext: 'jpg' },
  'snack-myeon-cup': { url: ottogiMap.get('스낵면 용기 90G') || ottogiMap.get('스낵면 컵 62G'), src: '오뚜기 공식몰', ext: 'jpg' },
  'jin-jjamppong-cup': { url: ottogiMap.get('진짬뽕 용기 115G') || ottogiMap.get('진짬뽕 컵 75G'), src: '오뚜기 공식몰', ext: 'jpg' },
  'kok-kok-spaghetti-cup': { url: ottogiMap.get('콕콕콕 스파게티 용기 120G'), src: '오뚜기 공식몰', ext: 'jpg' },
  'kok-kok-cheese-bokki': { url: ottogiMap.get('콕콕콕 치즈볶이 용기 95G'), src: '오뚜기 공식몰', ext: 'jpg' },
  'kok-kok-ramen-bokki': { url: ottogiMap.get('콕콕콕 라면볶이 용기 120G'), src: '오뚜기 공식몰', ext: 'jpg' },
  'kok-kok-jjajang-bokki': { url: ottogiMap.get('콕콕콕 짜장치즈볶이 용기 100G'), src: '오뚜기 공식몰', ext: 'jpg' },
  'real-cheese-ramen': { url: ottogiMap.get('리얼치즈라면 (135GX4)') || ottogiMap.get('리얼치즈라면 용기 120G'), src: '오뚜기 공식몰', ext: 'jpg' },
  'beef-seaweed-ramen-cup': { url: ottogiMap.get('쇠고기미역국라면 컵 60G'), src: '오뚜기 공식몰', ext: 'jpg' },
  'ramen-sari': { url: ottogiMap.get('라면사리 (110GX5)'), src: '오뚜기 공식몰', ext: 'jpg' },
  'ottogi-curry-ramen': { url: ottogiMap.get('오뚜기카레면 (130GX4)') || ottogiMap.get('오뚜기카레면 용기 110G'), src: '오뚜기 공식몰', ext: 'jpg' },

  // === NONGSHIM (농심 공식브랜드관) ===
  'shin-ramyun': { url: nongshimMap.get('신라면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'shin-the-red': { url: nongshimMap.get('신라면 더 레드') || nongshimMap.get('신라면더레드'), src: '농심 공식브랜드관', ext: 'jpg' },
  'shin-black': { url: nongshimMap.get('신라면블랙'), src: '농심 공식브랜드관', ext: 'jpg' },
  'shin-non-frying': { url: nongshimMap.get('신라면건면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'shin-toomba': { url: nongshimMap.get('신라면 툼바') || nongshimMap.get('신라면툼바'), src: '농심 공식브랜드관', ext: 'jpg' },
  'shin-stir-fry': { url: nongshimMap.get('신라면 볶음면') || nongshimMap.get('신라면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'shin-ramyun-cup-big': { url: nongshimMap.get('신라면큰사발') || nongshimMap.get('신라면큰사발면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'shin-ramyun-cup-small': { url: nongshimMap.get('신라면컵'), src: '농심 공식브랜드관', ext: 'jpg' },
  'shin-stir-fry-cup': { url: nongshimMap.get('신라면 툼바 큰사발') || nongshimMap.get('신라면 더 레드 큰사발면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'shin-black-cup': { url: nongshimMap.get('신라면블랙사발') || nongshimMap.get('신라면블랙사발면'), src: '농심 공식브랜드관', ext: 'jpg' },

  'chapagetti': { url: nongshimMap.get('올리브 짜파게티') || nongshimMap.get('사천짜파게티'), src: '농심 공식브랜드관', ext: 'jpg' },
  'spicy-chapagetti': { url: nongshimMap.get('사천짜파게티') || nongshimMap.get('사천요리 짜파게티'), src: '농심 공식브랜드관', ext: 'jpg' },
  'chapagetti-the-black': { url: nongshimMap.get('짜파게티더블랙'), src: '농심 공식브랜드관', ext: 'jpg' },
  'chapagetti-beombeok': { url: nongshimMap.get('짜파게티범벅') || nongshimMap.get('짜파게티 범벅'), src: '농심 공식브랜드관', ext: 'jpg' },

  'neoguri': { url: nongshimMap.get('얼큰한 너구리'), src: '농심 공식브랜드관', ext: 'jpg' },
  'neoguri-mild': { url: nongshimMap.get('순한 너구리') || nongshimMap.get('순한너구리'), src: '농심 공식브랜드관', ext: 'jpg' },
  'neoguri-cup': { url: nongshimMap.get('너구리 큰사발') || nongshimMap.get('너구리큰사발'), src: '농심 공식브랜드관', ext: 'jpg' },
  'angry-neoguri': { url: nongshimMap.get('앵그리RtA'), src: '농심 공식브랜드관', ext: 'jpg' },
  'kaguri': { url: nongshimMap.get('카구리큰사발면') || nongshimMap.get('라뽁구리큰사발면'), src: '농심 공식브랜드관', ext: 'jpg' },

  'anseongtangmyeon': { url: nongshimMap.get('안성탕면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'sunhagun-anseong': { url: nongshimMap.get('순하군 안성탕면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'anseongtangmyeon-cup': { url: nongshimMap.get('안성탕면컵'), src: '농심 공식브랜드관', ext: 'jpg' },

  'sari-gomtang': { url: nongshimMap.get('사리곰탕면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'sari-gomtang-cup': { url: nongshimMap.get('사리곰탕큰사발') || nongshimMap.get('사리곰탕면큰사발'), src: '농심 공식브랜드관', ext: 'jpg' },
  'myeolchi-kalguksu': { url: nongshimMap.get('멸치칼국수'), src: '농심 공식브랜드관', ext: 'jpg' },
  'myeolchi-kalguksu-spicy': { url: nongshimMap.get('얼큰장칼국수'), src: '농심 공식브랜드관', ext: 'jpg' },
  'ojingeo-jjamppong': { url: nongshimMap.get('오징어짬뽕'), src: '농심 공식브랜드관', ext: 'jpg' },
  'ojingeo-jjamppong-cup': { url: nongshimMap.get('오징어짬뽕큰사발') || nongshimMap.get('오징어짬뽕컵'), src: '농심 공식브랜드관', ext: 'jpg' },
  'baehongdong': { url: nongshimMap.get('배홍동 비빔면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'baehongdong-kalbim': { url: nongshimMap.get('배홍동 쫄쫄면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'mupama': { url: nongshimMap.get('무파마탕면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'gamjamyeon': { url: nongshimMap.get('감자면') || nongshimMap.get('감자면 봉지면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'gamjamyeon-cup': { url: nongshimMap.get('감자면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'budae-jjigae': { url: nongshimMap.get('보글보글 부대찌개면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'doongji-dongchimi': { url: nongshimMap.get('둥지냉면 동치미물냉면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'doongji-bibim': { url: nongshimMap.get('둥지냉면 비빔냉면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'yukgaejang-sabal': { url: nongshimMap.get('육개장 사발면') || nongshimMap.get('육개장사발면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'kimchi-sabal': { url: nongshimMap.get('김치사발면') || nongshimMap.get('김치큰사발'), src: '농심 공식브랜드관', ext: 'jpg' },
  'fried-udon-cup': { url: nongshimMap.get('튀김우동큰사발') || nongshimMap.get('튀김우동 큰사발'), src: '농심 공식브랜드관', ext: 'jpg' },
  'saewootang-cup': { url: nongshimMap.get('새우탕큰사발') || nongshimMap.get('새우탕면'), src: '농심 공식브랜드관', ext: 'jpg' },
  'noodlefit-tteokbokki': { url: nongshimMap.get('누들핏 짜파구리맛') || nongshimMap.get('누들핏 김치사발면맛'), src: '농심 공식브랜드관', ext: 'jpg' },
  'noodlefit-eomuk': { url: nongshimMap.get('누들핏 튀김우동맛') || nongshimMap.get('누들핏 육개장사발면맛'), src: '농심 공식브랜드관', ext: 'jpg' },

  // === SAMYANG (삼양식품 공식브랜드관) ===
  'samyang-ramen': { url: 'https://www.samyangfoods.com/upload/product/20230912/20230912173938560414.png', src: '삼양식품 공식브랜드관', ext: 'png' },
  'samyang-ramen-spicy': { url: 'https://www.samyangfoods.com/upload/product/20231017/20231017141211454452.png', src: '삼양식품 공식브랜드관', ext: 'png' },
  'samyang-gold': { url: 'https://www.samyangfoods.com/upload/product/20231017/20231017135003166448.png', src: '삼양식품 공식브랜드관', ext: 'png' },
  'samyang-ramen-cup': { url: 'https://www.samyangfoods.com/upload/product/20250110/20250110104513271125.png', src: '삼양식품 공식브랜드관', ext: 'png' },
  'buldak-original': { url: 'https://www.samyangfoods.com/upload/product/20260622/20260622144950808477.png', src: '삼양식품 공식브랜드관', ext: 'png' },
  'carbo-buldak': { url: 'https://www.samyangfoods.com/upload/product/20260622/20260622145514434489.png', src: '삼양식품 공식브랜드관', ext: 'png' },
  'buldak-quattro-cheese': { url: 'https://www.samyangfoods.com/upload/product/20250520/20250520092351672181.png', src: '삼양식품 공식브랜드관', ext: 'png' },
  'buldak-roser': { url: 'https://www.samyangfoods.com/upload/product/20250312/20250312171448230174.png', src: '삼양식품 공식브랜드관', ext: 'png' },
  'meptaeng-garlic-clam': { url: 'https://www.samyangfoods.com/upload/product/20250320/20250320101542315211.png', src: '삼양식품 공식브랜드관', ext: 'png' },
  'meptaeng-black-pepper': { url: 'https://www.samyangfoods.com/upload/product/20250404/20250404142535190227.png', src: '삼양식품 공식브랜드관', ext: 'png' },
  'meptaeng-cheongyang': { url: 'https://www.samyangfoods.com/upload/product/20250404/20250404142736739231.png', src: '삼양식품 공식브랜드관', ext: 'png' },
  'samyang-1963-heritage': { url: 'https://www.samyangfoods.com/upload/product/20260917/20260917104035286565.png', src: '삼양식품 공식브랜드관', ext: 'png' },
  'samyang-chicken-1963': { url: 'https://www.samyangfoods.com/upload/product/20260703/20260703142455899508.png', src: '삼양식품 공식브랜드관', ext: 'png' }
};

async function main() {
  console.log(`Starting download for ${Object.keys(officialMappings).length} mapped official products...`);

  let successCount = 0;
  let failCount = 0;

  for (const [id, info] of Object.entries(officialMappings)) {
    if (!info.url) {
      console.log(`[SKIP] ${id}: No official URL found`);
      failCount++;
      continue;
    }

    const filename = `${id}.${info.ext}`;
    const dest = path.join(publicDir, filename);

    console.log(`Downloading ${id} from ${info.src} (${info.url})...`);
    const res = await download(info.url, dest);
    if (res.success) {
      console.log(` -> SUCCESS: ${filename} (${res.size} bytes)`);
      successCount++;
    } else {
      console.log(` -> FAIL: ${filename} (${res.error || res.reason || res.status})`);
      failCount++;
    }
  }

  console.log(`\nDownload complete: ${successCount} succeeded, ${failCount} failed.`);
}

main().catch(console.error);
