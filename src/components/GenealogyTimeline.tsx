import { useState } from 'react';
import type { RamenProduct, GenealogyRelation } from '../types/ramen';
import { RAMEN_DATASET, RAMEN_MAP } from '../data/ramenDataset';
import { Filter, Tag } from 'lucide-react';

interface GenealogyTimelineProps {
  onOpenProductModal: (product: RamenProduct) => void;
}

export function GenealogyTimeline({ onOpenProductModal }: GenealogyTimelineProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedRelation, setSelectedRelation] = useState<string>('ALL');

  // Group products by decade/era
  const eras = [
    { label: '1960~70년대: 라면의 탄생과 태동기', start: 1963, end: 1979 },
    { label: '1980년대: 국민 탕면의 전성기 (신라면·짜파게티·진라면)', start: 1980, end: 1989 },
    { label: '1990년대: 매운맛과 특화 면발의 분화 (열라면·참깨·멸치칼국수)', start: 1990, end: 1999 },
    { label: '2000년대: 프리미엄 웰빙과 극한 매운맛 (틈새·맛있는라면)', start: 2000, end: 2009 },
    { label: '2010년대: 하얀국물 신드롬 & 불닭 볶음면 글로벌 열풍', start: 2010, end: 2019 },
    { label: '2020년대: 초매운맛 확장 & 모디슈머 융합 (더레드·마열·툼바)', start: 2020, end: 2026 },
  ];

  const getRelationBadge = (relation: GenealogyRelation) => {
    switch (relation) {
      case 'ORIGIN':
        return { label: '원조 제품', color: 'bg-stone-900 text-white' };
      case 'SUCCESSOR':
        return { label: '후속 제품', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'SPINOFF':
        return { label: '파생 제품', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'SPICY_VARIANT':
        return { label: '매운맛 확장', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'METHOD_VARIANT':
        return { label: '조리방식 변경', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'DISCONTINUED':
        return { label: '단종 명작', color: 'bg-stone-200 text-stone-700 border-stone-300' };
      case 'ANCESTOR':
        return { label: '조상/모태', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'PREDECESSOR':
        return { label: '선행 제품', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'CROSSOVER':
        return { label: '융합/모디슈머', color: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'RIVAL':
        return { label: '라이벌 대항마', color: 'bg-red-100 text-red-800 border-red-200' };
      default:
        return { label: '관련 제품', color: 'bg-stone-100 text-stone-700 border-stone-200' };
    }
  };

  const filteredProducts = RAMEN_DATASET.filter((p) => {
    if (selectedBrand !== 'ALL' && p.manufacturer !== selectedBrand) return false;
    if (selectedRelation !== 'ALL') {
      const hasRelation = p.lineage.some((l) => l.relation === selectedRelation);
      if (!hasRelation) return false;
    }
    return true;
  }).sort((a, b) => a.releaseYear - b.releaseYear);

  return (
    <section id="timeline" className="py-10 sm:py-16 border-b border-stone-300 bg-[#f7f4ee]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-900 text-white tracking-wider">
            1963 ~ 2026 LINEAGE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-950 font-serif mt-2">
            한국 라면의 계보
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            1963년 삼양라면의 탄생부터 2024년 신라면 툼바까지, 실제로 검증된 제품 간 원조·후속·파생·매운맛 확장의 역사를 탐색합니다.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-5 border border-stone-300 shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-stone-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> 제조사:
            </span>
            {['ALL', '농심', '삼양식품', '오뚜기', '팔도'].map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedBrand === brand
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                {brand === 'ALL' ? '전체 제조사' : brand}
              </button>
            ))}
          </div>

          {/* Relation Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-stone-500 mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> 계보 유형:
            </span>
            {[
              { id: 'ALL', label: '전체' },
              { id: 'ORIGIN', label: '원조' },
              { id: 'SPICY_VARIANT', label: '매운맛 확장' },
              { id: 'SPINOFF', label: '파생' },
              { id: 'METHOD_VARIANT', label: '조리변형' },
              { id: 'DISCONTINUED', label: '단종' },
            ].map((rel) => (
              <button
                key={rel.id}
                type="button"
                onClick={() => setSelectedRelation(rel.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  selectedRelation === rel.id
                    ? 'bg-amber-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {rel.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chronological Timeline Blocks by Era */}
        <div className="space-y-10">
          {eras.map((era) => {
            const eraProducts = filteredProducts.filter(
              (p) => p.releaseYear >= era.start && p.releaseYear <= era.end
            );
            if (eraProducts.length === 0) return null;

            return (
              <div key={era.label} className="relative">
                {/* Era Header Banner */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3.5 py-1 rounded-full bg-stone-900 text-amber-300 font-mono font-bold text-xs tracking-wider shadow-sm">
                    {era.start} ~ {era.end}
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base font-serif">
                    {era.label}
                  </h3>
                  <div className="flex-1 h-px bg-stone-300 ml-2" />
                </div>

                {/* Grid of Ramen Nodes in this Era */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {eraProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => onOpenProductModal(product)}
                      className="bg-white rounded-2xl p-4 border border-stone-300 shadow-sm hover:shadow-md hover:border-stone-500 transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                              {product.manufacturer}
                            </span>
                            <span className="text-xs font-black font-mono text-stone-900">
                              {product.releaseYear}년
                            </span>
                          </div>
                          {!product.isActive && (
                            <span className="text-[10px] bg-stone-700 text-white px-1.5 py-0.2 rounded font-semibold">
                              단종
                            </span>
                          )}
                        </div>

                        <h4 className="font-black text-stone-950 text-lg group-hover:text-rose-600 transition">
                          {product.name}
                        </h4>

                        <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                          {product.flavorProfile.primaryFlavors.join(' · ')}
                        </p>
                      </div>

                      {/* Lineage Edge Pills */}
                      {product.lineage.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-1">
                          {product.lineage.slice(0, 2).map((link, idx) => {
                            const badge = getRelationBadge(link.relation);
                            const target = RAMEN_MAP.get(link.targetId);
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 text-[11px] text-stone-600"
                              >
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badge.color}`}
                                >
                                  {badge.label}
                                </span>
                                <span className="font-semibold text-stone-800">
                                  {target ? target.name : link.targetId}
                                </span>
                                <span className="text-[10px] text-stone-400">
                                  ({link.year}년)
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
