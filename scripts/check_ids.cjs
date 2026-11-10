const fs = require('fs');
const c = fs.readFileSync('src/data/historicalGenealogyData.ts', 'utf8');
const ids = [...c.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Total IDs found:', ids.length, ids);
