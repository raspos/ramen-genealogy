const https = require('https');
const querystring = require('querystring');

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
    console.log(body.slice(0, 1500));
  });
});
req.write(postData);
req.end();
