const https = require('https');

function check(url) {
  return new Promise((resolve) => {
    https.get(url, {
      rejectUnauthorized: false,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (res) => {
      resolve({ url, status: res.statusCode, location: res.headers.location });
    }).on('error', e => resolve({ url, error: e.message }));
  });
}

async function run() {
  const urls = [
    'https://www.samyangfoods.com/',
    'https://www.samyangfoods.com/kor/index.do',
    'https://www.samyangfoods.com/kor/brand/brand.do',
    'https://samyangroundsquare.com/',
    'https://www.samyangmall.com/'
  ];
  for (const u of urls) {
    const r = await check(u);
    console.log(r);
  }
}

run();
