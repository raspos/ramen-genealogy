const fs = require('fs');

const NEW_COORDINATES = {
  'samyang-chicken-1963': { x: 100, y: 460 },

  // --- 소고기 얼큰계 (辛牛派) & 극초매운계 (極辛派) ---
  'anseongtangmyeon': { x: 330, y: 310 },
  'yukgaejang-sabal': { x: 330, y: 220 },
  'shin-ramyun': { x: 570, y: 290 },
  'jin-ramen-spicy': { x: 570, y: 400 },
  'shin-non-frying': { x: 1050, y: 290 },
  'shin-the-red': { x: 1280, y: 260 },
  'yeol-ramyun': { x: 810, y: 170 },
  'teumsae-bbalggyettok': { x: 1050, y: 170 },
  'ma-yeol': { x: 1280, y: 170 },

  // --- 사골·곰탕계 (骨湯派) ---
  'sari-gomtang': { x: 570, y: 510 },
  'snack-myeon': { x: 810, y: 510 },

  // --- 하얀 국물 반란계 (白湯叛亂派) ---
  'kkokko-myeon': { x: 1050, y: 400 },
  'nagasaki-jjamppong': { x: 1050, y: 490 },

  // --- 해물 시원계 (海鮮派) ---
  'neoguri': { x: 330, y: 620 },
  'ojingeo-jjamppong': { x: 810, y: 620 },
  'myeolchi-kalguksu': { x: 810, y: 710 },
  'jin-jjamppong': { x: 1280, y: 620 },

  // --- 비탕파: 춘장 짜장계 (炸醬派) ---
  'chapagetti': { x: 330, y: 800 },
  'spicy-chapagetti': { x: 810, y: 800 },

  // --- 비탕파: 화마 매운볶음계 (火魔派) & 퓨전계 (融合派) ---
  'buldak-original': { x: 1050, y: 780 },
  'carbo-buldak': { x: 1280, y: 730 },
  'shin-toomba': { x: 1280, y: 820 },

  // --- 비탕파: 냉비빔계 (冷排派) ---
  'paldo-bibim': { x: 330, y: 920 },
  'baehongdong': { x: 1280, y: 920 },
};

let content = fs.readFileSync('src/data/historicalGenealogyData.ts', 'utf8');

// For each node ID, update canvasX and canvasY
Object.entries(NEW_COORDINATES).forEach(([id, coords]) => {
  const nodeRegex = new RegExp(`id:\\s*['"]${id}['"][\\s\\S]*?canvasX:\\s*\\d+[\\s\\S]*?canvasY:\\s*\\d+`, 'm');
  const match = content.match(nodeRegex);
  if (match) {
    let replaced = match[0]
      .replace(/canvasX:\s*\d+/, `canvasX: ${coords.x}`)
      .replace(/canvasY:\s*\d+/, `canvasY: ${coords.y}`);
    content = content.replace(match[0], replaced);
    console.log(`Updated coordinates for ${id}: (${coords.x}, ${coords.y})`);
  } else {
    console.warn(`Could not match node ${id}`);
  }
});

fs.writeFileSync('src/data/historicalGenealogyData.ts', content, 'utf8');
console.log('Finished updating node coordinates!');
