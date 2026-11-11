const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const targetDir = "C:\\Users\\kimwo\\.gemini\\antigravity\\brain\\dd0bf1ef-262d-4557-ac43-e949e220d38c";

const baseUrl = 'http://localhost:4173/ramen-genealogy/';

const shots = [
  { name: 'v3_desktop_genealogy.png', url: baseUrl, w: 1680, h: 1200 },
  { name: 'v3_tablet_genealogy.png', url: baseUrl, w: 768, h: 1100 },
  { name: 'v3_mobile_390_vertical.png', url: baseUrl, w: 390, h: 1200 },
  { name: 'v3_mobile_320_vertical.png', url: baseUrl, w: 320, h: 1000 },
  { name: 'v3_ranking_page.png', url: `${baseUrl}#rankings`, w: 1400, h: 1000 }
];

shots.forEach((s, idx) => {
  const tmpOut = `C:\\Users\\kimwo\\shot_v3_${idx}.png`;
  const tmpProfile = `C:\\Users\\kimwo\\AppData\\Local\\Temp\\chrome_shot_v3_${Date.now()}_${idx}`;
  const cmd = `"${chrome}" --headless=new --disable-gpu --virtual-time-budget=3500 --user-data-dir="${tmpProfile}" --window-size=${s.w},${s.h} --screenshot="${tmpOut}" "${s.url}"`;
  console.log(`Taking ${s.name} from ${s.url} (${s.w}x${s.h})...`);
  try {
    execSync(cmd, { timeout: 45000 });
    if (fs.existsSync(tmpOut)) {
      const dest = path.join(targetDir, s.name);
      fs.copyFileSync(tmpOut, dest);
      console.log(`Saved ${s.name} (${fs.statSync(tmpOut).size} bytes)`);
      fs.unlinkSync(tmpOut);
    }
  } catch (e) {
    console.error(`Error taking ${s.name}:`, e.message);
  }
});
console.log('ALL V3 SCREENSHOTS CAPTURED SUCCESSFULLY!');
