import type { RamenProduct, TastePreferences, TasteMatchResult } from '../types/ramen';

export function matchRamenToPreferences(
  preferences: TastePreferences,
  dataset: RamenProduct[]
): TasteMatchResult[] {
  // Only recommend active products unless specified
  const pool = dataset.filter((p) => p.isActive);

  const scoredList: TasteMatchResult[] = pool.map((product) => {
    let score = 50; // 기본 점수
    const matchReasons: string[] = [];

    // 1. 국물 및 조리 스타일 (가중치 25점)
    if (preferences.brothPreference && preferences.brothPreference !== 'ANY') {
      if (product.productType === preferences.brothPreference) {
        score += 25;
        matchReasons.push(`선호하는 ${getBrothStyleLabel(preferences.brothPreference)} 스타일`);
      } else {
        score -= 20;
      }
    } else {
      score += 15;
    }

    // 2. 맵기 선호도 (가중치 25점)
    if (preferences.spicinessLevel && preferences.spicinessLevel !== 'ANY') {
      const grade = product.spiciness.spicinessGrade;
      const pref = preferences.spicinessLevel;

      if (
        (pref === 'MILD' && grade <= 1) ||
        (pref === 'MEDIUM' && grade === 2) ||
        (pref === 'HOT' && grade === 3) ||
        (pref === 'EXTREME' && grade >= 4)
      ) {
        score += 25;
        matchReasons.push(`원하시는 맵기 단계(${getSpicinessLabel(pref)})와 완벽 일치`);
      } else if (
        (pref === 'MILD' && grade === 2) ||
        (pref === 'MEDIUM' && (grade === 1 || grade === 3)) ||
        (pref === 'HOT' && (grade === 2 || grade === 4)) ||
        (pref === 'EXTREME' && grade === 3)
      ) {
        score += 10;
      } else {
        score -= 15;
      }
    } else {
      score += 15;
    }

    // 3. 주요 풍미 (가중치 20점)
    if (preferences.flavorFocus && preferences.flavorFocus !== 'ANY') {
      const bType = product.brothType;
      const fFocus = preferences.flavorFocus;

      const isMatch =
        (fFocus === 'BEEF' && (bType === 'BEEF' || bType === 'PORK_BONE')) ||
        (fFocus === 'SEAFOOD' && bType === 'SEAFOOD') ||
        (fFocus === 'CHEESE' && (bType === 'CHEESE' || bType === 'CHEESE_CREAM')) ||
        (fFocus === 'JJAJANG' && (bType === 'JJAJANG' || bType === 'DRY_JJAJANG')) ||
        (fFocus === 'VEG_CHICKEN' && (bType === 'CHICKEN' || bType === 'VEGETABLE' || bType === 'MISO_SOY'));

      if (isMatch) {
        score += 20;
        matchReasons.push(`${getFlavorFocusLabel(fFocus)} 베이스 풍미 만족`);
      } else {
        score -= 10;
      }
    } else {
      score += 10;
    }

    // 4. 면발 스타일 (가중치 15점)
    if (preferences.noodleStyle && preferences.noodleStyle !== 'ANY') {
      const nType = product.noodleType;
      const nPref = preferences.noodleStyle;

      const isNoodleMatch =
        (nPref === 'THICK' && (nType === 'THICK' || nType === 'KALGUKSU')) ||
        (nPref === 'STANDARD' && nType === 'STANDARD') ||
        (nPref === 'THIN' && nType === 'THIN') ||
        (nPref === 'NON_FRIED' && nType === 'NON_FRIED') ||
        (nPref === 'GLASS_RICE' && (nType === 'GLASS_NOODLE' || nType === 'RICE' || nType === 'NAENGMYEON'));

      if (isNoodleMatch) {
        score += 15;
        matchReasons.push(`${getNoodleLabel(nPref)} 면발 구성`);
      } else {
        score -= 5;
      }
    } else {
      score += 8;
    }

    // 5. 건강 지향 (칼로리 / 나트륨) (가중치 10점)
    if (preferences.healthFocus === 'LOW_CALORIE') {
      if (product.nutrition.caloriesKcal <= 400) {
        score += 15;
        matchReasons.push(`가벼운 열량(${product.nutrition.caloriesKcal}kcal) 충족`);
      } else {
        score -= 10;
      }
    } else if (preferences.healthFocus === 'LOW_SODIUM') {
      if (product.nutrition.sodiumMg <= 1350) {
        score += 15;
        matchReasons.push(`나트륨 저감(${product.nutrition.sodiumMg}mg) 안심 설계`);
      } else {
        score -= 10;
      }
    }

    // 6. 조리 시간 (가중치 10점)
    if (preferences.cookTimePreference === 'FAST') {
      if (product.cooking.cookTimeSec <= 180) {
        score += 12;
        matchReasons.push(`3분 이내 빠른 조리(${Math.floor(product.cooking.cookTimeSec / 60)}분)`);
      }
    } else if (preferences.cookTimePreference === 'STANDARD') {
      if (product.cooking.cookTimeSec >= 240) {
        score += 10;
        matchReasons.push(`정석 조리 시간(${Math.floor(product.cooking.cookTimeSec / 60)}분)`);
      }
    }

    // 점수 보정 (60% ~ 99% 구간으로 자연스럽게 매핑)
    const finalPercentage = Math.min(99, Math.max(55, Math.round(score)));

    // 대표 한 줄 이유 생성
    const fitSummary = matchReasons.length > 0 
      ? matchReasons.slice(0, 2).join(' · ')
      : `${product.brand} 고유의 시그니처 밸런스`;

    return {
      product,
      matchPercentage: finalPercentage,
      matchReasons,
      fitSummary,
    };
  });

  // 점수 내림차순 정렬 후 상위 5개 선정
  scoredList.sort((a, b) => b.matchPercentage - a.matchPercentage);
  return scoredList.slice(0, 5);
}

function getBrothStyleLabel(val: string): string {
  switch (val) {
    case 'SOUP': return '뜨끈한 국물';
    case 'STIR_FRY': return '자작한 볶음';
    case 'BIBIM': return '매콤달콤 비빔';
    case 'COLD': return '시원한 냉라면';
    default: return '전체';
  }
}

function getSpicinessLabel(val: string): string {
  switch (val) {
    case 'MILD': return '순한맛';
    case 'MEDIUM': return '신라면급 보통';
    case 'HOT': return '열라면급 칼칼함';
    case 'EXTREME': return '불닭급 이상 극한';
    default: return '전체';
  }
}

function getFlavorFocusLabel(val: string): string {
  switch (val) {
    case 'BEEF': return '소고기·사골 진국';
    case 'SEAFOOD': return '시원한 해물';
    case 'CHEESE': return '고소한 치즈크림';
    case 'JJAJANG': return '정통 춘장 짜장';
    case 'VEG_CHICKEN': return '깔끔한 채소·닭육수';
    default: return '다양한 맛';
  }
}

function getNoodleLabel(val: string): string {
  switch (val) {
    case 'THICK': return '굵고 쫄깃한';
    case 'STANDARD': return '대중적인 보통';
    case 'THIN': return '얇고 부드러운';
    case 'NON_FRIED': return '튀기지 않은 건면';
    case 'GLASS_RICE': return '가벼운 당면·쌀면';
    default: return '선호';
  }
}
