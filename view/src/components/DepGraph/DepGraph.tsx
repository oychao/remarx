import * as React from 'react';

import { calcGraph } from 'src/utils';
import { DepEdge } from './DepEdge';
import { DepNode, NodeStyle } from './DepNode';

interface DepGraphProps {
  graphModel: GraphView;
  determineStyle?: (node: dagre.Node) => NodeStyle;
}

export function DepGraph({ graphModel, determineStyle }: DepGraphProps) {
  const daGraph = calcGraph(graphModel);

  return (
    <svg style={{ display: 'block', height: '50%', width: '100%' }}>
      {daGraph.nodes.map(node => (
        <DepNode key={node.label} node={node} determineStyle={determineStyle} />
      ))}
      {daGraph.edges.map((edge, idx) => (
        <DepEdge key={idx} edge={edge} />
      ))}
    </svg>
  );
}
