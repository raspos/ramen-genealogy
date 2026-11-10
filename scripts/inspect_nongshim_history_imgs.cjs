const https = require('https');

https.get('https://www.nongshim.com/promotion/event/view?event_idx=417', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const imgs = [...b.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi)].map(m => ({ src: m[1], alt: m[2] }));
    console.log('All images on event page:');
    imgs.forEach(i => console.log(i));

    const imageNongshim = [...b.matchAll(/(https:\/\/image\.nongshim\.com\/[^\s"'>]+)/gi)].map(m => m[1]);
    console.log('image.nongshim.com URLs:', [...new Set(imageNongshim)]);
  });
});
