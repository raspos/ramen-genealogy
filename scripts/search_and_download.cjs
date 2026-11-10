const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 RamenApp/2.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function download(url, dest) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 RamenApp/2.0' } }, res => {
      if (res.statusCode !== 200) return resolve(false);
      const f = fs.createWriteStream(dest);
      res.pipe(f);
      f.on('finish', () => f.close(() => resolve(true)));
    }).on('error', () => resolve(false));
  });
}

async function searchAndDownload(query, targetId) {
  const destJpg = path.join(outDir, `${targetId}.jpg`);
  if (fs.existsSync(destJpg)) return true;

  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`;
  const res = await fetchJson(url);
  if (!res || !res.products || res.products.length === 0) return false;

  for (const p of res.products) {
    const img = p.image_front_url || p.image_url;
    if (img && (img.endsWith('.jpg') || img.endsWith('.png') || img.includes('/images/products/'))) {
      const ok = await download(img, destJpg);
      if (ok) {
        console.log(`[SUCCESS] ${targetId} downloaded from ${img}`);
        return true;
      }
    }
  }
  return false;
}

async function main() {
  const queries = [
    // Samyang
    { id: 'buldak', q: 'samyang buldak hot chicken' },
    { id: 'carbo-buldak', q: 'samyang carbo buldak' },
    { id: 'cheese-buldak', q: 'samyang cheese buldak' },
    { id: 'samyang-ramen', q: 'samyang ramen original' },
    { id: 'samyang-spicy', q: 'samyang spicy ramen' },
    { id: 'nagasaki-jjamppong', q: 'samyang nagasaki' },
    { id: 'rose-buldak', q: 'samyang rose buldak' },
    { id: 'haek-buldak', q: 'samyang 2x spicy buldak' },
    { id: 'yakisoba-buldak', q: 'samyang yakisoba buldak' },
    { id: 'habanero-lime-buldak', q: 'samyang habanero lime' },
    { id: 'four-cheese-buldak', q: 'samyang 4 cheese buldak' },

    // Ottogi
    { id: 'yeol-ramyun', q: 'ottogi yeul ramen' },
    { id: 'chamkkae', q: 'ottogi sesame ramen' },
    { id: 'snack-myeon', q: 'ottogi snack ramen' },
    { id: 'jin-jjamppong', q: 'ottogi jin jjambbong' },
    { id: 'jin-jjajang', q: 'ottogi jin jjajang' },
    { id: 'odongtong', q: 'ottogi odongtong' },
    { id: 'ottogi-spaghetti', q: 'ottogi spaghetti ramen' },
    { id: 'beef-seaweed-ramen', q: 'ottogi seaweed ramen' },
    { id: 'cup-noodle-spicy', q: 'ottogi cup noodle' },

    // Paldo
    { id: 'paldo-bibim', q: 'paldo bibim men' },
    { id: 'teumsae-bbalggyettok', q: 'paldo teumsae' },
    { id: 'kkokko-myeon', q: 'paldo kokomen' },
    { id: 'namja-ramen', q: 'paldo namja' },
    { id: 'paldo-doshirak', q: 'paldo doshirak' },
    { id: 'ilpum-jjajang', q: 'paldo ilpum jjajang' },
    { id: 'ilpum-seafood', q: 'paldo seafood noodle' },

    // Pulmuone / Harim
    { id: 'pulmuone-hongmyeon', q: 'pulmuone hongmyeon' },
    { id: 'pulmuone-baekmyeon', q: 'pulmuone baekmyeon' },
    { id: 'pulmuone-jeongmyeon', q: 'pulmuone jeongmyeon' },
    { id: 'harim-artisan-spicy', q: 'the misik artisan' },
    { id: 'harim-artisan-mild', q: 'the misik artisan mild' },

    // Convenience PBs
    { id: 'gs25-omori-kimchi', q: 'omori kimchi jjigae ramen' },
    { id: 'gs25-gonghwachun-jjamppong', q: 'gonghwachun' },
    { id: 'cu-sokcho-redcrab', q: 'cu ramen' },
    { id: 'emart24-sokpul-ramen', q: 'emart24 ramen' },
    { id: 'seven-gyodong-jjamppong', q: 'gangneung kyodong' }
  ];

  for (const item of queries) {
    await searchAndDownload(item.q, item.id);
  }
}

main();
