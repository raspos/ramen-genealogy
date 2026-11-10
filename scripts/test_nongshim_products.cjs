const https = require('https');

const brandIds = ['shinramyun', 'neoguri', 'chapagetti', 'ansung', 'mupama', 'kalguksoo', 'gomtang', 'shrimpnoodle', 'zzawang'];

function fetchBrandProducts(brandId) {
  return new Promise((resolve) => {
    const url = `https://brand.nongshim.com/${brandId}/product/index`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Find product images and names
        // Pattern: <img src="https://image.nongshim.com/non/pro/..." alt="..."
        const matches = [...data.matchAll(/<img[^>]+src="(https:\/\/image\.nongshim\.com\/non\/pro\/[^"]+)"[^>]*alt="([^"]*)"/gi)];
        const results = matches.map(m => ({ img: m[1], name: m[2].trim() })).filter(r => r.name.length > 0);
        
        // Also check if there's any product list in JS or HTML
        const proDivs = [...data.matchAll(/<strong[^>]*class="[^"]*tit[^"]*"[^>]*>([^<]+)<\/strong>/gi)];

        resolve({ brandId, status: res.statusCode, products: results, titles: proDivs.map(t => t[1].trim()) });
      });
    }).on('error', (e) => resolve({ brandId, error: e.message }));
  });
}

async function run() {
  for (const b of brandIds) {
    const res = await fetchBrandProducts(b);
    console.log(`Brand: ${res.brandId} (status: ${res.status})`);
    console.log('Products found:', res.products);
  }
}

run();
