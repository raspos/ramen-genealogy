const https = require('https');

https.get('https://www.samyangfoods.com/kor/brand/list.do?searchCateCd1=45', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('Length:', b.length);
    // Find all images
    const allImgs = [...b.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi)];
    console.log('All images:', allImgs.length);
    allImgs.slice(0, 15).forEach(m => console.log('Img:', m[1], 'alt:', m[2]));

    // Search for ajax / json in page
    const scripts = [...b.matchAll(/ajax|json|productList/gi)];
    console.log('Keywords found:', scripts.length);
  });
});
