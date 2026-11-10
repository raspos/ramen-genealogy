const fs = require('fs');

let content = fs.readFileSync('src/data/historicalGenealogyData.ts', 'utf8');

// 1. Add import
if (!content.includes("import { getAssetUrl }")) {
  content = "import { getAssetUrl } from '../utils/imageUrl';\n" + content;
}

// 2. Change declaration
content = content.replace(
  'export const LINEAGE_LEGEND_NODES: LineageLegendNode[] = [',
  'const RAW_LINEAGE_LEGEND_NODES: LineageLegendNode[] = ['
);

// 3. Export mapped array
const marker = '// ================= 4. 계보도 연결선 (Edges & Historical Branches) =================';
const mappedCode = `export const LINEAGE_LEGEND_NODES: LineageLegendNode[] = RAW_LINEAGE_LEGEND_NODES.map((n) => ({
  ...n,
  imageUrl: getAssetUrl(n.imageUrl),
}));\n\n`;

content = content.replace(marker, mappedCode + marker);

fs.writeFileSync('src/data/historicalGenealogyData.ts', content, 'utf8');
console.log('Successfully updated historicalGenealogyData.ts');
