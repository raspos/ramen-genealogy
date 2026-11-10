const https = require('https');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    };
    https.get(options, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) loc = 'https://' + u.hostname + loc;
        return resolve(fetchPage(loc));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  console.log('--- Ottogi Mall with rejectUnauthorized: false ---');
  try {
    const html = await fetchPage('https://ottogimall.co.kr/front/product/category?category_id=001001');
    const regex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']+)["']/g;
    let match;
    let count = 0;
    while ((match = regex.exec(html)) !== null) {
      if (match[1].includes('product') || match[1].includes('goods')) {
        count++;
        let img = match[1];
        if (img.startsWith('//')) img = 'https:' + img;
        else if (img.startsWith('/')) img = 'https://ottogimall.co.kr' + img;
        console.log(`[OTTOGI] ${match[2]} => ${img}`);
      }
    }
    console.log('Total Ottogi images:', count);
  } catch (e) {
    console.error('Ottogi err:', e.message);
  }

  console.log('--- Samyang Round Mall ---');
  try {
    const sHtml = await fetchPage('https://samyangroundmall.com/category/%EB%9D%BC%EB%A9%B4/42/');
    const sRegex = /<img[^>]+src=["']([^"']+\/web\/product\/[^"']+)["'][^>]*alt=["']([^"']+)["']/g;
    let match;
    let sCount = 0;
    while ((match = sRegex.exec(sHtml)) !== null) {
      sCount++;
      let img = match[1];
      if (img.startsWith('//')) img = 'https:' + img;
      console.log(`[SAMYANG] ${match[2]} => ${img}`);
    }
    console.log('Total Samyang images:', sCount);
  } catch (e) {
    console.error('Samyang err:', e.message);
  }
}

run();
