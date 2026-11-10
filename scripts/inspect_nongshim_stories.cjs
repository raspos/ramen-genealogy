const https = require('https');

https.get('https://brand.nongshim.com/commons/outoSearchBrand?brandNm=', {
  headers: { 'User-Agent': 'Mozilla/5.0', 'X-Requested-With': 'XMLHttpRequest' }
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const list = JSON.parse(b);
    const noodles = list.filter(item => item.catCd === 'A00');
    console.log(`Found ${noodles.length} noodle brands on Nongshim:`);
    noodles.forEach(n => {
      // Find any images in brandStory
      const storyImgs = [...(n.brandStory || '').matchAll(/src="([^"]+)"/gi)].map(m => m[1]);
      if (storyImgs.length > 0 || n.mainImg2) {
        console.log(`[${n.brandId}] ${n.koNm}:`);
        console.log('  mainImg2:', n.mainImg2 ? `https://image.nongshim.com/brand/info/${n.mainImg2}` : 'none');
        console.log('  storyImgs:', storyImgs);
      }
    });
  });
});
