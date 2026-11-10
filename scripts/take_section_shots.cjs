const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const targetDir = "C:\\Users\\kimwo\\.gemini\\antigravity\\brain\\dd0bf1ef-262d-4557-ac43-e949e220d38c";

const tmpOut = 'C:\\Users\\kimwo\\shot_encyclopedia_grid.png';
const tmpProfile = 'C:\\Users\\kimwo\\AppData\\Local\\Temp\\chrome_shot_ency_' + Date.now();
// 1280x4500 will capture down to the encyclopedia shelf
const cmd = `"${chrome}" --headless=new --disable-gpu --user-data-dir="${tmpProfile}" --window-size=1280,4800 --screenshot="${tmpOut}" http://localhost:4173/`;

try {
  execSync(cmd, { timeout: 45000 });
  if (fs.existsSync(tmpOut)) {
    fs.copyFileSync(tmpOut, path.join(targetDir, 'screenshot_encyclopedia_grid.png'));
    console.log('Saved screenshot_encyclopedia_grid.png (' + fs.statSync(tmpOut).size + ' bytes)');
    fs.unlinkSync(tmpOut);
  }
} catch(e) {
  console.error(e.message);
}
