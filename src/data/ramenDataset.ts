import type { RamenProduct } from '../types/ramen';
import { getAssetUrl } from '../utils/imageUrl';
import { NONGSHIM_PRODUCTS } from './products/nongshim';
import { SAMYANG_PRODUCTS } from './products/samyang';
import { OTTOGI_PRODUCTS } from './products/ottogi';
import { PALDO_PRODUCTS } from './products/paldo';
import { PULMUONE_HARIM_PRODUCTS } from './products/pulmuone_harim';
import { CONVENIENCE_PB_PRODUCTS } from './products/convenience_pb';
import { HISTORICAL_PRODUCTS } from './products/historical';

const RAW_PRODUCTS: RamenProduct[] = [
  ...NONGSHIM_PRODUCTS,
  ...SAMYANG_PRODUCTS,
  ...OTTOGI_PRODUCTS,
  ...PALDO_PRODUCTS,
  ...PULMUONE_HARIM_PRODUCTS,
  ...CONVENIENCE_PB_PRODUCTS,
  ...HISTORICAL_PRODUCTS,
];

/**
 * 라면의 계보 종합 데이터베이스
 * - getAssetUrl 적용으로 GitHub Pages 서브패스 환경에서도 이미지 절대 경로 보정
 */
export const RAMEN_DATASET: RamenProduct[] = RAW_PRODUCTS.map((p) => ({
  ...p,
  imageUrl: getAssetUrl(p.imageUrl),
}));

// 빠른 조회를 위한 ID 기반 인덱스 맵
export const RAMEN_MAP = new Map<string, RamenProduct>(
  RAMEN_DATASET.map(product => [product.id, product])
);
