const https = require('https');
const querystring = require('querystring');

function postAjax(params) {
  return new Promise((resolve) => {
    const postData = querystring.stringify(params);
    const req = https.request('https://www.otokimall.com/front/product/product_list.ajax', {
      method: 'POST',
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        // Parse HTML result to extract products and images
        // <img src="...cdn.otokimall.com..." alt="..."
        const imgs = [...body.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi)];
        const prdNames = [...body.matchAll(/class="prd-name"[^>]*>([\s\S]*?)<\/a>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
        resolve({
          status: res.statusCode,
          length: body.length,
          imgs: imgs.map(m => ({ src: m[1], alt: m[2] })),
          prdNames
        });
      });
    });
    req.on('error', e => resolve({ error: e.message }));
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('Testing scate=16 (봉지라면)...');
  const r16 = await postAjax({ scate: 16, pageSize: 80, page: 1, type: 'search' });
  console.log('r16 status:', r16.status, 'length:', r16.length, 'imgs:', r16.imgs.length, 'prds:', r16.prdNames.length);
  console.log('Sample r16 products:', r16.prdNames.slice(0, 10));
  console.log('Sample r16 images:', r16.imgs.slice(0, 10));

  console.log('\nTesting scate=17 (컵라면)...');
  const r17 = await postAjax({ scate: 17, pageSize: 80, page: 1, type: 'search' });
  console.log('r17 status:', r17.status, 'length:', r17.length, 'imgs:', r17.imgs.length, 'prds:', r17.prdNames.length);
  console.log('Sample r17 products:', r17.prdNames.slice(0, 10));
  console.log('Sample r17 images:', r17.imgs.slice(0, 10));
}

run();
