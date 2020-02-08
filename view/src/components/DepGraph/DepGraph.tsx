import * as React from 'react';

import { DepEdge } from './DepEdge';
import { DepNode } from './DepNode';

export function DepGraph({ graphModel }: { graphModel: DepGraphModel }) {
  return (
    <svg style={{ display: 'block', height: '50%', width: '100%' }}>
      {graphModel.nodes.map(node => (
        <DepNode key={node.label} node={node} />
      ))}
      {graphModel.edges.map((edge, idx) => (
        <DepEdge key={idx} edge={edge} />
      ))}
    </svg>
  );
}
