const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/products');

function download(url, dest) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, rejectUnauthorized: false }, (res) => {
      const s = fs.createWriteStream(dest);
      res.pipe(s);
      s.on('finish', () => {
        s.close();
        resolve(fs.statSync(dest).size);
      });
    }).on('error', e => resolve(0));
  });
}

async function run() {
  console.log('Downloading official 1963 vintage packages from samyang1963.com...');
  const s1 = await download('https://www.samyang1963.com/static/img/hs_item01.png', path.join(outDir, 'samyang-1963-original-10won.png'));
  console.log('1963 original 10-won package downloaded:', s1, 'bytes');

  const s2 = await download('https://www.samyang1963.com/static/img/first_lt_img.png', path.join(outDir, 'samyang-1963-vintage-photo.png'));
  console.log('1963 vintage photo downloaded:', s2, 'bytes');

  // Copy to samyang-chicken-1963.png and samyang-1963-heritage.png
  fs.copyFileSync(path.join(outDir, 'samyang-1963-original-10won.png'), path.join(outDir, 'samyang-chicken-1963.png'));
  fs.copyFileSync(path.join(outDir, 'samyang-1963-vintage-photo.png'), path.join(outDir, 'samyang-ramen-1963-origin.png'));
  console.log('Copied to target filenames.');
}

run();
