const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/images/products');

// 1. If shin-red.jpg exists from Nongshim Mall, copy it to shin-the-red.jpg
if (fs.existsSync(path.join(dir, 'shin-red.jpg'))) {
  fs.copyFileSync(path.join(dir, 'shin-red.jpg'), path.join(dir, 'shin-the-red.jpg'));
  console.log('Replaced shin-the-red.jpg with official Nongshim Mall shin-red.jpg');
}

// 2. Fix chapagetti-the-black
// In Nongshim Mall, 82205 bytes file was 짜파게티 더 블랙
if (fs.existsSync(path.join(dir, 'shin-black.jpg'))) {
  // Check if it's the chapagetti the black image (82205 bytes)
  const stat = fs.statSync(path.join(dir, 'shin-black.jpg'));
  if (stat.size === 82205) {
    fs.copyFileSync(path.join(dir, 'shin-black.jpg'), path.join(dir, 'chapagetti-the-black.jpg'));
    // And delete the false shin-black.jpg so shin-black uses its custom SVG or we fetch real shin black
    fs.unlinkSync(path.join(dir, 'shin-black.jpg'));
    console.log('Moved 82205 byte image to chapagetti-the-black.jpg');
  }
}

// 3. Remove any non-korean / Maruchan false matches
const falseMatches = [
  'shin-black-tofu-kimchi.jpg' // was Maruchan
];

falseMatches.forEach(f => {
  const p = path.join(dir, f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`Removed false match: ${f}`);
  }
});

console.log('Curation complete.');
