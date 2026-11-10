const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public/images/products');
const dataDir = path.join(__dirname, '../src/data/products');

// Get all files in publicDir that were downloaded
const files = fs.readdirSync(publicDir);
const downloadedIds = new Map();

files.forEach(f => {
  const ext = path.extname(f);
  const id = path.basename(f, ext);
  const stat = fs.statSync(path.join(publicDir, f));
  if (stat.size > 2000 && (ext === '.jpg' || ext === '.png')) {
    downloadedIds.set(id, { filename: f, size: stat.size });
  }
});

console.log('Valid official images on disk:', downloadedIds.size);

// Target files to update
const tsFiles = ['nongshim.ts', 'ottogi.ts', 'samyang.ts', 'convenience_pb.ts', 'historical.ts', 'paldo.ts'];

let totalUpdated = 0;

for (const tf of tsFiles) {
  const fullPath = path.join(dataDir, tf);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let fileUpdated = 0;

  for (const [id, info] of downloadedIds.entries()) {
    // Check if this file contains this id
    const idPattern = new RegExp(`id:\\s*'${id}'`);
    if (idPattern.test(content)) {
      // Determine source
      let source = '제조사 공식몰';
      if (tf.includes('nongshim')) source = '농심 공식브랜드관';
      else if (tf.includes('ottogi')) source = '오뚜기 공식몰';
      else if (tf.includes('samyang')) source = '삼양식품 공식브랜드관';

      // Replace imageUrl, imageSource, imageStatus for this product block
      const blockRegex = new RegExp(`(id:\\s*'${id}',[\\s\\S]*?)(imageUrl:\\s*'[^']+',?\\s*)(imageSource:\\s*'[^']+',?\\s*)?(imageStatus:\\s*'[^']+',?\\s*)?`, 'g');
      
      content = content.replace(blockRegex, (match, prefix) => {
        fileUpdated++;
        totalUpdated++;
        return `${prefix}imageUrl: '/images/products/${info.filename}',\n    imageSource: '${source}',\n    imageStatus: 'VERIFIED_PHOTO',`;
      });
    }
  }

  if (fileUpdated > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${tf}: ${fileUpdated} products updated with official images.`);
  }
}

console.log(`Total products updated across dataset: ${totalUpdated}`);
