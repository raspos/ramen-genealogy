import { RAMEN_DATASET } from './src/data/ramenDataset';
import { getDailyRecommendation } from './src/utils/dailyRecommendation';

const total = RAMEN_DATASET.length;
const bag = RAMEN_DATASET.filter(p => p.packageType === 'BAG').length;
const cupL = RAMEN_DATASET.filter(p => p.packageType === 'CUP_LARGE').length;
const cupS = RAMEN_DATASET.filter(p => p.packageType === 'CUP_SMALL').length;
const bowl = RAMEN_DATASET.filter(p => p.packageType === 'BOWL').length;
const cupsTotal = cupL + cupS + bowl;
const pb = RAMEN_DATASET.filter(p => p.isPB).length;
const discontinued = RAMEN_DATASET.filter(p => !p.isActive).length;
const verifiedPhotos = RAMEN_DATASET.filter(p => p.imageStatus === 'VERIFIED_PHOTO').length;
const archivePhotos = RAMEN_DATASET.filter(p => p.imageStatus === 'ARCHIVE_MATCH').length;

// PB distribution
const gs25 = RAMEN_DATASET.filter(p => p.salesChannel === 'GS25').length;
const cu = RAMEN_DATASET.filter(p => p.salesChannel === 'CU').length;
const emart24 = RAMEN_DATASET.filter(p => p.salesChannel === 'EMART24').length;
const seven = RAMEN_DATASET.filter(p => p.salesChannel === 'SEVEN_ELEVEN').length;

// Manufacturers
const makers: Record<string, number> = {};
RAMEN_DATASET.forEach(p => {
  makers[p.manufacturer] = (makers[p.manufacturer] || 0) + 1;
});

// Rankings
const scovilleVerified = RAMEN_DATASET.filter(p => p.spiciness.scovilleShu !== null)
  .sort((a, b) => (b.spiciness.scovilleShu || 0) - (a.spiciness.scovilleShu || 0));
const maxScoville = scovilleVerified[0];

const sodiumSorted = [...RAMEN_DATASET].sort((a, b) => b.nutrition.sodiumMg - a.nutrition.sodiumMg);
const maxSodium = sodiumSorted[0];
const minSodium = sodiumSorted[sodiumSorted.length - 1];

const calSorted = [...RAMEN_DATASET].sort((a, b) => b.nutrition.caloriesKcal - a.nutrition.caloriesKcal);
const maxCal = calSorted[0];
const minCal = calSorted[calSorted.length - 1];

const cookSorted = [...RAMEN_DATASET].filter(p => p.cooking.cookTimeSec > 0)
  .sort((a, b) => a.cooking.cookTimeSec - b.cooking.cookTimeSec);
const fastestCook = cookSorted[0];

const oldestActive = [...RAMEN_DATASET].filter(p => p.isActive)
  .sort((a, b) => a.releaseYear - b.releaseYear)[0];

// Total possible combos
const activeCount = RAMEN_DATASET.filter(p => p.isActive).length;
const totalCombos = (activeCount * (activeCount - 1)) / 2;

// Today combo
const rec = getDailyRecommendation();

console.log(JSON.stringify({
  total,
  bag,
  cupL,
  cupS,
  bowl,
  cupsTotal,
  pb,
  discontinued,
  verifiedPhotos,
  archivePhotos,
  gs25,
  cu,
  emart24,
  seven,
  makers,
  maxScoville: { name: maxScoville.name, shu: maxScoville.spiciness.scovilleShu },
  maxSodium: { name: maxSodium.name, mg: maxSodium.nutrition.sodiumMg },
  minSodium: { name: minSodium.name, mg: minSodium.nutrition.sodiumMg },
  maxCal: { name: maxCal.name, kcal: maxCal.nutrition.caloriesKcal },
  minCal: { name: minCal.name, kcal: minCal.nutrition.caloriesKcal },
  fastestCook: { name: fastestCook.name, sec: fastestCook.cooking.cookTimeSec },
  oldestActive: { name: oldestActive.name, year: oldestActive.releaseYear },
  activeCount,
  totalCombos,
  recDate: rec.date,
  recA: rec.combination.ramenA.name,
  recB: rec.combination.ramenB.name,
  recScore: rec.combination.compositeScore,
  surpriseScore: rec.combination.surpriseScore,
  tasteHarmonyScore: rec.combination.tasteHarmonyScore,
  cookCompatibilityScore: rec.combination.cookCompatibilityScore,
}, null, 2));
