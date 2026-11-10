const https = require('https');

async function testSearch(path) {
  return new Promise((resolve) => {
    https.get(`https://www.otokimall.com${path}`, {
      rejectUnauthorized: false,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        const prodMatches = [...body.matchAll(/cdn\.otokimall\.com\/data\/product[^\s"'>]+/gi)].map(m => m[0]);
        const imgWithAlt = [...body.matchAll(/<img[^>]+src="([^"]*cdn\.otokimall\.com\/data\/product[^"]*)"[^>]*alt="([^"]*)"/gi)];
        resolve({
          path,
          status: res.statusCode,
          length: body.length,
          prodCount: prodMatches.length,
          imgWithAlt: imgWithAlt.map(m => ({ src: m[1], alt: m[2] })),
          uniqueUrls: [...new Set(prodMatches)].slice(0, 10)
        });
      });
    }).on('error', e => resolve({ path, error: e.message }));
  });
}

async function run() {
  const tests = [
    '/front/product/search?keyword=진라면',
    '/front/search?searchWord=진라면',
    '/front/search/search_result?search_word=진라면',
    '/front/product/search_result?searchWord=진라면',
    '/front/product/search_result?keyword=진라면'
  ];

  for (const t of tests) {
    const res = await testSearch(t);
    console.log(`Path: ${res.path} -> Status: ${res.status}, Length: ${res.length}, Images: ${res.prodCount}`);
    if (res.imgWithAlt.length > 0) {
      console.log('Sample images:', res.imgWithAlt.slice(0, 5));
    }
  }
}

run();
