import { describe, it, expect } from 'vitest';
import { RAMEN_DATASET, RAMEN_MAP } from '../src/data/ramenDataset';
import {
  scoreCombination,
  generateMixedRecipe,
  calculateDynamicNutrition,
} from '../src/utils/pairingAlgorithm';
import {
  getDailyRecommendation,
  offsetDateString,
  getAllCombinations,
} from '../src/utils/dailyRecommendation';

describe('라면 궁합 및 추천 알고리즘 검증 테스트', () => {
  const shin = RAMEN_MAP.get('shin-ramyun')!;
  const chapa = RAMEN_MAP.get('chapagetti')!;
  const neoguri = RAMEN_MAP.get('neoguri')!;
  const snack = RAMEN_MAP.get('snack-myeon')!;
  const yeol = RAMEN_MAP.get('yeol-ramyun')!;
  const chamkkae = RAMEN_MAP.get('chamkkae')!;

  it('1. 두 제품의 선택 순서를 바꿔도 궁합 점수 및 세부 지표가 완전히 동일해야 한다 (대칭성 검증)', () => {
    const scoreAB = scoreCombination(shin, neoguri);
    const scoreBA = scoreCombination(neoguri, shin);

    expect(scoreAB.compositeScore).toBe(scoreBA.compositeScore);
    expect(scoreAB.tasteHarmonyScore).toBe(scoreBA.tasteHarmonyScore);
    expect(scoreAB.cookCompatibilityScore).toBe(scoreBA.cookCompatibilityScore);
    expect(scoreAB.surpriseScore).toBe(scoreBA.surpriseScore);
    expect(scoreAB.reliabilityScore).toBe(scoreBA.reliabilityScore);
  });

  it('2. 조리 시간이 다른 제품(스낵면 2분 vs 너구리 5분)의 경우 시차 투입 단계를 적절히 생성해야 한다', () => {
    const recipe = generateMixedRecipe(snack, neoguri);
    // 300초(5분) vs 120초(2분) -> 180초 시차 투입 필요
    expect(recipe.totalCookTimeSec).toBe(300);
    const staggeredStep = recipe.steps.find((s) => s.title.includes('선투입'));
    expect(staggeredStep).toBeDefined();
    expect(staggeredStep?.durationSec).toBe(180);
    expect(staggeredStep?.instruction).toContain('먼저 넣고 180초간');
  });

  it('3. 데이터가 부족하거나 미확인된 항목에 임의의 허위 수치를 출력하지 않고 자료 없음으로 처리해야 한다', () => {
    // 참깨라면은 공식 스코빌/캡사이신 실측치가 missing 상태임
    const nutritionResult = calculateDynamicNutrition(shin, chamkkae, 1.0, 1.0, 2);
    // 둘 다 실측 스코빌이 있지 않은 경우 임의 추정치 대신 null 처리
    expect(nutritionResult.estimatedSpicinessShu).toBeNull();
    expect(nutritionResult.spicinessDescription).toContain('자료 없음');
  });

  it('4. 영양성분 및 나트륨 동적 계산이 정확하며 면/스프 미분리 제품에 추정치 고지 문구를 포함해야 한다', () => {
    const resultFull = calculateDynamicNutrition(shin, yeol, 1.0, 1.0, 2);
    // 1인분당 칼로리 = (500 + 510) / 2 = 505
    expect(resultFull.perServingCalories).toBe(505);

    // 스프를 0%로 줄였을 때 나트륨이 감소해야 함
    const resultNoSoup = calculateDynamicNutrition(shin, yeol, 0, 0, 2);
    expect(resultNoSoup.totalSodiumMg).toBeLessThan(resultFull.totalSodiumMg);
    // 미분리 제품이므로 경고 문구 포함
    expect(resultNoSoup.sodiumWarningNote).toContain('추정치(ESTIMATED)');
  });

  it('5. 동일한 날짜에 대해 결정적 무작위 알고리즘 결과가 언제나 고정되어야 한다', () => {
    const rec1 = getDailyRecommendation('2026-11-10');
    const rec2 = getDailyRecommendation('2026-11-10');
    expect(rec1.combination.ramenA.id).toBe(rec2.combination.ramenA.id);
    expect(rec1.combination.ramenB.id).toBe(rec2.combination.ramenB.id);
    expect(rec1.combination.compositeScore).toBe(rec2.combination.compositeScore);
  });

  it('6. 최근 60일 동안 추천된 조합은 중복으로 추천되지 않아야 한다', () => {
    const baseDate = '2026-11-10';
    const today = getDailyRecommendation(baseDate);
    const todayPairKey = [today.combination.ramenA.id, today.combination.ramenB.id].sort().join(':');

    // 최근 60일의 추천 이력을 조사하여 오늘 조합과 중복되는지 검증
    for (let offset = -60; offset < 0; offset++) {
      const pastDate = offsetDateString(baseDate, offset);
      const pastRec = getDailyRecommendation(pastDate);
      const pastPairKey = [pastRec.combination.ramenA.id, pastRec.combination.ramenB.id].sort().join(':');
      expect(todayPairKey).not.toBe(pastPairKey);
    }
  }, 30000);

  it('7. 제조사 공식 레시피(짜파구리)와 알고리즘 실험 레시피가 명확히 구분되어야 한다', () => {
    const officialRecipe = generateMixedRecipe(chapa, neoguri);
    expect(officialRecipe.isOfficial).toBe(true);
    expect(officialRecipe.officialSource).toContain('농심 공식 조리 가이드');

    const expRecipe = generateMixedRecipe(shin, snack);
    expect(expRecipe.isOfficial).toBe(false);
    expect(expRecipe.officialSource).toContain('실험 레시피');
  });

  it('8. 모든 라면 제품의 조합 수가 정확히 N*(N-1)/2로 산출되는지 검증한다', () => {
    const activeRamens = RAMEN_DATASET.filter((p) => p.isActive);
    const expectedCount = (activeRamens.length * (activeRamens.length - 1)) / 2;
    const allCombos = getAllCombinations();
    expect(allCombos.length).toBe(expectedCount);
  });
});
