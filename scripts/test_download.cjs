const fs = require('fs');
const path = require('path');
const { fetchUrl, downloadImage, searchOpenFoodFacts, outDir } = require('./get_all_official_images.cjs');

async function testDownload() {
  console.log('Testing image download to:', outDir);
  const testItems = [
    { id: 'shin-ramyun', url: 'https://cafe24img.poxo.com/nsmall2022/web/product/medium/202602/c21d28d05a2369f829df20601a00e0cf.jpg' },
    { id: 'neoguri', url: 'https://cafe24img.poxo.com/nsmall2022/web/product/medium/202610/6c3f92700069514a2f5203ad45e5253c.jpg' },
    { id: 'chapagetti', url: 'https://cafe24img.poxo.com/nsmall2022/web/product/medium/202608/10fffcb7fbe615f893640eb833b1f9ea.jpg' },
    { id: 'anseongtangmyeon', url: 'https://cafe24img.poxo.com/nsmall2022/web/product/medium/202603/a7d7fd4cbd0e78a9766fefc683ac8377.jpg' },
    { id: 'myeolchi-kalguksu', url: 'https://cafe24img.poxo.com/nsmall2022/web/product/medium/202407/9c59d2c94d2ed647449cd781b1464252.jpg' },
    { id: 'yukgaejang-sabal', url: 'https://cafe24img.poxo.com/nsmall2022/web/product/medium/202407/2b3a3160ca4ab42a09c5409162092a94.jpg' }
  ];

  for (const item of testItems) {
    const dest = path.join(outDir, `${item.id}.jpg`);
    try {
      await downloadImage(item.url, dest);
      const stat = fs.statSync(dest);
      console.log(`Downloaded ${item.id}.jpg (${stat.size} bytes)`);
    } catch(e) {
      console.error(`Failed ${item.id}:`, e.message);
    }
  }

  // Also test OpenFoodFacts search
  console.log('Testing OpenFoodFacts for 불닭볶음면...');
  const buldakUrl = await searchOpenFoodFacts('불닭볶음면');
  console.log('Buldak image found:', buldakUrl);
  if (buldakUrl) {
    const dest = path.join(outDir, 'buldak.jpg');
    await downloadImage(buldakUrl, dest);
    console.log(`Downloaded buldak.jpg (${fs.statSync(dest).size} bytes)`);
  }
}

testDownload();
