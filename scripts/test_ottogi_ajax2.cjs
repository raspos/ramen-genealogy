const https = require('https');
const querystring = require('querystring');

function fetchProducts(scate, depthCheck = '2') {
  return new Promise((resolve) => {
    const postData = querystring.stringify({
      type: 'search',
      scate: String(scate),
      sbrand: '0',
      keyword: '',
      keywordRe: '',
      storeNo: '0',
      depthCheck: depthCheck,
      ptype: '0',
      psort: 'pop',
      listBtn: '0',
      pageSize: '100',
      page: '1'
    });

    const req = https.request('https://www.otokimall.com/front/product/product_list.ajax', {
      method: 'POST',
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referer': `https://www.otokimall.com/front/product/category/${scate}`,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        // Extract product name and images
        // <img src="...cdn.otokimall.com..." ... alt="..."
        const regex = /<img[^>]+src="([^"]*cdn\.otokimall\.com\/data\/product[^"]*)"[^>]*alt="([^"]*)"/gi;
        const matches = [...body.matchAll(regex)];
        
        // Also look for prd-name
        const prdRegex = /<p[^>]*class="[^"]*prd-name[^"]*"[^>]*>([\s\S]*?)<\/p>/gi;
        const names = [...body.matchAll(prdRegex)].map(m => m[1].replace(/<[^>]+>/g, '').trim());

        // Also look for any cdn.otokimall.com/data/product/ images
        const allProdImgs = [...body.matchAll(/(https?:\/\/cdn\.otokimall\.com\/data\/product\/[^\s"'>]+)/gi)].map(m => m[1]);

        resolve({
          scate,
          status: res.statusCode,
          length: body.length,
          matches: matches.map(m => ({ src: m[1], alt: m[2] })),
          names,
          allProdImgs: [...new Set(allProdImgs)]
        });
      });
    });

    req.on('error', e => resolve({ scate, error: e.message }));
    req.write(postData);
    req.end();
  });
}

async function run() {
  const r16 = await fetchProducts(16, '2');
  console.log('Category 16 (봉지라면):', r16.status, 'length:', r16.length, 'names:', r16.names.length, 'imgs:', r16.allProdImgs.length);
  if (r16.names.length > 0) {
    console.log('Sample names 16:', r16.names.slice(0, 15));
    console.log('Sample imgs 16:', r16.allProdImgs.slice(0, 15));
  }

  const r17 = await fetchProducts(17, '2');
  console.log('Category 17 (컵라면):', r17.status, 'length:', r17.length, 'names:', r17.names.length, 'imgs:', r17.allProdImgs.length);
  if (r17.names.length > 0) {
    console.log('Sample names 17:', r17.names.slice(0, 15));
    console.log('Sample imgs 17:', r17.allProdImgs.slice(0, 15));
  }
}

run();
