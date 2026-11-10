const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, {
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ url, status: res.statusCode, data }));
    }).on('error', e => resolve({ url, error: e.message }));
  });
}

async function testOttogi() {
  // Let's test ottogi.co.kr product page
  const res = await fetch('https://www.ottogi.co.kr/product/product_list.asp?page=1&h_cd=1');
  console.log('ottogi.co.kr product_list status:', res.status, 'length:', res.data ? res.data.length : 0);
  if (res.data) {
    const imgs = [...res.data.matchAll(/<img[^>]+src="([^"]*(?:product|goods|upload)[^"]*)"[^>]*alt="([^"]*)"/gi)];
    console.log('Images with alt on ottogi.co.kr:', imgs.slice(0, 20).map(m => ({ src: m[1], alt: m[2] })));
  }

  // Also test samyangfoods.com
  const samyang = await fetch('https://www.samyangfoods.com/kor/brand/index.do');
  console.log('samyangfoods status:', samyang.status, 'length:', samyang.data ? samyang.data.length : 0);
  if (samyang.data) {
    const imgs = [...samyang.data.matchAll(/<img[^>]+src="([^"]*(?:upload|product|brand)[^"]*)"[^>]*alt="([^"]*)"/gi)];
    console.log('Images with alt on samyangfoods.com:', imgs.slice(0, 20).map(m => ({ src: m[1], alt: m[2] })));
  }
}

testOttogi();
