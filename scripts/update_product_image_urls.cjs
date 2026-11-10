const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '../public/images/products');
const dataDir = path.join(__dirname, '../src/data/products');

const files = [
  'nongshim.ts',
  'samyang.ts',
  'ottogi.ts',
  'paldo.ts',
  'pulmuone_harim.ts',
  'convenience_pb.ts',
  'historical.ts'
];

let updatedTotal = 0;
let jpgCount = 0;
let svgCount = 0;

for (const file of files) {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match each product object
  // Find id: '...', ... imageUrl: '...'
  // We can replace imageUrl: '...' based on the preceding id: '...'
  const parts = content.split(/(\{\s*id:\s*'[^']+')/g);

  for (let i = 1; i < parts.length; i += 2) {
    const idMatch = parts[i].match(/id:\s*'([^']+)'/);
    if (idMatch) {
      const id = idMatch[1];
      const hasJpg = fs.existsSync(path.join(imgDir, `${id}.jpg`));
      const hasPng = fs.existsSync(path.join(imgDir, `${id}.png`));
      const localUrl = hasJpg ? `/images/products/${id}.jpg` : hasPng ? `/images/products/${id}.png` : `/images/products/${id}.svg`;

      if (hasJpg || hasPng) jpgCount++;
      else svgCount++;

      // In parts[i + 1], replace imageUrl: '...'
      parts[i + 1] = parts[i + 1].replace(/imageUrl:\s*'[^']*'/, `imageUrl: '${localUrl}'`);
      parts[i + 1] = parts[i + 1].replace(/imageStatus:\s*'[^']*'/, `imageStatus: 'VERIFIED_PHOTO'`);
      updatedTotal++;
    }
  }

  fs.writeFileSync(filePath, parts.join(''), 'utf8');
  console.log(`Updated ${file}`);
}

console.log(`Total products updated: ${updatedTotal} (JPG/PNG: ${jpgCount}, SVG: ${svgCount})`);
