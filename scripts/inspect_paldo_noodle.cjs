const http = require('http');

http.get('http://www.paldofood.co.kr/product/noodle', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode, 'Length:', b.length);
    // Find all product names and images
    const regex = /<img[^>]+src="([^"]*upload[^"]*)"[^>]*alt="([^"]*)"/gi;
    const matches = [...b.matchAll(regex)];
    console.log('Noodle products with alt:', matches.length);
    matches.forEach(m => console.log('Paldo product:', m[2], 'img:', m[1]));

    // Also look for any img in upload
    const allUpload = [...b.matchAll(/src="([^"]*upload[^"]*)"/gi)].map(m => m[1]);
    console.log('All upload imgs:', [...new Set(allUpload)].length);
    [...new Set(allUpload)].slice(0, 15).forEach(u => console.log(u));
  });
});
