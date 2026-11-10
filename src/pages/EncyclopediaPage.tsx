import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { RamenProduct } from '../types/ramen';
import { RAMEN_DATASET } from '../data/ramenDataset';
import { FACTION_TAXONOMY, getProductFaction } from '../data/factionTaxonomy';
import { ProductCardVisual } from '../components/ProductCardVisual';
import { Search, X, RotateCcw, BookOpen } from 'lucide-react';

interface EncyclopediaPageProps {
  onSelectProduct: (product: RamenProduct) => void;
}

export function EncyclopediaPage({ onSelectProduct }: EncyclopediaPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const branchParam = searchParams.get('branch');

  const [search, setSearch] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedPackage, setSelectedPackage] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSpicy, setSelectedSpicy] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ACTIVE' | 'DISCONTINUED'>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<string>(branchParam || 'ALL');

  useEffect(() => {
    if (branchParam) {
      setSelectedBranch(branchParam);
    }
  }, [branchParam]);

  const activeBranchNode = useMemo(() => {
    return FACTION_TAXONOMY.find((f) => f.id === selectedBranch) || null;
  }, [selectedBranch]);

  const filteredProducts = useMemo(() => {
    return RAMEN_DATASET.filter((p) => {
      // 1. Search Query
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

      // 2. Faction Branch Filter
      if (selectedBranch !== 'ALL') {
        const faction = getProductFaction(p);
        if (faction.id !== selectedBranch) return false;
      }

      // 3. Manufacturer Filter
      if (selectedBrand !== 'ALL') {
        if (selectedBrand === 'PB') {
          if (!p.isPB) return false;
        } else {
          if (p.manufacturer !== selectedBrand) return false;
        }
      }

      // 4. Package Type Filter
      if (selectedPackage !== 'ALL') {
        if (selectedPackage === 'BAG' && p.packageType !== 'BAG') return false;
        if (selectedPackage === 'CUP' && p.packageType === 'BAG') return false;
      }

      // 5. Product Type Filter
      if (selectedType !== 'ALL') {
        if (selectedType === 'SOUP' && p.productType !== 'SOUP') return false;
        if (selectedType === 'NON_SOUP' && p.productType === 'SOUP') return false;
      }

      // 6. Spiciness Filter
      if (selectedSpicy === 'MILD' && p.spiciness.spicinessGrade > 1) return false;
      if (selectedSpicy === 'MEDIUM' && p.spiciness.spicinessGrade !== 2) return false;
      if (selectedSpicy === 'HOT' && p.spiciness.spicinessGrade < 3) return false;

      // 7. Active Status Filter
      if (selectedStatus === 'ACTIVE' && !p.isActive) return false;
      if (selectedStatus === 'DISCONTINUED' && p.isActive) return false;

      return true;
    });
  }, [search, selectedBranch, selectedBrand, selectedPackage, selectedType, selectedSpicy, selectedStatus]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBrand('ALL');
    setSelectedPackage('ALL');
    setSelectedType('ALL');
    setSelectedSpicy('ALL');
    setSelectedStatus('ALL');
    setSelectedBranch('ALL');
    setSearchParams({});
  };

  const totalCount = RAMEN_DATASET.length;
  const activeCount = RAMEN_DATASET.filter((p) => p.isActive).length;
  const discontinuedCount = RAMEN_DATASET.filter((p) => !p.isActive).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Editorial Header */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-stone-100 text-xs font-serif font-bold mb-3 shadow-xs">
          <span>한국 즉석면 전수 조사 아카이브</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-stone-950 font-serif tracking-tight leading-tight">
          라면 도감
        </h1>

        <p className="mt-3 text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
          총 {totalCount}종 (판매 중 {activeCount}종 · 역사적 단종 {discontinuedCount}종)의 영양성분·조리법·매운맛 데이터베이스
        </p>
      </div>

      {/* Active Faction Alert Strip (if filtered by branch from genealogy) */}
      {activeBranchNode && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-black px-2.5 py-0.5 rounded text-white"
              style={{ backgroundColor: activeBranchNode.themeColor.badge }}
            >
              {activeBranchNode.hanja}
            </span>
            <span className="text-xs font-bold text-stone-900 font-serif">
              계보 탐색 필터 적용 중: 「{activeBranchNode.name}」
            </span>
            <span className="text-xs text-stone-500 font-mono">({filteredProducts.length}종)</span>
          </div>
          <button
            onClick={() => {
              setSelectedBranch('ALL');
              setSearchParams({});
            }}
            className="text-xs font-bold text-amber-900 hover:text-stone-900 underline cursor-pointer"
          >
            계열 필터 해제
          </button>
        </div>
      )}

      {/* Controls & Filter Toolbar */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm mb-8 space-y-4">
        {/* Top Row: Search & Status Pills */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="라면 제품명, 브랜드, 주요 풍미 검색..."
              className="w-full pl-10 pr-9 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-900 shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Active vs Discontinued Status Switcher */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl text-xs font-medium w-full sm:w-auto justify-center">
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedStatus === 'ALL'
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              전체 ({totalCount})
            </button>
            <button
              onClick={() => setSelectedStatus('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedStatus === 'ACTIVE'
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              판매 중 ({activeCount})
            </button>
            <button
              onClick={() => setSelectedStatus('DISCONTINUED')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedStatus === 'DISCONTINUED'
                  ? 'bg-white text-rose-700 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              단종 아카이브 ({discontinuedCount})
            </button>
          </div>
        </div>

        {/* Filter Pills Grid */}
        <div className="pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Manufacturer Filter */}
          <div>
            <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
              제조사
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full py-1.5 px-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800"
            >
              <option value="ALL">전체 제조사</option>
              <option value="농심">농심</option>
              <option value="삼양식품">삼양식품</option>
              <option value="오뚜기">오뚜기</option>
              <option value="팔도">팔도</option>
              <option value="풀무원">풀무원</option>
              <option value="하림">하림</option>
              <option value="PB">편의점 PB 전용</option>
            </select>
          </div>

          {/* Package Type Filter */}
          <div>
            <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
              포장 형태
            </label>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full py-1.5 px-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800"
            >
              <option value="ALL">전체 포장</option>
              <option value="BAG">봉지라면</option>
              <option value="CUP">용기면 (컵/사발)</option>
            </select>
          </div>

          {/* Soup Type Filter */}
          <div>
            <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
              국물 유무
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-1.5 px-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800"
            >
              <option value="ALL">전체 조리</option>
              <option value="SOUP">국물파 (탕면)</option>
              <option value="NON_SOUP">비국물파 (볶음/비빔)</option>
            </select>
          </div>

          {/* Spiciness Filter */}
          <div>
            <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
              매운맛 강도
            </label>
            <select
              value={selectedSpicy}
              onChange={(e) => setSelectedSpicy(e.target.value)}
              className="w-full py-1.5 px-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800"
            >
              <option value="ALL">전체 맵기</option>
              <option value="MILD">순한맛 (0~1단계)</option>
              <option value="MEDIUM">보통 매운맛 (2단계)</option>
              <option value="HOT">얼큰·화끈 (3단계 이상)</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Reset Action */}
        <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
          <div>
            조회된 라면: <span className="font-bold text-stone-900">{filteredProducts.length}개</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-stone-500 hover:text-stone-900 cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>필터 초기화</span>
          </button>
        </div>
      </div>

      {/* Product Cards Shelf Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCardVisual
              key={product.id}
              product={product}
              size="sm"
              onClick={() => onSelectProduct(product)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 max-w-lg mx-auto p-8">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">
            조건에 부합하는 라면이 없습니다
          </h3>
          <p className="text-xs text-stone-500 mt-1 mb-4">
            검색어나 필터 조건을 변경해보세요.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800"
          >
            전체 라면 보기
          </button>
        </div>
      )}
    </div>
  );
}
