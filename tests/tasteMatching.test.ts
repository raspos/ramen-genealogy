import { describe, it, expect } from 'vitest';
import { RAMEN_DATASET } from '../src/data/ramenDataset';
import { matchRamenToPreferences } from '../src/utils/tasteMatchingAlgorithm';

describe('내 라면 취향 찾기 알고리즘 단위 테스트', () => {
  it('1. 매운 국물 라면을 선호하는 사용자에게 알맞은 TOP 5 제품을 추천해야 한다', () => {
    const results = matchRamenToPreferences(
      {
        brothPreference: 'SOUP',
        spicinessLevel: 'HOT',
        flavorFocus: 'BEEF',
        noodleStyle: 'STANDARD',
        healthFocus: 'ANY',
        cookTimePreference: 'STANDARD',
      },
      RAMEN_DATASET
    );

    expect(results).toHaveLength(5);
    expect(results[0].matchPercentage).toBeGreaterThanOrEqual(75);
    expect(results[0].product.productType).toBe('SOUP');
    expect(results[0].product.spiciness.spicinessGrade).toBeGreaterThanOrEqual(2);
  });

  it('2. 저칼로리 및 건면 선호 시 누들핏/건면 계열이 상위에 랭크되어야 한다', () => {
    const results = matchRamenToPreferences(
      {
        brothPreference: 'ANY',
        spicinessLevel: 'ANY',
        flavorFocus: 'ANY',
        noodleStyle: 'NON_FRIED',
        healthFocus: 'LOW_CALORIE',
        cookTimePreference: 'ANY',
      },
      RAMEN_DATASET
    );

    expect(results).toHaveLength(5);
    const topResult = results[0];
    expect(topResult.product.nutrition.caloriesKcal).toBeLessThanOrEqual(470);
  });

  it('3. 짜장 볶음면 선호 시 짜장 계열이 추천되어야 한다', () => {
    const results = matchRamenToPreferences(
      {
        brothPreference: 'STIR_FRY',
        spicinessLevel: 'MILD',
        flavorFocus: 'JJAJANG',
        noodleStyle: 'STANDARD',
        healthFocus: 'ANY',
        cookTimePreference: 'ANY',
      },
      RAMEN_DATASET
    );

    expect(results).toHaveLength(5);
    const topNames = results.map((r) => r.product.name);
    const hasJjajang = topNames.some((name) => name.includes('짜장') || name.includes('짜파게티'));
    expect(hasJjajang).toBe(true);
  });
});
