const fs = require('fs');
const path = require('path');

const tsContent = fs.readFileSync(path.join(__dirname, '../src/data/ramenDataset.ts'), 'utf8');

// Match id, name, manufacturer, imageUrl
const items = [];
const regex = /id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*brand:\s*'([^']+)',\s*manufacturer:\s*'([^']+)',[\s\S]*?imageUrl:\s*'([^']+)'/g;

let m;
while ((m = regex.exec(tsContent)) !== null) {
  items.push({
    id: m[1],
    name: m[2],
    brand: m[3],
    manufacturer: m[4],
    imageUrl: m[5]
  });
}

console.log('Total items parsed:', items.length);

const byMfr = {};
items.forEach(it => {
  byMfr[it.manufacturer] = (byMfr[it.manufacturer] || 0) + 1;
});
console.log('By manufacturer:', byMfr);
