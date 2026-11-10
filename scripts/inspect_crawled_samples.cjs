const fs = require('fs');
const path = require('path');

const ottogi = JSON.parse(fs.readFileSync(path.join(__dirname, 'crawled_ottogi.json'), 'utf8'));
const nongshim = JSON.parse(fs.readFileSync(path.join(__dirname, 'crawled_nongshim.json'), 'utf8'));

console.log('Ottogi total:', ottogi.length);
console.log('Sample Ottogi:', ottogi.slice(0, 15).map(o => ({ name: o.name, img: o.imgUrl.slice(0, 60) })));

console.log('\nNongshim total:', nongshim.length);
console.log('Sample Nongshim:', nongshim.slice(0, 15).map(n => ({ name: n.name, img: n.imgUrl.slice(0, 60) })));
