const https = require('https');

function fetchCategory(catId) {
  return new Promise((resolve) => {
    https.get(`https://www.otokimall.com/front/product/category/${catId}`, {
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        // Look for cdn.otokimall.com images and product names
        const imgMatches = [...body.matchAll(/src="([^"]*cdn\.otokimall\.com[^"]*)"[^>]*alt="([^"]*)"/gi)];
        const dataProdMatches = [...body.matchAll(/<img[^>]+src="([^"]*cdn\.otokimall\.com\/data\/product[^"]*)"/gi)];
        
        // Also look for any JSON product objects in scripts
        const jsonMatches = [...body.matchAll(/"PROD_NAME":"([^"]+)","IMG_PATH":"([^"]+)","IMG_NAME":"([^"]+)"/gi)];

        resolve({
          catId,
          status: res.statusCode,
          imgCount: imgMatches.length,
          productsWithAlt: imgMatches.map(m => ({ src: m[1], alt: m[2] })),
          directProductImages: dataProdMatches.map(m => m[1]),
          jsonProducts: jsonMatches.map(m => ({ name: m[1], img: `https://cdn.otokimall.com/data/product${m[2]}/${m[3]}` }))
        });
      });
    }).on('error', e => resolve({ catId, error: e.message }));
  });
}

async function run() {
  for (const cat of [1, 16, 17]) {
    const r = await fetchCategory(cat);
    console.log(`=== Category ${cat} ===`);
    console.log('JSON products found:', r.jsonProducts.length);
    if (r.jsonProducts.length > 0) {
      console.log('Sample JSON products:', r.jsonProducts.slice(0, 15));
    }
    console.log('Direct product images found:', r.directProductImages.length);
    console.log('Products with alt:', r.productsWithAlt.slice(0, 10));
  }
}

run();
