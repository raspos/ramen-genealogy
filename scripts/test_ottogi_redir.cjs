const https = require('https');

https.get('https://www.ottogi.co.kr/product/product_list.asp', {
  rejectUnauthorized: false
}, (res) => {
  console.log('Location:', res.headers.location);
});
