const fs = require('fs');
const path = require('path');

const meta = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_products_meta.json'), 'utf8'));
const idSet = new Set(meta.map(m => m.id));

const taxonomyFile = fs.readFileSync(path.join(__dirname, '../src/data/factionTaxonomy.ts'), 'utf8');
const repMatches = taxonomyFile.match(/representativeIds:\s*\[([^\]]+)\]/g) || [];

for (const rm of repMatches) {
  const ids = rm.match(/'([^']+)'/g).map(s => s.replace(/'/g, ''));
  for (const id of ids) {
    if (!idSet.has(id)) {
      console.error('TAXONOMY ID NOT FOUND IN DATASET:', id);
    }
  }
}

console.log('Verification finished.');
