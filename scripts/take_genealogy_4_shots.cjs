const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const targetDir = "C:\\Users\\kimwo\\.gemini\\antigravity\\brain\\dd0bf1ef-262d-4557-ac43-e949e220d38c";

const shots = [
  { name: 'page_genealogy_4_desktop.png', url: 'http://localhost:4173/', w: 1600, h: 1250 },
  { name: 'page_genealogy_desktop.png', url: 'http://localhost:4173/', w: 1440, h: 1100 },
  { name: 'page_genealogy_4_tablet.png', url: 'http://localhost:4173/', w: 1024, h: 1100 },
  { name: 'page_genealogy_4_mobile_chronicle.png', url: 'http://localhost:4173/', w: 390, h: 1000 },
  { name: 'page_genealogy_mobile.png', url: 'http://localhost:4173/', w: 390, h: 844 }
];

shots.forEach((s, idx) => {
  const tmpOut = `C:\\Users\\kimwo\\shot_v4_${idx}.png`;
  const tmpProfile = `C:\\Users\\kimwo\\AppData\\Local\\Temp\\chrome_shot_v4_${Date.now()}_${idx}`;
  const cmd = `"${chrome}" --headless=new --disable-gpu --user-data-dir="${tmpProfile}" --window-size=${s.w},${s.h} --screenshot="${tmpOut}" ${s.url}`;
  console.log(`Taking ${s.name} from ${s.url} (${s.w}x${s.h})...`);
  try {
    execSync(cmd, { timeout: 45000 });
    if (fs.existsSync(tmpOut)) {
      const dest = path.join(targetDir, s.name);
      fs.copyFileSync(tmpOut, dest);
      console.log(`Successfully saved ${s.name} (${fs.statSync(tmpOut).size} bytes)`);
      fs.unlinkSync(tmpOut);
    }
  } catch (e) {
    console.error(`Error taking ${s.name}:`, e.message);
  }
});
console.log('ALL V4 SCREENSHOTS COMPLETE!');
