const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const targetDir = "C:\\Users\\kimwo\\.gemini\\antigravity\\brain\\dd0bf1ef-262d-4557-ac43-e949e220d38c";

const shots = [
  { name: 'page_genealogy_desktop.png', url: 'http://localhost:4173/', w: 1280, h: 900 },
  { name: 'page_genealogy_mobile.png', url: 'http://localhost:4173/', w: 390, h: 844 },
  { name: 'page_lab.png', url: 'http://localhost:4173/lab', w: 1280, h: 950 },
  { name: 'page_ranking.png', url: 'http://localhost:4173/ranking', w: 1280, h: 950 },
  { name: 'page_encyclopedia.png', url: 'http://localhost:4173/encyclopedia', w: 1280, h: 950 }
];

shots.forEach((s, idx) => {
  const tmpOut = `C:\\Users\\kimwo\\shot_${idx}.png`;
  const tmpProfile = `C:\\Users\\kimwo\\AppData\\Local\\Temp\\chrome_shot_${Date.now()}_${idx}`;
  const cmd = `"${chrome}" --headless=new --disable-gpu --user-data-dir="${tmpProfile}" --window-size=${s.w},${s.h} --screenshot="${tmpOut}" ${s.url}`;
  console.log(`Taking ${s.name} from ${s.url}...`);
  try {
    execSync(cmd, { timeout: 45000 });
    if (fs.existsSync(tmpOut)) {
      fs.copyFileSync(tmpOut, path.join(targetDir, s.name));
      console.log(`Successfully saved ${s.name} (${fs.statSync(tmpOut).size} bytes)`);
      fs.unlinkSync(tmpOut);
    }
  } catch (e) {
    console.error(`Error taking ${s.name}:`, e.message);
  }
});
console.log('ALL SCREENSHOTS COMPLETE!');
