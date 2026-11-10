const fs = require('fs');
const path = require('path');

const ottogi = JSON.parse(fs.readFileSync(path.join(__dirname, 'crawled_ottogi.json'), 'utf8'));
const nongshim = JSON.parse(fs.readFileSync(path.join(__dirname, 'crawled_nongshim.json'), 'utf8'));

// Read dataset products
function getDatasetProducts() {
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
        brand: m[4],
        packageType: m[5],
        file: f
      });
    }
  }
  return prods;
}

const allProds = getDatasetProducts();
console.log('Total dataset products:', allProds.length);

// Clean string for fuzzy matching
function clean(str) {
  return str.toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
}

// Check Ottogi matches
const ottogiProds = allProds.filter(p => p.manufacturer === '오뚜기');
console.log('\n--- OTTOGI MATCHING (' + ottogiProds.length + ' products) ---');
let ottogiMatches = 0;
for (const p of ottogiProds) {
  const pClean = clean(p.name);
  const isCup = p.packageType === 'CUP' || p.packageType === 'BOWL';
  
  // Find candidates
  let best = null;
  for (const o of ottogi) {
    const oClean = clean(o.name);
    const oIsCup = o.package === 'CUP' || oClean.includes('컵') || oClean.includes('용기') || oClean.includes('사발');
    
    // Check package alignment
    if (isCup !== oIsCup) continue;

    if (oClean.includes(pClean) || pClean.includes(oClean.replace(/gx[0-9]+/g, ''))) {
      best = o;
      break;
    }
  }
  if (!best) {
    // Try without package alignment if not found
    for (const o of ottogi) {
      const oClean = clean(o.name);
      if (oClean.includes(pClean)) {
        best = o;
        break;
      }
    }
  }

  if (best) {
    ottogiMatches++;
    console.log(`[MATCH] ${p.name} (${p.packageType}) -> ${best.name}`);
  } else {
    console.log(`[MISS ] ${p.name} (${p.packageType})`);
  }
}
console.log(`Ottogi matched: ${ottogiMatches}/${ottogiProds.length}`);

// Check Nongshim matches
const nongshimProds = allProds.filter(p => p.manufacturer === '농심');
console.log('\n--- NONGSHIM MATCHING (' + nongshimProds.length + ' products) ---');
let nongMatches = 0;
for (const p of nongshimProds) {
  const pClean = clean(p.name);
  const isCup = p.packageType === 'CUP' || p.packageType === 'BOWL';

  let best = null;
  for (const n of nongshim) {
    const nClean = clean(n.name);
    const nIsCup = nClean.includes('컵') || nClean.includes('사발');

    if (isCup !== nIsCup) continue;

    if (nClean.includes(pClean) || pClean.includes(nClean)) {
      best = n;
      break;
    }
  }
  if (!best) {
    for (const n of nongshim) {
      const nClean = clean(n.name);
      if (nClean.includes(pClean)) {
        best = n;
        break;
      }
    }
  }

  if (best) {
    nongMatches++;
    console.log(`[MATCH] ${p.name} (${p.packageType}) -> ${best.name}`);
  } else {
    console.log(`[MISS ] ${p.name} (${p.packageType})`);
  }
}
console.log(`Nongshim matched: ${nongMatches}/${nongshimProds.length}`);
