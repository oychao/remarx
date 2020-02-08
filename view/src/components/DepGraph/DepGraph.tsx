import * as React from 'react';

import { DepEdge } from './DepEdge';
import { DepNode, NodeStyle } from './DepNode';

interface DepGraphProps {
  graphModel: DepGraphModel;
  determineStyle?: (node: DepNodeModel) => NodeStyle;
}

export function DepGraph({ graphModel, determineStyle }: DepGraphProps) {
  return (
    <svg style={{ display: 'block', height: '50%', width: '100%' }}>
      {graphModel.nodes.map(node => (
        <DepNode key={node.label} node={node} determineStyle={determineStyle} />
      ))}
      {graphModel.edges.map((edge, idx) => (
        <DepEdge key={idx} edge={edge} />
      ))}
    </svg>
  );
}
