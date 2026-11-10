import { getAssetUrl } from '../utils/imageUrl';
import { useState, useEffect } from 'react';
import type { RamenProduct } from '../types/ramen';
import { Flame, Droplets, Clock } from 'lucide-react';

interface ProductCardVisualProps {
  product: RamenProduct;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export function ProductCardVisual({
  product,
  size = 'md',
  showDetails = true,
  onClick,
  selected = false,
}: ProductCardVisualProps) {
  const defaultSvg = getAssetUrl("/images/products/${product.id}.svg");
  const [imgSrc, setImgSrc] = useState(product.imageUrl || defaultSvg);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgSrc(product.imageUrl || getAssetUrl("/images/products/${product.id}.svg"));
    setImgError(false);
  }, [product.id, product.imageUrl]);
  const isLg = size === 'lg';
  const isSm = size === 'sm';

  const renderSpicinessPeppers = (grade: number) => {
    if (grade === 0) return <span className="text-[10px] text-stone-400 font-medium">안매움</span>;
    return (
      <div className="flex items-center gap-0.5" title={`매운맛 ${grade}단계`}>
        {Array.from({ length: grade }).map((_, i) => (
          <Flame key={i} className={`${isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'} fill-rose-500 text-rose-600`} />
        ))}
      </div>
    );
  };

  const getPackageTypeBadge = () => {
    switch (product.packageType) {
      case 'BAG':
        return '봉지';
      case 'CUP_LARGE':
        return '큰컵';
      case 'CUP_SMALL':
        return '소컵';
      case 'BOWL':
        return '사발';
      default:
        return '봉지';
    }
  };

  const getProductTypeBadge = () => {
    switch (product.productType) {
      case 'SOUP':
        return '국물';
      case 'STIR_FRY':
        return '볶음';
      case 'BIBIM':
        return '비빔';
      case 'COLD':
        return '냉면';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl border transition-all duration-300 select-none overflow-hidden flex flex-col justify-between ${
        selected
          ? 'ring-4 ring-rose-500/60 shadow-xl border-rose-500 scale-[1.02] bg-rose-50/20'
          : 'border-stone-200/90 hover:border-stone-400 hover:shadow-lg bg-white'
      } ${onClick ? 'cursor-pointer' : ''} ${
        isLg ? 'p-5' : isSm ? 'p-2.5' : 'p-3.5'
      }`}
    >
      {/* Packaging Top Color Strip */}
      <div
        className="absolute top-0 left-0 right-0 h-2 transition-opacity"
        style={{ backgroundColor: product.packagingThemeColor.bg }}
      />

      {/* Header Badges */}
      <div>
        <div className="flex items-start justify-between gap-1 mb-2 pt-0.5">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
              {product.manufacturer}
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              {getPackageTypeBadge()}
            </span>
            {product.isPB && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                PB
              </span>
            )}
            {!product.isActive && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-800 text-white">
                단종
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
            {getProductTypeBadge()}
          </span>
        </div>

        {/* Real Product Package Image Viewport */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100/60 flex items-center justify-center p-2 mb-2 border border-stone-100 group-hover:scale-[1.02] transition-transform">
          {!imgError ? (
            <img
              src={imgSrc}
              alt={product.name}
              onError={() => {
                if (imgSrc !== defaultSvg) {
                  setImgSrc(defaultSvg);
                } else {
                  setImgError(true);
                }
              }}
              className="max-h-full max-w-full object-contain drop-shadow-md transition-transform group-hover:drop-shadow-lg"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full rounded-lg flex flex-col items-center justify-center p-2 text-center shadow-inner"
              style={{
                backgroundColor: `${product.packagingThemeColor.bg}15`,
                border: `1.5px dashed ${product.packagingThemeColor.bg}50`,
              }}
            >
              <span className="text-xl font-black" style={{ color: product.packagingThemeColor.bg }}>
                {product.brand}
              </span>
              <span className="text-[10px] text-stone-500 font-medium mt-0.5">패키지 아카이브</span>
            </div>
          )}

          {/* Release Year Tag Overlay */}
          <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            {product.releaseYear}년
          </div>
        </div>

        {/* Name and Flavors */}
        <div className="text-center px-1">
          <h3
            className={`font-black tracking-tight text-stone-900 line-clamp-1 ${
              isLg ? 'text-xl' : isSm ? 'text-sm' : 'text-base'
            }`}
          >
            {product.name}
          </h3>
          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 font-medium">
            {product.flavorProfile.primaryFlavors.slice(0, 2).join(' · ')}
          </p>
        </div>
      </div>

      {/* Core Specs & Bottom Row */}
      {showDetails && (
        <div className="mt-2.5 pt-2 border-t border-stone-100 space-y-1.5">
          <div className="grid grid-cols-3 gap-1 text-center text-xs">
            <div>
              <span className="block text-[9px] text-stone-400">열량</span>
              <span className="font-bold text-stone-800 text-[11px]">{product.nutrition.caloriesKcal}</span>
              <span className="text-[8px] text-stone-400 ml-0.5">kcal</span>
            </div>
            <div>
              <span className="block text-[9px] text-stone-400">나트륨</span>
              <span className="font-bold text-stone-800 text-[11px]">{product.nutrition.sodiumMg.toLocaleString()}</span>
              <span className="text-[8px] text-stone-400 ml-0.5">mg</span>
            </div>
            <div>
              <span className="block text-[9px] text-stone-400">조리</span>
              <span className="font-bold text-stone-800 text-[11px]">{Math.floor(product.cooking.cookTimeSec / 60)}분</span>
              {product.cooking.cookTimeSec % 60 > 0 && (
                <span className="text-[8px] text-stone-400 ml-0.5">{product.cooking.cookTimeSec % 60}초</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-stone-600 pt-1 border-t border-stone-50">
            <div className="flex items-center gap-1">
              {renderSpicinessPeppers(product.spiciness.spicinessGrade)}
              {product.spiciness.scovilleShu ? (
                <span className="font-bold text-rose-700 text-[10px]">
                  {product.spiciness.scovilleShu.toLocaleString()}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <span className="flex items-center gap-0.5">
                <Droplets className="w-2.5 h-2.5 text-sky-500" />
                {product.cooking.waterMl}ml
              </span>
              <span className="flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5 text-amber-500" />
                {Math.floor(product.cooking.cookTimeSec / 60)}분
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
