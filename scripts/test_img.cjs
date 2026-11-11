const http = require('http');

http.get('http://localhost:4173/ramen-genealogy/images/products/samyang-1963-original-10won.png', res => {
  console.log('Image status:', res.statusCode, 'Content-Length:', res.headers['content-length']);
});
