const https = require('https');
const querystring = require('querystring');

function inspectHtml() {
  const postData = querystring.stringify({
    type: 'search',
    scate: '16',
    sbrand: '0',
    depthCheck: '2',
    ptype: '0',
    psort: 'pop',
    listBtn: '0',
    pageSize: '10',
    page: '1'
  });

  const req = https.request('https://www.otokimall.com/front/product/product_list.ajax', {
    method: 'POST',
    rejectUnauthorized: false,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Referer': 'https://www.otokimall.com/front/product/category/16',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      // Find each product card in HTML
      const items = [...body.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
      console.log('Li items found:', items.length);
      items.slice(0, 5).forEach((item, idx) => {
        console.log(`\n--- ITEM ${idx} ---`);
        const img = item[1].match(/src="([^"]*cdn\.otokimall\.com\/data\/product[^"]*)"/i);
        const title = item[1].match(/<span[^>]*class="[^"]*name[^"]*"[^>]*>([\s\S]*?)<\/span>/i) ||
                      item[1].match(/<a[^>]*title="([^"]*)"/i) ||
                      item[1].match(/alt="([^"]*)"/i);
        console.log('Img:', img ? img[1] : 'null');
        console.log('Title:', title ? title[1] : 'null');
        console.log('Raw snippet:', item[1].slice(0, 300));
      });
    });
  });
  req.write(postData);
  req.end();
}

inspectHtml();
