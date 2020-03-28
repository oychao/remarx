import * as React from 'react';

import { NODE_HALF_HEIGHT } from 'utils/index';

export interface NodeStyle {
  rectFill: string;
  textFill: string;
}

interface DepNodeProps {
  node: dagre.Node;
  determineStyle?: (node: dagre.Node) => NodeStyle;
  onNodeClick?: (node: dagre.Node) => void;
}

/**
 * dependency graph node
 */
export const DepNode = ({
  node,
  determineStyle = () => ({ rectFill: 'grey', textFill: 'orange' }),
  onNodeClick = () => null,
}: DepNodeProps) => {
  const { x, y, height, width, label } = node;
  const nodeStyle = determineStyle(node);

  const displayName = React.useMemo(() => {
    const parts = (label as string).split('/');
    let lastPart = parts.pop();

    if (lastPart.includes('#')) {
      const atomParts = lastPart.split(/#|\./);
      if (atomParts[atomParts.length - 1] === atomParts[0]) {
        lastPart = `#${atomParts[0]}`;
      }
    }

    if (lastPart.slice(0, 5) === 'index') {
      return `${parts.pop()}/${lastPart}`;
    } else {
      return lastPart;
    }
  }, [label]);

  const handleClick: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void = React.useCallback(() => {
    onNodeClick(node);
  }, [label]);

  return (
    <g onClick={handleClick} style={{ cursor: 'pointer' }}>
      <rect x={x} y={y} height={height} width={width} style={{ fill: nodeStyle.rectFill }} />
      <text x={x} y={y + NODE_HALF_HEIGHT * 2} style={{ fill: nodeStyle.textFill }}>
        {displayName}
      </text>
    </g>
  );
};
