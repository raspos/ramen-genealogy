const fs = require('fs');
const path = require('path');

// Extract all products from files
const files = [
  'nongshim.ts',
  'samyang.ts',
  'ottogi.ts',
  'paldo.ts',
  'pulmuone_harim.ts',
  'convenience_pb.ts',
  'historical.ts'
];

const dir = path.join(__dirname, '../src/data/products');
const allProducts = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  // Match id: '...', name: '...', manufacturer: '...', brand: '...'
  const idRegex = /id:\s*'([^']+)'/g;
  const nameRegex = /name:\s*'([^']+)'/g;
  const mfgRegex = /manufacturer:\s*'([^']+)'/g;
  const brandRegex = /brand:\s*'([^']+)'/g;
  const pkgRegex = /packageType:\s*'([^']+)'/g;
  const bgRegex = /bg:\s*'([^']+)'/g;
  const textRegex = /text:\s*'([^']+)'/g;

  // Let's parse objects by regex
  const objRegex = /\{[\s\S]*?id:\s*'([^']+)',[\s\S]*?name:\s*'([^']+)',[\s\S]*?manufacturer:\s*'([^']+)'[\s\S]*?packageType:\s*'([^']+)'[\s\S]*?bg:\s*'([^']+)',\s*text:\s*'([^']+)'[\s\S]*?\}/g;
  
  let match;
  while ((match = objRegex.exec(content)) !== null) {
    allProducts.push({
      file,
      id: match[1],
      name: match[2],
      manufacturer: match[3],
      packageType: match[4],
      bg: match[5],
      text: match[6]
    });
  }
}

console.log('Total extracted:', allProducts.length);
fs.writeFileSync(path.join(__dirname, 'all_products_meta.json'), JSON.stringify(allProducts, null, 2));
