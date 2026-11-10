const fs = require('fs');
const path = require('path');

const ts = fs.readFileSync(path.join(__dirname, '../src/data/historicalGenealogyData.ts'), 'utf8');

// Extract all id from LINEAGE_LEGEND_NODES
const idMatches = [...ts.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);
console.log('Total extracted IDs from data:', idMatches.length);

const publicDir = path.join(__dirname, '../public/images/products');

// Check products in publicDir
const files = fs.readdirSync(publicDir);

const nodes = [
  'samyang-chicken-1963',
  'anseongtangmyeon',
  'shin-ramyun',
  'jin-ramen-spicy',
  'yukgaejang-sabal',
  'shin-non-frying',
  'shin-the-red',
  'yeol-ramyun',
  'teumsae-ramen',
  'ma-yeol',
  'neoguri',
  'ojingeo-jjamppong',
  'myeolchi-kalguksu',
  'jin-jjamppong',
  'sari-gomtang',
  'snack-myeon',
  'kokomen',
  'nagasaki-jjamppong',
  'chapagetti',
  'spicy-chapagetti',
  'paldo-bibimmyeon',
  'baehongdong',
  'buldak-original',
  'carbo-buldak',
  'shin-toomba'
];

console.log(`Checking ${nodes.length} legend nodes images:`);
nodes.forEach(id => {
  const match = files.find(f => f.startsWith(id + '.'));
  if (match) {
    const stat = fs.statSync(path.join(publicDir, match));
    console.log(`[OK] ${id} -> ${match} (${stat.size} bytes)`);
  } else {
    console.log(`[MISSING] ${id}`);
  }
});
