import { RAMEN_DATASET } from '../data/ramenDataset';
import type { CombinationScore } from '../types/ramen';
import { scoreCombination, getPairKey } from './pairingAlgorithm';

/**
 * Gets KST (Korea Standard Time, UTC+9) date formatted as YYYY-MM-DD.
 */
export function getKSTDateString(date: Date = new Date()): string {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const kst = new Date(utc + 9 * 3600000);
  const y = kst.getFullYear();
  const m = String(kst.getMonth() + 1).padStart(2, '0');
  const d = String(kst.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Converts a date string 'YYYY-MM-DD' offset by dayCount.
 */
export function offsetDateString(dateStr: string, dayOffset: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + dayOffset);
  const ry = date.getUTCFullYear();
  const rm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const rd = String(date.getUTCDate()).padStart(2, '0');
  return `${ry}-${rm}-${rd}`;
}

/**
 * Simple 32-bit FNV-1a hash for string seeds.
 */
function hashString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

/**
 * Mulberry32 seeded PRNG. Generates float [0, 1).
 */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pre-computed all possible combinations among active products
let cachedCombinations: CombinationScore[] | null = null;
let cachedQualifiedCandidates: { score: CombinationScore; key: string }[] | null = null;
const dailyRecCache = new Map<string, {
  date: string;
  combination: CombinationScore;
  totalPoolCount: number;
  qualifiedCount: number;
}>();

export function getAllCombinations(): CombinationScore[] {
  if (cachedCombinations) return cachedCombinations;

  const activeProducts = RAMEN_DATASET.filter((p) => p.isActive);
  const results: CombinationScore[] = [];

  for (let i = 0; i < activeProducts.length; i++) {
    for (let j = i + 1; j < activeProducts.length; j++) {
      results.push(scoreCombination(activeProducts[i], activeProducts[j]));
    }
  }

  cachedCombinations = results;
  return results;
}

export function getQualifiedCandidates(): CombinationScore[] {
  return getQualifiedCandidateItems().map(item => item.score);
}

function getQualifiedCandidateItems(): { score: CombinationScore; key: string }[] {
  if (cachedQualifiedCandidates) return cachedQualifiedCandidates;

  const all = getAllCombinations();
  // Filter for good compatibility (>= 75) and substantial surprise (>= 60)
  let qualified = all.filter((c) => c.compositeScore >= 75 && c.surpriseScore >= 60);

  // If filtered pool is too small, relax surprise slightly
  if (qualified.length < 20) {
    qualified = all.filter((c) => c.compositeScore >= 72);
  }

  // Stable sort by compositeScore descending then pairKey
  qualified.sort((a, b) => {
    if (b.compositeScore !== a.compositeScore) return b.compositeScore - a.compositeScore;
    const keyA = getPairKey(a.ramenA.id, a.ramenB.id);
    const keyB = getPairKey(b.ramenA.id, b.ramenB.id);
    return keyA.localeCompare(keyB);
  });

  cachedQualifiedCandidates = qualified.map((score) => ({
    score,
    key: getPairKey(score.ramenA.id, score.ramenB.id),
  }));

  return cachedQualifiedCandidates;
}

/**
 * Deterministically picks a single combination for a given date with 60-day exclusion window.
 */
export function getDailyRecommendation(dateStr: string = getKSTDateString()): {
  date: string;
  combination: CombinationScore;
  totalPoolCount: number;
  qualifiedCount: number;
} {
  if (dailyRecCache.has(dateStr)) {
    return dailyRecCache.get(dateStr)!;
  }

  const candidateItems = getQualifiedCandidateItems();
  const allCombos = getAllCombinations();

  // Helper to pick deterministically avoiding a given exclusion set
  const pickCandidate = (rng: () => number, exclusionSet: Set<string>): { score: CombinationScore; key: string } => {
    let index = Math.floor(rng() * candidateItems.length);
    let attempts = 0;
    while (exclusionSet.has(candidateItems[index].key) && attempts < candidateItems.length) {
      index = (index + 1) % candidateItems.length;
      attempts++;
    }
    return candidateItems[index];
  };

  // Simulate past 60 days deterministically to build the exclusion set
  const recent60Keys = new Set<string>();

  for (let offset = -60; offset < 0; offset++) {
    const pastDate = offsetDateString(dateStr, offset);
    const pastHash = hashString(pastDate);
    const pastRng = mulberry32(pastHash);

    const picked = pickCandidate(pastRng, recent60Keys);
    recent60Keys.add(picked.key);
  }

  // Pick today's recommendation avoiding recent60Keys
  const todayHash = hashString(dateStr);
  const todayRng = mulberry32(todayHash);
  const todayPicked = pickCandidate(todayRng, recent60Keys);

  const result = {
    date: dateStr,
    combination: todayPicked.score,
    totalPoolCount: allCombos.length,
    qualifiedCount: candidateItems.length,
  };

  dailyRecCache.set(dateStr, result);
  return result;
}

/**
 * Returns past recommendations for archive browsing (e.g. past 7 days).
 */
export function getRecentRecommendations(count: number = 7, baseDateStr: string = getKSTDateString()) {
  const history = [];
  for (let i = 0; i < count; i++) {
    const targetDate = offsetDateString(baseDateStr, -i);
    history.push(getDailyRecommendation(targetDate));
  }
  return history;
}
