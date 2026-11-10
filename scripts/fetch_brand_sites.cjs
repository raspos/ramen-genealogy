const https = require('https');
const fs = require('fs');

function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, rejectUnauthorized: false }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) {
          const u = new URL(url);
          loc = u.protocol + '//' + u.hostname + loc;
        }
        return resolve(fetchPage(loc));
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  console.log('Fetching Samyang main...');
  const sHtml = await fetchPage('https://www.samyangfoods.com');
  const sLinks = sHtml.match(/href="([^"]*(?:product|brand)[^"]*)"/gi) || [];
  console.log('Samyang links:', [...new Set(sLinks)].slice(0, 15));

  console.log('Fetching Ottogi product list...');
  const oHtml = await fetchPage('https://www.otoki.com/product/product_list.asp?search_type=1&category=1');
  console.log('Ottogi HTML length:', oHtml.length);
  const oImgs = oHtml.match(/src="([^"]*(?:product|data)[^"]*)"/gi) || [];
  console.log('Ottogi images:', [...new Set(oImgs)].slice(0, 15));
}

run();
