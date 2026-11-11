import { useState, useMemo, useRef } from 'react';
import type { RamenProduct } from '../types/ramen';
import { RAMEN_DATASET } from '../data/ramenDataset';
import { FACTION_TAXONOMY, type FactionNode } from '../data/factionTaxonomy';
import { getAssetUrl } from '../utils/imageUrl';
import {
  HISTORICAL_EPOCHS,
  HISTORICAL_MILESTONES,
  LINEAGE_LEGEND_NODES,
  LINEAGE_EDGES,
  type HistoricalEventMilestone,
  type LineageLegendNode,
  type LineageEdge,
} from '../data/historicalGenealogyData';
import { LineageMilestoneModal } from './LineageMilestoneModal';
import { MobileVerticalTree } from './MobileVerticalTree';
import {
  Sparkles,
  RotateCcw,
  Info,
  Swords,
  ChevronRight,
  X,
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
  // Mobile display mode: CHRONICLE (세로형 계보도) is primary
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

      // 3. Rivals traversal (direct bidirectional)
      LINEAGE_EDGES.forEach((edge) => {
        if (edge.relationType === 'MARKET_RIVALRY') {
          if (edge.fromId === startId) {
            connectedEdgeIds.add(edge.id);
            connectedNodeIds.add(edge.toId);
          } else if (edge.toId === startId) {
            connectedEdgeIds.add(edge.id);
            connectedNodeIds.add(edge.fromId);
          }
        }
      });
    });

    return {
      nodeIds: connectedNodeIds,
      edgeIds: connectedEdgeIds,
    };
  }, [activeNodeId, highlightedFactionId]);

  const getNodeById = (id: string): LineageLegendNode | undefined => {
    return LINEAGE_LEGEND_NODES.find((n) => n.id === id);
  };

  const getFullProduct = (id: string): RamenProduct | undefined => {
    return RAMEN_DATASET.find((p) => p.id === id);
  };

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
        const isRivalryNode = LINEAGE_EDGES.some(
          (e) =>
            e.relationType === 'MARKET_RIVALRY' &&
            (e.fromId === n.id || e.toId === n.id)
        );
        return isRivalryNode;
      }
      return true;
    });
  }, [selectedEpochId, selectedBranch]);

  // Filter edges so when selecting tabs (국물파, 비국물파, 라이벌전), the lines disappear with the nodes!
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));

    return LINEAGE_EDGES.filter((edge) => {
      // 1. Both endpoints MUST be currently visible
      if (!visibleNodeIds.has(edge.fromId) || !visibleNodeIds.has(edge.toId)) {
        return false;
      }

      // 2. In RIVALRY mode, show strictly rivalry edges
      if (selectedBranch === 'RIVALRY') {
        return edge.relationType === 'MARKET_RIVALRY';
      }

      const isSoup = (f: string) =>
        f === 'root-chicken' ||
        f === 'spicy-beef' ||
        f === 'extreme-spicy' ||
        f === 'seafood-ocean' ||
        f === 'bone-broth' ||
        f === 'white-broth-rebel';

      const isNonSoup = (f: string) =>
        f === 'jjajang-chunjang' ||
        f === 'bibim-cold' ||
        f === 'fire-bokkeum' ||
        f === 'cream-fusion';

      // 3. In SOUP mode, ensure both endpoints are soup ramen
      if (selectedBranch === 'SOUP') {
        const fromNode = getNodeById(edge.fromId);
        const toNode = getNodeById(edge.toId);
        if (!fromNode || !toNode) return false;
        return isSoup(fromNode.factionId) && isSoup(toNode.factionId);
      }

      // 4. In NON_SOUP mode, ensure both endpoints are non-soup ramen
      if (selectedBranch === 'NON_SOUP') {
        const fromNode = getNodeById(edge.fromId);
        const toNode = getNodeById(edge.toId);
        if (!fromNode || !toNode) return false;
        return isNonSoup(fromNode.factionId) && isNonSoup(toNode.factionId);
      }

      return true;
    });
  }, [filteredNodes, selectedBranch]);

  // Dynamic Y-coordinate calculator: in NON_SOUP mode, pull non-soup lanes up to the top
  const getNodeY = (node: LineageLegendNode) => {
    if (selectedBranch === 'NON_SOUP') {
      if (node.canvasY >= 850) {
        return 380; // Lane: 냉비빔면파 (팔도비빔면, 배홍동)
      }
      return 190; // Lane: 짜장 · 불닭 · 퓨전파 (짜파게티, 불닭, 툼바 등)
    }
    return node.canvasY;
  };

  // Render edge curve
  const renderEdgeSvgPath = (edge: LineageEdge) => {
    const fromNode = getNodeById(edge.fromId);
    const toNode = getNodeById(edge.toId);
    if (!fromNode || !toNode) return null;

    const isActive = activePath ? activePath.edgeIds.has(edge.id) : true;
    const isDimmed = activePath && !activePath.edgeIds.has(edge.id);

    let d = '';
    let labelX = 0;
    let labelY = 0;

    if (edge.relationType === 'MARKET_RIVALRY') {
      if (Math.abs(fromNode.canvasX - toNode.canvasX) < 50) {
        // Vertical rivalry curve (Shin Ramyun vs Jin Ramen Spicy)
        const x1 = fromNode.canvasX + 66;
        const y1 = getNodeY(fromNode);
        const x2 = toNode.canvasX + 66;
        const y2 = getNodeY(toNode);
        const midX = Math.max(x1, x2) + 55;
        const midY = (y1 + y2) / 2;
        d = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
        labelX = midX + 6;
        labelY = midY;
      } else {
        // Horizontal rivalry arc (Paldo vs Baehongdong, Chapagetti vs Jin Jjajang)
        const x1 = fromNode.canvasX + 66;
        const y1 = getNodeY(fromNode);
        const x2 = toNode.canvasX - 66;
        const y2 = getNodeY(toNode);
        const midX = (x1 + x2) / 2;
        const midY = Math.min(y1, y2) - 45;
        d = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
        labelX = midX;
        labelY = midY - 6;
      }
    } else {
      // Flow from left to right
      const x1 = fromNode.canvasX + 66;
      const y1 = getNodeY(fromNode);
      const x2 = toNode.canvasX - 66;
      const y2 = getNodeY(toNode);
      const dx = x2 - x1;
      const cp1x = x1 + Math.max(dx * 0.45, 30);
      const cp1y = y1;
      const cp2x = x2 - Math.max(dx * 0.45, 30);
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
      strokeColor = '#ef4444'; // Radiant red for direct lineage
    } else if (edge.relationType === 'FACTION_SPLIT') {
      strokeWidth = 2.5;
      strokeDasharray = '6 4';
      strokeColor = '#d97706'; // Amber for faction split
    } else if (edge.relationType === 'MARKET_RIVALRY') {
      strokeWidth = 3;
      strokeDasharray = '4 3';
      strokeColor = '#a855f7'; // Vibrant purple for rivalry
    } else if (edge.relationType === 'PARADIGM_SHIFT') {
      strokeWidth = 3;
      strokeDasharray = '8 4';
      strokeColor = '#f59e0b'; // Gold for paradigm shift
    }

    return (
      <g
        key={edge.id}
        className={`transition-opacity duration-300 ${
          isDimmed ? 'opacity-15' : 'opacity-100'
        }`}
      >
        {/* Glow backdrop when active */}
        {isActive && activePath && (
          <path
            d={d}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth + 4}
            strokeOpacity="0.35"
            strokeLinecap="round"
          />
        )}

        {/* Main curve */}
        <path
          d={d}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          markerEnd={
            edge.relationType === 'DIRECT_LINEAGE'
              ? 'url(#arrowhead-direct)'
              : edge.relationType === 'MARKET_RIVALRY'
              ? 'url(#arrowhead-rivalry)'
              : 'url(#arrowhead-split)'
          }
        />

        {/* Midpoint Label Badge */}
        {edge.label && (
          <g
            transform={`translate(${labelX}, ${labelY})`}
            className="cursor-pointer pointer-events-auto"
          >
            <rect
              x="-48"
              y="-11"
              width="96"
              height="22"
              rx="11"
              fill={
                edge.relationType === 'DIRECT_LINEAGE'
                  ? '#7f1d1d'
                  : edge.relationType === 'MARKET_RIVALRY'
                  ? '#581c87'
                  : '#292524'
              }
              stroke={strokeColor}
              strokeWidth="1.5"
              className="drop-shadow-md"
            />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              {edge.relationType === 'MARKET_RIVALRY' ? `VS ${edge.label.split(' ')[0]}` : edge.label}
            </text>
          </g>
        )}
      </g>
    );
  };

  // Role Badge Styling Helper
  const getRoleBadgeStyle = (role: string) => {
    if (role.includes('시작') || role.includes('시초')) return 'bg-amber-400 text-stone-950 font-black shadow-xs';
    if (role.includes('통일') || role.includes('집권')) return 'bg-rose-600 text-white font-black';
    if (role.includes('독립') || role.includes('개척')) return 'bg-sky-600 text-white font-bold';
    if (role.includes('영수') || role.includes('연합')) return 'bg-amber-500 text-stone-950 font-black';
    if (role.includes('라이벌') || role.includes('맞수')) return 'bg-purple-600 text-white font-black';
    if (role.includes('혁명') || role.includes('강화')) return 'bg-rose-500 text-white font-black';
    return 'bg-stone-700 text-stone-100 font-bold';
  };

  return (
    <div className="w-full space-y-6">
      {/* ================= 1. PEDIGREE CONTROLS & FILTER BAR ================= */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-4">
        {/* Top: Motif & Philosophy Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-stone-950 text-amber-300 font-serif font-black text-xs shadow-xs">
              라면 파벌 실록
            </span>
            <span className="text-sm font-bold text-stone-900 font-serif">
              한국 라면 60년 맛의 파벌·분열·집권 계보도
            </span>
          </div>

          {/* Relation Type Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-4 h-1 bg-rose-500 rounded-full inline-block"></span>
              <span className="font-bold text-stone-800">직접 계승</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-4 border-b-2 border-dashed border-amber-500 inline-block"></span>
              <span className="font-bold text-amber-700">계열 분화</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-4 border-b-2 border-dotted border-purple-500 inline-block"></span>
              <span className="font-bold text-purple-700">시장 경쟁 (라이벌)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-4 border-b-2 border-dashed border-amber-400 inline-block"></span>
              <span className="font-bold text-amber-600">사조 전환</span>
            </span>
          </div>
        </div>

        {/* Filter Rows */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Faction Alignment Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setSelectedBranch('ALL')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                selectedBranch === 'ALL'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              전체 계보 (23기수)
            </button>
            <button
              onClick={() => setSelectedBranch('SOUP')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                selectedBranch === 'SOUP'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              국물파 (탕파)
            </button>
            <button
              onClick={() => setSelectedBranch('NON_SOUP')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                selectedBranch === 'NON_SOUP'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              비국물파 (건파)
            </button>
            <button
              onClick={() => setSelectedBranch('RIVALRY')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                selectedBranch === 'RIVALRY'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
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
              className="px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-stone-900 cursor-pointer shadow-xs"
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
                className="px-3 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                title="계보 추적 초기화"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>추적 해제</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Path Tracing Alert Banner */}
        {activeNodeId && (
          <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs shadow-xs">
            <div className="flex items-center gap-2.5 text-stone-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-medium">
                <strong>[{getNodeById(activeNodeId)?.name}]</strong> 중심의 60년 계통 경로를 추적 중입니다. (선조·직계·숙명의 적수만 강조)
              </span>
            </div>
            <button
              onClick={() => setActiveNodeId(null)}
              className="text-amber-900 hover:text-stone-950 font-bold underline cursor-pointer shrink-0 ml-2"
            >
              전체 계보 복귀
            </button>
          </div>
        )}
      </div>

      {/* ================= 2. MOBILE VIEW SWITCHER ================= */}
      <div className="md:hidden flex items-center justify-center gap-1 p-1 bg-stone-200 rounded-2xl max-w-sm mx-auto">
        <button
          onClick={() => setMobileMode('CHRONICLE')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            mobileMode === 'CHRONICLE' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700'
          }`}
        >
          세로형 분파 족보 (추천)
        </button>
        <button
          onClick={() => setMobileMode('CANVAS')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            mobileMode === 'CANVAS' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-700'
          }`}
        >
          가로 캔버스 뷰
        </button>
      </div>

      {/* ================= 3. MOBILE VERTICAL TREE (When CHRONICLE active on mobile) ================= */}
      {mobileMode === 'CHRONICLE' && (
        <div className="md:hidden">
          <MobileVerticalTree
            nodes={filteredNodes}
            edges={filteredEdges}
            epochs={HISTORICAL_EPOCHS}
            milestones={HISTORICAL_MILESTONES}
            onSelectNode={(node) => {
              setActiveNodeId(node.id);
              setSelectedLegendNode(node);
            }}
            onSelectMilestone={(ms) => setSelectedMilestone(ms)}
          />
        </div>
      )}

      {/* ================= 4. DESKTOP CANVAS VIEW (Also visible on mobile when CANVAS toggled) ================= */}
      <div
        className={`${
          mobileMode === 'CHRONICLE' ? 'hidden md:block' : 'block'
        } bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl relative`}
      >
        <div
          ref={canvasScrollRef}
          className="relative overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing p-6"
          style={{ minHeight: '620px', maxHeight: '1120px' }}
        >
          {/* Virtual SVG Canvas: 1850px x 1080px */}
          <div
            className="relative select-none"
            style={{
              width: '1850px',
              height: selectedBranch === 'NON_SOUP' ? '560px' : selectedBranch === 'SOUP' ? '760px' : '1080px',
              backgroundColor: '#121110',
              backgroundImage: `
                radial-gradient(circle at 10% 45%, rgba(217, 119, 6, 0.09) 0%, transparent 45%),
                radial-gradient(circle at 90% 65%, rgba(220, 38, 38, 0.09) 0%, transparent 45%),
                linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
            }}
          >
            {/* Top Epoch Banners (Time Axis X across 1850px) */}
            <div className="absolute top-0 left-0 right-0 h-16 border-b border-stone-800/90 flex text-center z-10 bg-stone-950/85 backdrop-blur-md">
              <div className="w-[380px] border-r border-stone-800/80 p-2 flex flex-col justify-center">
                <span className="text-[11px] font-mono text-amber-400 font-bold">1963 ~ 1970년대</span>
                <span className="text-xs font-serif font-black text-stone-100">
                  제1기: 건국과 원조의 태동 (단일 뿌리에서 분기로)
                </span>
              </div>
              <div className="w-[380px] border-r border-stone-800/80 p-2 flex flex-col justify-center">
                <span className="text-[11px] font-mono text-amber-400 font-bold">1980 ~ 1985</span>
                <span className="text-xs font-serif font-black text-stone-100">
                  제2기: 탕과 건의 대분화 (너구리·안성·짜파·비빔)
                </span>
              </div>
              <div className="w-[380px] border-r border-stone-800/80 p-2 flex flex-col justify-center">
                <span className="text-[11px] font-mono text-amber-400 font-bold">1986 ~ 1994</span>
                <span className="text-xs font-serif font-black text-stone-100">
                  제3기: 신라면 천하통일 & 영구적 라이벌전
                </span>
              </div>
              <div className="w-[280px] border-r border-stone-800/80 p-2 flex flex-col justify-center">
                <span className="text-[11px] font-mono text-amber-400 font-bold">2009 ~ 2011</span>
                <span className="text-xs font-serif font-black text-stone-100">
                  제4기: 하얀 국물의 난 & 극매운맛
                </span>
              </div>
              <div className="flex-1 p-2 flex flex-col justify-center">
                <span className="text-[11px] font-mono text-amber-400 font-bold">2012 ~ 2026</span>
                <span className="text-xs font-serif font-black text-stone-100">
                  제5·6기: 불닭 혁명 & K-크림 퓨전 백가쟁명
                </span>
              </div>
            </div>

            {/* Horizontal Faction Lane Guides (Clear boundaries behind cards) */}
            <div className="absolute inset-0 pt-16 pointer-events-none z-5">
              {selectedBranch === 'NON_SOUP' ? (
                <>
                  <div
                    className="absolute inset-x-0 border-b border-stone-800/40 flex items-center px-4"
                    style={{ top: '100px', height: '170px' }}
                  >
                    <span className="text-[10px] font-serif font-black tracking-wider text-amber-500/90 bg-stone-950/90 px-3 py-1 rounded-md border border-amber-900 shadow-md">
                      짜장 · 불닭 볶음 · 크림 퓨전파 (롯데짜장 · 짜파게티 · 불닭볶음면 · 까르보불닭 · 신라면 툼바)
                    </span>
                  </div>

                  <div
                    className="absolute inset-x-0 flex items-center px-4"
                    style={{ top: '290px', height: '170px' }}
                  >
                    <span className="text-[10px] font-serif font-black tracking-wider text-cyan-400/90 bg-stone-950/90 px-3 py-1 rounded-md border border-cyan-900 shadow-md">
                      새콤달콤 냉비빔면파 (팔도비빔면 vs 배홍동)
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="absolute inset-x-0 border-b border-stone-800/40 flex items-center px-4"
                    style={{ top: '60px', height: '110px' }}
                  >
                    <span className="text-[10px] font-serif font-black tracking-wider text-rose-500/70 bg-stone-950/80 px-2.5 py-1 rounded-md border border-rose-950">
                      사발 용기면 & 전통 곰탕 사골 백탕파 (육개장 사발면 · 사리곰탕)
                    </span>
                  </div>

                  <div
                    className="absolute inset-x-0 border-b border-stone-800/40 flex items-center px-4"
                    style={{ top: '180px', height: '150px' }}
                  >
                    <span className="text-[10px] font-serif font-black tracking-wider text-rose-400 bg-stone-950/80 px-2.5 py-1 rounded-md border border-rose-900">
                      정통 소고기 장국 & 얼큰탕 집권파 (삼양쇠고기면 · 안성탕면 · 신라면)
                    </span>
                  </div>

                  <div
                    className="absolute inset-x-0 border-b border-stone-800/40 flex items-center px-4"
                    style={{ top: '340px', height: '150px' }}
                  >
                    <span className="text-[10px] font-serif font-black tracking-wider text-sky-400 bg-stone-950/80 px-2.5 py-1 rounded-md border border-sky-950">
                      얼큰 해물·우동·짬뽕파 (너구리 · 오징어짬뽕 · 진짬뽕)
                    </span>
                  </div>

                  <div
                    className="absolute inset-x-0 border-b border-stone-800/40 flex items-center px-4"
                    style={{ top: '500px', height: '150px' }}
                  >
                    <span className="text-[10px] font-serif font-black tracking-wider text-amber-400 bg-stone-950/80 px-2.5 py-1 rounded-md border border-amber-950">
                      하얀국물 반란파 & 크림 퓨전파 (꼬꼬면 · 나가사끼 짬뽕 · 신라면 툼바)
                    </span>
                  </div>

                  <div
                    className="absolute inset-x-0 border-b border-stone-800/40 flex items-center px-4"
                    style={{ top: '660px', height: '150px' }}
                  >
                    <span className="text-[10px] font-serif font-black tracking-wider text-amber-600 bg-stone-950/80 px-2.5 py-1 rounded-md border border-amber-950">
                      비국물 춘장 짜장 & 화마 볶음파 (롯데짜장 · 짜파게티 · 불닭볶음면)
                    </span>
                  </div>

                  <div
                    className="absolute inset-x-0 flex items-center px-4"
                    style={{ top: '830px', height: '150px' }}
                  >
                    <span className="text-[10px] font-serif font-black tracking-wider text-blue-400 bg-stone-950/80 px-2.5 py-1 rounded-md border border-blue-950">
                      새콤달콤 냉비빔면파 (팔도비빔면 vs 배홍동)
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Epoch Historical Milestones (Flags / Clickable Badges at Y=75) */}
            <div className="absolute top-[72px] left-0 right-0 z-20 pointer-events-auto">
              {HISTORICAL_MILESTONES.map((ms) => {
                let xPos = 70;
                if (ms.id === 'ms-1963') xPos = 70;
                else if (ms.id === 'ms-1970-beef') xPos = 270;
                else if (ms.id === 'ms-1970-jjajang') xPos = 360;
                else if (ms.id === 'ms-1980s') xPos = 500;
                else if (ms.id === 'ms-1984') xPos = 690;
                else if (ms.id === 'ms-2011') xPos = 1270;
                else if (ms.id === 'ms-2012') xPos = 1360;
                else if (ms.id === 'ms-2015') xPos = 1450;
                else if (ms.id === 'ms-2020s') xPos = 1630;

                return (
                  <button
                    key={ms.id}
                    onClick={() => setSelectedMilestone(ms)}
                    className="absolute -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    style={{ left: `${xPos}px` }}
                    title={`${ms.year}년 ${ms.title}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span className="text-[11px] font-mono font-bold text-amber-300">
                      {ms.year}
                    </span>
                    <span className="text-xs font-serif font-black text-stone-100">
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
                  id="arrowhead-direct"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
                </marker>
                <marker
                  id="arrowhead-split"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706" />
                </marker>
                <marker
                  id="arrowhead-rivalry"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7" />
                </marker>
              </defs>

              {filteredEdges.map((edge) => renderEdgeSvgPath(edge))}
            </svg>

            {/* Absolute Positioned 23 Legend Nodes (HTML Elements for Crisp Cards) */}
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
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 w-[132px] rounded-2xl p-2.5 transition-all duration-300 pointer-events-auto cursor-pointer flex flex-col justify-between ${
                      isDimmed ? 'opacity-25 grayscale-[70%] scale-95' : 'opacity-100'
                    } ${
                      isSelected || isMatched
                        ? 'bg-stone-900 border-2 border-amber-400 shadow-2xl ring-4 ring-amber-400/40 scale-105 z-30'
                        : is1963
                        ? 'bg-amber-950/95 border-2 border-amber-400 shadow-xl ring-2 ring-amber-500/50'
                        : 'bg-stone-900/95 border-2 border-stone-700/80 hover:border-amber-400 hover:bg-stone-850 shadow-lg'
                    }`}
                    style={{
                      left: `${node.canvasX}px`,
                      top: `${getNodeY(node)}px`,
                      height: '146px',
                    }}
                  >
                    {/* Header: Role Badge + Year */}
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full leading-none font-bold ${getRoleBadgeStyle(
                          node.historicalRole
                        )}`}
                      >
                        {node.historicalRole}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-amber-300">
                        {node.releaseYear}
                      </span>
                    </div>

                    {/* Packaging Photo */}
                    <div className="relative w-full h-[62px] rounded-xl bg-stone-950 p-1 flex items-center justify-center overflow-hidden border border-stone-800 group-hover:scale-105 transition-transform">
                      <img
                        src={getAssetUrl(node.imageUrl)}
                        alt={node.name}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = getAssetUrl(`/images/products/${node.id}.svg`);
                        }}
                        className="max-h-full max-w-full object-contain drop-shadow"
                      />

                      {/* 1963 Vintage Packaging Special Crest */}
                      {is1963 && (
                        <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-stone-950 text-[8px] font-black text-center py-0.5 tracking-tighter">
                          1963년 10원 원형 실물
                        </span>
                      )}
                    </div>

                    {/* Product Name & Brand */}
                    <div className="text-center mt-1">
                      <h4 className="text-xs font-black text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {node.name}
                      </h4>
                      <p className="text-[10px] text-stone-300 font-serif leading-none mt-0.5 font-bold">
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
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              제품 카드를 클릭하면 <strong>직계 선조와 후손 계보</strong>가 하이라이트되며, 역사적 서사 창이 열립니다.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-stone-400">
              전체 23대 기수 대표 라면 수록
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
                  className={`text-xs px-2.5 py-0.5 rounded-full ${getRoleBadgeStyle(
                    selectedLegendNode.historicalRole
                  )}`}
                >
                  {selectedLegendNode.historicalRole}
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {selectedLegendNode.releaseYear}년 출시
                </span>
                <span className="text-xs font-serif font-bold text-stone-300">
                  {selectedLegendNode.hanjaFaction} · {selectedLegendNode.factionName}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
                {selectedLegendNode.name}
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="w-32 h-32 rounded-2xl bg-white p-2 border border-stone-200 flex items-center justify-center shrink-0 shadow-sm">
                  <img
                    src={getAssetUrl(selectedLegendNode.imageUrl)}
                    alt={selectedLegendNode.name}
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="text-xs font-mono font-bold text-amber-700">
                    {selectedLegendNode.manufacturer} · {selectedLegendNode.brand}
                  </div>
                  <blockquote className="text-sm font-serif italic font-bold text-stone-800 border-l-2 sm:border-amber-400 sm:pl-3">
                    {selectedLegendNode.doctrineQuote}
                  </blockquote>
                  {selectedLegendNode.vintageYearNote && (
                    <span className="inline-block text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                      {selectedLegendNode.vintageYearNote}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-stone-500 uppercase tracking-wider mb-2">
                  역사적 서사와 사조 평정기
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                  {selectedLegendNode.editorialNote}
                </p>
              </div>

              {/* Connected Lineage Edges */}
              <div>
                <h4 className="text-xs font-black text-stone-500 uppercase tracking-wider mb-2">
                  계보상의 직접 연결 관계
                </h4>
                <div className="space-y-2">
                  {LINEAGE_EDGES.filter(
                    (e) => e.fromId === selectedLegendNode.id || e.toId === selectedLegendNode.id
                  ).map((edge) => {
                    const isOutgoing = edge.fromId === selectedLegendNode.id;
                    const otherNode = getNodeById(isOutgoing ? edge.toId : edge.fromId);
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
                                : edge.relationType === 'MARKET_RIVALRY'
                                ? 'bg-purple-100 text-purple-800'
                                : edge.relationType === 'FACTION_SPLIT'
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
        <LineageMilestoneModal
          milestone={selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
          onSelectProductNode={(node) => {
            setActiveNodeId(node.id);
            setSelectedLegendNode(node);
          }}
          getNodeById={getNodeById}
        />
      )}
    </div>
  );
}
