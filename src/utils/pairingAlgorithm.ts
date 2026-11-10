import type { RamenProduct, CombinationScore, MixedRecipe, MixedRecipeStep } from '../types/ramen';
import { OFFICIAL_RECIPES } from '../data/officialRecipes';

export type { CombinationScore };

/**
 * Creates an order-independent unique key for a pair of ramens.
 */
export function getPairKey(aId: string, bId: string): string {
  return [aId, bId].sort().join(':');
}

/**
 * Evaluates taste harmony score (0~100) between two ramen products.
 * Strictly commutative: f(A, B) === f(B, A).
 */
export function evaluateTasteHarmony(a: RamenProduct, b: RamenProduct): { score: number; reason: string } {
  // 1. Broth compatibility matrix
  const brothPair = [a.brothType, b.brothType].sort().join('+');
  let brothSynergy = 78; // baseline

  switch (brothPair) {
    case 'BEEF+SEAFOOD':
      brothSynergy = 94; // 육해공의 만남 (소고기 육수 + 해물 다시마/오징어)
      break;
    case 'DRY_JJAJANG+SEAFOOD':
      brothSynergy = 96; // 짜파구리/해물쟁반짜장 계열 (최고의 시너지)
      break;
    case 'DRY_JJAJANG+DRY_SPICY':
      brothSynergy = 95; // 사천짜장/불닭게티 계열
      break;
    case 'BEEF+PORK_BONE':
      brothSynergy = 93; // 신사리면 사골소고기 곰탕 계열
      break;
    case 'MISO_SOY+SEAFOOD':
      brothSynergy = 92; // 안구리 된장해물 탕면 계열
      break;
    case 'BEEF+MISO_SOY':
      brothSynergy = 90; // 구수한 장국과 얼큰한 소고기
      break;
    case 'BEEF+BEEF':
      brothSynergy = 86; // 안정적인 매운 소고기 탕면
      break;
    case 'CHICKEN+PORK_BONE':
      brothSynergy = 88; // 닭육수와 돈골 백탕의 깊은 감칠맛
      break;
    case 'BEEF+CHICKEN':
      brothSynergy = 85; // 칼칼한 닭육수 + 소고기
      break;
    case 'DRY_SWEET_SOUR+DRY_SWEET_SOUR':
      brothSynergy = 84; // 비빔면 블렌딩
      break;
    case 'DRY_SWEET_SOUR+SOUP':
    case 'BEEF+DRY_SWEET_SOUR':
    case 'DRY_SWEET_SOUR+SEAFOOD':
      brothSynergy = 60; // 찬 비빔면과 뜨거운 국물라면은 조화 난이도 높음
      break;
    default:
      brothSynergy = 78;
  }

  // 2. Spiciness contrast & balance
  // Extreme spiciness + Creamy/Bone broth or mild egg broth produces fantastic balance
  const maxSpiciness = Math.max(a.spiciness.spicinessGrade, b.spiciness.spicinessGrade);
  const minSpiciness = Math.min(a.spiciness.spicinessGrade, b.spiciness.spicinessGrade);
  let spicinessBalance = 80;

  if (maxSpiciness >= 4 && minSpiciness <= 1) {
    spicinessBalance = 94; // 극매운맛 완화 시너지 (e.g. 불닭 + 짜파게티, 불닭 + 사리곰탕)
  } else if (maxSpiciness === 3 && minSpiciness <= 1) {
    spicinessBalance = 90; // 열라면 + 참깨라면
  } else if (maxSpiciness === minSpiciness && maxSpiciness >= 4) {
    spicinessBalance = 72; // 둘 다 극한 매운맛 (초고추 챌린지 성격)
  }

  // 3. Savory (Umami) combined richness
  const avgSavory = (a.flavorProfile.savoryScore + b.flavorProfile.savoryScore) / 2;
  const savoryBonus = Math.round(avgSavory * 3); // 3 ~ 15

  const rawScore = Math.min(99, Math.max(50, Math.round(brothSynergy * 0.55 + spicinessBalance * 0.35 + savoryBonus)));

  let reason = '서로 다른 풍미가 균형을 이루는 조화로운 맛';
  if (brothPair === 'DRY_JJAJANG+SEAFOOD') {
    reason = '진한 춘장 소스와 시원한 해물 감칠맛이 완벽하게 융합되는 황금 조합';
  } else if (brothPair === 'DRY_JJAJANG+DRY_SPICY') {
    reason = '달콤짭조름한 짜장이 화끈한 캡사이신 매운맛을 포근하게 감싸는 중독적 맛';
  } else if (brothPair === 'BEEF+PORK_BONE') {
    reason = '진한 사골의 고소한 바디감이 칼칼한 소고기 고춧가루 국물을 명품 탕면으로 격상';
  } else if (maxSpiciness >= 4 && minSpiciness <= 1) {
    reason = '극강의 매운맛을 순하고 부드러운 육수가 훌륭하게 완화해 주는 상호보완 밸런스';
  } else if (brothPair.includes('DRY_SWEET_SOUR') && (a.productType === 'SOUP' || b.productType === 'SOUP')) {
    reason = '찬 비빔 양념과 뜨거운 국물의 성격 차이로 정밀한 물 조절이 필요한 실험적 조합';
  }

  return { score: rawScore, reason };
}

/**
 * Evaluates cooking compatibility score (0~100).
 * Checks cook time gap, method compatibility (soup vs stir-fry vs bibim), and noodle thickness.
 * Strictly commutative: f(A, B) === f(B, A).
 */
export function evaluateCookCompatibility(a: RamenProduct, b: RamenProduct): { score: number; reason: string } {
  // 1. Time difference penalty
  const timeDiffSec = Math.abs(a.cooking.cookTimeSec - b.cooking.cookTimeSec);
  let timeScore = 95;
  if (timeDiffSec === 0) {
    timeScore = 98; // 완벽 일치
  } else if (timeDiffSec <= 30) {
    timeScore = 92; // 30초 차이 (용이함)
  } else if (timeDiffSec <= 60) {
    timeScore = 84; // 1분 차이
  } else if (timeDiffSec <= 120) {
    timeScore = 70; // 2분 차이 (시간차 투입 필수)
  } else {
    timeScore = 55; // 3분 이상 차이 (e.g. 2분 스낵면 vs 5분 너구리)
  }

  // 2. Cooking method match
  let methodScore = 90;
  if (a.productType === b.productType) {
    if (a.productType === 'SOUP') methodScore = 96;
    else if (a.productType === 'STIR_FRY') methodScore = 95;
    else if (a.productType === 'BIBIM') methodScore = 90;
  } else if (
    (a.productType === 'SOUP' && b.productType === 'STIR_FRY') ||
    (a.productType === 'STIR_FRY' && b.productType === 'SOUP')
  ) {
    methodScore = 86; // 국물+볶음: 물 버리기 공법(짜파구리 방식)으로 검증됨
  } else if (a.productType === 'BIBIM' || b.productType === 'BIBIM') {
    methodScore = 52; // 찬물 헹굼 비빔면과 뜨거운 면/국물의 공존 난이도 높음
  }

  // 3. Noodle type match
  let noodleScore = 88;
  if (a.noodleType === b.noodleType) {
    noodleScore = 96;
  } else if (
    (a.noodleType === 'THICK' && b.noodleType === 'STANDARD') ||
    (a.noodleType === 'STANDARD' && b.noodleType === 'THICK')
  ) {
    noodleScore = 88;
  } else if (
    (a.noodleType === 'THIN' && b.noodleType === 'THICK') ||
    (a.noodleType === 'THICK' && b.noodleType === 'THIN')
  ) {
    noodleScore = 65; // 두께 차이가 커서 익는 속도 차이 주의 필요
  }

  const rawScore = Math.min(99, Math.max(45, Math.round(timeScore * 0.45 + methodScore * 0.40 + noodleScore * 0.15)));

  let reason = '조리 시간과 방식이 무난하게 호환되는 구성';
  if (timeDiffSec === 0 && a.productType === b.productType) {
    reason = `두 제품 모두 조리시간(${Math.floor(a.cooking.cookTimeSec / 60)}분)과 방식이 일치하여 동시 투입 조리가 매우 간편함`;
  } else if (timeDiffSec >= 90) {
    reason = `조리 시간 차이(${timeDiffSec}초)가 크므로 굵은 면을 먼저 끓이고 얇은 면을 시차 투입해야 면발 식감이 유지됨`;
  } else if (
    (a.productType === 'SOUP' && b.productType === 'STIR_FRY') ||
    (a.productType === 'STIR_FRY' && b.productType === 'SOUP')
  ) {
    reason = '국물 면과 볶음 면의 결합으로, 면을 함께 삶은 후 물을 자작하게(8~10스푼) 남기고 비비는 방식 권장';
  }

  return { score: rawScore, reason };
}

/**
 * Evaluates surprise / unexpectedness score (0~100).
 * Rewards cross-brand, cross-category, novel pairings while moderately ranking well-known clichés.
 * Strictly commutative: f(A, B) === f(B, A).
 */
export function evaluateSurprise(a: RamenProduct, b: RamenProduct): { score: number; reason: string } {
  const pairKey = getPairKey(a.id, b.id);
  
  // Clichés that everyone knows have lower novelty surprise
  if (pairKey === 'chapagetti:neoguri') {
    return { score: 62, reason: '전 국민이 아는 공인 국민 레시피 (익숙한 친근함)' };
  }
  if (pairKey === 'buldak:chapagetti') {
    return { score: 68, reason: 'SNS에서 이미 확립된 유명 조합' };
  }

  let surpriseScore = 60; // baseline

  // 1. Cross-manufacturer bonus
  if (a.manufacturer !== b.manufacturer) {
    surpriseScore += 18; // 제조사 라이벌 조합 (e.g. 농심 + 삼양)
  }

  // 2. Different category bonus
  if (a.productType !== b.productType) {
    surpriseScore += 14;
  }

  // 3. Contrasting flavor profile
  const brothPair = [a.brothType, b.brothType].sort().join('+');
  if (brothPair === 'DRY_JJAJANG+SEAFOOD' && pairKey !== 'chapagetti:neoguri') {
    surpriseScore += 16; // 멸치칼국수 + 짜파게티 등 의외의 꿀조합
  } else if (brothPair === 'CHICKEN+PORK_BONE' || brothPair === 'CHICKEN+BEEF') {
    surpriseScore += 12;
  }

  const rawScore = Math.min(98, Math.max(40, surpriseScore));
  let reason = '예상치 못한 두 제품의 만남이 선사하는 신선한 조합';
  if (a.manufacturer !== b.manufacturer) {
    reason = `${a.manufacturer}과 ${b.manufacturer}의 경계를 넘나드는 대담한 라이벌 브랜드 페어링`;
  }
  if (brothPair === 'DRY_JJAJANG+SEAFOOD' && pairKey !== 'chapagetti:neoguri') {
    reason = '멸치 칼국수 해물 육수와 짜장의 뜻밖의 조화가 주는 신선한 충격';
  }

  return { score: rawScore, reason };
}

/**
 * Calculates data reliability score (0~100).
 */
export function evaluateReliability(a: RamenProduct, b: RamenProduct): number {
  const pairKey = getPairKey(a.id, b.id);
  if (OFFICIAL_RECIPES[pairKey]?.recipe.isOfficial) {
    return 98; // 공식 제조사 레시피 보증
  }

  let reliability = 70;
  if (a.spiciness.scovilleProvenance === 'VERIFIED' && b.spiciness.scovilleProvenance === 'VERIFIED') {
    reliability += 15;
  }
  if (a.spiciness.capsaicinProvenance === 'VERIFIED' && b.spiciness.capsaicinProvenance === 'VERIFIED') {
    reliability += 10;
  }
  if (a.officialDataSource && b.officialDataSource) {
    reliability += 5;
  }

  return Math.min(98, reliability);
}

/**
 * Full combination scoring evaluation. Symmetrical for any input order.
 */
export function scoreCombination(a: RamenProduct, b: RamenProduct): CombinationScore {
  const taste = evaluateTasteHarmony(a, b);
  const cook = evaluateCookCompatibility(a, b);
  const surprise = evaluateSurprise(a, b);
  const reliability = evaluateReliability(a, b);

  // Composite calculation: 50% taste, 35% cooking, 15% reliability
  const compositeScore = Math.round(taste.score * 0.50 + cook.score * 0.35 + reliability * 0.15);

  const pairKey = getPairKey(a.id, b.id);
  const official = OFFICIAL_RECIPES[pairKey];

  return {
    ramenA: a,
    ramenB: b,
    compositeScore,
    tasteHarmonyScore: taste.score,
    cookCompatibilityScore: cook.score,
    surpriseScore: surprise.score,
    reliabilityScore: reliability,
    expectedTaste: official?.expectedTaste || taste.reason,
    recommendationHook: official?.recommendationHook || surprise.reason,
    isOfficialRecipe: official ? official.recipe.isOfficial : false,
    tastePredictionType: 'RULE_BASED_PREDICTION',
  };
}

/**
 * Generates an actionable step-by-step mixed recipe.
 * Uses official manufacturer recipe if verified, else synthesizes an experimental recipe.
 */
export function generateMixedRecipe(a: RamenProduct, b: RamenProduct): MixedRecipe {
  const pairKey = getPairKey(a.id, b.id);
  if (OFFICIAL_RECIPES[pairKey]) {
    return OFFICIAL_RECIPES[pairKey].recipe;
  }

  // Synthesize experimental recipe
  const isOneStirOrBibim = a.productType !== 'SOUP' || b.productType !== 'SOUP';
  const bothStirOrBibim = a.productType !== 'SOUP' && b.productType !== 'SOUP';

  // Determine noodle insertion order based on cook time
  const timeA = a.cooking.cookTimeSec;
  const timeB = b.cooking.cookTimeSec;
  const maxTime = Math.max(timeA, timeB);
  const minTime = Math.min(timeA, timeB);
  const timeDiff = maxTime - minTime;
  const firstRamen = timeA >= timeB ? a : b;
  const secondRamen = timeA >= timeB ? b : a;

  let totalWaterMl = 900;
  let cookingMethodType: MixedRecipe['cookingMethodType'] = 'SOUP_SOUP';
  const steps: MixedRecipeStep[] = [];

  if (bothStirOrBibim) {
    totalWaterMl = 1000;
    cookingMethodType = a.productType === 'BIBIM' || b.productType === 'BIBIM' ? 'COLD_MIX' : 'STIR_STIR';
    
    steps.push({
      stepNumber: 1,
      title: '물 끓이기',
      instruction: `물 ${totalWaterMl}ml를 냄비에 붓고 센 불로 끓입니다.`,
      durationSec: 180,
    });

    if (timeDiff >= 30) {
      steps.push({
        stepNumber: 2,
        title: `${firstRamen.name} 면 선투입`,
        instruction: `끓는 물에 조리 시간이 더 긴 [${firstRamen.name}] 면과 후레이크를 먼저 넣고 ${timeDiff}초간 삶습니다.`,
        durationSec: timeDiff,
        tip: `면발 굵기 차이로 인한 익힘 균형을 맞춥니다.`,
      });
      steps.push({
        stepNumber: 3,
        title: `${secondRamen.name} 면 투입 및 삶기`,
        instruction: `이어서 [${secondRamen.name}] 면을 넣고 ${minTime}초간 함께 삶습니다.`,
        durationSec: minTime,
      });
    } else {
      steps.push({
        stepNumber: 2,
        title: '두 면 동시 삶기',
        instruction: `끓는 물에 [${a.name}]과 [${b.name}]의 면과 후레이크를 모두 넣고 ${minTime}초간 삶습니다.`,
        durationSec: minTime,
      });
    }

    if (cookingMethodType === 'COLD_MIX') {
      steps.push({
        stepNumber: steps.length + 1,
        title: '찬물 헹굼 및 물기 제거',
        instruction: '삶아진 면을 찬물(또는 얼음물)에 빠르게 헹구어 면발의 탄력을 살리고 체에 밭쳐 물기를 완전히 뺍니다.',
        durationSec: 45,
      });
      steps.push({
        stepNumber: steps.length + 1,
        title: '비빔 소스 블렌딩',
        instruction: `양쪽 비빔/액상 스프를 넣고 고루 비벼 완성합니다. 기호에 따라 오이나 삶은 달걀을 곁들입니다.`,
        durationSec: 30,
      });
    } else {
      steps.push({
        stepNumber: steps.length + 1,
        title: '물 따라내기 (8~10스푼 남기기)',
        instruction: '물을 약 8~10스푼(약 120ml) 정도만 자작하게 남기고 따라 버립니다.',
        durationSec: 30,
      });
      steps.push({
        stepNumber: steps.length + 1,
        title: '소스 투입 및 30초 볶기',
        instruction: `스프(취향에 맞춰 조절)를 넣고 약불에서 30초간 잘 볶아 윤기나게 비벼냅니다.`,
        durationSec: 30,
      });
    }

  } else if (isOneStirOrBibim) {
    // One is soup, one is stir-fry (Chapaguri style)
    totalWaterMl = 950;
    cookingMethodType = 'SOUP_STIR';

    steps.push({
      stepNumber: 1,
      title: '물 끓이기',
      instruction: `물 ${totalWaterMl}ml를 냄비에 붓고 센 불로 끓입니다.`,
      durationSec: 180,
    });

    if (timeDiff >= 30) {
      steps.push({
        stepNumber: 2,
        title: `${firstRamen.name} 선투입`,
        instruction: `끓는 물에 [${firstRamen.name}] 면과 후레이크를 먼저 넣고 ${timeDiff}초간 끓입니다.`,
        durationSec: timeDiff,
      });
      steps.push({
        stepNumber: 3,
        title: `${secondRamen.name} 투입`,
        instruction: `이어서 [${secondRamen.name}] 면을 넣고 ${minTime}초간 더 끓입니다.`,
        durationSec: minTime,
      });
    } else {
      steps.push({
        stepNumber: 2,
        title: '두 면 동시 삶기',
        instruction: `끓는 물에 두 라면의 면과 후레이크를 모두 넣고 ${minTime}초간 삶습니다.`,
        durationSec: minTime,
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: '자작하게 물 남기기',
      instruction: '국물 8~10스푼(약 120ml)만 남기고 따라 버립니다.',
      durationSec: 30,
    });
    steps.push({
      stepNumber: steps.length + 1,
      title: '볶음스프 1봉 + 국물스프 0.4봉 비비기',
      instruction: `볶음 라면의 스프는 전량(1.0) 넣고, 국물 라면의 분말스프는 0.4~0.5봉만 넣어 약불에서 30초간 비벼 완성합니다.`,
      durationSec: 30,
      tip: '국물 라면 스프를 다 넣으면 지나치게 짤 수 있으므로 절반 이하 투입이 핵심입니다.',
    });

  } else {
    // Both are soup ramens!
    totalWaterMl = Math.round((a.cooking.waterMl + b.cooking.waterMl) * 0.85); // 2-pack reduced water
    cookingMethodType = 'SOUP_SOUP';

    steps.push({
      stepNumber: 1,
      title: '물 끓이기 (황금 비율 감수)',
      instruction: `물 ${totalWaterMl}ml를 냄비에 붓고 센 불로 끓입니다. (두 라면 정량 단순 합산보다 15% 줄여야 국물 바디감이 최상으로 유지됩니다)`,
      durationSec: 180,
    });

    if (timeDiff >= 30) {
      steps.push({
        stepNumber: 2,
        title: `${firstRamen.name} 면 & 스프 일부 선투입`,
        instruction: `물이 끓으면 [${firstRamen.name}] 면과 스프 0.8봉을 먼저 넣고 ${timeDiff}초간 끓입니다.`,
        durationSec: timeDiff,
      });
      steps.push({
        stepNumber: 3,
        title: `${secondRamen.name} 면 및 스프 투입`,
        instruction: `[${secondRamen.name}] 면과 스프 0.8봉, 건더기를 모두 넣고 ${minTime}초간 보글보글 끓여 완성합니다.`,
        durationSec: minTime,
      });
    } else {
      steps.push({
        stepNumber: 2,
        title: '면과 스프 동시 투입',
        instruction: `물이 끓으면 두 라면의 면, 분말스프(각각 0.8봉 권장), 후레이크를 모두 넣고 ${minTime}초간 끓입니다.`,
        durationSec: minTime,
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: '그릇 담아내기',
      instruction: '면발을 집게로 들었다 놓으며 공기를 통하게 한 뒤 그릇에 담아 완성합니다.',
    });
  }

  return {
    title: `${a.name} × ${b.name} 알고리즘 실험 레시피`,
    isOfficial: false,
    officialSource: '라면의 계보 알고리즘 조리 최적화 모델 (실험 레시피)',
    totalWaterMl,
    totalCookTimeSec: maxTime,
    recommendedSoupRatioA: isOneStirOrBibim && a.productType === 'SOUP' ? 0.4 : 0.8,
    recommendedSoupRatioB: isOneStirOrBibim && b.productType === 'SOUP' ? 0.4 : 0.8,
    cookingMethodType,
    steps,
    tasteDescription: `${a.name}의 풍미와 ${b.name}의 매력이 균형을 이루도록 설계된 조리법`,
  };
}

/**
 * Real-time dynamic nutrition calculator based on user-adjusted soup ratios and servings.
 * Handles unseparated sodium with explicit estimation warnings.
 */
export interface CalculatedNutrition {
  totalCalories: number;
  totalSodiumMg: number;
  totalCarbsG: number;
  totalProteinG: number;
  totalFatG: number;
  perServingCalories: number;
  perServingSodiumMg: number;
  perServingCarbsG: number;
  perServingProteinG: number;
  perServingFatG: number;
  sodiumWarningNote: string;
  isSodiumSeparated: boolean;
  estimatedSpicinessShu: number | null;
  spicinessDescription: string;
}

export function calculateDynamicNutrition(
  a: RamenProduct,
  b: RamenProduct,
  soupRatioA: number, // 0.0 ~ 1.0
  soupRatioB: number, // 0.0 ~ 1.0
  servings: number = 2
): CalculatedNutrition {
  // Noodle vs Soup contribution assumptions when unseparated:
  // Calories: noodle ~85%, soup ~15%
  // Sodium: noodle ~42%, soup ~58%
  // Fat: noodle ~90%, soup ~10%
  // Carbs: noodle ~95%, soup ~5%
  // Protein: noodle ~80%, soup ~20%

  const noodleA_cal = a.nutrition.caloriesKcal * 0.85;
  const soupA_cal = a.nutrition.caloriesKcal * 0.15 * soupRatioA;
  const noodleB_cal = b.nutrition.caloriesKcal * 0.85;
  const soupB_cal = b.nutrition.caloriesKcal * 0.15 * soupRatioB;
  const totalCalories = Math.round(noodleA_cal + soupA_cal + noodleB_cal + soupB_cal);

  // Sodium calculation
  const noodleA_sod = a.nutrition.sodiumMg * 0.42;
  const soupA_sod = a.nutrition.sodiumMg * 0.58 * soupRatioA;
  const noodleB_sod = b.nutrition.sodiumMg * 0.42;
  const soupB_sod = b.nutrition.sodiumMg * 0.58 * soupRatioB;
  const totalSodiumMg = Math.round(noodleA_sod + soupA_sod + noodleB_sod + soupB_sod);

  const totalCarbsG = Math.round(a.nutrition.carbsG + b.nutrition.carbsG);
  const totalProteinG = Math.round(a.nutrition.proteinG + b.nutrition.proteinG);
  const totalFatG = Math.round(a.nutrition.fatG + b.nutrition.fatG);

  const validServings = Math.max(1, servings);
  const perServingCalories = Math.round(totalCalories / validServings);
  const perServingSodiumMg = Math.round(totalSodiumMg / validServings);
  const perServingCarbsG = Math.round(totalCarbsG / validServings);
  const perServingProteinG = Math.round(totalProteinG / validServings);
  const perServingFatG = Math.round(totalFatG / validServings);

  const isSodiumSeparated = a.nutrition.sodiumSeparated && b.nutrition.sodiumSeparated;
  const sodiumWarningNote = isSodiumSeparated
    ? '공식 검증된 면/스프 분리 나트륨 데이터 기준'
    : '※ 제조사 공식 영양성분표상 면/스프별 나트륨 분리 데이터가 미제공되어, 스프 비율 조절 시 나트륨 감소량은 스프 평균 기여율(58%) 기반 추정치(ESTIMATED)입니다.';

  // Spiciness estimation: only provide number if BOTH products have VERIFIED Scoville data
  let estimatedSpicinessShu: number | null = null;
  let spicinessDescription = '자료 없음 (공식 검증 데이터 부족)';

  if (
    a.spiciness.scovilleProvenance === 'VERIFIED' &&
    b.spiciness.scovilleProvenance === 'VERIFIED' &&
    a.spiciness.scovilleShu !== null &&
    b.spiciness.scovilleShu !== null
  ) {
    // Weighted by soup ratios
    const weightA = soupRatioA;
    const weightB = soupRatioB;
    const totalWeight = weightA + weightB;
    if (totalWeight > 0) {
      estimatedSpicinessShu = Math.round(
        (a.spiciness.scovilleShu * weightA + b.spiciness.scovilleShu * weightB) / totalWeight
      );
      spicinessDescription = `예상 스코빌지수 약 ${estimatedSpicinessShu.toLocaleString()} SHU (스프 투입 비율 가중 추정치)`;
    } else {
      estimatedSpicinessShu = 0;
      spicinessDescription = '스프 미투입으로 매운맛 거의 없음';
    }
  }

  return {
    totalCalories,
    totalSodiumMg,
    totalCarbsG,
    totalProteinG,
    totalFatG,
    perServingCalories,
    perServingSodiumMg,
    perServingCarbsG,
    perServingProteinG,
    perServingFatG,
    sodiumWarningNote,
    isSodiumSeparated,
    estimatedSpicinessShu,
    spicinessDescription,
  };
}
