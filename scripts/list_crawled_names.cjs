const fs = require('fs');
const path = require('path');

const ottogi = JSON.parse(fs.readFileSync(path.join(__dirname, 'crawled_ottogi.json'), 'utf8'));
const nongshim = JSON.parse(fs.readFileSync(path.join(__dirname, 'crawled_nongshim.json'), 'utf8'));

console.log('--- ALL OTTOGI NAMES (' + ottogi.length + ') ---');
console.log([...new Set(ottogi.map(o => o.name))].sort().join('\n'));

console.log('\n--- ALL NONGSHIM NAMES (' + nongshim.length + ') ---');
console.log([...new Set(nongshim.map(n => n.name))].sort().join('\n'));
