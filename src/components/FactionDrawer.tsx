import { useEffect } from 'react';
import type { RamenProduct } from '../types/ramen';
import type { FactionNode } from '../data/factionTaxonomy';
import { getFactionMembers } from '../data/factionTaxonomy';
import { FACTION_CHRONICLES } from '../data/historicalGenealogyData';
import { X, ArrowRight, BookOpen, Crown, Scroll } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FactionDrawerProps {
  faction: FactionNode | null;
  onClose: () => void;
  onSelectProduct: (product: RamenProduct) => void;
}

export function FactionDrawer({ faction, onClose, onSelectProduct }: FactionDrawerProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!faction) return null;

  const members = getFactionMembers(faction.id);
  const repIds = new Set(faction.representativeIds);
  const repMembers = members.filter((m) => repIds.has(m.id));
  const otherMembers = members.filter((m) => !repIds.has(m.id));

  // Find matching historical chronicle
  const chronicle = FACTION_CHRONICLES.find(
    (c) =>
      c.id === faction.id ||
      (faction.id.startsWith('spicy-beef') && c.id === 'spicy-beef') ||
      (faction.id.startsWith('spicy-seafood') && c.id === 'seafood-ocean') ||
      (faction.id.startsWith('broth-beef-bone') && c.id === 'bone-broth') ||
      (faction.id.startsWith('jjajang') && c.id === 'jjajang-chunjang') ||
      (faction.id.startsWith('bibim') && c.id === 'bibim-cold') ||
      (faction.id.startsWith('dry-spicy') && c.id === 'fire-bokkeum') ||
      (faction.id.startsWith('dry-cheese') && c.id === 'cream-fusion')
  );

  const getHegemonyLabel = (status?: string) => {
    switch (status) {
      case 'RULING':
        return { label: '천하통일 집권 (天下統一)', color: 'bg-rose-600 text-white' };
      case 'MAINSTREAM':
        return { label: '주류 붕당 (主流 朋黨)', color: 'bg-stone-900 text-amber-300' };
      case 'HISTORIC_ORIGIN':
        return { label: '역사적 시원 (始原)', color: 'bg-amber-500 text-stone-950 font-black' };
      case 'EXPEDITIONARY':
        return { label: '반란과 신흥 돌풍 (叛亂·突風)', color: 'bg-orange-500 text-white' };
      case 'COEXISTING':
        return { label: '공존과 롱셀러 (共存)', color: 'bg-sky-600 text-white' };
      default:
        return { label: '전통 붕당', color: 'bg-stone-800 text-stone-200' };
    }
  };

  const hegemonyInfo = getHegemonyLabel(chronicle?.hegemonyStatus);

  const handleNavigateToEncyclopedia = () => {
    onClose();
    navigate(`/encyclopedia?branch=${faction.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div
            className="p-6 border-b border-stone-200 relative"
            style={{ backgroundColor: faction.themeColor.bg }}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 border border-stone-200 cursor-pointer shadow-xs transition"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="text-xs font-black px-2.5 py-0.5 rounded text-white"
                style={{ backgroundColor: faction.themeColor.badge }}
              >
                {faction.hanja}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs ${hegemonyInfo.color}`}
              >
                {hegemonyInfo.label}
              </span>
              <span className="text-xs font-bold text-stone-600">
                {faction.parentBranchId === 'SOUP' ? '국물파 (탕파)' : '비국물파 (건파)'} ·{' '}
                {faction.subCategory}
              </span>
              <span className="text-xs font-bold text-stone-500 font-mono bg-white/90 px-2 py-0.5 rounded-full border border-stone-200">
                총 {members.length}종
              </span>
            </div>

            <h2 className="text-2xl font-black text-stone-950 font-serif tracking-tight">
              {faction.name}
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-stone-700 leading-relaxed font-serif italic bg-white/70 p-3 rounded-xl border border-stone-200/60">
              {faction.doctrine}
            </p>

            <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
              {faction.summary}
            </p>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Historical Chronicle Section (당쟁사 실록) */}
            {chronicle && chronicle.chronicleStory && chronicle.chronicleStory.length > 0 && (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-stone-900 font-serif font-black text-xs">
                  <Scroll className="w-4 h-4 text-amber-600" />
                  <span>붕당 흥망성쇠 실록 (興亡盛衰 實錄)</span>
                </div>
                <div className="space-y-2 border-l-2 border-amber-400 pl-3">
                  {chronicle.chronicleStory.map((story, idx) => (
                    <p
                      key={idx}
                      className="text-xs text-stone-700 leading-relaxed font-medium"
                    >
                      {story}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Representative Flagship Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-stone-500 tracking-wider uppercase flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>대표 깃발 제품 ({repMembers.length}종)</span>
                </h3>
                <span className="text-[11px] text-stone-400 font-medium">계보도의 중심축</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {repMembers.map((product) => {
                  const defaultSvg = `/images/products/${product.id}.svg`;
                  const is1963 = product.id === 'samyang-chicken-1963';
                  return (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className={`group p-3 rounded-2xl transition-all cursor-pointer flex flex-col justify-between ${
                        is1963
                          ? 'bg-amber-50 border-2 border-amber-400 ring-2 ring-amber-300'
                          : 'bg-stone-50 hover:bg-stone-100/80 border border-stone-200/90 hover:border-stone-400'
                      }`}
                    >
                      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white p-2 mb-2 flex items-center justify-center border border-stone-100 group-hover:scale-105 transition-transform">
                        <img
                          src={product.imageUrl || defaultSvg}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (!target.src.endsWith('.svg')) target.src = defaultSvg;
                          }}
                          className="max-h-full max-w-full object-contain drop-shadow"
                        />
                        {is1963 && (
                          <span className="absolute top-1 left-1 bg-amber-600 text-[8.5px] font-black text-white px-1.5 py-0.5 rounded shadow-xs">
                            1963 실물봉지
                          </span>
                        )}
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] font-bold text-stone-400">
                          {product.manufacturer} · {product.releaseYear}년
                        </span>
                        <h4 className="text-sm font-black text-stone-900 line-clamp-1 group-hover:text-rose-700 transition-colors">
                          {product.name}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Other Members in this Faction */}
            {otherMembers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3 pt-4 border-t border-stone-200">
                  <h3 className="text-xs font-black text-stone-500 tracking-wider uppercase">
                    동일 계열 수록 제품 ({otherMembers.length}종)
                  </h3>
                  <span className="text-[11px] text-stone-400 font-medium">클릭 시 상세정보</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {otherMembers.slice(0, 12).map((product) => {
                    const defaultSvg = `/images/products/${product.id}.svg`;
                    return (
                      <div
                        key={product.id}
                        onClick={() => onSelectProduct(product)}
                        className="group p-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-300 transition-all cursor-pointer text-center flex flex-col justify-between"
                      >
                        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-stone-50 p-1 mb-1.5 flex items-center justify-center border border-stone-100">
                          <img
                            src={product.imageUrl || defaultSvg}
                            alt={product.name}
                            loading="lazy"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              if (!target.src.endsWith('.svg')) target.src = defaultSvg;
                            }}
                            className="max-h-full max-w-full object-contain drop-shadow"
                          />
                        </div>
                        <span className="text-[9px] font-medium text-stone-400">
                          {product.manufacturer}
                        </span>
                        <span className="text-xs font-bold text-stone-800 line-clamp-1 group-hover:text-rose-700">
                          {product.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {otherMembers.length > 12 && (
                  <p className="text-center text-xs text-stone-400 mt-2">
                    외 {otherMembers.length - 12}종 더보기
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
            <div className="text-xs text-stone-600 font-medium">
              이 계열의 전체 <span className="font-bold text-stone-900">{members.length}종</span> 라면
            </div>
            <button
              onClick={handleNavigateToEncyclopedia}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>도감에서 전체 보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}