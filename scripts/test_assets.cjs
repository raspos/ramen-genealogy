const http = require('http');

http.get('http://localhost:4173/ramen-genealogy/', res => {
  console.log('Main HTML Status:', res.statusCode);
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    const jsMatch = html.match(/src="(\/ramen-genealogy\/assets\/[^"]+)"/);
    const cssMatch = html.match(/href="(\/ramen-genealogy\/assets\/[^"]+)"/);
    console.log('JS match:', jsMatch ? jsMatch[1] : null);
    console.log('CSS match:', cssMatch ? cssMatch[1] : null);
    if (jsMatch) {
      http.get('http://localhost:4173' + jsMatch[1], jsRes => {
        console.log('JS Asset status:', jsRes.statusCode);
      });
    }
    if (cssMatch) {
      http.get('http://localhost:4173' + cssMatch[1], cssRes => {
        console.log('CSS Asset status:', cssRes.statusCode);
      });
    }
  });
});
