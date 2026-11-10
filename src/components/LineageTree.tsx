import { useState, useMemo, useRef } from 'react';
import type { RamenProduct } from '../types/ramen';
import { RAMEN_DATASET } from '../data/ramenDataset';
import { FACTION_TAXONOMY, type FactionNode } from '../data/factionTaxonomy';
import {
  HISTORICAL_EPOCHS,
  HISTORICAL_MILESTONES,
  LINEAGE_LEGEND_NODES,
  LINEAGE_EDGES,
  type HistoricalEventMilestone,
  type LineageLegendNode,
  type LineageEdge,
} from '../data/historicalGenealogyData';
import {
  Sparkles,
  RotateCcw,
  Info,
  Swords,
  ChevronRight,
  X,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface LineageTreeProps {
  onSelectProduct: (product: RamenProduct) => void;
  onOpenFactionDrawer: (faction: FactionNode) => void;
  highlightedFactionId?: string | null;
  searchQuery?: string;
}

export function LineageTree({
  onSelectProduct,
  onOpenFactionDrawer,
  highlightedFactionId,
  searchQuery = '',
}: LineageTreeProps) {
  // Mobile display mode
  const [mobileMode, setMobileMode] = useState<'CANVAS' | 'CHRONICLE'>('CHRONICLE');

  // Filters
  const [selectedEpochId, setSelectedEpochId] = useState<string>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<'ALL' | 'SOUP' | 'NON_SOUP' | 'RIVALRY'>('ALL');

  // Interactive selection & path tracing
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [selectedLegendNode, setSelectedLegendNode] = useState<LineageLegendNode | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<HistoricalEventMilestone | null>(null);

  // Canvas zoom/pan reference
  const canvasScrollRef = useRef<HTMLDivElement>(null);

  // Search matching nodes
  const searchMatchedNodeIds = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.trim().toLowerCase();
    const set = new Set<string>();
    LINEAGE_LEGEND_NODES.forEach((n) => {
      if (
        n.name.toLowerCase().includes(q) ||
        n.brand.toLowerCase().includes(q) ||
        n.manufacturer.toLowerCase().includes(q) ||
        n.factionName.toLowerCase().includes(q) ||
        n.historicalRole.toLowerCase().includes(q)
      ) {
        set.add(n.id);
      }
    });
    return set;
  }, [searchQuery]);

  // Graph path tracing algorithm: Ancestors, Descendants, Rivals
  const activePath = useMemo(() => {
    const targetId = activeNodeId || highlightedFactionId;
    if (!targetId) return null;

    // Check if target is a faction ID or a node ID
    let rootNodeIds: string[] = [];
    const directNode = LINEAGE_LEGEND_NODES.find((n) => n.id === targetId);
    if (directNode) {
      rootNodeIds = [directNode.id];
    } else {
      rootNodeIds = LINEAGE_LEGEND_NODES.filter((n) => n.factionId === targetId).map((n) => n.id);
    }

    if (rootNodeIds.length === 0) return null;

    const connectedNodeIds = new Set<string>(rootNodeIds);
    const connectedEdgeIds = new Set<string>();

    rootNodeIds.forEach((startId) => {
      // 1. Ancestors traversal (incoming)
      const qUp = [startId];
      while (qUp.length > 0) {
        const curr = qUp.shift()!;
        LINEAGE_EDGES.forEach((edge) => {
          if (edge.toId === curr) {
            connectedEdgeIds.add(edge.id);
            if (!connectedNodeIds.has(edge.fromId)) {
              connectedNodeIds.add(edge.fromId);
              qUp.push(edge.fromId);
            }
          }
        });
      }

      // 2. Descendants traversal (outgoing)
      const qDown = [startId];
      while (qDown.length > 0) {
        const curr = qDown.shift()!;
        LINEAGE_EDGES.forEach((edge) => {
          if (edge.fromId === curr) {
            connectedEdgeIds.add(edge.id);
            if (!connectedNodeIds.has(edge.toId)) {
              connectedNodeIds.add(edge.toId);
              qDown.push(edge.toId);
            }
          }
        });
      }

      // 3. Rivals traversal
      LINEAGE_EDGES.forEach((edge) => {
        if (edge.relationType === 'HISTORICAL_RIVALRY') {
          if (edge.fromId === startId) {
            connectedNodeIds.add(edge.toId);
            connectedEdgeIds.add(edge.id);
          } else if (edge.toId === startId) {
            connectedNodeIds.add(edge.fromId);
            connectedEdgeIds.add(edge.id);
          }
        }
      });
    });

    return { nodeIds: connectedNodeIds, edgeIds: connectedEdgeIds };
  }, [activeNodeId, highlightedFactionId]);

  // Lookup node by ID
  const getNodeById = (id: string): LineageLegendNode | undefined => {
    return LINEAGE_LEGEND_NODES.find((n) => n.id === id);
  };

  // Lookup full ramen product by ID
  const getFullProduct = (id: string): RamenProduct | undefined => {
    return RAMEN_DATASET.find((p) => p.id === id);
  };

  // Lookup faction taxonomy node
  const getFactionNode = (factionId: string): FactionNode | undefined => {
    return FACTION_TAXONOMY.find((f) => f.id === factionId);
  };

  // Filter nodes for canvas rendering
  const filteredNodes = useMemo(() => {
    return LINEAGE_LEGEND_NODES.filter((n) => {
      if (selectedEpochId !== 'ALL' && n.epochId !== selectedEpochId) return false;
      if (selectedBranch === 'SOUP') {
        return (
          n.factionId === 'root-chicken' ||
          n.factionId === 'spicy-beef' ||
          n.factionId === 'seafood-ocean' ||
          n.factionId === 'bone-broth' ||
          n.factionId === 'white-broth-rebel' ||
          n.factionId === 'extreme-spicy'
        );
      }
      if (selectedBranch === 'NON_SOUP') {
        return (
          n.factionId === 'jjajang-chunjang' ||
          n.factionId === 'bibim-cold' ||
          n.factionId === 'fire-bokkeum' ||
          n.factionId === 'cream-fusion'
        );
      }
      if (selectedBranch === 'RIVALRY') {
        const hasRivalry = LINEAGE_EDGES.some(
          (e) =>
            (e.fromId === n.id || e.toId === n.id) &&
            (e.relationType === 'HISTORICAL_RIVALRY' || e.relationType === 'REVOLUTIONARY_SCHISM')
        );
        return hasRivalry || n.id === 'samyang-chicken-1963';
      }
      return true;
    });
  }, [selectedEpochId, selectedBranch]);

  // Render edge curve
  const renderEdgeSvgPath = (edge: LineageEdge) => {
    const fromNode = getNodeById(edge.fromId);
    const toNode = getNodeById(edge.toId);
    if (!fromNode || !toNode) return null;

    const isActive = activePath ? activePath.edgeIds.has(edge.id) : true;
    const isDimmed = activePath && !activePath.edgeIds.has(edge.id);

    // Coordinate calculation
    let d = '';
    let labelX = 0;
    let labelY = 0;

    if (edge.relationType === 'HISTORICAL_RIVALRY') {
      // Arch curve to the right for vertical rivalry
      const x1 = fromNode.canvasX + 45;
      const y1 = fromNode.canvasY;
      const x2 = toNode.canvasX + 45;
      const y2 = toNode.canvasY;
      const midX = Math.max(x1, x2) + 48;
      const midY = (y1 + y2) / 2;
      d = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
      labelX = midX + 8;
      labelY = midY;
    } else {
      // Flow from left to right
      const x1 = fromNode.canvasX + 54;
      const y1 = fromNode.canvasY;
      const x2 = toNode.canvasX - 54;
      const y2 = toNode.canvasY;
      const dx = x2 - x1;
      const cp1x = x1 + Math.max(dx * 0.45, 24);
      const cp1y = y1;
      const cp2x = x2 - Math.max(dx * 0.45, 24);
      const cp2y = y2;
      d = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
      labelX = (x1 + x2) / 2;
      labelY = (y1 + y2) / 2;
    }

    // Line styles by relation type
    let strokeColor = edge.factionColor;
    let strokeWidth = 2.5;
    let strokeDasharray = 'none';

    if (edge.relationType === 'DIRECT_LINEAGE') {
      strokeWidth = isActive ? 3.5 : 2.5;
      strokeColor = '#dc2626'; // Deep red for direct lineage
    } else if (edge.relationType === 'REVOLUTIONARY_SCHISM') {
      strokeWidth = 3;
      strokeDasharray = '6 4';
      strokeColor = '#b91c1c'; // Pulsing rebel red
    } else if (edge.relationType === 'HISTORICAL_RIVALRY') {
      strokeWidth = 2.5;
      strokeDasharray = '4 3';
      strokeColor = '#7c3aed'; // Regal purple for rivalry
    }

    return (
      <g
        key={edge.id}
        className={`transition-all duration-300 ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
      >
        <path
          d={d}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all"
        />

        {/* Midpoint Label Badge */}
        {isActive && !isDimmed && (
          <g transform={`translate(${labelX}, ${labelY})`}>
            <rect
              x="-48"
              y="-10"
              width="96"
              height="20"
              rx="10"
              fill={edge.relationType === 'HISTORICAL_RIVALRY' ? '#6d28d9' : '#1c1917'}
              fillOpacity="0.9"
              stroke="#ffffff"
              strokeWidth="1"
            />
            <text
              x="0"
              y="3.5"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="9.5"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              {edge.label}
            </text>
          </g>
        )}
      </g>
    );
  };

  // Role Badge Styling Helper
  const getRoleBadgeStyle = (role: string) => {
    if (role.includes('시원')) return 'bg-amber-500 text-stone-950 font-black';
    if (role.includes('통일') || role.includes('집권')) return 'bg-rose-600 text-white font-black';
    if (role.includes('독립') || role.includes('태동')) return 'bg-sky-600 text-white font-bold';
    if (role.includes('반란') || role.includes('도발')) return 'bg-orange-500 text-white font-black';
    if (role.includes('라이벌') || role.includes('대항마')) return 'bg-purple-600 text-white font-bold';
    if (role.includes('화마') || role.includes('융합')) return 'bg-stone-900 text-amber-300 font-bold';
    return 'bg-stone-700 text-stone-100 font-bold';
  };

  return (
    <div className="w-full space-y-6">
      {/* ================= 1. PEDIGREE CONTROLS & FILTER BAR ================= */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top: Motif & Philosophy Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-stone-950 text-amber-300 font-serif font-black text-xs">
              朋黨史 (붕당사)
            </span>
            <span className="text-xs sm:text-sm font-bold text-stone-800">
              한국 라면 60년 맛의 파벌·분열·집권 실록
            </span>
          </div>

          {/* Relation Type Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-stone-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-rose-600 rounded-full inline-block"></span>
              <span>정통 계승</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-amber-600 rounded-full inline-block"></span>
              <span>계열 분화</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 border-b-2 border-dashed border-rose-500 inline-block"></span>
              <span>사조 반란</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 border-b-2 border-dotted border-purple-600 inline-block"></span>
              <span>숙명의 라이벌</span>
            </span>
          </div>
        </div>

        {/* Filter Rows */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Faction Alignment Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-stone-100/90 p-1 rounded-xl">
            <button
              onClick={() => setSelectedBranch('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                selectedBranch === 'ALL'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              전체 계보 (25기수)
            </button>
            <button
              onClick={() => setSelectedBranch('SOUP')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                selectedBranch === 'SOUP'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              국물파 (탕파)
            </button>
            <button
              onClick={() => setSelectedBranch('NON_SOUP')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                selectedBranch === 'NON_SOUP'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              비국물파 (건파)
            </button>
            <button
              onClick={() => setSelectedBranch('RIVALRY')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 ${
                selectedBranch === 'RIVALRY'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Swords className="w-3 h-3" />
              <span>숙명의 라이벌전</span>
            </button>
          </div>

          {/* Epoch Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="epoch-select" className="text-xs font-bold text-stone-500 whitespace-nowrap">
              시대별 집권기:
            </label>
            <select
              id="epoch-select"
              value={selectedEpochId}
              onChange={(e) => setSelectedEpochId(e.target.value)}
              className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-stone-900 cursor-pointer"
            >
              <option value="ALL">전체 6대 시대 (1963~2026)</option>
              {HISTORICAL_EPOCHS.map((ep) => (
                <option key={ep.id} value={ep.id}>
                  {ep.name} ({ep.period})
                </option>
              ))}
            </select>

            {/* Reset Tracing */}
            {activeNodeId && (
              <button
                onClick={() => setActiveNodeId(null)}
                className="px-2.5 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                title="계보 추적 초기화"
              >
                <RotateCcw className="w-3 h-3" />
                <span>추적 해제</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Path Tracing Alert Banner */}
        {activeNodeId && (
          <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-stone-800">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>[{getNodeById(activeNodeId)?.name}]</strong> 중심의 60년 계통 경로를 추적
                중입니다. (선조·직계·숙명의 적수만 강조)
              </span>
            </div>
            <button
              onClick={() => setActiveNodeId(null)}
              className="text-amber-800 hover:text-stone-950 font-bold underline cursor-pointer shrink-0 ml-2"
            >
              전체 계보 복귀
            </button>
          </div>
        )}
      </div>

      {/* ================= 2. MOBILE VIEW SWITCHER ================= */}
      <div className="md:hidden flex items-center justify-center gap-1 p-1 bg-stone-200 rounded-xl max-w-xs mx-auto">
        <button
          onClick={() => setMobileMode('CHRONICLE')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
            mobileMode === 'CHRONICLE' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700'
          }`}
        >
          시대별 연대기 흐름
        </button>
        <button
          onClick={() => setMobileMode('CANVAS')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
            mobileMode === 'CANVAS' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700'
          }`}
        >
          가로 계보도 캔버스
        </button>
      </div>

      {/* ================= 3. MOBILE CHRONICLE FLOW VIEW ================= */}
      {mobileMode === 'CHRONICLE' && (
        <div className="md:hidden space-y-6">
          <div className="text-center p-3 bg-stone-100 rounded-xl text-xs text-stone-600 font-medium">
            조선시대 붕당정치처럼 6개 시대로 이어지는 라면의 흥망성쇠를 아래로 탐색하세요.
          </div>

          {HISTORICAL_EPOCHS.map((epoch) => {
            const epochNodes = LINEAGE_LEGEND_NODES.filter((n) => n.epochId === epoch.id);
            const epochMilestone = HISTORICAL_MILESTONES.find((m) => m.epochId === epoch.id);

            return (
              <div
                key={epoch.id}
                className="bg-white border-2 border-stone-300 rounded-2xl p-4 shadow-sm space-y-4"
              >
                {/* Epoch Header */}
                <div className="border-b border-stone-200 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-black text-rose-700 font-mono tracking-wider">
                      {epoch.period}
                    </span>
                    <span className="text-xs font-serif font-black px-2 py-0.5 bg-stone-900 text-amber-300 rounded">
                      {epoch.hanja}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-stone-900 font-serif">{epoch.name}</h3>
                  <p className="text-xs text-stone-600 mt-1 font-medium leading-relaxed">
                    {epoch.narrative}
                  </p>
                </div>

                {/* Epoch Milestone Callout if any */}
                {epochMilestone && (
                  <div
                    onClick={() => setSelectedMilestone(epochMilestone)}
                    className="p-3 bg-amber-50/80 border border-amber-300/80 rounded-xl cursor-pointer hover:bg-amber-100/80 transition"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-amber-900 mb-1">
                      <span>역사적 분기점 · {epochMilestone.year}년</span>
                      <span className="font-serif font-bold text-amber-800">
                        {epochMilestone.hanjaTitle}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-stone-900">{epochMilestone.title}</h4>
                    <p className="text-[11px] text-stone-600 mt-0.5 line-clamp-2">
                      {epochMilestone.summary}
                    </p>
                  </div>
                )}

                {/* Nodes in this Epoch */}
                <div className="grid grid-cols-2 gap-2.5">
                  {epochNodes.map((node) => {
                    const is1963 = node.id === 'samyang-chicken-1963';

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedLegendNode(node)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          is1963
                            ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300'
                            : 'bg-stone-50 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {/* Packaging Photo */}
                        <div className="relative w-full aspect-square rounded-lg bg-white p-1 mb-2 flex items-center justify-center overflow-hidden border border-stone-200/80">
                          <img
                            src={node.imageUrl}
                            alt={node.name}
                            loading="lazy"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              if (!target.src.endsWith('.svg')) {
                                target.src = `/images/products/${node.id}.svg`;
                              }
                            }}
                            className="max-h-full max-w-full object-contain drop-shadow"
                          />
                          {is1963 && (
                            <span className="absolute top-1 left-1 bg-amber-600 text-[9px] font-black text-white px-1.5 py-0.5 rounded shadow-xs">
                              1963년 실물봉지
                            </span>
                          )}
                        </div>

                        {/* Node Info */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded ${getRoleBadgeStyle(
                                node.historicalRole
                              )}`}
                            >
                              {node.historicalRole}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-stone-500">
                              {node.releaseYear}년
                            </span>
                          </div>

                          <h4 className="text-xs font-black text-stone-900 line-clamp-1">
                            {node.name}
                          </h4>

                          <p className="text-[10px] text-stone-500 mt-0.5 font-serif line-clamp-1">
                            {node.hanjaFaction} · {node.manufacturer}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= 4. DESKTOP / TABLET / SCROLL SVG CANVAS ================= */}
      <div
        className={`${
          mobileMode === 'CHRONICLE' ? 'hidden md:block' : 'block'
        } relative w-full bg-stone-900 border-2 border-stone-800 rounded-3xl overflow-hidden shadow-2xl`}
      >
        {/* Mobile Canvas Scroll Prompt */}
        <div className="md:hidden bg-stone-950 py-2 px-4 text-center text-amber-300 text-xs font-bold border-b border-stone-800 flex items-center justify-center gap-1.5">
          <span>← 좌우로 자유롭게 스크롤하여 60년 계보도를 탐색하세요 →</span>
        </div>

        {/* Scrollable Canvas Viewport */}
        <div
          ref={canvasScrollRef}
          className="overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-stone-900"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Inner Canvas: 1220 x 940 */}
          <div
            className="relative select-none"
            style={{
              width: '1220px',
              height: '940px',
              backgroundColor: '#141413',
              backgroundImage: `
                radial-gradient(circle at 15% 40%, rgba(217, 119, 6, 0.08) 0%, transparent 40%),
                radial-gradient(circle at 85% 65%, rgba(220, 38, 38, 0.08) 0%, transparent 40%),
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
            }}
          >
            {/* Top Epoch Banners (Time Axis X) */}
            <div className="absolute top-0 left-0 right-0 h-14 border-b border-stone-800/80 flex text-center z-10 bg-stone-950/70 backdrop-blur-xs">
              <div className="w-[170px] border-r border-stone-800/60 p-1 flex flex-col justify-center">
                <span className="text-[10px] font-mono text-amber-400 font-bold">1963~1970s</span>
                <span className="text-[11px] font-serif font-black text-stone-200">
                  제1기: 건국과 시원 (開拓期)
                </span>
              </div>
              <div className="w-[180px] border-r border-stone-800/60 p-1 flex flex-col justify-center">
                <span className="text-[10px] font-mono text-amber-400 font-bold">1980~1988</span>
                <span className="text-[11px] font-serif font-black text-stone-200">
                  제2기: 소고기 국물 (牛肉湯)
                </span>
              </div>
              <div className="w-[180px] border-r border-stone-800/60 p-1 flex flex-col justify-center">
                <span className="text-[10px] font-mono text-amber-400 font-bold">1982~1984</span>
                <span className="text-[11px] font-serif font-black text-stone-200">
                  제3기: 분파 태동 (海鮮·非湯)
                </span>
              </div>
              <div className="w-[190px] border-r border-stone-800/60 p-1 flex flex-col justify-center">
                <span className="text-[10px] font-mono text-amber-400 font-bold">1988~2000s</span>
                <span className="text-[11px] font-serif font-black text-stone-200">
                  제4기: 다양화 (百花齊放)
                </span>
              </div>
              <div className="w-[170px] border-r border-stone-800/60 p-1 flex flex-col justify-center">
                <span className="text-[10px] font-mono text-amber-400 font-bold">2011~2012</span>
                <span className="text-[11px] font-serif font-black text-stone-200">
                  제5기: 백탕의 난 (白湯叛亂)
                </span>
              </div>
              <div className="flex-1 p-1 flex flex-col justify-center">
                <span className="text-[10px] font-mono text-amber-400 font-bold">2012~2026</span>
                <span className="text-[11px] font-serif font-black text-stone-200">
                  제6기: K-라면 세계화 (火魔·融合)
                </span>
              </div>
            </div>

            {/* Left Flavor Factions Axis (Y-Axis Labels) */}
            <div className="absolute left-2 top-20 flex flex-col gap-2 z-10 pointer-events-none">
              <span className="text-[9px] font-bold tracking-widest text-rose-400/70 font-mono rotate-180 [writing-mode:vertical-rl]">
                ▲ 탕파 (얼큰·사골·해물·극초매운 국물)
              </span>
            </div>
            <div className="absolute left-2 bottom-6 flex flex-col gap-2 z-10 pointer-events-none">
              <span className="text-[9px] font-bold tracking-widest text-amber-400/70 font-mono rotate-180 [writing-mode:vertical-rl]">
                ▼ 건파 (짜장·비빔·화마·크림퓨전)
              </span>
            </div>

            {/* Epoch Historical Milestones (Flags / Clickable Badges) */}
            <div className="absolute top-16 left-0 right-0 z-20 pointer-events-auto">
              {HISTORICAL_MILESTONES.map((ms) => {
                let xPos = 80;
                if (ms.year === 1963) xPos = 80;
                else if (ms.year === 1982) xPos = 250;
                else if (ms.year === 1984) xPos = 350;
                else if (ms.year === 1986) xPos = 460;
                else if (ms.year === 2011) xPos = 790;
                else if (ms.year === 2012) xPos = 880;
                else if (ms.year === 2015) xPos = 970;

                return (
                  <button
                    key={ms.id}
                    onClick={() => setSelectedMilestone(ms)}
                    className="absolute -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700/80 shadow-md cursor-pointer hover:scale-105 transition-transform"
                    style={{ left: `${xPos}px` }}
                    title={`${ms.year}년 ${ms.title}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="text-[10px] font-mono font-bold text-amber-300">
                      {ms.year}
                    </span>
                    <span className="text-[11px] font-serif font-bold text-stone-200">
                      {ms.hanjaTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SVG Connecting Edges Layer */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-15"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <marker
                  id="arrow-red"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <polygon points="0 1, 8 4, 0 7" fill="#dc2626" />
                </marker>
                <marker
                  id="arrow-amber"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <polygon points="0 1, 8 4, 0 7" fill="#d97706" />
                </marker>
                <marker
                  id="arrow-purple"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <polygon points="0 1, 8 4, 0 7" fill="#7c3aed" />
                </marker>
              </defs>

              {/* Render All 24 Edges */}
              {LINEAGE_EDGES.map((edge) => renderEdgeSvgPath(edge))}
            </svg>

            {/* Absolute Positioned 25 Legend Nodes (HTML Elements for Crisp Cards) */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {filteredNodes.map((node) => {
                const isSelected = activeNodeId === node.id;
                const isDimmed = activePath && !activePath.nodeIds.has(node.id);
                const isMatched = searchMatchedNodeIds ? searchMatchedNodeIds.has(node.id) : false;
                const is1963 = node.id === 'samyang-chicken-1963';

                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      setActiveNodeId(node.id);
                      setSelectedLegendNode(node);
                    }}
                    onMouseEnter={() => {
                      if (!activeNodeId) setActiveNodeId(node.id);
                    }}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 w-[116px] rounded-2xl p-2 transition-all duration-300 pointer-events-auto cursor-pointer flex flex-col justify-between ${
                      isDimmed ? 'opacity-25 grayscale-[60%] scale-95' : 'opacity-100'
                    } ${
                      isSelected || isMatched
                        ? 'bg-stone-900 border-2 border-amber-400 shadow-2xl ring-4 ring-amber-400/30 scale-105 z-30'
                        : is1963
                        ? 'bg-amber-950/90 border-2 border-amber-400 shadow-xl'
                        : 'bg-stone-900/90 border border-stone-700/80 hover:border-amber-400/90 hover:bg-stone-850 shadow-lg'
                    }`}
                    style={{
                      left: `${node.canvasX}px`,
                      top: `${node.canvasY}px`,
                      height: '136px',
                    }}
                  >
                    {/* Header: Role Badge + Year */}
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-[8.5px] px-1.5 py-0.5 rounded leading-none ${getRoleBadgeStyle(
                          node.historicalRole
                        )}`}
                      >
                        {node.historicalRole}
                      </span>
                      <span className="text-[9.5px] font-mono font-bold text-amber-300">
                        {node.releaseYear}
                      </span>
                    </div>

                    {/* Packaging Photo (Authentic Image!) */}
                    <div className="relative w-full h-[58px] rounded-lg bg-stone-950/80 p-1 flex items-center justify-center overflow-hidden border border-stone-800 group-hover:scale-105 transition-transform">
                      <img
                        src={node.imageUrl}
                        alt={node.name}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (!target.src.endsWith('.svg')) {
                            target.src = `/images/products/${node.id}.svg`;
                          }
                        }}
                        className="max-h-full max-w-full object-contain drop-shadow"
                      />

                      {/* 1963 Vintage Packaging Special Crest */}
                      {is1963 && (
                        <span className="absolute bottom-0.5 inset-x-0 bg-amber-500/90 text-stone-950 text-[7.5px] font-black text-center py-0.2 tracking-tighter">
                          1963 10원 실물
                        </span>
                      )}
                    </div>

                    {/* Product Name & Brand */}
                    <div className="text-center mt-1">
                      <h4 className="text-[11px] font-black text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {node.name}
                      </h4>
                      <p className="text-[9px] text-stone-400 font-serif leading-none mt-0.5">
                        {node.hanjaFaction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Canvas Bottom Control Guide */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              제품 카드를 클릭하면 <strong>직계 선조와 후손 계보</strong>가 하이라이트되며, 역사적
              서사 창이 열립니다.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-stone-500">
              전체 25대 기수 대표 라면 수록
            </span>
          </div>
        </div>
      </div>

      {/* ================= 5. LEGEND NODE EDITORIAL DETAIL MODAL ================= */}
      {selectedLegendNode && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="relative bg-white border-2 border-stone-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-stone-900 text-white relative">
              <button
                onClick={() => setSelectedLegendNode(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer transition"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded ${getRoleBadgeStyle(
                    selectedLegendNode.historicalRole
                  )}`}
                >
                  {selectedLegendNode.historicalRole}
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {selectedLegendNode.releaseYear}년 출시
                </span>
                <span className="text-xs font-serif font-bold text-stone-400">
                  {selectedLegendNode.hanjaFaction} · {selectedLegendNode.factionName}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
                {selectedLegendNode.name}
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Product Photo Showcase */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="w-36 h-36 shrink-0 rounded-xl bg-white p-2 border border-stone-200 flex items-center justify-center shadow-sm">
                  <img
                    src={selectedLegendNode.imageUrl}
                    alt={selectedLegendNode.name}
                    className="max-h-full max-w-full object-contain drop-shadow"
                  />
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  {selectedLegendNode.isVintagePhoto && (
                    <span className="inline-block bg-amber-500 text-stone-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      {selectedLegendNode.vintageYearNote || '역사적 실물 패키지 사진'}
                    </span>
                  )}
                  <p className="text-sm font-serif italic text-stone-800 leading-relaxed font-bold">
                    {selectedLegendNode.doctrineQuote}
                  </p>
                  <p className="text-xs text-stone-500 font-medium">
                    제조사: {selectedLegendNode.manufacturer} · 브랜드: {selectedLegendNode.brand} ·
                    용기형태: {selectedLegendNode.packageType === 'BAG' ? '봉지면' : '용기면'}
                  </p>
                </div>
              </div>

              {/* Datajournalism Editorial Historical Narrative */}
              <div>
                <h3 className="text-xs font-black text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-stone-700" />
                  <span>붕당사 실록 및 계보상 의의</span>
                </h3>
                <p className="text-sm text-stone-800 font-medium leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  {selectedLegendNode.editorialNote}
                </p>
              </div>

              {/* Connected Lineage Relations */}
              <div>
                <h3 className="text-xs font-black text-stone-500 uppercase tracking-wider mb-2">
                  이 제품을 관통하는 계보 전승선
                </h3>
                <div className="space-y-2">
                  {LINEAGE_EDGES.filter(
                    (e) => e.fromId === selectedLegendNode.id || e.toId === selectedLegendNode.id
                  ).map((edge) => {
                    const otherNodeId =
                      edge.fromId === selectedLegendNode.id ? edge.toId : edge.fromId;
                    const otherNode = getNodeById(otherNodeId);
                    const isOutgoing = edge.fromId === selectedLegendNode.id;

                    return (
                      <div
                        key={edge.id}
                        className="p-3 rounded-xl bg-stone-100/80 border border-stone-200/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              edge.relationType === 'DIRECT_LINEAGE'
                                ? 'bg-rose-100 text-rose-800'
                                : edge.relationType === 'HISTORICAL_RIVALRY'
                                ? 'bg-purple-100 text-purple-800'
                                : edge.relationType === 'REVOLUTIONARY_SCHISM'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {edge.label}
                          </span>
                          <span className="font-bold text-stone-900">
                            {isOutgoing ? '→ 계승/분파: ' : '← 모태 선조: '} {otherNode?.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 hidden sm:inline">
                          {edge.narrative}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  const fNode = getFactionNode(selectedLegendNode.factionId);
                  if (fNode) onOpenFactionDrawer(fNode);
                  setSelectedLegendNode(null);
                }}
                className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <span>{selectedLegendNode.factionName} 전체 세력 보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  const full = getFullProduct(selectedLegendNode.id);
                  if (full) onSelectProduct(full);
                  setSelectedLegendNode(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <span>제품 상세 스펙 & 조리법 보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. HISTORICAL MILESTONE MODAL ================= */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="relative bg-white border-2 border-stone-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-stone-900 text-white relative">
              <button
                onClick={() => setSelectedMilestone(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer transition"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-stone-950 text-xs font-black font-mono">
                  {selectedMilestone.year}년 라면사 분기점
                </span>
                <span className="text-xs font-serif font-black text-amber-300">
                  {selectedMilestone.hanjaTitle}
                </span>
              </div>

              <h2 className="text-2xl font-black text-white font-serif">
                {selectedMilestone.title}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-stone-700 font-medium leading-relaxed bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80">
                {selectedMilestone.summary}
              </p>

              <div>
                <h4 className="text-xs font-black text-stone-500 uppercase tracking-wider mb-2">
                  이 사건의 핵심 주역 제품
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMilestone.keyProducts.map((pId) => {
                    const node = getNodeById(pId);
                    if (!node) return null;
                    return (
                      <div
                        key={node.id}
                        onClick={() => {
                          setSelectedMilestone(null);
                          setSelectedLegendNode(node);
                        }}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 flex items-center gap-2.5 cursor-pointer transition"
                      >
                        <img
                          src={node.imageUrl}
                          alt={node.name}
                          className="w-8 h-8 object-contain"
                        />
                        <span className="text-xs font-bold text-stone-900">{node.name}</span>
                        <ChevronRight className="w-3 h-3 text-stone-400" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 text-right">
              <button
                onClick={() => setSelectedMilestone(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs cursor-pointer hover:bg-stone-800 transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}