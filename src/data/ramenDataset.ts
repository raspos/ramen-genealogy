import type { RamenProduct } from '../types/ramen';
import { NONGSHIM_PRODUCTS } from './products/nongshim';
import { SAMYANG_PRODUCTS } from './products/samyang';
import { OTTOGI_PRODUCTS } from './products/ottogi';
import { PALDO_PRODUCTS } from './products/paldo';
import { PULMUONE_HARIM_PRODUCTS } from './products/pulmuone_harim';
import { CONVENIENCE_PB_PRODUCTS } from './products/convenience_pb';
import { HISTORICAL_PRODUCTS } from './products/historical';

/**
 * 라면의 계보 2.0 종합 데이터베이스
 * - 7개 카테고리 (농심, 삼양, 오뚜기, 팔도, 풀무원/하림, 편의점 PB, 역사적 단종 라면)
 * - 총 197종의 실측/공식 데이터 기반 제품 수록
 */
export const RAMEN_DATASET: RamenProduct[] = [
  ...NONGSHIM_PRODUCTS,
  ...SAMYANG_PRODUCTS,
  ...OTTOGI_PRODUCTS,
  ...PALDO_PRODUCTS,
  ...PULMUONE_HARIM_PRODUCTS,
  ...CONVENIENCE_PB_PRODUCTS,
  ...HISTORICAL_PRODUCTS,
];

// 빠른 조회를 위한 ID 기반 인덱스 맵
export const RAMEN_MAP = new Map<string, RamenProduct>(
  RAMEN_DATASET.map(product => [product.id, product])
);
