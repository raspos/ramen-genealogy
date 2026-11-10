const https = require('https');
const fs = require('fs');

function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, rejectUnauthorized: false }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  // Check pages 1 to 5 for category 1 (ramen)
  for (let page = 1; page <= 5; page++) {
    const url = `https://www.otoki.com/product/product_list.asp?search_type=1&category=1&page=${page}`;
    const html = await fetchPage(url);
    // Let's find patterns like <a ...><img src="..." alt="..."> or title/name
    // Let's regex for list items
    const regex = /<img[^>]+src="(\/pds\/product\/cat_ko\/[^"]+)"[^>]*alt="([^"]*)"/gi;
    let match;
    let count = 0;
    while ((match = regex.exec(html)) !== null) {
      count++;
      console.log(`Page ${page}: [${match[2]}] -> https://www.otoki.com${match[1]}`);
    }
    if (count === 0) {
      // Let's see if alt is somewhere else or in <p class="...">
      const re2 = /src="(\/pds\/product\/cat_ko\/[^"]+)"/gi;
      let m2;
      while ((m2 = re2.exec(html)) !== null) {
        console.log(`Page ${page} img: https://www.otoki.com${m2[1]}`);
      }
      break;
    }
  }
}

run();
