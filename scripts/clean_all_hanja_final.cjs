const fs = require('fs');

// 1. FactionQuizModal.tsx
let fqm = fs.readFileSync('src/components/FactionQuizModal.tsx', 'utf8');
fqm = fqm.replace('뜨끈하고 진한 국물 라면 (탕파 湯派)', '뜨끈하고 진한 국물 라면 (국물파)');
fqm = fqm.replace('소스에 비벼 먹거나 볶아낸 비국물 라면 (건파 乾派)', '소스에 비벼 먹거나 볶아낸 비국물 라면 (비국물파)');
fqm = fqm.replace(/[\u4e00-\u9fa5]/g, '');
fs.writeFileSync('src/components/FactionQuizModal.tsx', fqm, 'utf8');

// 2. LineageTree.tsx
let lt = fs.readFileSync('src/components/LineageTree.tsx', 'utf8');
lt = lt.replaceAll('辛라면 천하통일 & 라이벌전', '신라면 천하통일 & 라이벌전');
lt = lt.replaceAll('辛', '신');
fs.writeFileSync('src/components/LineageTree.tsx', lt, 'utf8');

// 3. LabPage.tsx
let lp = fs.readFileSync('src/pages/LabPage.tsx', 'utf8');
lp = lp.replace(/혼잡실험실\(混雜實驗室\)/g, '라면 조합 연구소');
lp = lp.replace(/[\u4e00-\u9fa5]/g, '');
fs.writeFileSync('src/pages/LabPage.tsx', lp, 'utf8');

// 4. historical.ts
let hist = fs.readFileSync('src/data/products/historical.ts', 'utf8');
hist = hist.replace('탕(湯)류', '탕류');
hist = hist.replace('청보 열(熱)라면', '청보 열라면');
fs.writeFileSync('src/data/products/historical.ts', hist, 'utf8');

// 5. factionTaxonomy.ts
let ft = fs.readFileSync('src/data/factionTaxonomy.ts', 'utf8');
ft = ft.replace(/hanja:\s*'[^']*[\u4e00-\u9fa5][^']*'/g, (m) => {
  return "hanja: '대표 파벌'";
});
fs.writeFileSync('src/data/factionTaxonomy.ts', ft, 'utf8');

// 6. historicalGenealogyData.ts
let hg = fs.readFileSync('src/data/historicalGenealogyData.ts', 'utf8');
hg = hg.replaceAll('시원(始原)', '원조 시작');
hg = hg.replaceAll('분당(分黨)', '분파');
hg = hg.replaceAll('반란(叛亂)', '반란');
hg = hg.replaceAll('辛湯執權期', '소고기 국물 집권기');
hg = hg.replaceAll('辛라면', '신라면');
hg = hg.replaceAll('제3기: 비탕파(非湯派)의 분당과 바다의 독립', '제3기: 비국물 라면의 등장과 해물 라면의 독립');
hg = hg.replaceAll('分黨創設期', '분파 창설기');
hg = hg.replaceAll('多極分化期', '다양화 전성기');
hg = hg.replaceAll('白湯叛亂期', '하얀국물 반란기');
hg = hg.replaceAll('現代復興期', '글로벌 현대 부흥기');
hg = hg.replaceAll('비탕파(非湯派) 양대 세력의 정립', '비국물 라면 양대 세력의 정립');
hg = hg.replaceAll('하얀 국물의 난 (白湯의 亂)', '하얀 국물의 난');
hg = hg.replaceAll('불닭 화마(火魔)의 강림과 비국물 대세화', '불닭 화마의 강림과 비국물 대세화');
hg = hg.replaceAll('한자 ‘辛’을 내걸고', '매울 신(辛) 브랜드를 내걸고');
hg = hg.replaceAll("'牛骨派'", "'진한 사골 곰탕파'");
hg = hg.replaceAll("'白湯派'", "'하얀국물 반란파'");
hg = hg.replaceAll('1986 辛라면 집권', '1986 신라면 집권');
hg = hg.replaceAll('2012 화마(火魔) 강림', '2012 불닭 화마 강림');
hg = hg.replaceAll('조종(祖宗)', '뿌리');
hg = hg.replaceAll('종손(宗孫)', '적통 주류');
hg = hg.replaceAll('極辛派', '극초매운맛파');
fs.writeFileSync('src/data/historicalGenealogyData.ts', hg, 'utf8');

console.log('Complete Hanja cleanup script finished!');
