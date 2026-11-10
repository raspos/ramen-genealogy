const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/products');
const allMeta = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_products_meta.json'), 'utf8'));

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 RamenResearch/2.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
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

// Map korean brand names to search queries that OpenFoodFacts or public databases have
const SEARCH_ALIASES = {
  'jin-spicy': ['ottogi jin ramen spicy', 'jin ramen hot', 'ottogi jin ramen'],
  'jin-mild': ['ottogi jin ramen mild', 'jin ramen mild'],
  'jin-cup-spicy': ['ottogi jin ramen cup', 'jin ramen hot cup'],
  'jin-cup-mild': ['ottogi jin ramen mild cup'],
  'jin-big-cup-spicy': ['ottogi jin ramen bowl'],
  'jin-jjamppong': ['ottogi jin jjambbong', 'jin jjambbong', 'jin jjamppong'],
  'jin-jjamppong-cup': ['ottogi jin jjambbong bowl', 'jin jjamppong cup'],
  'jin-jjajang': ['ottogi jin jjajang', 'jin jjajang'],
  'odongtong': ['ottogi odontong', 'odongtong'],
  'ottogi-spaghetti': ['ottogi spaghetti', 'ottogi spaghetti ramen'],
  'beef-seaweed-ramen': ['ottogi seaweed ramen', 'ottogi miyeok'],
  'cup-noodle-spicy': ['ottogi cup noodle', 'cup noodle spicy'],
  'cup-noodle-udong': ['ottogi cup noodle udon'],
  'cup-noodle-rose': ['ottogi cup noodle rose'],
  'cup-noodle-jjambbong': ['ottogi cup noodle jjambbong'],
  'ramen-sari': ['ottogi ramen sari', 'ramen sari'],
  'yeol-cup': ['ottogi yeul bowl', 'yeul ramen cup', 'yeol ramen cup'],
  'chamkkae-cup': ['ottogi sesame bowl', 'sesame ramen cup'],

  // Nongshim remaining
  'shin-dry': ['nongshim shin ramyun non-frying', 'shin light'],
  'shin-black-sabal': ['nongshim shin black bowl', 'shin ramyun black cup'],
  'shin-toomba-big-cup': ['nongshim toomba cup', 'shin toomba'],
  'neoguri-mild': ['nongshim mild neoguri', 'neoguri mild'],
  'angry-neoguri': ['nongshim angry neoguri', 'angry rtari'],
  'neoguri-big-cup': ['nongshim neoguri bowl', 'neoguri cup'],
  'chapagetti-spicy': ['nongshim spicy chapagetti', 'sichuan chapagetti'],
  'the-black-chapagetti': ['nongshim the black chapagetti', 'chapagetti the black'],
  'chapagetti-big-cup': ['nongshim chapagetti bowl', 'chapagetti bowl'],
  'chapagetti-cup': ['nongshim chapagetti cup', 'chapagetti beombok'],
  'soonha-anseongtangmyeon': ['soonha anseongtangmyeon', 'anseongtangmyeon mild'],
  'yukgaejang-big-sabal': ['nongshim yukgaejang bowl'],
  'yukgaejang-bag': ['nongshim yukgaejang bag', 'yukgaejang ramen'],
  'myeolchi-kalguksu-sabal': ['nongshim myeolchi bowl', 'myeolchi kalguksu cup'],
  'sarigomtang-cup': ['nongshim sarigomtang cup', 'sarigomtang bowl'],
  'ojingeo-jjamppong-big-cup': ['nongshim squid champong cup', 'ojingeo jjamppong cup'],
  'twiggim-udong': ['nongshim tempura udon', 'tempura udon cup', 'nongshim twigim udon'],
  'baehongdong-bibim': ['nongshim baehongdong', 'baehongdong'],
  'baehongdong-chal-jjol': ['nongshim baehongdong jjolmyeon'],
  'salad-noodle': ['nongshim salad noodle'],
  'pasta-rang': ['nongshim pastarang'],
  'chal-bibimmyeon': ['nongshim chal bibim myun'],

  // Samyang remaining
  'cheese-buldak': ['samyang cheese buldak', 'cheese hot chicken'],
  'samyang-1963': ['samyang ramen original 1963', 'samyang 1963'],
  'jjajang-buldak': ['samyang jjajang buldak', 'buldak jjajang'],
  'creamy-carbo-buldak': ['samyang creamy carbo buldak', 'cream carbonara buldak'],
  'four-cheese-buldak': ['samyang 4 cheese buldak', '4 cheese hot chicken'],
  'ganjjambbong': ['samyang ganjjambbong', 'ganjjambbong'],
  'ganjjambbong-big-cup': ['samyang ganjjambbong bowl'],
  'map-tang-black': ['samyang maptang black pepper', 'samyang maptang'],
  'map-tang-garlic': ['samyang maptang garlic', 'maptang'],
  'map-tang-cheongyang': ['samyang maptang cheongyang', 'maptang'],

  // Paldo remaining
  'teumsae-cup': ['paldo teumsae cup', 'teumsae bowl'],
  'ilpum-jjajang': ['paldo ilpum jjajang', 'ilpum chajang'],
  'bibim-jjol-men': ['paldo bibim jjolmyeon'],
  'udong-wang-ttukkeong': ['paldo udong wangttukkeong', 'udong wang ttukkeong'],

  // Pulmuone / Harim
  'pulmuone-hongmyeon': ['pulmuone hong myeon', 'pulmuone hongmyeon', 'pulmuone ramen'],
  'pulmuone-baekmyeon': ['pulmuone baek myeon', 'pulmuone baekmyeon'],
  'pulmuone-jeongmyeon': ['pulmuone jeong myeon', 'pulmuone jeongmyeon'],
  'pulmuone-donkotsu': ['pulmuone tonkotsu ramen', 'pulmuone ramen'],
  'pulmuone-flower-crab': ['pulmuone crab ramen', 'pulmuone kkotge'],
  'harim-artisan-spicy': ['the misik artisan spicy', 'harim artisan ramen', 'harim the misik'],
  'harim-artisan-mild': ['the misik artisan mild', 'harim the misik'],
  'harim-champions-jjajang': ['the misik jjajang', 'harim jjajang'],
  'harim-bibimmyeon': ['the misik bibimmyeon', 'harim bibim'],

  // Convenience PB
  'gs25-omori-kimchi': ['omori kimchi jjigae ramen', 'omori kimchi', 'gs25 omori'],
  'gs25-omori-budae': ['omori budae jjigae ramen', 'gs25 budae'],
  'gs25-teumsae-omori': ['teumsae omori kimchi', 'gs25 teumsae'],
  'cu-sokcho-redcrab': ['cu sokcho red crab', 'sokcho red crab ramen'],
  'cu-cheongyang-ramen': ['cu cheongyang ramen', 'heyroo cheongyang'],
  'emart24-sokpul-ramen': ['emart24 sokpul ramen', 'sokpul ramen'],
  'seven-daepa-ramen': ['seven eleven daepa ramen', 'seven eleven ramen'],
  'seven-gangneung-jjambbong': ['gangneung jjamppong suntofu', 'seven eleven jjamppong']
};

async function searchProduct(terms) {
  for (const term of terms) {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(term)}&search_simple=1&action=process&json=1&page_size=5`;
    const res = await fetchJson(url);
    if (res && res.products && res.products.length > 0) {
      for (const p of res.products) {
        const img = p.image_front_url || p.image_url;
        if (img && (img.endsWith('.jpg') || img.endsWith('.png') || img.includes('/images/products/'))) {
          return img;
        }
      }
    }
  }
  return null;
}

async function main() {
  const missing = allMeta.filter(m => !fs.existsSync(path.join(outDir, `${m.id}.jpg`)));
  console.log(`Remaining products to fetch: ${missing.length}`);

  let successCount = 0;
  for (const item of missing) {
    const queries = SEARCH_ALIASES[item.id] || [
      `${item.manufacturer} ${item.name}`,
      item.name,
      `${item.brand} ramen`
    ];

    const imgUrl = await searchProduct(queries);
    if (imgUrl) {
      const dest = path.join(outDir, `${item.id}.jpg`);
      const ok = await downloadImage(imgUrl, dest);
      if (ok) {
        successCount++;
        console.log(`[OK] ${item.id} (${item.name}) -> ${fs.statSync(dest).size} bytes`);
      }
    } else {
      console.log(`[NOT FOUND] ${item.id} (${item.name})`);
    }
  }

  console.log(`Done! Newly downloaded: ${successCount}`);
}

main();
