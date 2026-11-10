const fs = require('fs');
const path = require('path');

const ottogi = JSON.parse(fs.readFileSync(path.join(__dirname, 'crawled_ottogi.json'), 'utf8'));
const nongshim = JSON.parse(fs.readFileSync(path.join(__dirname, 'crawled_nongshim.json'), 'utf8'));

// Refined matcher
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[0-9]+g(x[0-9]+)?/g, '')
    .replace(/큰사발면?/g, '큰컵')
    .replace(/용기면?/g, '큰컵')
    .replace(/용기/g, '큰컵')
    .replace(/소컵/g, '컵')
    .replace(/사발면?/g, '사발')
    .replace(/봉지/g, '');
}

function findBestMatch(prod, list, mfr) {
  const isCup = prod.packageType === 'CUP' || prod.packageType === 'BOWL';
  const normTarget = normalize(prod.name);

  // Exact brand / product specific mapping
  const specificMap = {
    'shin-toomba': '신라면 툼바',
    'shin-thered': '신라면 더 레드',
    'shin-black': '신라면 블랙',
    'shin-nonfrying': '신라면 건면',
    'shin-ramyun': isCup ? '신라면큰사발' : '신라면',
    'neoguri': isCup ? '너구리큰사발' : '얼큰한 너구리',
    'neoguri-mild': '순한 너구리',
    'neoguri-angry': '앵그리RtA',
    'chapagetti': isCup ? '짜파게티큰사발' : '올리브 짜파게티',
    'chapagetti-spicy': '사천짜파게티',
    'chapagetti-the-black': '짜파게티더블랙',
    'chapagetti-bumbeok': '짜파게티범벅',
    'jin-ramen-spicy': isCup ? '진라면 매운맛' : '진라면 매운맛',
    'jin-ramen-mild': isCup ? '진라면 순한맛' : '진라면 순한맛',
    'yeol-ramyun': '열라면',
    'ma-yeol': '마열라면',
    'chamkkae': '참깨라면',
    'snack-myeon': '스낵면',
    'jin-jjamppong': '진짬뽕',
    'jin-jjajang': '진짜장',
    'jin-bibim': '진비빔면',
    'odongtong': '오동통면',
    'cupnoodle-spicy': '컵누들 매콤한맛',
    'cupnoodle-udong': '컵누들 우동맛',
    'cupnoodle-rose': '컵누들 로제',
    'cupnoodle-tom-yum': '컵누들 똠얌꿍',
    'real-cheese': '리얼치즈라면',
    'miyeokguk': '쇠고기미역국라면',
    'kok-spaghetti': '콕콕콕 스파게티',
    'kok-cheese': '콕콕콕 치즈볶이',
    'kok-ramen-bokki': '콕콕콕 라면볶이',
    'kok-jjajang-bokki': '콕콕콕 짜장볶이',
    'ansung': '안성탕면',
    'ansung-mild': '순하군 안성탕면',
    'sarigomtang': '사리곰탕',
    'ojingeo-jjamppong': '오징어짬뽕',
    'baehongdong': '배홍동',
    'baehongdong-jjol': '배홍동 쫄쫄면',
    'kalguksoo': '멸치칼국수',
    'mupama': '무파마',
    'gamjamyeon': '감자면',
    'yukgaejang-bowl': '육개장',
    'kimchi-bowl': '김치사발면',
    'fried-udon-cup': '튀김우동',
    'saewootang-cup': '새우탕',
    'noodlefit-tteokbokki': '누들핏 떡볶이',
    'noodlefit-fishcake': '누들핏 어묵탕',
  };

  const overrideQuery = specificMap[prod.id];

  // 1. Try with overrideQuery
  if (overrideQuery) {
    const qNorm = normalize(overrideQuery);
    for (const item of list) {
      const iNorm = normalize(item.name);
      const itemIsCup = item.package === 'CUP' || iNorm.includes('컵') || iNorm.includes('사발') || iNorm.includes('용기');
      if (isCup === itemIsCup && (iNorm.includes(qNorm) || qNorm.includes(iNorm))) {
        return item;
      }
    }
    // Try without package check if strictly mapped
    for (const item of list) {
      const iNorm = normalize(item.name);
      if (iNorm.includes(qNorm)) {
        return item;
      }
    }
  }

  // 2. Try normal fuzzy matching
  for (const item of list) {
    const iNorm = normalize(item.name);
    const itemIsCup = item.package === 'CUP' || iNorm.includes('컵') || iNorm.includes('사발') || iNorm.includes('용기');
    if (isCup === itemIsCup) {
      if (iNorm.includes(normTarget) || normTarget.includes(iNorm)) {
        return item;
      }
    }
  }

  return null;
}

// Test with full dataset
const dir = path.join(__dirname, '../src/data/products');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
const prods = [];
for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const regex = /id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*manufacturer:\s*'([^']+)',\s*brand:\s*'([^']+)',[\s\S]*?packageType:\s*'([^']+)'/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    prods.push({
      id: m[1],
      name: m[2],
      manufacturer: m[3],
      packageType: m[5],
      file: f
    });
  }
}

let oCount = 0;
let nCount = 0;

console.log('--- REFINED OTTOGI MATCHES ---');
prods.filter(p => p.manufacturer === '오뚜기').forEach(p => {
  const match = findBestMatch(p, ottogi, '오뚜기');
  if (match) {
    oCount++;
    console.log(`[O-OK] ${p.id} (${p.name} / ${p.packageType}) -> ${match.name}`);
  } else {
    console.log(`[O-NO] ${p.id} (${p.name} / ${p.packageType})`);
  }
});

console.log('\n--- REFINED NONGSHIM MATCHES ---');
prods.filter(p => p.manufacturer === '농심').forEach(p => {
  const match = findBestMatch(p, nongshim, '농심');
  if (match) {
    nCount++;
    console.log(`[N-OK] ${p.id} (${p.name} / ${p.packageType}) -> ${match.name}`);
  } else {
    console.log(`[N-NO] ${p.id} (${p.name} / ${p.packageType})`);
  }
});

console.log(`\nOttogi Matched: ${oCount} / 41`);
console.log(`Nongshim Matched: ${nCount} / 48`);
