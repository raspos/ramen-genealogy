const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/images/products');
const files = fs.readdirSync(dir);

const matches = files.filter(f => /koko|kkokko|chicken/i.test(f));
console.log('Matches:', matches);
