import { useState } from 'react';
import type { RamenProduct } from '../types/ramen';
import { RAMEN_DATASET } from '../data/ramenDataset';
import { ProductCardVisual } from './ProductCardVisual';
import { Search, ShieldCheck, Package } from 'lucide-react';

interface RamenEncyclopediaProps {
  onOpenProductModal: (product: RamenProduct) => void;
}

export function RamenEncyclopedia({ onOpenProductModal }: RamenEncyclopediaProps) {
  const [search, setSearch] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedPackage, setSelectedPackage] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSpicy, setSelectedSpicy] = useState<string>('ALL');
  const [visibleCount, setVisibleCount] = useState<number>(24);

  const filtered = RAMEN_DATASET.filter((p) => {
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchMaker = p.manufacturer.toLowerCase().includes(q);
      const matchFlavor = p.flavorProfile.primaryFlavors.some((f) =>
        f.toLowerCase().includes(q)
      );
      if (!matchName && !matchBrand && !matchMaker && !matchFlavor) return false;
    }

    // Brand / Category filter
    if (selectedBrand !== 'ALL') {
      if (selectedBrand === 'PB') {
        if (!p.isPB) return false;
      } else if (selectedBrand === 'DISCONTINUED') {
        if (p.isActive) return false;
      } else {
        if (p.manufacturer !== selectedBrand) return false;
      }
    }

    // Package Type filter
    if (selectedPackage !== 'ALL') {
      if (p.packageType !== selectedPackage) return false;
    }

    // Product Type filter
    if (selectedType !== 'ALL' && p.productType !== selectedType) return false;

    // Spicy filter
    if (selectedSpicy === 'MILD' && p.spiciness.spicinessGrade > 1) return false;
    if (selectedSpicy === 'MEDIUM' && p.spiciness.spicinessGrade !== 2) return false;
    if (selectedSpicy === 'HOT' && p.spiciness.spicinessGrade < 3) return false;

    return true;
  });

  const verifiedCount = RAMEN_DATASET.filter(
    (p) => p.spiciness.scovilleProvenance === 'VERIFIED'
  ).length;

  return (
    <section id="encyclopedia" className="py-10 sm:py-16 border-b border-stone-300 bg-[#f8f6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-900 text-white tracking-wider">
            PRODUCT ENCYCLOPEDIA
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-950 font-serif mt-2">
            라면 200종 도감
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            국내 6대 제조사 및 편의점 4사(GS25·CU·이마트24·세븐일레븐)의 공식 실측 데이터를 바탕으로 구축된 대한민국 최대 규모의 즉석면 도감
          </p>
        </div>

        {/* Search & Filter Workbench */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-300 shadow-md mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="제품명, 주요 풍미, 제조사, PB 브랜드 검색 (예: 멸치칼국수, 불닭, 오모리, 틈새, 안성탕면)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-stone-50"
            />
          </div>

          {/* Filter Pills */}
          <div className="space-y-3 text-xs">
            {/* Manufacturer / PB / Discontinued */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-stone-500 mr-1 min-w-[50px]">분류:</span>
              {[
                { id: 'ALL', label: '전체 (197종)' },
                { id: '농심', label: '농심' },
                { id: '삼양식품', label: '삼양' },
                { id: '오뚜기', label: '오뚜기' },
                { id: '팔도', label: '팔도' },
                { id: '풀무원', label: '풀무원' },
                { id: '하림', label: '하림' },
                { id: 'PB', label: '편의점 PB' },
                { id: 'DISCONTINUED', label: '역사적 단종' },
              ].map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                    selectedBrand === brand.id
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {brand.label}
                </button>
              ))}
            </div>

            {/* Package Type (봉지 vs 큰컵 vs 소컵 vs 사발) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-stone-500 mr-1 min-w-[50px]">용기:</span>
              {[
                { id: 'ALL', label: '전체' },
                { id: 'BAG', label: '봉지면' },
                { id: 'CUP_LARGE', label: '큰컵' },
                { id: 'CUP_SMALL', label: '소컵' },
                { id: 'BOWL', label: '사발면' },
              ].map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`px-3 py-1 rounded-full font-semibold transition cursor-pointer ${
                    selectedPackage === pkg.id
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {pkg.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-100">
              {/* Product Type */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-stone-500 mr-1 min-w-[50px]">조리:</span>
                {[
                  { id: 'ALL', label: '전체' },
                  { id: 'SOUP', label: '국물' },
                  { id: 'STIR_FRY', label: '볶음' },
                  { id: 'BIBIM', label: '비빔' },
                  { id: 'COLD', label: '냉면' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedType(t.id)}
                    className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer ${
                      selectedType === t.id
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Spicy Grade */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-stone-500 mr-1">맵기:</span>
                {[
                  { id: 'ALL', label: '전체' },
                  { id: 'MILD', label: '순한맛' },
                  { id: 'MEDIUM', label: '신라면급' },
                  { id: 'HOT', label: '열라면·불닭급' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSpicy(s.id)}
                    className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer ${
                      selectedSpicy === s.id
                        ? 'bg-rose-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Meta Status Strip */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-stone-400" />
                표시 중: <strong className="text-stone-900">{filtered.length}</strong> / {RAMEN_DATASET.length}개 제품
              </span>
              <span className="flex items-center gap-1 hidden sm:inline-flex">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                공식 실측 스코빌 검증: {verifiedCount}종
              </span>
            </div>
            <span>카드를 클릭하면 상세 조리법과 영양성분이 표시됩니다.</span>
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {filtered.slice(0, visibleCount).map((product) => (
                <ProductCardVisual
                  key={product.id}
                  product={product}
                  size="sm"
                  showDetails={true}
                  onClick={() => onOpenProductModal(product)}
                />
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div className="text-center pt-8">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="px-8 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-sm shadow-md transition cursor-pointer hover:scale-105"
                >
                  라면 더보기 ({Math.min(visibleCount, filtered.length)} / {filtered.length}개 표시 중)
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <p className="text-stone-500 text-sm">
              조건에 맞는 라면 제품을 찾을 수 없습니다. 검색어나 필터를 변경해 보세요.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
