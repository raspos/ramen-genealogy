const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/images/products');
const files = fs.readdirSync(dir);

const matches = files.filter(f => /teum|koko|bibim|paldo/i.test(f));
console.log('Matches:', matches);
