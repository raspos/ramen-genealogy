const https = require('https');

https.get('https://www.otokimall.com/front/main', {
  rejectUnauthorized: false,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    // Search for all occurrences of PROD_NAME
    const prodMatches = [...body.matchAll(/\{[^{}]*"PROD_NAME"[^{}]*\}/gi)];
    console.log('Product JSON objects found in front/main:', prodMatches.length);
    prodMatches.forEach((m, idx) => {
      try {
        const obj = JSON.parse(m[0]);
        console.log(`[${idx}]`, obj.PROD_NAME, 'img:', `https://cdn.otokimall.com/data/product${obj.IMG_PATH}/${obj.IMG_NAME || obj.IMG_RENAME || obj.IMG_FILE}`);
      } catch (e) {
        console.log(`[${idx}] (raw):`, m[0].slice(0, 150));
      }
    });

    // Also look for any big array of products
    const arrayMatches = [...body.matchAll(/var\s+[a-zA-Z0-9_]*prod[a-zA-Z0-9_]*\s*=\s*(\[[^;]+\]);/gi)];
    console.log('Product arrays found:', arrayMatches.length);
  });
});
