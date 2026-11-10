const fs = require('fs');

function fixFile(file) {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (!c.includes('getAssetUrl')) {
    c = "import { getAssetUrl } from '../utils/imageUrl';\n" + c;
    changed = true;
  }

  // target.src
  if (c.includes('target.src = `/images/')) {
    c = c.replace(/target\.src\s*=\s*`\/images\/([^`]+)`/g, 'target.src = getAssetUrl("/images/$1")');
    changed = true;
  }
  // defaultSvg
  if (c.includes('`/images/')) {
    c = c.replace(/`\/images\/([^`]+)`/g, 'getAssetUrl("/images/$1")');
    changed = true;
  }
  if (c.includes("'/images/")) {
    c = c.replace(/'\/images\/([^']+)'/g, 'getAssetUrl("/images/$1")');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, c, 'utf8');
    console.log('Fixed asset URLs in:', file);
  }
}

[
  'src/components/FactionDrawer.tsx',
  'src/components/FactionQuizModal.tsx',
  'src/components/MainVisualMosaic.tsx',
  'src/components/ProductCardVisual.tsx',
  'src/components/ProductDetailModal.tsx',
  'src/pages/RankingPage.tsx'
].forEach(fixFile);

console.log('Component asset URLs fixed!');
