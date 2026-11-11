import type {
  HistoricalEpoch,
  HistoricalEventMilestone,
  LineageLegendNode,
  LineageEdge,
} from '../data/historicalGenealogyData';
import { getAssetUrl } from '../utils/imageUrl';
import { Swords, ArrowDown } from 'lucide-react';

interface MobileVerticalTreeProps {
  nodes: LineageLegendNode[];
  edges: LineageEdge[];
  epochs: HistoricalEpoch[];
  milestones: HistoricalEventMilestone[];
  onSelectNode: (node: LineageLegendNode) => void;
  onSelectMilestone: (milestone: HistoricalEventMilestone) => void;
}

export function MobileVerticalTree({
  nodes,
  milestones,
  onSelectNode,
  onSelectMilestone,
}: MobileVerticalTreeProps) {
  const getNode = (id: string) => nodes.find((n) => n.id === id);
  const getMilestone = (id: string) => milestones.find((m) => m.id === id);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 pb-8 text-stone-900 overflow-hidden">
      {/* Intro Header */}
      <div className="text-center p-4 rounded-3xl bg-stone-900 text-white shadow-md border border-stone-800">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-black text-[11px] font-serif mb-2">
          모바일 세로형 라면 족보
        </span>
        <h3 className="text-lg font-black font-serif tracking-tight text-white">
          한국 라면 60년, 맛의 분열과 쟁패
        </h3>
        <p className="text-xs text-stone-400 mt-1 font-medium">
          1963년 단일 뿌리에서 2026년 백가쟁명까지 위에서 아래로 흐르는 맛의 분파도
        </p>
      </div>

      {/* ================= ERA 1: 1963 ~ 1970 원조 탄생과 첫 분기 ================= */}
      <section className="relative bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-200 shadow-sm space-y-4">
        {/* Era Tag */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <span className="text-xs font-serif font-black px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900">
            제1기 · 1963 ~ 1970
          </span>
          <span className="text-[11px] font-mono font-bold text-stone-500">
            단일 뿌리에서 첫 갈래로
          </span>
        </div>

        {/* Milestone Pill 1963 */}
        {getMilestone('ms-1963') && (
          <button
            onClick={() => onSelectMilestone(getMilestone('ms-1963')!)}
            className="w-full p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 flex items-center justify-between gap-2 text-left cursor-pointer transition group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span className="text-xs font-serif font-black text-amber-950 truncate">
                1963년 라면 왕국의 탄생 (삼양라면 10원)
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full shrink-0">
              기록 보기
            </span>
          </button>
        )}

        {/* Root Node: Samyang 1963 */}
        {getNode('samyang-chicken-1963') && (
          <div className="flex justify-center">
            <ProductMiniCard
              node={getNode('samyang-chicken-1963')!}
              onClick={() => onSelectNode(getNode('samyang-chicken-1963')!)}
              badgeColor="bg-amber-400 text-stone-950"
              borderColor="border-amber-400 ring-2 ring-amber-400/20"
            />
          </div>
        )}

        {/* Branch Split Fork Line */}
        <div className="relative py-2 flex flex-col items-center">
          <div className="w-0.5 h-6 bg-gradient-to-b from-amber-400 to-stone-400" />
          <div className="px-3 py-1 rounded-full bg-stone-100 border border-stone-300 text-[10px] font-serif font-bold text-stone-700 shadow-2xs">
            1970년 최초의 파벌 분기 (탕 vs 건)
          </div>
          <div className="w-full flex justify-around mt-1">
            <div className="w-1/3 border-b-2 border-dashed border-rose-400" />
            <div className="w-1/3 border-b-2 border-dashed border-amber-600" />
          </div>
        </div>

        {/* 1970 Branch Products */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Soup Branch: Samyang Beef 1970 */}
          {getNode('samyang-beef-1970') && (
            <div className="space-y-1">
              <div className="text-center">
                <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  국물파(탕): 소고기 장국
                </span>
              </div>
              <ProductMiniCard
                node={getNode('samyang-beef-1970')!}
                onClick={() => onSelectNode(getNode('samyang-beef-1970')!)}
                badgeColor="bg-rose-600 text-white"
                borderColor="border-rose-300"
              />
            </div>
          )}

          {/* Dry Branch: Lotte Jjajang 1970 */}
          {getNode('lotte-jjajang-1970') && (
            <div className="space-y-1">
              <div className="text-center">
                <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  비국물파(건): 인스턴트 짜장
                </span>
              </div>
              <ProductMiniCard
                node={getNode('lotte-jjajang-1970')!}
                onClick={() => onSelectNode(getNode('lotte-jjajang-1970')!)}
                badgeColor="bg-amber-800 text-white"
                borderColor="border-amber-300"
              />
            </div>
          )}
        </div>
      </section>

      {/* Vertical Spine Transition */}
      <div className="flex justify-center -my-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 border border-stone-300 text-[10px] font-bold text-stone-600">
          <ArrowDown className="w-3 h-3 text-stone-500 animate-bounce" />
          <span>1980년대 탕·건 대폭발</span>
        </div>
      </div>

      {/* ================= ERA 2: 1982 ~ 1985 장국과 비국물의 대폭발 ================= */}
      <section className="relative bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <span className="text-xs font-serif font-black px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900">
            제2기 · 1982 ~ 1985
          </span>
          <span className="text-[11px] font-mono font-bold text-stone-500">
            현대 라면의 지형도 확립
          </span>
        </div>

        {/* Milestone Pill 1984 */}
        {getMilestone('ms-1984') && (
          <button
            onClick={() => onSelectMilestone(getMilestone('ms-1984')!)}
            className="w-full p-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-300 flex items-center justify-between gap-2 text-left cursor-pointer transition"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span className="text-xs font-serif font-black text-stone-900 truncate">
                1984년 비국물 양대산맥 성립 (짜파게티 & 팔도비빔면)
              </span>
            </div>
            <span className="text-[10px] font-bold text-stone-600 bg-stone-200 px-2 py-0.5 rounded-full shrink-0">
              기록 보기
            </span>
          </button>
        )}

        {/* Faction Grid */}
        <div className="space-y-3">
          {/* 탕파 삼총사 (육개장, 안성탕면, 너구리) */}
          <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
            <span className="text-[10px] font-black text-rose-800 block">
              국물파(탕)의 진화: 용기면·장국·해물우동
            </span>
            <div className="grid grid-cols-3 gap-2">
              {['yukgaejang-sabal', 'anseongtangmyeon', 'neoguri'].map((id) => {
                const node = getNode(id);
                if (!node) return null;
                return (
                  <ProductMiniCard
                    key={id}
                    node={node}
                    compact
                    onClick={() => onSelectNode(node)}
                    badgeColor="bg-rose-600 text-white"
                    borderColor="border-rose-200"
                  />
                );
              })}
            </div>
          </div>

          {/* 비국물파 듀오 (짜파게티, 팔도비빔면) */}
          <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
            <span className="text-[10px] font-black text-blue-800 block">
              비국물파(건)의 양대산맥: 과립 짜장 & 찬물 비빔면
            </span>
            <div className="grid grid-cols-2 gap-2">
              {['chapagetti', 'paldo-bibim'].map((id) => {
                const node = getNode(id);
                if (!node) return null;
                return (
                  <ProductMiniCard
                    key={id}
                    node={node}
                    compact
                    onClick={() => onSelectNode(node)}
                    badgeColor={id === 'chapagetti' ? 'bg-amber-800 text-white' : 'bg-blue-600 text-white'}
                    borderColor="border-blue-200"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Vertical Spine Transition */}
      <div className="flex justify-center -my-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 border border-stone-300 text-[10px] font-bold text-stone-600">
          <ArrowDown className="w-3 h-3 text-stone-500 animate-bounce" />
          <span>얼큰탕 천하통일 & 라이벌전</span>
        </div>
      </div>

      {/* ================= ERA 3: 1986 ~ 2008 신라면 집권과 라이벌전 ================= */}
      <section className="relative bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <span className="text-xs font-serif font-black px-2.5 py-1 rounded-lg bg-red-100 text-red-900">
            제3기 · 1986 ~ 2008
          </span>
          <span className="text-[11px] font-mono font-bold text-stone-500">
            얼큰 소고기탕 천하통일
          </span>
        </div>

        {/* Milestone Pill 1986 */}
        {getMilestone('ms-1980s') && (
          <button
            onClick={() => onSelectMilestone(getMilestone('ms-1980s')!)}
            className="w-full p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 flex items-center justify-between gap-2 text-left cursor-pointer transition"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
              <span className="text-xs font-serif font-black text-rose-950 truncate">
                1986년 신라면의 절대 집권 (소고기 표고버섯 얼큰탕)
              </span>
            </div>
            <span className="text-[10px] font-bold text-rose-800 bg-rose-200 px-2 py-0.5 rounded-full shrink-0">
              기록 보기
            </span>
          </button>
        )}

        {/* RIVALRY DUEL BOX: 신라면 vs 진라면 매운맛 */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950 via-stone-900 to-blue-950 text-white shadow-md border border-stone-700">
          <div className="flex items-center justify-center gap-2 mb-2.5 text-xs font-serif font-black">
            <Swords className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300">40년 숙명의 양강 라이벌전</span>
          </div>

          <div className="grid grid-cols-2 gap-2 relative">
            {getNode('shin-ramyun') && (
              <ProductMiniCard
                node={getNode('shin-ramyun')!}
                dark
                onClick={() => onSelectNode(getNode('shin-ramyun')!)}
                badgeColor="bg-rose-600 text-white"
                borderColor="border-rose-500/80"
              />
            )}
            {getNode('jin-ramen-spicy') && (
              <ProductMiniCard
                node={getNode('jin-ramen-spicy')!}
                dark
                onClick={() => onSelectNode(getNode('jin-ramen-spicy')!)}
                badgeColor="bg-blue-600 text-white"
                borderColor="border-blue-500/80"
              />
            )}
            {/* Center VS Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-amber-400 text-stone-950 font-black text-[11px] flex items-center justify-center shadow-lg border-2 border-stone-900 z-10">
              VS
            </div>
          </div>
        </div>

        {/* Co-existing Branches: 사리곰탕, 오징어짬뽕, 참깨라면 */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {['sari-gomtang', 'ojingeo-jjamppong', 'chamkkae'].map((id) => {
            const node = getNode(id);
            if (!node) return null;
            return (
              <ProductMiniCard
                key={id}
                node={node}
                compact
                onClick={() => onSelectNode(node)}
                badgeColor={
                  id === 'sari-gomtang'
                    ? 'bg-amber-600 text-white'
                    : id === 'ojingeo-jjamppong'
                    ? 'bg-sky-600 text-white'
                    : 'bg-orange-500 text-white'
                }
                borderColor="border-stone-200"
              />
            );
          })}
        </div>
      </section>

      {/* Vertical Spine Transition */}
      <div className="flex justify-center -my-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 border border-stone-300 text-[10px] font-bold text-stone-600">
          <ArrowDown className="w-3 h-3 text-stone-500 animate-bounce" />
          <span>2011년 하얀국물의 난</span>
        </div>
      </div>

      {/* ================= ERA 4: 2009 ~ 2011 하얀국물의 난 & 극매운맛 ================= */}
      <section className="relative bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <span className="text-xs font-serif font-black px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900">
            제4기 · 2009 ~ 2011
          </span>
          <span className="text-[11px] font-mono font-bold text-stone-500">
            하얀 국물의 반란 & 극한 스코빌
          </span>
        </div>

        {/* Milestone Pill 2011 */}
        {getMilestone('ms-2011') && (
          <button
            onClick={() => onSelectMilestone(getMilestone('ms-2011')!)}
            className="w-full p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 flex items-center justify-between gap-2 text-left cursor-pointer transition"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="text-xs font-serif font-black text-amber-950 truncate">
                2011년 하얀 국물의 난 (꼬꼬면 vs 나가사끼 짬뽕)
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full shrink-0">
              기록 보기
            </span>
          </button>
        )}

        {/* RIVALRY DUEL BOX: 꼬꼬면 vs 나가사끼 짬뽕 */}
        <div className="p-3.5 rounded-2xl bg-amber-950/90 text-white shadow-md border border-amber-700/80">
          <div className="flex items-center justify-center gap-2 mb-2 text-xs font-serif font-black text-amber-300">
            <Swords className="w-4 h-4" />
            <span>2011 백탕 대전</span>
          </div>

          <div className="grid grid-cols-2 gap-2 relative">
            {getNode('kkokko-myeon') && (
              <ProductMiniCard
                node={getNode('kkokko-myeon')!}
                dark
                onClick={() => onSelectNode(getNode('kkokko-myeon')!)}
                badgeColor="bg-amber-500 text-stone-950"
                borderColor="border-amber-400"
              />
            )}
            {getNode('nagasaki-jjamppong') && (
              <ProductMiniCard
                node={getNode('nagasaki-jjamppong')!}
                dark
                onClick={() => onSelectNode(getNode('nagasaki-jjamppong')!)}
                badgeColor="bg-amber-400 text-stone-950"
                borderColor="border-amber-400"
              />
            )}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white text-stone-950 font-black text-[11px] flex items-center justify-center shadow-lg border-2 border-amber-950 z-10">
              VS
            </div>
          </div>
        </div>

        {/* Extreme Spicy Side Node: 틈새라면 */}
        {getNode('teumsae-bbalggyettok') && (
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-black text-red-700 block mb-1.5">
              국물 매운맛의 극한: 9,413 SHU
            </span>
            <ProductMiniCard
              node={getNode('teumsae-bbalggyettok')!}
              onClick={() => onSelectNode(getNode('teumsae-bbalggyettok')!)}
              badgeColor="bg-red-800 text-white"
              borderColor="border-red-300"
            />
          </div>
        )}
      </section>

      {/* Vertical Spine Transition */}
      <div className="flex justify-center -my-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 border border-stone-300 text-[10px] font-bold text-stone-600">
          <ArrowDown className="w-3 h-3 text-stone-500 animate-bounce" />
          <span>불닭 혁명 & 프리미엄 짬뽕·짜장 대전</span>
        </div>
      </div>

      {/* ================= ERA 5: 2012 ~ 2016 불닭 혁명 & 프리미엄 대전 ================= */}
      <section className="relative bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <span className="text-xs font-serif font-black px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900">
            제5기 · 2012 ~ 2016
          </span>
          <span className="text-[11px] font-mono font-bold text-stone-500">
            비국물 화마와 불맛 프리미엄
          </span>
        </div>

        {/* Milestone Pill 2012 */}
        {getMilestone('ms-2012') && (
          <button
            onClick={() => onSelectMilestone(getMilestone('ms-2012')!)}
            className="w-full p-2.5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-300 flex items-center justify-between gap-2 text-left cursor-pointer transition"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span className="text-xs font-serif font-black text-red-950 truncate">
                2012년 불닭의 등장과 K-라면 세계화
              </span>
            </div>
            <span className="text-[10px] font-bold text-red-800 bg-red-200 px-2 py-0.5 rounded-full shrink-0">
              기록 보기
            </span>
          </button>
        )}

        {/* Buldak Hero Card */}
        {getNode('buldak') && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950 to-stone-900 text-white shadow-md border border-red-800">
            <span className="text-[10px] font-black text-red-400 block mb-1.5 font-serif">
              국물 없는 화마(火魔) 혁명 · 글로벌 메가 IP
            </span>
            <ProductMiniCard
              node={getNode('buldak')!}
              dark
              onClick={() => onSelectNode(getNode('buldak')!)}
              badgeColor="bg-red-600 text-white"
              borderColor="border-red-500"
            />
          </div>
        )}

        {/* Milestone Pill 2015 */}
        {getMilestone('ms-2015') && (
          <button
            onClick={() => onSelectMilestone(getMilestone('ms-2015')!)}
            className="w-full p-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-300 flex items-center justify-between gap-2 text-left cursor-pointer transition"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
              <span className="text-xs font-serif font-black text-stone-900 truncate">
                2015년 프리미엄 짬뽕 대전 (진짬뽕 & 불맛 유성스프)
              </span>
            </div>
            <span className="text-[10px] font-bold text-stone-600 bg-stone-200 px-2 py-0.5 rounded-full shrink-0">
              기록 보기
            </span>
          </button>
        )}

        {/* 2015 Premium Battles: 진짬뽕 & 진짜장 */}
        <div className="grid grid-cols-2 gap-2">
          {getNode('jin-jjamppong') && (
            <ProductMiniCard
              node={getNode('jin-jjamppong')!}
              compact
              onClick={() => onSelectNode(getNode('jin-jjamppong')!)}
              badgeColor="bg-sky-700 text-white"
              borderColor="border-sky-300"
            />
          )}
          {getNode('jin-jjajang') && (
            <ProductMiniCard
              node={getNode('jin-jjajang')!}
              compact
              onClick={() => onSelectNode(getNode('jin-jjajang')!)}
              badgeColor="bg-amber-800 text-white"
              borderColor="border-amber-300"
            />
          )}
        </div>
      </section>

      {/* Vertical Spine Transition */}
      <div className="flex justify-center -my-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 border border-stone-300 text-[10px] font-bold text-stone-600">
          <ArrowDown className="w-3 h-3 text-stone-500 animate-bounce" />
          <span>현대 크림 퓨전 & 비빔면 쟁패</span>
        </div>
      </div>

      {/* ================= ERA 6: 2017 ~ 2026 크림 퓨전과 백가쟁명 ================= */}
      <section className="relative bg-white rounded-3xl p-4 sm:p-5 border-2 border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <span className="text-xs font-serif font-black px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900">
            제6기 · 2017 ~ 현재
          </span>
          <span className="text-[11px] font-mono font-bold text-stone-500">
            퓨전 르네상스와 백가쟁명
          </span>
        </div>

        {/* Milestone Pill 2020s */}
        {getMilestone('ms-2020s') && (
          <button
            onClick={() => onSelectMilestone(getMilestone('ms-2020s')!)}
            className="w-full p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-300 flex items-center justify-between gap-2 text-left cursor-pointer transition"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
              <span className="text-xs font-serif font-black text-purple-950 truncate">
                2020년대 퓨전 라면의 백가쟁명 (까르보불닭 & 툼바)
              </span>
            </div>
            <span className="text-[10px] font-bold text-purple-800 bg-purple-200 px-2 py-0.5 rounded-full shrink-0">
              기록 보기
            </span>
          </button>
        )}

        {/* K-Cream Fusion Line: 까르보불닭 -> 신라면 툼바 */}
        <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
          <span className="text-[10px] font-black text-purple-800 block font-serif">
            K-크림 퓨전의 대세화: 모디슈머에서 정규 메이저로
          </span>
          <div className="grid grid-cols-2 gap-2">
            {getNode('carbo-buldak') && (
              <ProductMiniCard
                node={getNode('carbo-buldak')!}
                compact
                onClick={() => onSelectNode(getNode('carbo-buldak')!)}
                badgeColor="bg-purple-600 text-white"
                borderColor="border-purple-300"
              />
            )}
            {getNode('shin-toomba') && (
              <ProductMiniCard
                node={getNode('shin-toomba')!}
                compact
                onClick={() => onSelectNode(getNode('shin-toomba')!)}
                badgeColor="bg-purple-700 text-white"
                borderColor="border-purple-300"
              />
            )}
          </div>
        </div>

        {/* RIVALRY DUEL BOX: 팔도비빔면 vs 배홍동 */}
        <div className="p-3.5 rounded-2xl bg-blue-950 text-white shadow-md border border-blue-800">
          <div className="flex items-center justify-center gap-2 mb-2 text-xs font-serif font-black text-blue-300">
            <Swords className="w-4 h-4" />
            <span>비빔면 왕좌 쟁탈전</span>
          </div>

          <div className="grid grid-cols-2 gap-2 relative">
            {getNode('paldo-bibim') && (
              <ProductMiniCard
                node={getNode('paldo-bibim')!}
                dark
                onClick={() => onSelectNode(getNode('paldo-bibim')!)}
                badgeColor="bg-blue-600 text-white"
                borderColor="border-blue-400"
              />
            )}
            {getNode('baehongdong') && (
              <ProductMiniCard
                node={getNode('baehongdong')!}
                dark
                onClick={() => onSelectNode(getNode('baehongdong')!)}
                badgeColor="bg-sky-500 text-stone-950"
                borderColor="border-sky-400"
              />
            )}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-amber-400 text-stone-950 font-black text-[11px] flex items-center justify-center shadow-lg border-2 border-blue-950 z-10">
              VS
            </div>
          </div>
        </div>

        {/* Orthodoxy Extreme: 신라면 더 레드 */}
        {getNode('shin-the-red') && (
          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200">
            <span className="text-[10px] font-black text-rose-800 block mb-1">
              정통 얼큰 소고기탕의 극한 진화: 7,500 SHU
            </span>
            <ProductMiniCard
              node={getNode('shin-the-red')!}
              onClick={() => onSelectNode(getNode('shin-the-red')!)}
              badgeColor="bg-rose-700 text-white"
              borderColor="border-rose-300"
            />
          </div>
        )}
      </section>
    </div>
  );
}

// Mini Card Subcomponent optimized for touch
function ProductMiniCard({
  node,
  compact = false,
  dark = false,
  badgeColor,
  borderColor,
  onClick,
}: {
  node: LineageLegendNode;
  compact?: boolean;
  dark?: boolean;
  badgeColor: string;
  borderColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-2.5 rounded-2xl flex items-center gap-2.5 text-left cursor-pointer transition hover:scale-102 border ${
        dark
          ? 'bg-stone-900/90 text-white hover:bg-stone-850'
          : 'bg-stone-50 text-stone-900 hover:bg-stone-100'
      } ${borderColor || 'border-stone-200'}`}
    >
      <div
        className={`${
          compact ? 'w-10 h-10' : 'w-12 h-12'
        } rounded-xl bg-white p-1 border border-stone-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs`}
      >
        <img
          src={getAssetUrl(node.imageUrl)}
          alt={node.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`text-[9px] px-1.5 py-0.2 rounded font-black font-mono ${badgeColor}`}>
            {node.releaseYear}
          </span>
          <span
            className={`text-[9px] font-bold truncate ${
              dark ? 'text-stone-400' : 'text-stone-500'
            }`}
          >
            {node.historicalRole}
          </span>
        </div>

        <h5
          className={`text-xs font-black truncate ${
            dark ? 'text-white' : 'text-stone-900'
          }`}
        >
          {node.name}
        </h5>

        {!compact && (
          <p
            className={`text-[10px] line-clamp-1 mt-0.5 font-medium ${
              dark ? 'text-stone-400' : 'text-stone-600'
            }`}
          >
            {node.doctrineQuote.replace(/[“”"]/g, '')}
          </p>
        )}
      </div>
    </button>
  );
}
