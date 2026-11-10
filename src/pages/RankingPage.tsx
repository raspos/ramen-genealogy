import { useState, useMemo } from 'react';
import type { RamenProduct } from '../types/ramen';
import { RAMEN_DATASET } from '../data/ramenDataset';
import { AlertCircle, Flame, Droplets, Clock, DollarSign, Scale, Calendar } from 'lucide-react';

interface RankingPageProps {
  onSelectProduct: (product: RamenProduct) => void;
}

type RankingMetric =
  | 'SPICY_SCOVILLE'     // 스코빌지수 (SHU)
  | 'SPICY_CAPSAICIN'    // 스프 캡사이신류 함량 (mg/kg)
  | 'SODIUM_TOTAL'       // 총 나트륨 (mg)
  | 'SODIUM_PER_100G'    // 100g당 나트륨 (mg/100g)
  | 'CALORIES'           // 열량 (kcal)
  | 'WEIGHT'             // 중량 (g)
  | 'COOK_TIME'          // 빠른 조리시간 (초)
  | 'PRICE'              // 가격 (원)
  | 'OLDEST';            // 출시 연도 (가장 오래된 현역)

export function RankingPage({ onSelectProduct }: RankingPageProps) {
  const [metric, setMetric] = useState<RankingMetric>('SPICY_SCOVILLE');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'SOUP' | 'NON_SOUP'>('ALL');

  // Strictly filter out discontinued products (단종 제외)
  const activeProducts = useMemo(() => {
    return RAMEN_DATASET.filter((p) => p.isActive);
  }, []);

  const filteredPool = useMemo(() => {
    if (typeFilter === 'ALL') return activeProducts;
    if (typeFilter === 'SOUP') return activeProducts.filter((p) => p.productType === 'SOUP');
    return activeProducts.filter((p) => p.productType === 'STIR_FRY' || p.productType === 'BIBIM');
  }, [activeProducts, typeFilter]);

  const rankingData = useMemo(() => {
    let items: { product: RamenProduct; primaryValue: string; secondaryValue: string }[] = [];
    let standardDesc = '';
    let disclaimer = '';

    switch (metric) {
      case 'SPICY_SCOVILLE': {
        const sorted = [...filteredPool]
          .filter((p) => p.spiciness.scovilleShu !== null && (p.spiciness.scovilleShu || 0) > 0)
          .sort((a, b) => (b.spiciness.scovilleShu || 0) - (a.spiciness.scovilleShu || 0));

        items = sorted.map((p) => ({
          product: p,
          primaryValue: `${p.spiciness.scovilleShu?.toLocaleString()} SHU`,
          secondaryValue: p.spiciness.scovilleProvenance === 'VERIFIED' ? '제조사 공식 공시' : '추정치'
        }));
        standardDesc = '제조사가 공식 공시한 스코빌 지수(SHU) 기준 순위';
        disclaimer = '스코빌 지수는 분말 원료 기준이며, 조리 후 실제 국물 체감 매운맛은 물의 양과 나트륨 농도에 따라 달라질 수 있습니다.';
        break;
      }

      case 'SPICY_CAPSAICIN': {
        const sorted = [...filteredPool]
          .filter((p) => p.spiciness.capsaicinSoupMgPerKg !== null && (p.spiciness.capsaicinSoupMgPerKg || 0) > 0)
          .sort((a, b) => (b.spiciness.capsaicinSoupMgPerKg || 0) - (a.spiciness.capsaicinSoupMgPerKg || 0));

        items = sorted.map((p) => ({
          product: p,
          primaryValue: `${p.spiciness.capsaicinSoupMgPerKg?.toFixed(1)} mg/kg`,
          secondaryValue: `국물 농도 ${p.spiciness.capsaicinPreparedMgPerL?.toFixed(1) || '-'} mg/L`
        }));
        standardDesc = '한국소비자원 시험검사 실측 스프 캡사이신류(캡사이신+디하이드로캡사이신) 함량';
        disclaimer = '소비자원 공식 시험검사 결과가 확인된 제품군 기준 실측치입니다.';
        break;
      }

      case 'SODIUM_TOTAL': {
        const sorted = [...filteredPool].sort((a, b) => b.nutrition.sodiumMg - a.nutrition.sodiumMg);
        items = sorted.map((p) => ({
          product: p,
          primaryValue: `${p.nutrition.sodiumMg.toLocaleString()} mg`,
          secondaryValue: `일일 영양성분 기준치(2,000mg)의 ${Math.round((p.nutrition.sodiumMg / 2000) * 100)}%`
        }));
        standardDesc = '1회 제공량(1봉지/1용기)당 총 나트륨 함량 기준';
        disclaimer = '성인 일일 권장 나트륨 기준치는 2,000mg입니다.';
        break;
      }

      case 'SODIUM_PER_100G': {
        const sorted = [...filteredPool].sort((a, b) => {
          const aRate = (a.nutrition.sodiumMg / a.nutrition.weightG) * 100;
          const bRate = (b.nutrition.sodiumMg / b.nutrition.weightG) * 100;
          return bRate - aRate;
        });
        items = sorted.map((p) => {
          const rate = Math.round((p.nutrition.sodiumMg / p.nutrition.weightG) * 100);
          return {
            product: p,
            primaryValue: `${rate.toLocaleString()} mg`,
            secondaryValue: `총 중량 ${p.nutrition.weightG}g (총 나트륨 ${p.nutrition.sodiumMg}mg)`
          };
        });
        standardDesc = '중량 차이를 배제한 100g 환산 단위당 나트륨 농도';
        disclaimer = '소형 컵라면과 대형 봉지면 간의 상대적 염도를 객관적으로 비교한 수치입니다.';
        break;
      }

      case 'CALORIES': {
        const sorted = [...filteredPool].sort((a, b) => b.nutrition.caloriesKcal - a.nutrition.caloriesKcal);
        items = sorted.map((p) => ({
          product: p,
          primaryValue: `${p.nutrition.caloriesKcal} kcal`,
          secondaryValue: `탄수화물 ${p.nutrition.carbsG}g · 지방 ${p.nutrition.fatG}g · 단백질 ${p.nutrition.proteinG}g`
        }));
        standardDesc = '1회 제공량당 총 열량 기준';
        break;
      }

      case 'WEIGHT': {
        const sorted = [...filteredPool].sort((a, b) => b.nutrition.weightG - a.nutrition.weightG);
        items = sorted.map((p) => ({
          product: p,
          primaryValue: `${p.nutrition.weightG} g`,
          secondaryValue: `열량 ${p.nutrition.caloriesKcal} kcal`
        }));
        standardDesc = '제품 총 내용량(중량) 기준';
        break;
      }

      case 'COOK_TIME': {
        const sorted = [...filteredPool].sort((a, b) => a.cooking.cookTimeSec - b.cooking.cookTimeSec);
        items = sorted.map((p) => {
          const m = Math.floor(p.cooking.cookTimeSec / 60);
          const s = p.cooking.cookTimeSec % 60;
          return {
            product: p,
            primaryValue: s > 0 ? `${m}분 ${s}초` : `${m}분`,
            secondaryValue: `권장 물 ${p.cooking.waterMl}ml`
          };
        });
        standardDesc = '공식 조리법에 명시된 가장 빠른 완성 조리 시간';
        break;
      }

      case 'PRICE': {
        const sorted = [...filteredPool]
          .filter((p) => p.priceKrw && p.priceKrw > 0)
          .sort((a, b) => (a.priceKrw || 0) - (b.priceKrw || 0));

        items = sorted.map((p) => ({
          product: p,
          primaryValue: `${p.priceKrw?.toLocaleString()} 원`,
          secondaryValue: `출시 ${p.releaseYear}년 · ${p.isPB ? '편의점 PB가' : '권장소비자가'}`
        }));
        standardDesc = '단품 기준 권장소비자가격(최저가순)';
        disclaimer = '유통 채널(대형마트, 편의점, 온라인몰) 및 행사 여부에 따라 실구매가는 다를 수 있습니다.';
        break;
      }

      case 'OLDEST': {
        const sorted = [...filteredPool].sort((a, b) => a.releaseYear - b.releaseYear);
        items = sorted.map((p) => ({
          product: p,
          primaryValue: `${p.releaseYear}년`,
          secondaryValue: `${2026 - p.releaseYear + 1}년째 판매 중인 스테디셀러`
        }));
        standardDesc = '현재도 정상 판매 중인 최장수 라면 역사 순위';
        disclaimer = '단종된 역사적 제품(1963 삼양라면 원판 등)은 제외하고 현재 구매 가능한 현역 제품만 집계합니다.';
        break;
      }
    }

    return { items, standardDesc, disclaimer };
  }, [filteredPool, metric]);

  const top3 = rankingData.items.slice(0, 3);
  const remaining = rankingData.items.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Editorial Header */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-stone-100 text-xs font-serif font-bold mb-3 shadow-xs">
          <span>데이터로 검증하는 한국 라면의 지형도</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-stone-950 font-serif tracking-tight leading-tight">
          라면 랭킹
        </h1>

        <p className="mt-3 text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
          매운맛·나트륨·열량부터 조리시간·가격·출시연도까지, 현역 판매 중인 170여 종의 공시 데이터를 객관적으로 비교합니다.
        </p>
      </div>

      {/* Metric Category Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-2 mb-6">
        {[
          { id: 'SPICY_SCOVILLE', label: '스코빌지수', icon: Flame },
          { id: 'SPICY_CAPSAICIN', label: '실측 캡사이신', icon: Flame },
          { id: 'SODIUM_TOTAL', label: '총 나트륨', icon: Droplets },
          { id: 'SODIUM_PER_100G', label: '100g당 염도', icon: Droplets },
          { id: 'CALORIES', label: '열량', icon: Scale },
          { id: 'WEIGHT', label: '중량', icon: Scale },
          { id: 'COOK_TIME', label: '조리 속도', icon: Clock },
          { id: 'PRICE', label: '가성비 가격', icon: DollarSign },
          { id: 'OLDEST', label: '최장수 현역', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setMetric(tab.id as RankingMetric)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                metric === tab.id
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub Filter: Soup vs Non-Soup */}
      <div className="flex items-center justify-between flex-wrap gap-3 max-w-4xl mx-auto mb-6 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
        <div className="text-xs text-stone-600 font-medium">
          {rankingData.standardDesc} <span className="font-bold text-stone-900">({rankingData.items.length}종 집계)</span>
        </div>

        <div className="inline-flex items-center gap-1 p-1 bg-stone-100 rounded-xl text-xs font-medium">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg transition ${
              typeFilter === 'ALL' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-500'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setTypeFilter('SOUP')}
            className={`px-2.5 py-1 rounded-lg transition ${
              typeFilter === 'SOUP' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-500'
            }`}
          >
            국물라면
          </button>
          <button
            onClick={() => setTypeFilter('NON_SOUP')}
            className={`px-2.5 py-1 rounded-lg transition ${
              typeFilter === 'NON_SOUP' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-500'
            }`}
          >
            비빔·볶음면
          </button>
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      {top3.length > 0 && (
        <div className="max-w-4xl mx-auto mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* 2nd Place */}
            {top3[1] && (
              <div
                onClick={() => onSelectProduct(top3[1].product)}
                className="order-2 md:order-1 bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm hover:border-stone-400 transition-all cursor-pointer text-center flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-800 font-black text-sm flex items-center justify-center mx-auto mb-2">
                    2
                  </div>
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-50 p-2 mb-3 flex items-center justify-center">
                    <img
                      src={top3[1].product.imageUrl || `/images/products/${top3[1].product.id}.svg`}
                      alt={top3[1].product.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `/images/products/${top3[1].product.id}.svg`;
                      }}
                      className="max-h-full max-w-full object-contain drop-shadow"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-stone-400">
                    {top3[1].product.manufacturer} · {top3[1].product.releaseYear}
                  </span>
                  <h3 className="text-base font-black text-stone-900 line-clamp-1">
                    {top3[1].product.name}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <span className="text-xl font-black text-stone-900 block">
                    {top3[1].primaryValue}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {top3[1].secondaryValue}
                  </span>
                </div>
              </div>
            )}

            {/* 1st Place (Center Podium) */}
            {top3[0] && (
              <div
                onClick={() => onSelectProduct(top3[0].product)}
                className="order-1 md:order-2 bg-gradient-to-b from-amber-50/60 to-white rounded-3xl p-6 border-2 border-amber-400 shadow-xl hover:border-amber-500 transition-all cursor-pointer text-center flex flex-col justify-between md:-translate-y-3"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 font-black text-base flex items-center justify-center mx-auto mb-2 shadow-md">
                    1
                  </div>
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white p-3 mb-3 flex items-center justify-center border border-amber-100 shadow-inner">
                    <img
                      src={top3[0].product.imageUrl || `/images/products/${top3[0].product.id}.svg`}
                      alt={top3[0].product.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `/images/products/${top3[0].product.id}.svg`;
                      }}
                      className="max-h-full max-w-full object-contain drop-shadow-md"
                    />
                  </div>
                  <span className="text-xs font-bold text-amber-800">
                    {top3[0].product.manufacturer} · {top3[0].product.releaseYear}년
                  </span>
                  <h3 className="text-xl font-black text-stone-950 font-serif mt-0.5">
                    {top3[0].product.name}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-amber-200">
                  <span className="text-2xl font-black text-stone-950 block">
                    {top3[0].primaryValue}
                  </span>
                  <span className="text-xs text-stone-600 font-medium">
                    {top3[0].secondaryValue}
                  </span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <div
                onClick={() => onSelectProduct(top3[2].product)}
                className="order-3 bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-sm hover:border-stone-400 transition-all cursor-pointer text-center flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-black text-sm flex items-center justify-center mx-auto mb-2">
                    3
                  </div>
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-50 p-2 mb-3 flex items-center justify-center">
                    <img
                      src={top3[2].product.imageUrl || `/images/products/${top3[2].product.id}.svg`}
                      alt={top3[2].product.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `/images/products/${top3[2].product.id}.svg`;
                      }}
                      className="max-h-full max-w-full object-contain drop-shadow"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-stone-400">
                    {top3[2].product.manufacturer} · {top3[2].product.releaseYear}
                  </span>
                  <h3 className="text-base font-black text-stone-900 line-clamp-1">
                    {top3[2].product.name}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <span className="text-xl font-black text-stone-900 block">
                    {top3[2].primaryValue}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {top3[2].secondaryValue}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DENSE RANKED LIST (Ranks 4+) */}
      {remaining.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="px-5 py-3 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
            <div className="flex items-center gap-6">
              <span className="w-8 text-center">순위</span>
              <span>제품 정보</span>
            </div>
            <span>측정 기준 수치</span>
          </div>

          <div className="divide-y divide-stone-100">
            {remaining.map((item, idx) => {
              const rank = idx + 4;
              const product = item.product;

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-stone-50 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="w-8 text-center text-sm font-black text-stone-400 font-mono">
                      {rank}
                    </span>

                    <div className="w-12 h-12 rounded-lg bg-stone-50 p-1 flex items-center justify-center shrink-0 border border-stone-100 overflow-hidden">
                      <img
                        src={product.imageUrl || `/images/products/${product.id}.svg`}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `/images/products/${product.id}.svg`;
                        }}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                          {product.manufacturer}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {product.releaseYear}년
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 truncate group-hover:text-rose-700 transition-colors">
                        {product.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-black text-stone-950 font-mono block">
                      {item.primaryValue}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {item.secondaryValue}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footnote & Disclaimer */}
      {rankingData.disclaimer && (
        <div className="max-w-4xl mx-auto mt-6 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{rankingData.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
