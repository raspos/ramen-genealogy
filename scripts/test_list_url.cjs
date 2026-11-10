const https = require('https');

const url = 'https://cdn.otokimall.com/data/product/list/20221125/1775615260107nHmAc.qdss635zk3mq.jpg';

https.get(url, {
  rejectUnauthorized: false,
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
}, (res) => {
  console.log('List URL status:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  console.log('Content-Length:', res.headers['content-length']);
});
