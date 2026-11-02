import fs from 'node:fs';

const content = fs.readFileSync('src/components/showcase/showcaseData.ts', 'utf8');
const archPart = content.split('export const ARCHITECTURE_NODES')[1];
const nodes = archPart.split('dependencies:');
console.log('Total nodes found:', nodes.length - 1);
for (let i = 0; i < nodes.length - 1; i++) {
  const block = nodes[i];
  const idM = block.match(/id:\s*"([^"]+)"/);
  const labelM = block.match(/label:\s*"([^"]+)"/);
  const layerM = block.match(/layer:\s*"([^"]+)"/);
  console.log(`${i + 1}. [${layerM ? layerM[1] : ''}] ${labelM ? labelM[1] : ''} (id: ${idM ? idM[1] : ''})`);
}
