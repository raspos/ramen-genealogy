const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/products');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const allMeta = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_products_meta.json'), 'utf8'));

// Helper to adjust color hex brightness
function adjustColor(hex, percent) {
  let num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00FF) + percent;
  let b = (num & 0x0000FF) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function generateBagSvg(item) {
  const bg = item.bg || '#dc2626';
  const text = item.text || '#ffffff';
  const bgLight = adjustColor(bg, 35);
  const bgDark = adjustColor(bg, -40);
  const isDarkText = text.toLowerCase() === '#ffffff' || text.toLowerCase() === '#fff' ? false : true;
  const badgeBg = isDarkText ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)';

  // Shorten name if too long for main packaging graphic
  let displayName = item.name;
  let subName = '';
  if (displayName.length > 8) {
    const parts = displayName.split(' ');
    if (parts.length > 1) {
      displayName = parts[0];
      subName = parts.slice(1).join(' ');
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="100%" height="100%">
  <defs>
    <!-- Background Gradient for Pillowy Volume -->
    <linearGradient id="bagGrad_${item.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgLight}" />
      <stop offset="40%" stop-color="${bg}" />
      <stop offset="100%" stop-color="${bgDark}" />
    </linearGradient>

    <!-- Cellophane Crimp Texture -->
    <pattern id="crimpPattern" width="10" height="20" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
      <line x1="5" y1="0" x2="5" y2="20" stroke="rgba(0,0,0,0.25)" stroke-width="2"/>
    </pattern>

    <!-- Gloss Sheen Overlay -->
    <linearGradient id="glossGrad" x1="0%" y1="0%" x2="100%" y2="70%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.45)" />
      <stop offset="35%" stop-color="rgba(255,255,255,0.08)" />
      <stop offset="60%" stop-color="rgba(255,255,255,0)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0.2)" />
    </linearGradient>

    <!-- Drop Shadow -->
    <filter id="packShadow" x="-10%" y="-10%" width="120%" height="125%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Drop Shadow & Bag Outer Silhouette -->
  <g filter="url(#packShadow)">
    <rect x="25" y="20" width="270" height="360" rx="22" fill="url(#bagGrad_${item.id})" />
  </g>

  <!-- Top Crimp Seal -->
  <rect x="25" y="20" width="270" height="24" rx="4" fill="url(#crimpPattern)" />
  <line x1="25" y1="44" x2="295" y2="44" stroke="rgba(0,0,0,0.3)" stroke-width="1.5" />
  <line x1="25" y1="20" x2="295" y2="20" stroke="rgba(255,255,255,0.4)" stroke-width="1" />

  <!-- Bottom Crimp Seal -->
  <rect x="25" y="356" width="270" height="24" rx="4" fill="url(#crimpPattern)" />
  <line x1="25" y1="356" x2="295" y2="356" stroke="rgba(0,0,0,0.3)" stroke-width="1.5" />

  <!-- Gloss Reflection Sheen Path -->
  <path d="M 25 44 L 295 44 L 295 180 Q 160 140 25 240 Z" fill="url(#glossGrad)" />

  <!-- Manufacturer Top Pill -->
  <g transform="translate(45, 58)">
    <rect x="0" y="0" width="80" height="22" rx="11" fill="${badgeBg}" stroke="rgba(255,255,255,0.4)" stroke-width="1" />
    <text x="40" y="15" fill="${text}" font-family="'Pretendard', sans-serif" font-size="11" font-weight="900" text-anchor="middle">
      ${item.manufacturer}
    </text>
  </g>

  <!-- Packaging Badge (봉지 / KOREAN RAMEN) -->
  <g transform="translate(205, 58)">
    <rect x="0" y="0" width="70" height="22" rx="11" fill="rgba(0,0,0,0.3)" />
    <text x="35" y="15" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="10" font-weight="800" text-anchor="middle">
      정통 봉지면
    </text>
  </g>

  <!-- Central Steaming Ramen Graphic Illustration -->
  <g transform="translate(160, 195)">
    <!-- Plate / Bowl Outer Ring -->
    <ellipse cx="0" cy="30" rx="75" ry="38" fill="rgba(0,0,0,0.25)" />
    <ellipse cx="0" cy="24" rx="72" ry="34" fill="#ffffff" />
    <ellipse cx="0" cy="22" rx="66" ry="30" fill="${bgDark}" opacity="0.85" />
    <!-- Rich Broth Surface -->
    <ellipse cx="0" cy="22" rx="62" ry="26" fill="#e11d48" opacity="0.9" />
    <!-- Golden Noodle Swirls -->
    <path d="M -40 20 Q -20 10 0 22 Q 20 34 40 20" stroke="#fde047" stroke-width="5" fill="none" stroke-linecap="round" />
    <path d="M -30 26 Q -10 38 10 24 Q 30 14 36 28" stroke="#fef08a" stroke-width="4.5" fill="none" stroke-linecap="round" />
    <path d="M -20 14 Q 0 28 25 18" stroke="#facc15" stroke-width="4" fill="none" stroke-linecap="round" />
    <!-- Garnish (Egg / Scallion / Chili) -->
    <ellipse cx="12" cy="18" rx="8" ry="6" fill="#ffffff" />
    <ellipse cx="12" cy="18" rx="4" ry="3" fill="#f59e0b" />
    <rect x="-18" y="14" width="7" height="3" rx="1.5" fill="#16a34a" />
    <rect x="-12" y="24" width="6" height="3" rx="1.5" fill="#16a34a" />
    <!-- Steam wisps -->
    <path d="M -20 -5 Q -25 -20 -15 -32" stroke="rgba(255,255,255,0.6)" stroke-width="3" fill="none" stroke-linecap="round" />
    <path d="M 0 -10 Q 5 -25 -2 -38" stroke="rgba(255,255,255,0.7)" stroke-width="3.5" fill="none" stroke-linecap="round" />
    <path d="M 20 -6 Q 15 -22 25 -34" stroke="rgba(255,255,255,0.6)" stroke-width="3" fill="none" stroke-linecap="round" />
  </g>

  <!-- Large Bold Korean Product Title -->
  <text x="160" y="${subName ? '118' : '128'}" fill="${text}" font-family="'Pretendard', 'Malgun Gothic', sans-serif" font-size="${displayName.length > 5 ? '26' : '32'}" font-weight="900" text-anchor="middle" letter-spacing="-1" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.5));">
    ${displayName}
  </text>
  ${subName ? `<text x="160" y="146" fill="${text}" opacity="0.9" font-family="'Pretendard', sans-serif" font-size="15" font-weight="800" text-anchor="middle" letter-spacing="-0.5" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">${subName}</text>` : ''}

  <!-- Authentic Bottom Footer Bar -->
  <g transform="translate(45, 305)">
    <rect x="0" y="0" width="230" height="38" rx="12" fill="rgba(0,0,0,0.45)" backdrop-filter="blur(4px)" />
    <!-- Spicy Pepper & Calories Badge -->
    <circle cx="24" cy="19" r="10" fill="#dc2626" />
    <text x="24" y="23" fill="#ffffff" font-size="12" text-anchor="middle">🌶️</text>
    <text x="44" y="24" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900">
      K-RAMEN ARCHIVE
    </text>
    <text x="215" y="24" fill="#facc15" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="end">
      오리지널
    </text>
  </g>
</svg>`;
}

function generateCupSvg(item) {
  const bg = item.bg || '#dc2626';
  const text = item.text || '#ffffff';
  const bgLight = adjustColor(bg, 40);
  const bgDark = adjustColor(bg, -40);
  const isBowl = item.packageType === 'BOWL';

  let displayName = item.name;
  if (displayName.length > 9) {
    displayName = displayName.substring(0, 9);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="100%" height="100%">
  <defs>
    <linearGradient id="cupBodyGrad_${item.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${bgDark}" />
      <stop offset="25%" stop-color="${bgLight}" />
      <stop offset="60%" stop-color="${bg}" />
      <stop offset="100%" stop-color="${bgDark}" />
    </linearGradient>

    <linearGradient id="lidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="60%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>

    <filter id="cupShadow" x="-10%" y="-10%" width="120%" height="125%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#000000" flood-opacity="0.32"/>
    </filter>
  </defs>

  <!-- Cup 3D Body -->
  <g filter="url(#cupShadow)">
    ${isBowl ? `
      <!-- Broad Bowl Silhouette -->
      <path d="M 40 100 L 70 340 Q 160 365 250 340 L 280 100 Z" fill="url(#cupBodyGrad_${item.id})" />
      <ellipse cx="160" cy="340" rx="90" ry="16" fill="${bgDark}" />
    ` : `
      <!-- Tapered Cup Silhouette -->
      <path d="M 60 110 L 85 345 Q 160 365 235 345 L 260 110 Z" fill="url(#cupBodyGrad_${item.id})" />
      <ellipse cx="160" cy="345" rx="75" ry="15" fill="${bgDark}" />
    `}
  </g>

  <!-- Body Color Ribbon & Manufacturer Badge -->
  <g transform="translate(160, 155)">
    <rect x="-60" y="0" width="120" height="24" rx="12" fill="rgba(0,0,0,0.3)" />
    <text x="0" y="16" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="12" font-weight="900" text-anchor="middle">
      ${item.manufacturer}
    </text>
  </g>

  <!-- Large Product Title on Cup -->
  <text x="160" y="215" fill="${text}" font-family="'Pretendard', 'Malgun Gothic', sans-serif" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="-1" style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.5));">
    ${displayName}
  </text>

  <!-- Instant Cup Ramen Icon Graphic -->
  <g transform="translate(160, 275)">
    <!-- Mini Noodles Bowl Graphic -->
    <ellipse cx="0" cy="15" rx="45" ry="18" fill="rgba(0,0,0,0.25)" />
    <ellipse cx="0" cy="10" rx="42" ry="16" fill="#fef08a" />
    <path d="M -25 8 Q 0 18 25 8" stroke="#ca8a04" stroke-width="3" fill="none" stroke-linecap="round" />
    <circle cx="0" cy="8" r="4" fill="#dc2626" />
    <!-- Steam -->
    <path d="M -10 -4 Q -15 -18 -8 -26" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <path d="M 10 -4 Q 15 -18 8 -26" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" fill="none" stroke-linecap="round" />
  </g>

  <!-- Hot Water 3-min Mark -->
  <text x="160" y="325" fill="${text}" opacity="0.9" font-family="'Pretendard', sans-serif" font-size="11" font-weight="800" text-anchor="middle">
    뜨거운 물 3~4분 완성
  </text>

  <!-- 3D Foil Lid Top Rim -->
  <g transform="translate(160, ${isBowl ? '95' : '105'})">
    <!-- Lid Outer Rim Rim -->
    <ellipse cx="0" cy="0" rx="${isBowl ? '124' : '104'}" ry="${isBowl ? '34' : '26'}" fill="url(#lidGrad)" stroke="#94a3b8" stroke-width="2.5" />
    <ellipse cx="0" cy="-2" rx="${isBowl ? '118' : '98'}" ry="${isBowl ? '30' : '23'}" fill="#ffffff" />
    <!-- Inner Lid Branding -->
    <ellipse cx="0" cy="-2" rx="${isBowl ? '85' : '70'}" ry="${isBowl ? '20' : '16'}" fill="${bg}" opacity="0.9" />
    <text x="0" y="3" fill="${text}" font-family="'Pretendard', sans-serif" font-size="${isBowl ? '14' : '12'}" font-weight="900" text-anchor="middle">
      ${item.manufacturer} · ${isBowl ? '사발면' : '큰컵'}
    </text>
    <!-- Pull Tab (뜯는곳) -->
    <path d="M ${isBowl ? '110' : '90'} -8 Q ${isBowl ? '135' : '115'} -14 ${isBowl ? '130' : '110'} 6 Q ${isBowl ? '115' : '95'} 8 ${isBowl ? '110' : '90'} -8 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5" />
    <text x="${isBowl ? '122' : '102'}" y="-1" fill="#ffffff" font-family="'Pretendard', sans-serif" font-size="8" font-weight="900">
      OPEN
    </text>
  </g>
</svg>`;
}

async function main() {
  console.log('Generating high-fidelity SVG graphics for all products...');
  let svgCount = 0;
  for (const item of allMeta) {
    const isCup = item.packageType === 'CUP_SMALL' || item.packageType === 'CUP_LARGE' || item.packageType === 'BOWL';
    const svgContent = isCup ? generateCupSvg(item) : generateBagSvg(item);
    const dest = path.join(outDir, `${item.id}.svg`);
    fs.writeFileSync(dest, svgContent, 'utf8');
    svgCount++;
  }
  console.log(`Successfully generated ${svgCount} SVG package graphics in ${outDir}`);
}

main();
