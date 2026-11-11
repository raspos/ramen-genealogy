import { describe, it, expect } from 'vitest';
import {
  LINEAGE_LEGEND_NODES,
  LINEAGE_EDGES,
  HISTORICAL_MILESTONES,
  HISTORICAL_EPOCHS,
  type HistoricalRelationType,
} from '../src/data/historicalGenealogyData';
import { RAMEN_DATASET } from '../src/data/ramenDataset';

describe('라면의 계보 3.0 무결성 및 역사적 정확성 검증 (Lineage Integrity Tests)', () => {
  it('1. 캔버스 노드 카드 간 물리적 겹침(Collision)이 0건이어야 한다 (카드 크기: 132x146)', () => {
    const cardWidth = 132;
    const cardHeight = 146;
    const collisions: Array<{ a: string; b: string; dx: number; dy: number }> = [];

    for (let i = 0; i < LINEAGE_LEGEND_NODES.length; i++) {
      for (let j = i + 1; j < LINEAGE_LEGEND_NODES.length; j++) {
        const a = LINEAGE_LEGEND_NODES[i];
        const b = LINEAGE_LEGEND_NODES[j];
        const dx = Math.abs(a.canvasX - b.canvasX);
        const dy = Math.abs(a.canvasY - b.canvasY);

        if (dx < cardWidth && dy < cardHeight) {
          collisions.push({ a: a.name, b: b.name, dx, dy });
        }
      }
    }

    expect(collisions).toEqual([]);
    expect(collisions.length).toBe(0);
  });

  it('2. 모든 방향성 계보 연결선(DIRECT_LINEAGE, FACTION_SPLIT, PARADIGM_SHIFT)에서 시간 역전(Anachronism)이 없어야 한다 (fromYear <= toYear)', () => {
    const nodeMap = new Map<string, number>(
      LINEAGE_LEGEND_NODES.map((n) => [n.id, n.releaseYear])
    );

    const anachronisms: Array<{ edgeId: string; from: string; fromYear: number; to: string; toYear: number }> = [];

    for (const edge of LINEAGE_EDGES) {
      const fromYear = nodeMap.get(edge.fromId);
      const toYear = nodeMap.get(edge.toId);

      expect(fromYear).toBeDefined();
      expect(toYear).toBeDefined();

      if (edge.relationType !== 'MARKET_RIVALRY') {
        if (fromYear! > toYear!) {
          anachronisms.push({
            edgeId: edge.id,
            from: edge.fromId,
            fromYear: fromYear!,
            to: edge.toId,
            toYear: toYear!,
          });
        }
      }
    }

    expect(anachronisms).toEqual([]);
    expect(anachronisms.length).toBe(0);
  });

  it('3. 안성탕면(1983) -> 육개장 사발면(1982) 같은 시간 역전 오류가 제거되었는지 확인한다', () => {
    const invalidEdge = LINEAGE_EDGES.find(
      (e) => e.fromId === 'anseongtangmyeon' && e.toId === 'yukgaejang-sabal'
    );
    expect(invalidEdge).toBeUndefined();

    // 대신 1970 쇠고기면에서 사발면과 안성탕면으로 올바르게 분기되었는지 확인
    const validYukgaejangEdge = LINEAGE_EDGES.find(
      (e) => e.toId === 'yukgaejang-sabal'
    );
    expect(validYukgaejangEdge).toBeDefined();
    expect(validYukgaejangEdge?.fromId).toBe('samyang-beef-1970');
  });

  it('4. 계보도에 정의된 모든 대표 라면(23기수)이 RAMEN_DATASET에 실물 데이터로 존재해야 한다', () => {
    const datasetIds = new Set(RAMEN_DATASET.map((p) => p.id));

    for (const node of LINEAGE_LEGEND_NODES) {
      expect(datasetIds.has(node.id), `Node ID ${node.id} (${node.name}) not found in RAMEN_DATASET`).toBe(true);
    }
  });

  it('5. 4대 관계 유형(DIRECT_LINEAGE, FACTION_SPLIT, MARKET_RIVALRY, PARADIGM_SHIFT)이 모두 적용되어야 한다', () => {
    const types = new Set<HistoricalRelationType>(LINEAGE_EDGES.map((e) => e.relationType));

    expect(types.has('DIRECT_LINEAGE')).toBe(true);
    expect(types.has('FACTION_SPLIT')).toBe(true);
    expect(types.has('MARKET_RIVALRY')).toBe(true);
    expect(types.has('PARADIGM_SHIFT')).toBe(true);
  });

  it('6. 역사적 분기점(Milestones)에 5대 서사 필드와 공신력 있는 출처가 모두 작성되어 있어야 한다', () => {
    expect(HISTORICAL_MILESTONES.length).toBeGreaterThanOrEqual(8);

    for (const ms of HISTORICAL_MILESTONES) {
      expect(ms.marketContext).toBeDefined();
      expect(ms.marketContext.length).toBeGreaterThan(10);

      expect(ms.innovationFeatures).toBeDefined();
      expect(ms.innovationFeatures.length).toBeGreaterThan(10);

      expect(ms.distinctionFromMainstream).toBeDefined();
      expect(ms.distinctionFromMainstream.length).toBeGreaterThan(10);

      expect(ms.marketLegacy).toBeDefined();
      expect(ms.marketLegacy.length).toBeGreaterThan(10);

      expect(ms.sources).toBeDefined();
      expect(ms.sources.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('7. 상단 마일스톤 핀 영역과 제품 카드 영역이 완벽히 분리되어야 한다 (모든 카드 Y >= 220, 상단 여백 확보)', () => {
    for (const node of LINEAGE_LEGEND_NODES) {
      // 카드 상단 모서리(Y - 73)가 140 이상이어야 상단 마일스톤 배지(Y: 56, 94, 높이 32)와 최소 30px 이상 이격됨
      expect(node.canvasY).toBeGreaterThanOrEqual(220);
    }
  });

  it('8. 삼양라면 1963년 실물 패키지 자산이 온전히 복원되어 있어야 한다 (1.4MB 고화질 닭표 10원 봉지)', () => {
    const samyang1963 = RAMEN_DATASET.find((p) => p.id === 'samyang-chicken-1963');
    expect(samyang1963).toBeDefined();
    expect(samyang1963?.imageUrl).toBeDefined();

    // Node fs check for authentic asset file size (> 1MB)
    const fs = require('fs');
    const path = require('path');
    const assetPath = path.join(__dirname, '..', 'public', samyang1963!.imageUrl.replace(/^\//, ''));
    expect(fs.existsSync(assetPath)).toBe(true);
    const stat = fs.statSync(assetPath);
    expect(stat.size).toBeGreaterThan(1000000); // 1.44MB authentic high-res
  });
});
