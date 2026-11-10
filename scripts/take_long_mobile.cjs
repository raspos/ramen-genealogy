const { execSync } = require('child_process');
const fs = require('fs');
const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const dest = "C:\\Users\\kimwo\\.gemini\\antigravity\\brain\\dd0bf1ef-262d-4557-ac43-e949e220d38c\\page_genealogy_4_mobile_long.png";
const tmpOut = "C:\\Users\\kimwo\\shot_mob_long.png";

try {
  execSync(`"${chrome}" --headless=new --disable-gpu --window-size=390,1600 --screenshot="${tmpOut}" http://localhost:4173/`, { timeout: 30000 });
  if (fs.existsSync(tmpOut)) {
    fs.copyFileSync(tmpOut, dest);
    fs.unlinkSync(tmpOut);
    console.log('Mobile long screenshot captured successfully!');
  }
} catch (e) {
  console.error(e.message);
}
