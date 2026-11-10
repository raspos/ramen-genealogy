const https = require('https');
const querystring = require('querystring');

const postData = querystring.stringify({
  searchCateCd1: '45',
  searchCateCd2: '',
  pageIndex: '1',
  pageUnit: '100'
});

const req = https.request('https://www.samyangfoods.com/kor/brand/ajaxProductList.do', {
  method: 'POST',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'https://www.samyangfoods.com/kor/brand/list.do?searchCateCd1=45',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode, 'Length:', b.length);
    // Find products and images
    const imgs = [...b.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi)];
    console.log('Images found on Samyang:', imgs.length);
    imgs.slice(0, 20).forEach(m => console.log('Img:', m[1], 'alt:', m[2]));
  });
});
req.write(postData);
req.end();
