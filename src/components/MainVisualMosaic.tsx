import { getAssetUrl } from '../utils/imageUrl';
import { useState, useMemo } from 'react';
import type { RamenProduct } from '../types/ramen';
import { RAMEN_DATASET } from '../data/ramenDataset';
import { Sparkles, Layers, Flame } from 'lucide-react';

interface MainVisualMosaicProps {
  onSelectProduct: (product: RamenProduct) => void;
  onExploreGenealogy: () => void;
  onStartTasteTest: () => void;
}

export function MainVisualMosaic({
  onSelectProduct,
  onExploreGenealogy,
  onStartTasteTest,
}: MainVisualMosaicProps) {
  const [filterBrand, setFilterBrand] = useState<string>('ALL');
  const [hoveredProduct, setHoveredProduct] = useState<RamenProduct | null>(null);

  // Pick a dynamic sample of authentic products with verified photos
  const displayItems = useMemo(() => {
    let pool = RAMEN_DATASET;
    if (filterBrand !== 'ALL') {
      pool = pool.filter((p) => p.manufacturer === filterBrand);
    }
    // Limit to 48 visually striking packages for smooth rendering
    return pool.slice(0, 48);
  }, [filterBrand]);

  const totalCount = RAMEN_DATASET.length;
  const verifiedPhotoCount = RAMEN_DATASET.filter((p) => p.imageStatus === 'VERIFIED_PHOTO').length;

  return (
    <section className="relative overflow-hidden bg-stone-950 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[250px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header Text */}
      <div className="relative max-w-5xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 border border-amber-500/30 text-amber-300 text-xs font-bold mb-4 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>인터랙티브 데이터저널리즘 아카이브</span>
          <span className="w-1 h-1 rounded-full bg-amber-400" />
          <span className="text-white font-extrabold">{totalCount}종 전수 분석</span>
        </div>

        <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          라면의 계보 <span className="text-amber-400 text-2xl sm:text-4xl align-top font-bold">2.0</span>
        </h1>
        <p className="mt-3 text-base sm:text-xl text-stone-300 font-medium max-w-3xl mx-auto leading-relaxed">
          1963년 최초의 치킨라면부터 2026년 마열·투움바·편의점 PB까지, <br className="hidden sm:inline" />
          대한민국 60년 라면의 역사와 과학적 궁합을 인터랙티브 데이터로 탐험합니다.
        </p>

        {/* Counter & Metric Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs sm:text-sm">
          <div className="px-4 py-2 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center gap-2 shadow-sm">
            <span className="text-stone-400 font-medium">검증 수록 제품</span>
            <span className="text-amber-400 font-black text-base">{totalCount}종</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center gap-2 shadow-sm">
            <span className="text-stone-400 font-medium">실물 패키지 DB</span>
            <span className="text-emerald-400 font-black text-base">{verifiedPhotoCount}종</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center gap-2 shadow-sm">
            <span className="text-stone-400 font-medium">조합 가능의 수</span>
            <span className="text-rose-400 font-black text-base">
              {((totalCount * (totalCount - 1)) / 2).toLocaleString()}개
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
          <button
            onClick={onStartTasteTest}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm transition-all shadow-lg hover:shadow-amber-500/20 hover:scale-105 cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>내 라면 취향 찾기</span>
          </button>
          <button
            onClick={onExploreGenealogy}
            className="px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-sm border border-stone-700 transition-all cursor-pointer flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-stone-400" />
            <span>60년 계보도 보기</span>
          </button>
        </div>
      </div>

      {/* Brand Filters */}
      <div className="relative max-w-4xl mx-auto flex items-center justify-center gap-1.5 flex-wrap mb-6">
        {[
          { id: 'ALL', label: '전체 (197종)' },
          { id: '농심', label: '농심' },
          { id: '삼양식품', label: '삼양' },
          { id: '오뚜기', label: '오뚜기' },
          { id: '팔도', label: '팔도' },
          { id: '풀무원', label: '풀무원' },
          { id: '하림', label: '하림' },
          { id: '기타/PB', label: '편의점 PB' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilterBrand(btn.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterBrand === btn.id
                ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/40'
                : 'bg-stone-900/80 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* INTERACTIVE PACKAGING WALL (MOSAIC GRID) */}
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {displayItems.map((product) => {
            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                onMouseEnter={() => setHoveredProduct(product)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-900 border border-stone-800/90 hover:border-amber-400 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col p-2 justify-between"
              >
                {/* Product Theme Color Accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: product.packagingThemeColor.bg }}
                />

                {/* Package Image Viewport */}
                <div className="w-full flex-1 flex items-center justify-center p-1 overflow-hidden">
                  <img
                    src={product.imageUrl || getAssetUrl("/images/products/${product.id}.svg")}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.endsWith('.svg')) {
                        target.src = getAssetUrl("/images/products/${product.id}.svg");
                      }
                    }}
                    className="max-h-full max-w-full object-contain drop-shadow transition-transform group-hover:scale-110"
                  />
                </div>

                {/* Micro Label */}
                <div className="text-center pt-1 border-t border-stone-800/60">
                  <div className="text-[10px] sm:text-[11px] font-black text-stone-200 line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {product.name}
                  </div>
                  <div className="text-[9px] text-stone-500 font-medium">
                    {product.manufacturer} · {product.releaseYear}
                  </div>
                </div>

                {/* Hover Badge */}
                {product.spiciness.spicinessGrade >= 3 && (
                  <div className="absolute top-1.5 right-1.5 bg-rose-600/90 text-white rounded-full p-0.5" title="매운맛">
                    <Flame className="w-2.5 h-2.5 fill-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Hover Floating Preview Pill */}
        {hoveredProduct && (
          <div className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900/95 backdrop-blur-md text-white border border-amber-500/50 shadow-2xl rounded-2xl p-3 px-5 items-center gap-4 z-50 pointer-events-none animate-fadeIn">
            <div className="w-10 h-10 rounded-lg bg-stone-800 p-1 flex items-center justify-center border border-stone-700">
              <img
                src={hoveredProduct.imageUrl}
                alt={hoveredProduct.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-amber-300">{hoveredProduct.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                  {hoveredProduct.manufacturer} ({hoveredProduct.releaseYear}년)
                </span>
                <span className="text-xs text-rose-400 font-bold">
                  {hoveredProduct.spiciness.scovilleShu
                    ? `${hoveredProduct.spiciness.scovilleShu.toLocaleString()} SHU`
                    : `매운맛 ${hoveredProduct.spiciness.spicinessGrade}단계`}
                </span>
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                {hoveredProduct.flavorProfile.primaryFlavors.join(' · ')} | {hoveredProduct.nutrition.caloriesKcal}kcal | {Math.floor(hoveredProduct.cooking.cookTimeSec / 60)}분 조리
              </div>
            </div>
            <div className="text-xs text-amber-400/90 font-semibold pl-3 border-l border-stone-700">
              클릭하여 상세 정보 보기
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-stone-500">
          * 패키지를 클릭하면 상세 영양성분, 공식 조리법 및 계보 관계를 확인할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
