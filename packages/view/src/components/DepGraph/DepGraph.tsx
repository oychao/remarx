import * as React from 'react';

import { calcGraph } from 'src/utils';
import { DepEdge } from './DepEdge';
import { DepNode, NodeStyle } from './DepNode';

interface DepGraphProps {
  graphModel: GraphView;
  determineStyle?: (node: dagre.Node) => NodeStyle;
  onNodeClick?: (node: dagre.Node) => void;
}

export function DepGraph({ graphModel, determineStyle, onNodeClick }: DepGraphProps) {
  const daGraph = calcGraph(graphModel);

  return (
    <svg style={{ display: 'block', height: '100%', width: '100%' }}>
      {daGraph.edges.map((edge, idx) => (
        <DepEdge key={idx} edge={edge} />
      ))}
      {daGraph.nodes.map(node => (
        <DepNode key={node.label} node={node} determineStyle={determineStyle} onNodeClick={onNodeClick} />
      ))}
    </svg>
  );
}
