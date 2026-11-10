const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/images/products');

// 1. Delete all 21720 byte false positive Maruchan images
const files = fs.readdirSync(dir);
let deletedCount = 0;
for (const file of files) {
  if (file.endsWith('.jpg')) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.size === 21720) {
      fs.unlinkSync(full);
      deletedCount++;
      console.log(`Deleted false 21720 byte file: ${file}`);
    }
  }
}
console.log(`Deleted ${deletedCount} false images.`);

// 2. Map existing high-res official files to alternate ID names if needed
const aliasCopies = [
  { from: 'mu-pama.jpg', to: 'mupama.jpg' },
  { from: 'shin-cup.jpg', to: 'shin-ramyun-cup-small.jpg' },
  { from: 'neoguri-cup.jpg', to: 'neoguri-cup-big.jpg' },
  { from: 'ojingeo-jjamppong.jpg', to: 'ojingeo-jjamppong-cup.jpg' },
  { from: 'sarigomtang.jpg', to: 'sari-gomtang.jpg' },
  { from: 'buldak.jpg', to: 'samyang-buldak.jpg' },
  { from: 'paldo-doshirak.jpg', to: 'doshirak.jpg' },
  { from: 'yeol-ramyun.jpg', to: 'yeol-ramen.jpg' },
  { from: 'snack-myeon.jpg', to: 'snack-ramen.jpg' },
  { from: 'chamkkae.jpg', to: 'sesame-ramen.jpg' }
];

for (const alias of aliasCopies) {
  const fromPath = path.join(dir, alias.from);
  const toPath = path.join(dir, alias.to);
  if (fs.existsSync(fromPath) && !fs.existsSync(toPath)) {
    fs.copyFileSync(fromPath, toPath);
    console.log(`Aliased ${alias.from} -> ${alias.to}`);
  }
}
